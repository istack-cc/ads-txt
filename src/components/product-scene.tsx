"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import type { Product } from "@/components/product-data";
import { getProductModelPath } from "@/lib/model-paths";

type ProductSceneProps = {
  products: Product[];
  variant?: "hero" | "card";
  className?: string;
  showDetails?: boolean;
};

type LoadedProduct = {
  group: THREE.Group;
  idle: gsap.core.Tween | null;
};

function createLabelTexture(product: Product) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 768;
  const context = canvas.getContext("2d");

  if (!context) {
    return null;
  }

  const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, product.accent);
  gradient.addColorStop(1, product.secondaryAccent);
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = product.id === "storeops" ? "#101923" : "#ffffff";
  context.font = "900 92px Arial, sans-serif";
  context.textBaseline = "top";
  context.fillText(product.shortName, 54, 58);

  context.font = "800 64px Arial, sans-serif";
  product.name.split(/(?=[A-Z][a-z])/).forEach((line, index) => {
    context.fillText(line.toUpperCase(), 54, 178 + index * 70);
  });

  context.font = "600 30px Arial, sans-serif";
  context.fillText(product.category.toUpperCase(), 54, 610);

  context.strokeStyle =
    product.id === "storeops" ? "rgba(16,25,35,.25)" : "rgba(255,255,255,.32)";
  context.lineWidth = 4;
  context.strokeRect(34, 34, canvas.width - 68, canvas.height - 68);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function disposeMaterial(material: THREE.Material) {
  Object.values(material).forEach((value) => {
    if (value instanceof THREE.Texture) {
      value.dispose();
    }
  });
  material.dispose();
}

function disposeObject(object: THREE.Object3D) {
  object.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.geometry.dispose();
      if (Array.isArray(child.material)) {
        child.material.forEach(disposeMaterial);
      } else {
        disposeMaterial(child.material);
      }
    }
  });
}

export function ProductScene({
  products,
  variant = "hero",
  className = "",
  showDetails = false,
}: ProductSceneProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const loadedRef = useRef<Map<string, LoadedProduct>>(new Map());
  const [activeProductId, setActiveProductId] = useState(products[0]?.id);
  const [webglFailed, setWebglFailed] = useState(false);
  const activeProduct = useMemo(
    () => products.find((product) => product.id === activeProductId) ?? products[0],
    [activeProductId, products],
  );

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const host = container;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, variant === "hero" ? 0.35 : 0.2, variant === "hero" ? 5.2 : 3.8);

    let renderer: THREE.WebGLRenderer;

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      window.setTimeout(() => setWebglFailed(true), 0);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 1.25);
    const key = new THREE.DirectionalLight(0xffffff, 2.35);
    key.position.set(3, 4, 5);
    const rim = new THREE.DirectionalLight(0x8de8ff, 1.45);
    rim.position.set(-4, 2, -3);
    scene.add(ambient, key, rim);

    const loader = new GLTFLoader();
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const root = new THREE.Group();
    const tweens: gsap.core.Tween[] = [];
    const loadedProducts = new Map<string, LoadedProduct>();
    let disposed = false;
    loadedRef.current = loadedProducts;
    scene.add(root);

    const spacing = variant === "hero" ? 1.58 : 0;
    const startX = -((products.length - 1) * spacing) / 2;

    products.forEach((product, index) => {
      loader.load(
        getProductModelPath(product),
        (gltf) => {
          if (disposed) {
            disposeObject(gltf.scene);
            return;
          }

          const group = new THREE.Group();
          group.name = product.id;
          group.userData.productId = product.id;
          group.position.set(startX + index * spacing, variant === "hero" ? 0 : -0.05, 0);
          group.rotation.set(
            THREE.MathUtils.degToRad(variant === "hero" ? -4 : -2),
            THREE.MathUtils.degToRad(variant === "hero" ? -20 + index * 18 : -18),
            THREE.MathUtils.degToRad(variant === "hero" ? -2 + index * 1.5 : -3),
          );
          group.scale.setScalar(variant === "hero" ? 1 : 0.92);
          group.add(gltf.scene);

          const labelTexture = createLabelTexture(product);
          if (labelTexture) {
            const label = new THREE.Mesh(
              new THREE.PlaneGeometry(1.08, 1.62),
              new THREE.MeshStandardMaterial({
                map: labelTexture,
                transparent: true,
                roughness: 0.4,
              }),
            );
            label.name = `${product.id}_front_label`;
            label.position.set(0, 0, 0.145);
            group.add(label);
          }

          root.add(group);

          const idle = prefersReducedMotion
            ? null
            : gsap.to(group.rotation, {
                y: group.rotation.y + Math.PI * 2,
                duration: variant === "hero" ? 14 + index * 1.8 : 18,
                ease: "none",
                repeat: -1,
              });

          if (idle) {
            tweens.push(idle);
          }

          loadedProducts.set(product.id, { group, idle });
        },
        undefined,
        () => {
          setWebglFailed(true);
        },
      );
    });

    function resize() {
      const rect = host.getBoundingClientRect();
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    function pickProduct(event: PointerEvent) {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const intersections = raycaster.intersectObjects(root.children, true);
      const hit = intersections
        .map((intersection) => {
          let object: THREE.Object3D | null = intersection.object;
          while (object && !object.userData.productId) {
            object = object.parent;
          }
          return object?.userData.productId as Product["id"] | undefined;
        })
        .find(Boolean);

      if (hit) {
        setActiveProductId(hit);
      }
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();
    renderer.domElement.addEventListener("pointermove", pickProduct);
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });

    return () => {
      disposed = true;
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener("pointermove", pickProduct);
      renderer.setAnimationLoop(null);
      tweens.forEach((tween) => tween.kill());
      loadedProducts.forEach(({ group }) => disposeObject(group));
      loadedProducts.clear();
      loadedRef.current = new Map();
      scene.clear();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [products, variant]);

  useEffect(() => {
    const tweens: gsap.core.Tween[] = [];

    loadedRef.current.forEach((loaded, id) => {
      const selected = id === activeProductId;
      const baseScale = variant === "hero" ? 1 : 0.92;
      const selectedScale = variant === "hero" ? 1.12 : 1.02;
      loaded.idle?.timeScale(selected ? 0.18 : 1);
      gsap.killTweensOf(loaded.group.scale);
      tweens.push(
        gsap.to(loaded.group.scale, {
          x: selected ? selectedScale : baseScale,
          y: selected ? selectedScale : baseScale,
          z: selected ? selectedScale : baseScale,
          duration: 0.5,
          ease: "power3.out",
        }),
      );
    });

    return () => {
      tweens.forEach((tween) => tween.kill());
    };
  }, [activeProductId, variant]);

  return (
    <div className={`product-scene product-scene--${variant} ${className}`}>
      <div
        ref={containerRef}
        className="product-scene__canvas"
        aria-label="Interactive 3D app packaging preview"
      />
      <div className="product-scene__controls" aria-label="Select product">
        {products.map((product) => (
          <button
            className={product.id === activeProductId ? "is-active" : ""}
            key={product.id}
            onClick={() => setActiveProductId(product.id)}
            onFocus={() => setActiveProductId(product.id)}
            onMouseEnter={() => setActiveProductId(product.id)}
            type="button"
          >
            {product.name}
          </button>
        ))}
      </div>
      {showDetails ? (
        <div className="product-scene__details" aria-live="polite">
          <span>{activeProduct.category}</span>
          <strong>{activeProduct.name}</strong>
          <p>{activeProduct.summary}</p>
        </div>
      ) : null}
      {webglFailed ? (
        <div className="product-scene__fallback">
          {products.map((product) => (
            <div key={product.id}>
              <strong>{product.name}</strong>
              <span>{product.category}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
