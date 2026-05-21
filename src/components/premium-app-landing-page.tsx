import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  Check,
  Download,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import type { CSSProperties } from "react";
import { PremiumAppGsap } from "@/components/premium-app-gsap";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { App, AppFaq } from "@/data/apps";
import { cn } from "@/lib/utils";

type DescSection = {
  heading?: string;
  body: string;
};

type CategoryLike = {
  name: string;
  slug: string;
};

type HowToStep = {
  name: string;
  text: string;
};

type RelatedSeoLink = {
  title: string;
  href: string;
  description: string;
};

type LifestyleAsset = {
  src: string;
  alt: string;
};

type PremiumAppLandingPageProps = {
  app: App;
  category: CategoryLike;
  descSections: DescSection[];
  faqs: AppFaq[];
  howToSteps: HowToStep[];
  relatedApps: App[];
  relatedSeoLinks: RelatedSeoLink[];
  heroUrl: string;
  footerUrl: string;
  devUrl: string;
  jsonLd: unknown;
};

function formatInstalls(raw?: string) {
  const n = parseInt((raw ?? "0").replace(/\D/g, ""), 10) || 0;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1)}M+`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K+`;
  if (n > 0) return `${n}+`;
  return "Free";
}

function platformStore(app: App) {
  if (app.platform === "ios") return "App Store";
  if (app.platform === "both") return "App Store and Google Play";
  return "Google Play";
}

function platformLabel(app: App) {
  if (app.platform === "ios") return "iPhone";
  if (app.platform === "both") return "Android and iPhone";
  return "Android";
}

function storeCtaLabel(app: App) {
  if (app.platform === "both") return "Get free app";
  return "Free download";
}

function getProofStats(app: App, category: CategoryLike) {
  return [
    { value: app.rating ? app.rating.toFixed(1) : "4.6", label: "Rating" },
    { value: formatInstalls(app.playStoreInstalls), label: "Reach" },
    { value: "Free", label: "Start" },
    { value: category.name, label: "Category" },
  ];
}

function getFeatures(app: App) {
  if (app.features.length > 0) {
    return app.features.slice(0, 3);
  }

  return [
    {
      title: "Focused workflow",
      description: app.short_description || app.description,
    },
    {
      title: "No account wall",
      description: "Open the app and start with the core tools without a long setup path.",
    },
    {
      title: "Clean repeat use",
      description: `${app.name} keeps the interface practical, fast, and easy to return to.`,
    },
  ];
}

function getLifestyleAssets(app: App): LifestyleAsset[] {
  if (app.id !== "ai-tanning") return [];

  return [
    {
      src: "/generated/ai-tanning-beach-walk.png",
      alt: "Adult women walking along a sunny beach shoreline",
    },
    {
      src: "/generated/ai-tanning-beach-lounge.png",
      alt: "Adult women relaxing on a beach with the ocean behind them",
    },
  ];
}

function PremiumDownloadLink({
  app,
  href,
  className,
  compact = false,
}: {
  app: App;
  href: string;
  className?: string;
  compact?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        buttonVariants({ size: compact ? "default" : "lg" }),
        "group relative isolate min-h-12 overflow-hidden rounded-full border-0 bg-[linear-gradient(135deg,var(--app-accent)_0%,#111111_92%)] px-5 font-black text-white shadow-2xl shadow-[var(--app-accent)]/20 transition duration-300 hover:-translate-y-0.5 hover:text-white hover:shadow-[0_22px_54px_-18px_var(--app-accent)] focus-visible:ring-4 focus-visible:ring-[var(--app-accent-soft)]",
        "before:absolute before:inset-y-0 before:left-[-40%] before:z-[-1] before:w-1/3 before:skew-x-[-18deg] before:bg-white/30 before:opacity-0 before:blur-sm before:transition-all before:duration-700 hover:before:left-[120%] hover:before:opacity-100",
        compact ? "h-11 gap-2 px-5 text-sm" : "h-14 gap-3 px-6 text-base",
        className
      )}
    >
      <Download className={compact ? "size-4" : "size-5"} aria-hidden="true" />
      <span className="flex flex-col items-start leading-none">
        <span>{storeCtaLabel(app)}</span>
        {!compact && (
          <span className="mt-1 text-[11px] font-bold uppercase tracking-normal text-white/72">
            {platformStore(app)}
          </span>
        )}
      </span>
      {!compact && (
        <span className="ml-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-black uppercase tracking-normal text-[var(--app-accent)]">
          Free
        </span>
      )}
    </a>
  );
}

export function PremiumAppLandingPage({
  app,
  category,
  descSections,
  faqs,
  howToSteps,
  relatedApps,
  relatedSeoLinks,
  heroUrl,
  footerUrl,
  devUrl,
  jsonLd,
}: PremiumAppLandingPageProps) {
  const screenshots = app.screenshots ?? [];
  const primaryScreens = screenshots.slice(0, 3);
  const stats = getProofStats(app, category);
  const features = getFeatures(app);
  const lifestyleAssets = getLifestyleAssets(app);
  const sections = (descSections.length ? descSections : [{ body: app.description }]).slice(0, 3);
  const accentStyle = {
    "--app-accent": app.gradientFrom,
    "--app-accent-soft": `${app.gradientFrom}16`,
  } as CSSProperties;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PremiumAppGsap>
        <main
          id="main-content"
          className="min-h-screen bg-background text-foreground"
          style={accentStyle}
        >
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-background"
          >
            Skip to main content
          </a>
          <PremiumNav app={app} />

          <section className="relative overflow-hidden px-5 pb-20 pt-24 md:px-8 lg:px-10">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[720px] bg-[radial-gradient(circle_at_82%_20%,var(--app-accent-soft),transparent_36%),linear-gradient(180deg,hsl(var(--background))_0%,transparent_74%)]" />
            <div className="relative mx-auto grid min-h-[720px] w-full max-w-7xl items-center gap-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(420px,0.76fr)]">
              <div data-gsap="hero-copy" className="flex max-w-3xl flex-col items-start">
                <h1 className="max-w-4xl text-balance text-[56px] font-black leading-[0.92] tracking-normal text-foreground md:text-[82px] lg:text-[104px]">
                  {app.name}
                </h1>
                <p className="mt-5 max-w-2xl text-balance text-2xl font-bold leading-tight text-[var(--app-accent)] md:text-4xl">
                  {app.subtitle}
                </p>
                <p className="mt-6 max-w-xl text-pretty text-base font-medium leading-8 text-muted-foreground md:text-lg">
                  {app.short_description || app.description}
                </p>
                <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                  <PremiumDownloadLink app={app} href={heroUrl} />
                  <a
                    href="#screens"
                    className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 rounded-full px-6 font-bold")}
                  >
                    View screens
                  </a>
                </div>
              </div>

              <div data-gsap="hero-media" className="relative mx-auto w-full max-w-[560px] lg:max-w-none">
                <div className="absolute inset-x-8 bottom-4 h-16 rounded-full bg-foreground/10 blur-2xl" />
                <div data-gsap="float" className="relative min-h-[520px]">
                  {primaryScreens.length > 0 ? (
                    primaryScreens.map((src, index) => (
                      <div
                        key={src}
                        className={cn(
                          "absolute overflow-hidden rounded-[2rem] border bg-card p-2 shadow-2xl shadow-foreground/10",
                          index === 0 && "left-1/2 top-0 z-30 w-[250px] -translate-x-1/2 md:w-[282px]",
                          index === 1 && "left-0 top-24 z-20 w-[210px] -rotate-6 opacity-90 md:w-[236px]",
                          index === 2 && "right-0 top-28 z-10 w-[210px] rotate-6 opacity-90 md:w-[236px]"
                        )}
                      >
                        <Image
                          src={src}
                          alt={`${app.name} screenshot ${index + 1}`}
                          width={360}
                          height={760}
                          className="aspect-[9/19] w-full rounded-[1.55rem] object-cover object-top"
                          priority={index === 0}
                          unoptimized
                        />
                      </div>
                    ))
                  ) : (
                    <Card className="absolute left-1/2 top-16 grid size-[320px] -translate-x-1/2 place-items-center rounded-[2rem]">
                      <Image
                        src={app.iconUrl}
                        alt={`${app.name} icon`}
                        width={168}
                        height={168}
                        className="size-40 rounded-[2rem] object-cover shadow-xl shadow-foreground/10"
                        unoptimized
                      />
                    </Card>
                  )}
                  <Badge
                    variant="outline"
                    className="absolute bottom-14 left-1/2 z-40 -translate-x-1/2 gap-2 rounded-full border-background bg-background/90 px-4 py-2 text-[var(--app-accent)] shadow-lg shadow-foreground/5 backdrop-blur"
                  >
                    <Sparkles aria-hidden="true" />
                    {platformLabel(app)}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="relative mx-auto grid max-w-7xl gap-px overflow-hidden rounded-lg border bg-border sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} data-gsap="proof-item" className="bg-background p-5">
                  <strong className="block text-2xl font-black text-foreground">{stat.value}</strong>
                  <span className="mt-1 block text-xs font-bold uppercase tracking-normal text-muted-foreground">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section id="screens" className="scroll-mt-24 border-t px-5 py-20 md:px-8 lg:px-10">
            <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.72fr_1fr]">
              <div className="max-w-xl">
                <p className="text-sm font-bold text-[var(--app-accent)]">Screens</p>
                <h2 className="mt-3 text-balance text-4xl font-black leading-tight md:text-6xl">
                  The product stays visible.
                </h2>
                <p className="mt-5 text-pretty text-base leading-8 text-muted-foreground">
                  A cleaner page should make the app easier to judge. Real screens, compact proof,
                  and direct store actions do the work without extra decoration.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {(primaryScreens.length ? primaryScreens : [app.iconUrl, app.bannerUrl, app.iconUrl]).map((src, index) => (
                  <Card key={`${src}-${index}`} className="overflow-hidden rounded-lg">
                    <CardContent className="p-2">
                      <Image
                        src={src}
                        alt={primaryScreens.length ? `${app.name} screenshot ${index + 1}` : ""}
                        width={320}
                        height={680}
                        className="aspect-[9/19] w-full rounded-md object-cover object-top"
                        unoptimized
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section id="proof" className="scroll-mt-24 px-5 py-20 md:px-8 lg:px-10">
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-4 md:grid-cols-3">
                {features.map((feature, index) => {
                  const Icon = [BadgeCheck, ShieldCheck, Star][index] ?? BadgeCheck;
                  return (
                    <Card key={feature.title} className="rounded-lg">
                      <CardHeader>
                        <Icon className="text-[var(--app-accent)]" aria-hidden="true" />
                        <CardTitle>{feature.title}</CardTitle>
                        <CardDescription>{feature.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>

          {lifestyleAssets.length > 0 && (
            <section className="border-y bg-muted/35 px-5 py-20 md:px-8 lg:px-10">
              <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.48fr_1fr] lg:items-end">
                <div>
                  <p className="text-sm font-bold text-[var(--app-accent)]">Beach-ready</p>
                  <h2 className="mt-3 text-balance text-4xl font-black leading-tight md:text-5xl">
                    Plan sun time with a calmer visual story.
                  </h2>
                  <p className="mt-5 text-pretty text-base leading-8 text-muted-foreground">
                    The page now pairs the app screenshots with warm lifestyle assets that match the UV, SPF,
                    and tanning use case without crowding the product UI.
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {lifestyleAssets.map((asset, index) => (
                    <figure
                      key={asset.src}
                      className={cn(
                        "overflow-hidden rounded-lg border bg-background p-2 shadow-sm",
                        index === 1 && "sm:translate-y-8"
                      )}
                    >
                      <Image
                        src={asset.src}
                        alt={asset.alt}
                        width={1536}
                        height={1024}
                        className="aspect-[4/3] w-full rounded-md object-cover"
                        sizes="(min-width: 1024px) 34vw, (min-width: 640px) 46vw, 100vw"
                      />
                    </figure>
                  ))}
                </div>
              </div>
            </section>
          )}

          <section className="border-y bg-muted/35 px-5 py-20 md:px-8 lg:px-10">
            <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.56fr_1fr]">
              <div>
                <p className="text-sm font-bold text-[var(--app-accent)]">How it works</p>
                <h2 className="mt-3 text-balance text-4xl font-black leading-tight md:text-5xl">
                  Three steps, no friction.
                </h2>
              </div>
              <div className="grid gap-px overflow-hidden rounded-lg border bg-border">
                {howToSteps.map((step, index) => (
                  <article key={step.name} className="grid gap-5 bg-background p-5 md:grid-cols-[4rem_1fr]">
                    <span className="text-sm font-black text-[var(--app-accent)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-lg font-black">{step.name}</h3>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">{step.text}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="px-5 py-20 md:px-8 lg:px-10">
            <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.58fr_1fr]">
              <div>
                <p className="text-sm font-bold text-[var(--app-accent)]">About</p>
                <h2 className="mt-3 text-balance text-4xl font-black leading-tight md:text-5xl">
                  {app.name}
                </h2>
                <a
                  href={devUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground"
                >
                  iStack
                  <ExternalLink aria-hidden="true" />
                </a>
              </div>
              <div className="grid gap-4">
                {sections.map((section, index) => (
                  <Card key={index} className="rounded-lg">
                    <CardHeader>
                      {section.heading && <CardTitle>{section.heading}</CardTitle>}
                      <CardDescription className="text-base leading-8">{section.body}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {relatedSeoLinks.length > 0 && (
            <section className="border-t px-5 py-20 md:px-8 lg:px-10">
              <div className="mx-auto max-w-7xl">
                <h2 className="text-3xl font-black tracking-normal">Related guides</h2>
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  {relatedSeoLinks.map((link) => (
                    <Card key={link.href} className="rounded-lg transition hover:-translate-y-0.5">
                      <Link href={link.href}>
                        <CardHeader>
                          <CardTitle className="text-base">{link.title}</CardTitle>
                          <CardDescription>{link.description}</CardDescription>
                        </CardHeader>
                      </Link>
                    </Card>
                  ))}
                </div>
              </div>
            </section>
          )}

          <section id="faq" className="scroll-mt-24 border-t px-5 py-20 md:px-8 lg:px-10">
            <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.55fr_1fr]">
              <h2 className="text-balance text-4xl font-black leading-tight md:text-5xl">
                Frequently asked questions
              </h2>
              <dl className="grid gap-px overflow-hidden rounded-lg border bg-border">
                {faqs.map((faq) => (
                  <details key={faq.question} className="group bg-background p-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-black">
                      {faq.question}
                      <Check className="text-[var(--app-accent)] transition group-open:rotate-45" aria-hidden="true" />
                    </summary>
                    <dd className="mt-4 text-sm leading-7 text-muted-foreground">{faq.answer}</dd>
                  </details>
                ))}
              </dl>
            </div>
          </section>

          <section className="px-5 py-20 md:px-8 lg:px-10">
            <div className="mx-auto grid max-w-7xl items-center gap-8 rounded-lg border bg-foreground p-6 text-background md:grid-cols-[1fr_auto] md:p-8">
              <div>
                <h2 className="text-balance text-3xl font-black leading-tight md:text-5xl">
                  Ready to try {app.name}?
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-background/70">
                  Free on {platformStore(app)}, with a direct path into the core workflow.
                </p>
              </div>
              <PremiumDownloadLink app={app} href={footerUrl} className="shadow-white/10 hover:shadow-white/20" />
            </div>
          </section>

          {relatedApps.length > 0 && (
            <section className="border-t px-5 py-16 md:px-8 lg:px-10">
              <div className="mx-auto max-w-7xl">
                <div className="flex items-end justify-between gap-6">
                  <h2 className="text-3xl font-black tracking-normal">More {category.name}</h2>
                  <Link href={`/category/${category.slug}/`} className="text-sm font-bold text-muted-foreground hover:text-foreground">
                    See all
                  </Link>
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
                  {relatedApps.slice(0, 6).map((related) => (
                    <Link key={related.id} href={`/apps/${related.id}/`} className="group rounded-lg border p-3 transition hover:-translate-y-0.5 hover:bg-muted/40">
                      <Image
                        src={related.iconUrl}
                        alt={`${related.name} icon`}
                        width={48}
                        height={48}
                        className="size-12 rounded-md object-cover"
                        unoptimized
                      />
                      <p className="mt-4 line-clamp-2 text-sm font-bold leading-tight">{related.name}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}
        </main>
      </PremiumAppGsap>

      <PremiumFooter />
    </>
  );
}

function PremiumNav({ app }: { app: App }) {
  return (
    <header data-gsap="nav" className="fixed inset-x-0 top-0 z-50 px-4 py-4 md:px-8">
      <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-full border bg-background/86 px-3 py-2 shadow-sm backdrop-blur-xl">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <Image
            src={app.iconUrl}
            alt=""
            width={36}
            height={36}
            className="size-9 rounded-md object-cover"
            unoptimized
          />
          <span className="truncate text-sm font-black text-foreground sm:text-base">
            {app.name}
          </span>
        </Link>
        <div className="hidden items-center gap-6 text-sm font-bold text-muted-foreground md:flex">
          <a href="#screens" className="hover:text-foreground">Screens</a>
          <a href="#proof" className="hover:text-foreground">Proof</a>
          <a href="#faq" className="hover:text-foreground">FAQ</a>
        </div>
        <a
          href="#screens"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "hidden rounded-full px-4 font-bold sm:inline-flex")}
        >
          Preview
        </a>
      </nav>
    </header>
  );
}

function PremiumFooter() {
  return (
    <footer className="border-t bg-background px-5 py-10 text-foreground md:px-8 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 md:flex-row md:items-center">
        <p className="text-sm text-muted-foreground">Copyright 2026 iStack. All rights reserved.</p>
        <nav className="flex flex-wrap gap-5 text-sm font-bold text-muted-foreground">
          <Link href="/privacy/" className="hover:text-foreground">
            Privacy
          </Link>
          <Link href="/terms/" className="hover:text-foreground">
            Terms
          </Link>
          <a href="mailto:contact@istack.cc" className="hover:text-foreground">
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}
