import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  Apple,
  BadgeCheck,
  Check,
  ExternalLink,
  Star,
} from "lucide-react";
import {
  DmvAnimatedText,
  DmvScrollMarquee,
  DmvStickyAttestations,
  MotionReveal,
} from "@/components/dmv-scroll-effects";
import { DEVELOPER_URL } from "@/data/apps";
import type { App, AppFaq } from "@/data/apps";
import { getPlayStoreUrl } from "@/lib/storeUrl";

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

type DmvPracticePageProps = {
  app: App;
  category: CategoryLike;
  descSections: DescSection[];
  faqs: AppFaq[];
  howToSteps: HowToStep[];
  relatedApps: App[];
  heroUrl: string;
  footerUrl: string;
  devUrl: string;
  jsonLd: unknown;
};

const glass =
  "relative overflow-hidden border border-white/70 bg-white/64 shadow-[0_24px_80px_-52px_rgba(15,60,130,0.45),inset_0_1px_1px_rgba(255,255,255,0.92)] backdrop-blur-xl";

const navLinks = ["Home", "How It Works", "Attestations", "FAQ"];

const attestationCards = [
  {
    title: "Passed first try",
    quote: "The mock sessions made the real test feel familiar.",
    person: "Maya, permit student",
    image: "/generated/dmv-attestation-3.png",
  },
  {
    title: "CDL review clicked",
    quote: "I could repeat the tricky parts instead of rereading everything.",
    person: "Luis, CDL prep",
    image: "/generated/dmv-attestation-2.png",
  },
  {
    title: "Less stress",
    quote: "Quick practice before my appointment helped me stay focused.",
    person: "Kai, learner driver",
    image: "/generated/dmv-attestation-1.png",
  },
];

export function DmvPracticeLandingPage({
  app,
  category,
  descSections,
  faqs,
  howToSteps,
  relatedApps,
  heroUrl,
  footerUrl,
  devUrl,
  jsonLd,
}: DmvPracticePageProps) {
  const screenshots = app.screenshots ?? [];
  const marqueeImages = [
    ...attestationCards.map((card) => card.image),
    "/generated/dmv-hero-color.png",
    ...screenshots.slice(0, 6),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-[#f7fbff] text-[#071322]">
        <LightNav appIconUrl={app.iconUrl} />

        <section className="relative flex min-h-screen items-start justify-center overflow-hidden px-5 pb-20 pt-28 md:px-10">
          <Image
            src="/generated/dmv-hero-road.png"
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
            unoptimized
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,251,255,0.90)_0%,rgba(247,251,255,0.62)_33%,rgba(247,251,255,0.08)_66%,rgba(247,251,255,0.40)_100%)]" />
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#f7fbff] to-transparent" />
          <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center text-center">
            <MotionReveal>
              <div className={`mb-5 inline-flex items-center gap-3 rounded-full px-4 py-2 ${glass}`}>
                <Image
                  src={app.iconUrl}
                  alt=""
                  width={28}
                  height={28}
                  className="rounded-[8px]"
                  unoptimized
                />
                <span className="text-sm font-bold uppercase tracking-[0.12em] text-[#245078]">
                  DMV practice test
                </span>
              </div>
            </MotionReveal>

            <MotionReveal delay={90}>
              <h1 className="mx-auto max-w-4xl text-[56px] font-black leading-[0.92] tracking-[-1px] text-[#071322] md:text-8xl lg:text-[120px]">
                Premium.
                <span className="block text-[#0a84ff]">Prepared.</span>
              </h1>
            </MotionReveal>

            <MotionReveal delay={170}>
              <p className="mx-auto mt-5 max-w-xl text-base font-semibold leading-7 text-[#4c657d] md:text-xl">
                {app.short_description || app.description}
              </p>
            </MotionReveal>

            <MotionReveal delay={260} className="mt-8 flex w-full flex-col items-center gap-4">
              <StoreBadgeGroup app={app} appStoreUrl={heroUrl} position="hero" />
              <p className="rounded-full bg-white/70 px-4 py-2 text-sm font-bold text-[#315a80] shadow-sm backdrop-blur">
                Free to start. No account required. Built for quick DMV review.
              </p>
              <a
                href="#attestations"
                className="inline-flex h-10 items-center justify-center rounded-full bg-white/78 px-6 text-sm font-black text-[#071322] shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"
              >
                Discover
              </a>
            </MotionReveal>
          </div>
        </section>

        <DmvScrollMarquee images={marqueeImages} />

        <section className="px-5 py-24 md:px-10">
          <div className="mx-auto max-w-6xl text-center">
            <MotionReveal>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#0a84ff]">
                Formal study. Fun momentum.
              </p>
              <h2 className="mx-auto mt-4 max-w-4xl text-4xl font-black leading-tight tracking-[-1px] md:text-6xl">
                Practice that feels credible, clear, and surprisingly light.
              </h2>
              <DmvAnimatedText
                text="The page now uses a bright trust palette, visible proof elements, and real app screens without leaning into a government look or cartoon style."
                className="mx-auto mt-5 max-w-2xl text-base font-medium leading-8 text-[#5b7288]"
              />
            </MotionReveal>

            <div className="mt-14 grid gap-5 md:grid-cols-3">
              {[
                ["State-style focus", "Practice signs, rules, and written-exam recall without heavy manuals."],
                ["Mock-test rhythm", "Short sessions make progress feel measurable instead of vague."],
                ["Proof-forward prep", "Attestations, rating cues, and readiness cards reinforce confidence."],
              ].map(([title, description], index) => (
                <MotionReveal key={title} delay={index * 90}>
                  <article className="h-full rounded-[16px] border border-[#dbe8f5] bg-white p-7 text-left shadow-[0_24px_80px_-64px_rgba(15,60,130,0.38)]">
                    <BadgeCheck className="mb-6 h-7 w-7 text-[#08a852]" aria-hidden="true" />
                    <h3 className="text-xl font-black">{title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[#5b7288]">{description}</p>
                  </article>
                </MotionReveal>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-20 md:px-10">
          <div className="mx-auto grid max-w-6xl items-center gap-12 rounded-[24px] bg-white p-6 shadow-[0_30px_110px_-78px_rgba(15,60,130,0.55)] md:grid-cols-[1.1fr_0.9fr] md:p-10">
            <div className="grid grid-cols-3 gap-3">
              {attestationCards.map((card, index) => (
                <MotionReveal key={card.image} delay={index * 90}>
                  <Image
                    src={card.image}
                    alt={`${card.person} holding a fictional DMV practice pass card`}
                    width={1024}
                    height={1536}
                    className={`aspect-[4/5] rounded-[18px] object-cover shadow-[0_18px_54px_-40px_rgba(15,60,130,0.48)] ${index === 1 ? "mt-8" : ""}`}
                    unoptimized
                  />
                </MotionReveal>
              ))}
            </div>
            <MotionReveal delay={120}>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#08a852]">
                Nationwide confidence
              </p>
              <h2 className="mt-4 text-4xl font-black leading-tight tracking-[-1px] md:text-5xl">
                Proof points that make prep feel real.
              </h2>
              <p className="mt-5 text-base leading-8 text-[#5b7288]">
                A formal landing page still needs human reassurance. Rating cues, pass-score cards,
                testimonial panels, and real app UI give visitors reasons to believe before they tap.
              </p>
              <div className="mt-7 grid gap-3">
                {["Score-style readiness cards", "Five-star attestation cues", "Real app screenshot evidence"].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm font-bold text-[#245078]">
                    <Check className="h-5 w-5 rounded-full bg-[#e8f8ef] p-1 text-[#08a852]" />
                    {item}
                  </div>
                ))}
              </div>
            </MotionReveal>
          </div>
        </section>

        <section id="attestations" className="px-5 py-24 md:px-10">
          <div className="mx-auto max-w-6xl">
            <MotionReveal className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#0a84ff]">
                  Attestations
                </p>
                <h2 className="mt-4 text-4xl font-black leading-tight tracking-[-1px] md:text-6xl">
                  Confidence from the study loop.
                </h2>
              </div>
              <div className="rounded-[14px] border border-[#dbe8f5] bg-white p-4 shadow-sm">
                <div className="flex gap-1 text-[#f8b51b]">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <p className="mt-2 text-xs font-bold text-[#5b7288]">Formal proof, friendly tone</p>
              </div>
            </MotionReveal>

            <DmvStickyAttestations cards={attestationCards} />
          </div>
        </section>

        <section className="px-5 py-24 md:px-10">
          <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[0.78fr_1.22fr]">
            <MotionReveal>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#0a84ff]">
                How it works
              </p>
              <h2 className="mt-4 text-4xl font-black leading-tight tracking-[-1px] md:text-5xl">
                Three clean steps from download to review.
              </h2>
            </MotionReveal>
            <div className="grid gap-4">
              {howToSteps.map((step, index) => (
                <MotionReveal key={step.name} delay={index * 80}>
                  <article className="rounded-[18px] border border-[#dbe8f5] bg-white p-6 shadow-[0_20px_70px_-66px_rgba(15,60,130,0.35)]">
                    <span className="text-sm font-black text-[#0a84ff]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-3 text-xl font-black">{step.name}</h3>
                    <p className="mt-3 text-sm leading-7 text-[#5b7288]">{step.text}</p>
                  </article>
                </MotionReveal>
              ))}
            </div>
          </div>
        </section>

        {screenshots.length > 0 && (
          <section className="px-5 py-24 md:px-10">
            <div className="mx-auto max-w-6xl text-center">
              <MotionReveal>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#0a84ff]">
                  Real app UI
                </p>
                <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-black leading-tight tracking-[-1px] md:text-6xl">
                  The product stays visible, not hidden behind claims.
                </h2>
              </MotionReveal>
              <div className="mt-12 grid gap-5 md:grid-cols-3">
                {screenshots.slice(0, 3).map((src, index) => (
                  <MotionReveal key={src} delay={index * 90}>
                    <div className="rounded-[28px] border border-[#dbe8f5] bg-white p-3 shadow-[0_30px_90px_-68px_rgba(15,60,130,0.55)]">
                      <Image
                        src={src}
                        alt={`${app.name} screenshot ${index + 1}`}
                        width={300}
                        height={620}
                        className="aspect-[9/19] w-full rounded-[22px] object-cover object-top"
                        loading="eager"
                        unoptimized
                      />
                    </div>
                  </MotionReveal>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="px-5 py-24 md:px-10">
          <div className="mx-auto max-w-6xl overflow-hidden rounded-[28px] bg-[#071322] text-white shadow-[0_36px_110px_-64px_rgba(15,60,130,0.55)]">
            <div className="grid items-center gap-10 p-8 md:grid-cols-[0.9fr_1.1fr] md:p-12">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#74d89d]">
                  Start your practice loop
                </p>
                <h2 className="mt-4 text-4xl font-black leading-tight tracking-[-1px] md:text-6xl">
                  Study with structure and a little momentum.
                </h2>
                <p className="mt-5 text-base leading-8 text-white/68">
                  Keep the page formal enough to earn trust and fun enough to feel approachable.
                </p>
                <StoreBadgeGroup
                  app={app}
                  appStoreUrl={footerUrl}
                  position="footer"
                  className="mt-8 justify-start"
                  tone="dark"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {attestationCards.map((card, index) => (
                  <MotionReveal key={card.image} delay={120 + index * 80}>
                    <Image
                      src={card.image}
                      alt=""
                      width={1024}
                      height={1536}
                      className={`aspect-[3/4] rounded-[18px] object-cover ${index === 1 ? "mt-10" : ""}`}
                      unoptimized
                    />
                  </MotionReveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-20 md:px-10">
          <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[0.8fr_1.2fr]">
            <MotionReveal>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#0a84ff]">
                About {category.name}
              </p>
              <h2 className="mt-4 text-4xl font-black leading-tight tracking-[-1px]">
                {app.name}
              </h2>
              <a
                href={devUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#0a84ff]"
              >
                iStack
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </MotionReveal>
            <div className="space-y-5">
              {descSections.slice(0, 4).map((section, index) => (
                <MotionReveal key={index} delay={index * 70}>
                  <article className="rounded-[18px] border border-[#dbe8f5] bg-white p-5">
                    {section.heading && <h3 className="mb-2 font-black">{section.heading}</h3>}
                    <p className="text-sm leading-7 text-[#5b7288]">{section.body}</p>
                  </article>
                </MotionReveal>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="px-5 py-20 md:px-10">
          <div className="mx-auto max-w-6xl">
            <MotionReveal>
              <h2 className="text-4xl font-black tracking-[-1px]">Frequently asked questions</h2>
            </MotionReveal>
            <dl className="mt-8 grid gap-4 md:grid-cols-2">
              {faqs.map((faq, index) => (
                <MotionReveal key={faq.question} delay={(index % 2) * 80}>
                  <details className="rounded-[18px] border border-[#dbe8f5] bg-white p-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-black">
                      {faq.question}
                      <Check className="h-4 w-4 text-[#0a84ff]" aria-hidden="true" />
                    </summary>
                    <dd className="mt-4 text-sm leading-7 text-[#5b7288]">{faq.answer}</dd>
                  </details>
                </MotionReveal>
              ))}
            </dl>
          </div>
        </section>

        {relatedApps.length > 0 && (
          <section className="border-t border-[#dbe8f5] px-5 py-20 md:px-10">
            <div className="mx-auto max-w-6xl">
              <div className="flex items-end justify-between gap-6">
                <h2 className="text-4xl font-black tracking-[-1px]">More {category.name}</h2>
                <Link href={`/category/${category.slug}/`} className="text-sm font-black text-[#0a84ff]">
                  See all
                </Link>
              </div>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {relatedApps.map((related) => (
                  <Link key={related.id} href={`/apps/${related.id}/`} className="rounded-[18px] border border-[#dbe8f5] bg-white p-4 transition hover:-translate-y-0.5">
                    <Image
                      src={related.iconUrl}
                      alt={`${related.name} icon`}
                      width={56}
                      height={56}
                      className="h-14 w-14 rounded-2xl object-cover"
                      unoptimized
                    />
                    <p className="mt-5 line-clamp-2 text-sm font-black">{related.name}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <LightFooter />
    </>
  );
}

function LightNav({ appIconUrl }: { appIconUrl: string }) {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-5 py-4 md:px-10">
      <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/70 bg-white/76 px-4 py-2 shadow-[0_18px_60px_-48px_rgba(15,60,130,0.45)] backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src={appIconUrl}
            alt=""
            width={34}
            height={34}
            className="h-8 w-8 rounded-[10px] object-cover shadow-sm"
            unoptimized
          />
          <span className="text-base font-black text-[#071322]">DMV Practice</span>
        </Link>
        <div className="hidden items-center gap-3 md:flex">
          {navLinks.map((link, index) => (
            <div key={link} className="flex items-center gap-3">
              {index > 0 && <span className="text-[#a7b8c8]">|</span>}
              <a
                href={link === "Attestations" ? "#attestations" : link === "FAQ" ? "#faq" : "#"}
                className="text-sm font-bold text-[#637a91] hover:text-[#071322]"
              >
                {link}
              </a>
            </div>
          ))}
        </div>
        <a
          href="#attestations"
          className="hidden rounded-full bg-[#071322] px-5 py-2 text-sm font-black text-white transition hover:-translate-y-0.5 sm:inline-flex"
        >
          Reviews
        </a>
      </nav>
    </header>
  );
}

function StoreBadgeGroup({
  app,
  appStoreUrl,
  position,
  className = "",
  tone = "light",
}: {
  app: App;
  appStoreUrl: string;
  position: "hero" | "footer";
  className?: string;
  tone?: "light" | "dark";
}) {
  const hasPlayStoreApp = app.platform !== "ios" && !app.packageId.startsWith("ios.");
  const playStoreUrl = hasPlayStoreApp
    ? getPlayStoreUrl(app, "app-page", position)
    : DEVELOPER_URL;
  const playStoreMicrocopy = hasPlayStoreApp ? "Get it on" : "More iStack apps";
  const isDark = tone === "dark";

  return (
    <div className={`flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row ${className}`}>
      <StoreBadge
        href={appStoreUrl}
        label="App Store"
        microcopy="Free download"
        icon={<Apple className="h-8 w-8" aria-hidden="true" />}
        className={
          isDark
            ? "border-white/18 bg-white text-[#071322] shadow-[0_24px_60px_-34px_rgba(255,255,255,0.48)] hover:bg-[#f4f8ff]"
            : "border-[#071322] bg-[#071322] text-white shadow-[0_28px_70px_-36px_rgba(7,19,34,0.88)] hover:bg-[#0f2439]"
        }
      />
      <StoreBadge
        href={playStoreUrl}
        label="Google Play"
        microcopy={hasPlayStoreApp ? "Free download" : playStoreMicrocopy}
        icon={<PlayStoreIcon />}
        className={
          isDark
            ? "border-white/18 bg-white/10 text-white shadow-[0_24px_60px_-40px_rgba(255,255,255,0.36)] hover:bg-white/16"
            : "border-white bg-white/86 text-[#071322] shadow-[0_28px_70px_-52px_rgba(15,60,130,0.52)] hover:bg-white"
        }
      />
    </div>
  );
}

function StoreBadge({
  href,
  icon,
  microcopy,
  label,
  className,
}: {
  href: string;
  icon: ReactNode;
  microcopy: string;
  label: string;
  className: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative isolate inline-flex min-h-[62px] w-full min-w-[214px] items-center gap-3 overflow-hidden rounded-[18px] border px-5 text-left transition duration-300 hover:-translate-y-1 sm:w-auto ${className}`}
      aria-label={`${microcopy} ${label}`}
    >
      <span className="absolute inset-y-0 left-[-42%] z-[-1] w-1/3 skew-x-[-18deg] bg-white/24 opacity-0 blur-sm transition-all duration-700 group-hover:left-[118%] group-hover:opacity-100" />
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-current/10">
        {icon}
      </span>
      <span className="leading-none">
        <span className="block text-[11px] font-black uppercase tracking-[0.12em] opacity-65">
          {microcopy}
        </span>
        <span className="mt-1 block text-xl font-black tracking-[-0.02em]">
          {label}
        </span>
      </span>
    </a>
  );
}

function PlayStoreIcon() {
  return (
    <svg
      viewBox="0 0 36 36"
      className="h-8 w-8"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7.7 5.5c-.5.4-.8 1.1-.8 2.1v20.8c0 1 .3 1.7.8 2.1l11-12.5L7.7 5.5Z"
        fill="#22C55E"
      />
      <path
        d="m22.2 14 4.1 2.3c1.7 1 1.7 2.4 0 3.4L22.2 22 18 18l4.2-4Z"
        fill="#F59E0B"
      />
      <path
        d="M7.7 5.5 22.2 14 18 18 7.7 5.5Z"
        fill="#38BDF8"
      />
      <path
        d="M7.7 30.5 18 18l4.2 4-14.5 8.5Z"
        fill="#EF4444"
      />
    </svg>
  );
}

function LightFooter() {
  return (
    <footer className="border-t border-[#dbe8f5] bg-white px-5 py-12 text-[#071322] md:px-10">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 md:flex-row md:items-center">
        <p className="text-sm text-[#637a91]">Copyright 2026 iStack. All rights reserved.</p>
        <nav className="flex flex-wrap gap-5 text-sm font-bold text-[#637a91]">
          <Link href="/privacy/" className="hover:text-[#071322]">
            Privacy
          </Link>
          <Link href="/terms/" className="hover:text-[#071322]">
            Terms
          </Link>
          <a href="mailto:contact@istack.cc" className="hover:text-[#071322]">
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}
