import { ArrowRight, Box, Cuboid, Sparkles } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { products } from "@/components/product-data";
import { ProductScene } from "@/components/product-scene";

const heroProducts = products.slice(0, 3);

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#090e14] text-white">
      <nav className="site-nav" aria-label="Primary navigation">
        <a className="site-nav__brand" href="#top">
          iStack App Foundry
        </a>
        <div className="site-nav__links">
          <a href="#work">Work</a>
          <a href="#apps">Apps</a>
          <a href="#stack">Stack</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <section className="hero-section" id="top">
        <div className="hero-section__copy">
          <h1>Apps presented as products you can inspect.</h1>
          <p>
            A real-time WebGL shelf where each app becomes a polished software
            package. Hover to slow the rotation, reveal the app&apos;s purpose,
            and open the case study.
          </p>
          <div className="hero-section__actions">
            <a className="button button--primary" href="#apps">
              Explore apps
              <ArrowRight aria-hidden="true" size={17} />
            </a>
            <a className="button button--secondary" href="#stack">
              How it works
            </a>
          </div>
        </div>

        <ProductScene
          className="hero-section__scene"
          products={heroProducts}
          showDetails
          variant="hero"
        />
      </section>

      <section className="proof-band" id="work">
        <div>
          <Cuboid aria-hidden="true" size={22} />
          <span>GLB packages</span>
          <strong>Modeled as real 3D product objects.</strong>
        </div>
        <div>
          <Sparkles aria-hidden="true" size={22} />
          <span>GSAP motion</span>
          <strong>Idle rotation, hover scale, and focus states.</strong>
        </div>
        <div>
          <Box aria-hidden="true" size={22} />
          <span>WebGL runtime</span>
          <strong>Rendered live with Three.js in the browser.</strong>
        </div>
      </section>

      <section className="apps-section" id="apps">
        <div className="section-heading">
          <span>Product shelf</span>
          <h2>Each app has its own package, palette, and product story.</h2>
        </div>
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="stack-section" id="stack">
        <div className="stack-section__copy">
          <span>Build stack</span>
          <h2>Designed like a product gallery, built like an interactive scene.</h2>
        </div>
        <div className="stack-list">
          <article>
            <h3>Blender to GLTF</h3>
            <p>
              Packaging models are defined in a Blender Python source file and
              exported as GLB assets for the browser scene.
            </p>
          </article>
          <article>
            <h3>Three.js WebGL</h3>
            <p>
              Product files are loaded through GLTFLoader and lit in real time
              with stable responsive canvas dimensions.
            </p>
          </article>
          <article>
            <h3>GSAP interactions</h3>
            <p>
              Rotation, hover emphasis, and entrance pacing are handled with
              GSAP tweens instead of CSS-only transforms.
            </p>
          </article>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div>
          <span>Ready for a real product shelf?</span>
          <h2>Turn your app portfolio into something people can inspect.</h2>
        </div>
        <a className="button button--primary" href="mailto:hello@example.com">
          Start a build
          <ArrowRight aria-hidden="true" size={17} />
        </a>
      </section>
    </main>
  );
}
