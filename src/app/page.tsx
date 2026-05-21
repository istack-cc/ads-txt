import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  Camera,
  Dumbbell,
  FileText,
  Grid3X3,
  LockKeyhole,
  Mic2,
  Palette,
  Sparkles,
  Wrench,
  Zap,
} from "lucide-react";
import { AppGrid } from "@/components/app-grid";
import { CinematicScroll } from "@/components/cinematic-scroll";
import { Footer } from "@/components/footer";
import { HeroMotionGraphic } from "@/components/hero-motion-graphic";
import { ManyMoreMarquee } from "@/components/many-more-marquee";
import { Nav } from "@/components/nav";
import { ScreenshotMotionCarousel } from "@/components/screenshot-motion-carousel";
import { buttonVariants } from "@/components/ui/button";
import {
  APPS,
  DEVELOPER_URL,
  FEATURED_APPS,
  IOS_DEVELOPER_URL,
} from "@/data/apps";
import { CATEGORIES_LIST } from "@/data/categories";
import { ORGANIZATION } from "@/data/organization";
import {
  generateGraph,
  generateItemListSchema,
  generateOrganizationSchema,
  generateWebSiteSchema,
} from "@/lib/schema";
import { cn } from "@/lib/utils";

const UNPUBLISHED_IDS = new Set(["forms"]);
const iosFirst = (a: (typeof APPS)[number], b: (typeof APPS)[number]) =>
  Number(b.platform === "ios") - Number(a.platform === "ios");
const LIVE_APPS = APPS.filter((app) => !UNPUBLISHED_IDS.has(app.id)).sort(iosFirst);
const FEATURED = FEATURED_APPS.filter((app) => !UNPUBLISHED_IDS.has(app.id)).sort(iosFirst).slice(0, 5);
const RECENT = [...LIVE_APPS]
  .filter((app) => app.playStoreUpdatedOn)
  .sort((a, b) => {
    const da = new Date(a.playStoreUpdatedOn!).getTime();
    const db = new Date(b.playStoreUpdatedOn!).getTime();
    return db - da;
  })
  .slice(0, 6);

function formatInstallsTotal() {
  const total = APPS.reduce((acc, app) => {
    const n = parseInt((app.playStoreInstalls ?? "0").replace(/\D/g, ""), 10) || 0;
    return acc + n;
  }, 0);
  if (total >= 1_000_000) {
    const m = total / 1_000_000;
    return `${m >= 10 ? Math.floor(m) : m.toFixed(1)}M+`;
  }
  if (total >= 1_000) return `${Math.round(total / 1_000)}K+`;
  return `${total}+`;
}

const STATS = [
  { value: `${LIVE_APPS.length}+`, label: "Free apps" },
  { value: formatInstallsTotal(), label: "Total installs" },
  { value: "4.6", label: "Avg. rating" },
  { value: `${CATEGORIES_LIST.length}`, label: "Categories" },
];

const CAT_COUNTS = Object.fromEntries(
  CATEGORIES_LIST.map((cat) => [
    cat.id,
    LIVE_APPS.filter((app) => app.seoCategory === cat.id).length,
  ])
);

const CAT_ICONS = {
  productivity: Zap,
  "ai-photo": Camera,
  utilities: Wrench,
  health: Dumbbell,
  education: FileText,
  personalization: Palette,
  voice: Mic2,
};

const PRINCIPLES = [
  {
    icon: BadgeCheck,
    title: "Free to start",
    text: "Every app has a clear free path, fast launch, and a focused job to do.",
  },
  {
    icon: LockKeyhole,
    title: "Low friction",
    text: "No mandatory accounts for core workflows, no onboarding maze, no extra noise.",
  },
  {
    icon: Grid3X3,
    title: "Made for daily tasks",
    text: "Small tools across photos, utilities, fitness, documents, voice, and personalization.",
  },
];

const jsonLd = generateGraph([
  generateOrganizationSchema(),
  generateWebSiteSchema(),
  generateItemListSchema(FEATURED, "iStack Featured Apps"),
]);

function FeaturedShowcase() {
  if (!FEATURED.length) return null;

  const slides = FEATURED.flatMap((app) => {
    const sources = app.screenshots?.length ? app.screenshots.slice(0, 3) : [app.bannerUrl];
    return sources.map((src, shotIndex) => ({
      src,
      alt: `${app.name} screenshot ${shotIndex + 1}`,
      href: `/apps/${app.id}/`,
    }));
  }).slice(0, 12);

  return (
    <ScreenshotMotionCarousel slides={slides} />
  );
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
        style={{ background: "#0f0f0f", color: "#fff" }}
      >
        Skip to main content
      </a>

      <Nav appsHref="#apps" />

      <main id="main-content" className="site3d">
        <CinematicScroll />
        <section className="home-hero3d" aria-labelledby="hero-heading">
          <div className="home-hero3d__copy">
            <p className="home-kicker">
              <Sparkles size={16} aria-hidden="true" />
              Solo app studio
            </p>
            <h1 id="hero-heading">iStack apps for everyday tasks.</h1>
            <p>
              A portfolio of free Android and iOS apps for photos, documents,
              utilities, fitness, voice tools, and customization.
            </p>
            <div className="home-actions">
              <Link
                href="#apps"
                className={cn(buttonVariants({ size: "lg" }), "home-action home-action--dark")}
              >
                Browse apps
                <Grid3X3 aria-hidden="true" />
              </Link>
              <a
                href={DEVELOPER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "home-action")}
              >
                Google Play
                <ArrowUpRight aria-hidden="true" />
              </a>
            </div>
          </div>

          <HeroMotionGraphic apps={LIVE_APPS} />
        </section>

        <section className="home-stat-band" aria-label="Key portfolio stats">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </section>

        <section id="categories" className="home-section" aria-labelledby="categories-heading">
          <div className="home-section__head">
            <p className="home-kicker">Categories</p>
            <h2 id="categories-heading">Find the tool by the job.</h2>
          </div>
          <div className="category3d-grid">
            {CATEGORIES_LIST.map((cat) => {
              const Icon = CAT_ICONS[cat.id as keyof typeof CAT_ICONS] ?? Grid3X3;
              return (
                <Link key={cat.id} href={`/category/${cat.slug}/`} className="category3d-card">
                  <span>
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <strong>{cat.name}</strong>
                  <small>{CAT_COUNTS[cat.id] ?? 0} apps</small>
                  <p>{cat.hub_keyword}</p>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="home-section home-section--dark" aria-labelledby="featured-heading">
          <div className="home-section__head home-section__head--split">
            <div>
              <p className="home-kicker">Featured shelf</p>
              <h2 id="featured-heading">Focused products with a clean store path.</h2>
            </div>
            <Link href="#apps" className="home-text-link">
              See all apps
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>

          <FeaturedShowcase />
        </section>

        <section className="home-section" aria-labelledby="why-heading">
          <div className="home-section__head">
            <p className="home-kicker">Why iStack</p>
            <h2 id="why-heading">Simple apps, polished enough to keep.</h2>
          </div>
          <div className="principle3d-grid">
            {PRINCIPLES.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="principle3d-card">
                  <Icon size={22} aria-hidden="true" />
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              );
            })}
          </div>
        </section>

        {RECENT.length > 0 && (
          <section className="home-section home-section--muted" aria-labelledby="recent-heading">
            <div className="home-section__head home-section__head--split">
              <div>
                <p className="home-kicker">Recently updated</p>
                <h2 id="recent-heading">Fresh builds from the catalog.</h2>
              </div>
              <Link href="#apps" className="home-text-link">
                All apps
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </div>
            <div className="recent3d-grid">
              {RECENT.map((app) => (
                <Link key={app.id} href={`/apps/${app.id}/`} className="recent3d-card">
                  <Image src={app.iconUrl} alt="" width={48} height={48} unoptimized />
                  <div>
                    <strong>{app.name}</strong>
                    <span>{app.playStoreUpdatedOn}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="home-bio" aria-labelledby="bio-heading">
          <h2 id="bio-heading">Built by one independent publisher.</h2>
          <div className="home-bio__content">
            <p>
              iStack is a focused mobile app portfolio with {ORGANIZATION.aggregate_stats.total_apps}
              {" "}published apps, {(ORGANIZATION.aggregate_stats.total_installs / 1000).toFixed(0)}K+
              {" "}installs, and a {ORGANIZATION.aggregate_stats.avg_rating} average rating.
            </p>
            <div className="home-bio__actions">
              <a href={DEVELOPER_URL} target="_blank" rel="noopener noreferrer">
                Google Play profile
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
              <a href={IOS_DEVELOPER_URL} target="_blank" rel="noopener noreferrer">
                App Store profile
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        <ManyMoreMarquee apps={LIVE_APPS} speed={45} />

        <section id="apps" className="home-section home-section--apps" aria-labelledby="apps-heading">
          <div className="home-section__head">
            <p className="home-kicker">Complete catalog</p>
            <h2 id="apps-heading">All {LIVE_APPS.length} apps.</h2>
          </div>
          <AppGrid />
        </section>
      </main>

      <Footer />
    </>
  );
}
