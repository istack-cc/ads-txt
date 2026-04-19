import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { AppShowcase } from "@/components/app-showcase";
import { AppGrid } from "@/components/app-grid";
import { ManyMoreMarquee } from "@/components/many-more-marquee";
import { Footer } from "@/components/footer";
import { FEATURED_APPS } from "@/data/apps";
import { APPS, DEVELOPER_URL, IOS_DEVELOPER_URL, SUPPORT_EMAIL } from "@/data/apps";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://istack.cc";

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "iStack",
  url: SITE_URL,
  logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.ico` },
  contactPoint: {
    "@type": "ContactPoint",
    email: SUPPORT_EMAIL,
    contactType: "customer support",
  },
  sameAs: [DEVELOPER_URL, IOS_DEVELOPER_URL],
};

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "iStack",
  url: SITE_URL,
  description: `iStack makes free Android and iOS apps for workouts, photo editing, documents, device utilities, and everyday phone tasks. Browse ${APPS.length}+ apps on Google Play and App Store.`,
  publisher: { "@type": "Organization", name: "iStack", url: SITE_URL },
};

const UNPUBLISHED_IDS = new Set(["forms"]);
const LIVE_APPS = APPS.filter((a) => !UNPUBLISHED_IDS.has(a.id));
const FEATURED = FEATURED_APPS.filter((a) => !UNPUBLISHED_IDS.has(a.id)).slice(0, 6);

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
      />

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
        style={{ background: "#0f0f0f", color: "#fff" }}
      >
        Skip to main content
      </a>

      <Nav appsHref="#apps" />

      <main id="main-content">
        <Hero />

        <ManyMoreMarquee apps={LIVE_APPS} speed={40} />

        {FEATURED.map((app, i) => (
          <AppShowcase key={app.id} app={app} index={i} />
        ))}

        <ManyMoreMarquee apps={LIVE_APPS} speed={55} />

        <section
          id="apps"
          aria-labelledby="apps-heading"
          style={{
            background: "#fff",
            padding: "80px 24px",
            scrollMarginTop: 80,
          }}
        >
          <div style={{ maxWidth: 1120, margin: "0 auto" }}>
            <h2
              id="apps-heading"
              className="sd-fade-up"
              style={{
                fontWeight: 800,
                fontSize: 36,
                marginBottom: 8,
                letterSpacing: "-0.03em",
                color: "#0f0f0f",
              }}
            >
              All {APPS.length} Apps
            </h2>
            <p
              className="sd-fade-up"
              style={{ color: "#888", fontSize: 15, marginBottom: 36 }}
            >
              Every app is free to download. No trials, no limits.
            </p>
            <AppGrid />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
