"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Float, RoundedBox } from "@react-three/drei";
import {
  AdditiveBlending,
  CanvasTexture,
  Group,
  LinearFilter,
  MathUtils,
  SRGBColorSpace,
  TextureLoader,
  type Texture,
} from "three";
import type { App } from "@/data/apps";

type HeroMotionGraphicProps = {
  apps?: App[];
};

function createRoundedIconTexture(texture: Texture) {
  const image = texture.image as CanvasImageSource & { naturalWidth?: number; naturalHeight?: number };
  const size = Math.max(image.naturalWidth ?? 512, image.naturalHeight ?? 512, 512);
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext("2d");
  if (!context) return texture;

  const radius = size * 0.22;
  context.clearRect(0, 0, size, size);
  context.beginPath();
  context.moveTo(radius, 0);
  context.lineTo(size - radius, 0);
  context.quadraticCurveTo(size, 0, size, radius);
  context.lineTo(size, size - radius);
  context.quadraticCurveTo(size, size, size - radius, size);
  context.lineTo(radius, size);
  context.quadraticCurveTo(0, size, 0, size - radius);
  context.lineTo(0, radius);
  context.quadraticCurveTo(0, 0, radius, 0);
  context.closePath();
  context.clip();
  context.drawImage(image, 0, 0, size, size);

  const roundedTexture = new CanvasTexture(canvas);
  roundedTexture.colorSpace = SRGBColorSpace;
  roundedTexture.minFilter = LinearFilter;
  roundedTexture.magFilter = LinearFilter;
  roundedTexture.needsUpdate = true;
  return roundedTexture;
}

function StageTile({
  index,
  total,
  texture,
  featured = false,
}: {
  index: number;
  total: number;
  texture: Texture;
  featured?: boolean;
}) {
  const groupRef = useRef<Group>(null);
  const angle = (index / total) * Math.PI * 2;

  useFrame(({ camera, clock, pointer }) => {
    const group = groupRef.current;
    if (!group) return;

    const t = clock.elapsedTime;

    if (featured) {
      group.position.set(pointer.x * 0.14, 0.02 + Math.sin(t * 1.1) * 0.08 + pointer.y * 0.08, 0.56);
      group.rotation.set(-0.08 + pointer.y * 0.05, pointer.x * 0.14, Math.sin(t * 0.7) * 0.025);
      group.scale.setScalar(1.05 + Math.sin(t * 1.4) * 0.012);
    } else {
      const orbit = angle + t * 0.34;
      const depth = Math.sin(orbit);
      const x = Math.cos(orbit) * 1.56;
      const y = Math.sin(orbit * 1.42) * 0.42 + Math.cos(orbit * 0.7) * 0.1;
      const z = depth * 0.84 - 0.1;
      const scale = MathUtils.lerp(0.54, 0.72, (depth + 1) / 2);

      group.position.set(x, y, z);
      group.scale.setScalar(scale);
      group.lookAt(camera.position);
      group.rotation.z += Math.sin(t + index) * 0.03;
    }
  });

  const size = featured ? 1.34 : 0.74;
  const depth = featured ? 0.2 : 0.14;
  const radius = featured ? 0.24 : 0.16;
  const iconSize = featured ? size * 0.7 : size * 0.9;

  return (
    <group ref={groupRef}>
      <RoundedBox args={[size, size, depth]} radius={radius} smoothness={8}>
        <meshStandardMaterial
          color={featured ? "#edf7ef" : "#17201b"}
          metalness={featured ? 0.18 : 0.36}
          roughness={featured ? 0.28 : 0.38}
          emissive={featured ? "#d5fff4" : "#d5fff4"}
          emissiveIntensity={featured ? 0.02 : 0.04}
        />
      </RoundedBox>
      <mesh position={[0, 0, depth / 2 + 0.016]}>
        <planeGeometry args={[iconSize, iconSize]} />
        <meshBasicMaterial map={texture} toneMapped={false} transparent />
      </mesh>
    </group>
  );
}

function OrbitRings() {
  const ringsRef = useRef<Group>(null);

  useFrame(({ clock, pointer }) => {
    if (!ringsRef.current) return;
    const t = clock.elapsedTime;
    ringsRef.current.rotation.x = 1.17 + pointer.y * 0.05;
    ringsRef.current.rotation.y = pointer.x * 0.08;
    ringsRef.current.rotation.z = t * 0.1;
  });

  return (
    <group ref={ringsRef}>
      {[0, 1, 2].map((ring) => (
        <mesh key={ring} rotation={[0, 0, ring * 0.7]}>
          <torusGeometry args={[1.22 + ring * 0.28, 0.006, 10, 150]} />
          <meshBasicMaterial
            color={ring === 1 ? "#8ad8c8" : "#f7efe0"}
            transparent
            opacity={ring === 1 ? 0.34 : 0.18}
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function LightDots() {
  const groupRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.z = -clock.elapsedTime * 0.16;
  });

  const dots = useMemo(
    () =>
      Array.from({ length: 18 }, (_, index) => {
        const angle = (index / 18) * Math.PI * 2;
        const radius = 1.62 + (index % 3) * 0.14;
        return [Math.cos(angle) * radius, Math.sin(angle * 1.5) * 0.42, Math.sin(angle) * 0.82] as const;
      }),
    []
  );

  return (
    <group ref={groupRef}>
      {dots.map((dot, index) => (
        <mesh key={index} position={dot}>
          <sphereGeometry args={[index % 4 === 0 ? 0.032 : 0.022, 12, 12]} />
          <meshBasicMaterial
            color={index % 4 === 0 ? "#8ad8c8" : "#f8f3e7"}
            transparent
            opacity={index % 4 === 0 ? 0.74 : 0.42}
            blending={AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

function OrbitTiles({ apps }: { apps: App[] }) {
  const textures = useLoader(TextureLoader, apps.map((app) => app.iconUrl));
  const roundedTextures = useMemo(() => textures.map(createRoundedIconTexture), [textures]);

  useEffect(() => {
    roundedTextures.forEach((texture) => {
      texture.colorSpace = SRGBColorSpace;
      texture.needsUpdate = true;
    });
    return () => {
      roundedTextures.forEach((texture) => {
        if (texture instanceof CanvasTexture) texture.dispose();
      });
    };
  }, [roundedTextures]);

  return (
    <>
      <StageTile index={0} total={1} texture={roundedTextures[0]} featured />
      {apps.slice(1).map((app, index) => (
        <StageTile
          key={app.id}
          index={index}
          total={Math.max(1, apps.length - 1)}
          texture={roundedTextures[index + 1]}
        />
      ))}
    </>
  );
}

function AppOrbitScene({ apps }: HeroMotionGraphicProps) {
  const rootRef = useRef<Group>(null);
  const heroApps = useMemo(() => (apps ?? []).slice(0, 8), [apps]);

  useFrame(({ clock, pointer }) => {
    if (!rootRef.current) return;
    rootRef.current.rotation.y = pointer.x * 0.08 + Math.sin(clock.elapsedTime * 0.42) * 0.035;
    rootRef.current.rotation.x = -0.06 + pointer.y * 0.05;
  });

  if (heroApps.length === 0) return null;

  return (
    <group ref={rootRef}>
      <ambientLight intensity={1.8} />
      <directionalLight position={[2.4, 3.6, 4.8]} intensity={2.6} color="#fff8eb" />
      <pointLight position={[-2.3, -0.6, 2.2]} intensity={24} color="#8ad8c8" />
      <pointLight position={[2.3, 1.6, -1.8]} intensity={9} color="#f6b96f" />

      <Float speed={1.3} rotationIntensity={0.12} floatIntensity={0.18}>
        <OrbitRings />
        <LightDots />
        <OrbitTiles apps={heroApps} />
      </Float>
    </group>
  );
}

export function HeroMotionGraphic({ apps }: HeroMotionGraphicProps) {
  return (
    <div className="hero-motion3d" aria-hidden="true">
      <Canvas
        className="hero-motion3d__canvas"
        camera={{ position: [0, 0, 7.6], fov: 36 }}
        dpr={[1, 1.7]}
        gl={{ antialias: true, alpha: true }}
      >
        <AppOrbitScene apps={apps} />
      </Canvas>
    </div>
  );
}
