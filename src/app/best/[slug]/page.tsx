import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getAppBySlug } from "@/data/apps";
import { BEST_OF_ARTICLES, getBestOfBySlug } from "@/data/best-of";
import { getStoreUrl } from "@/lib/storeUrl";
import {
  generateGraph,
  generateOrganizationSchema,
  generateBreadcrumbListSchema,
  generateFAQPageSchema,
  generateItemListSchema,
} from "@/lib/schema";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://istack.cc";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return BEST_OF_ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getBestOfBySlug(slug);
  if (!article) return { title: "Not Found | iStack" };

  return {
    title: `${article.title} | iStack`,
    description: article.description,
    alternates: { canonical: `/best/${article.slug}/` },
    openGraph: {
      title: `${article.title} | iStack`,
      description: article.description,
      type: "article",
      url: `/best/${article.slug}/`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${article.title} | iStack`,
      description: article.description,
    },
  };
}

export default async function BestOfPage({ params }: PageProps) {
  const { slug } = await params;
  const article = getBestOfBySlug(slug);
  if (!article) notFound();

  // Resolve apps for iStack entries to compute store URLs and images
  const picks = article.picks.map((p) => {
    const app = p.app_id ? getAppBySlug(p.app_id) : undefined;
    return {
      ...p,
      app,
      cta_url:
        app && p.is_istack
          ? getStoreUrl(app, "best-of", "entry")
          : p.external_url,
    };
  });

  // ItemList schema — AI engines use this for ranked list extraction
  const itemListSchema = {
    "@type": "ItemList",
    name: article.title,
    description: article.description,
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    numberOfItems: picks.length,
    itemListElement: picks.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "SoftwareApplication",
        name: p.name,
        description: p.one_liner,
        ...(p.cta_url ? { url: p.cta_url } : {}),
        applicationCategory: "MobileApplication",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
    })),
  };

  const jsonLd = generateGraph([
    generateOrganizationSchema(),
    generateBreadcrumbListSchema([
      { name: "Home", item: SITE_URL },
      { name: "Best-of guides", item: `${SITE_URL}/best/` },
      { name: article.title, item: `${SITE_URL}/best/${article.slug}/` },
    ]),
    itemListSchema,
    generateFAQPageSchema(article.faq),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav appsHref="/#apps" />

      <main className="mx-auto w-full max-w-3xl px-5 py-24 lg:px-10">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol
            className="flex flex-wrap items-center gap-1.5 text-xs"
            style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-outfit)" }}
          >
            <li>
              <Link href="/" style={{ color: "var(--accent)" }} className="hover:underline underline-offset-2">
                Home
              </Link>
            </li>
            <li aria-hidden="true">›</li>
            <li aria-current="page">{article.title}</li>
          </ol>
        </nav>

        {/* H1 */}
        <h1
          className="mb-3 text-4xl font-semibold leading-tight"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--foreground)",
            fontVariationSettings: '"opsz" 48',
            textWrap: "balance",
          }}
        >
          {article.title}
        </h1>

        <p
          className="mb-6 text-base italic"
          style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-outfit)" }}
        >
          {article.intent}
        </p>

        <p
          className="mb-8 text-sm"
          style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-outfit)" }}
        >
          Updated {article.last_updated}
        </p>

        {/* TL;DR answer capsule — front-loaded for AI extraction */}
        <aside
          aria-label="Summary"
          className="mb-12 rounded-2xl border p-5"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          <p
            className="mb-2 text-[11px] font-bold uppercase tracking-wider"
            style={{ color: "var(--accent)", fontFamily: "var(--font-outfit)" }}
          >
            The short answer
          </p>
          <p
            className="text-base leading-relaxed"
            style={{ color: "var(--foreground)", fontFamily: "var(--font-outfit)" }}
          >
            {article.tldr}
          </p>
        </aside>

        {/* Description */}
        <p
          className="mb-12 text-base leading-relaxed"
          style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-outfit)" }}
        >
          {article.description}
        </p>

        {/* Ranked list */}
        <section aria-labelledby="picks-heading" className="mb-12">
          <h2
            id="picks-heading"
            className="mb-6 text-2xl font-semibold"
            style={{ fontFamily: "var(--font-display)", color: "var(--foreground)", fontVariationSettings: '"opsz" 36' }}
          >
            The picks, ranked
          </h2>
          <ol className="space-y-8">
            {picks.map((p, i) => (
              <li
                key={p.name}
                className="rounded-2xl border p-5"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="mb-3 flex items-start gap-4">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                    style={{
                      background: "var(--accent)",
                      color: "var(--primary-foreground)",
                      fontFamily: "var(--font-outfit)",
                    }}
                    aria-label={`Rank ${i + 1}`}
                  >
                    {i + 1}
                  </div>
                  {p.app?.iconUrl && (
                    <Image
                      src={p.app.iconUrl}
                      alt={`${p.name} icon`}
                      width={48}
                      height={48}
                      className="shrink-0 rounded-[12px] border"
                      style={{ borderColor: "var(--border)" }}
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <h3
                      className="text-xl font-semibold leading-tight"
                      style={{ fontFamily: "var(--font-display)", color: "var(--foreground)", fontVariationSettings: '"opsz" 36' }}
                    >
                      {p.is_istack && p.app ? (
                        <Link href={`/apps/${p.app.id}/`} style={{ color: "var(--foreground)" }} className="hover:underline underline-offset-4">
                          {p.name}
                        </Link>
                      ) : (
                        p.name
                      )}
                    </h3>
                    <p
                      className="mt-1 text-sm"
                      style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-outfit)" }}
                    >
                      {p.one_liner}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p
                      className="mb-2 text-[11px] font-bold uppercase tracking-wider"
                      style={{ color: "#22c55e", fontFamily: "var(--font-outfit)" }}
                    >
                      Pros
                    </p>
                    <ul className="space-y-1.5 text-sm" style={{ color: "var(--foreground)", fontFamily: "var(--font-outfit)" }}>
                      {p.pros.map((pro) => (
                        <li key={pro} className="flex gap-2">
                          <span aria-hidden="true" style={{ color: "#22c55e" }}>+</span>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p
                      className="mb-2 text-[11px] font-bold uppercase tracking-wider"
                      style={{ color: "#f59e0b", fontFamily: "var(--font-outfit)" }}
                    >
                      Cons
                    </p>
                    <ul className="space-y-1.5 text-sm" style={{ color: "var(--foreground)", fontFamily: "var(--font-outfit)" }}>
                      {p.cons.map((con) => (
                        <li key={con} className="flex gap-2">
                          <span aria-hidden="true" style={{ color: "#f59e0b" }}>−</span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {p.cta_url && (
                  <div className="mt-5">
                    {p.is_istack && p.app ? (
                      <Link
                        href={`/apps/${p.app.id}/`}
                        className="inline-flex h-10 items-center gap-2 rounded-xl px-5 text-sm font-semibold transition-[filter] hover:brightness-110"
                        style={{ background: "var(--accent)", color: "var(--primary-foreground)", fontFamily: "var(--font-outfit)" }}
                      >
                        About {p.name} →
                      </Link>
                    ) : (
                      <a
                        href={p.cta_url}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="inline-flex h-10 items-center gap-2 rounded-xl border px-5 text-sm font-semibold transition-colors hover:bg-[--surface]"
                        style={{ borderColor: "var(--border)", color: "var(--foreground)", fontFamily: "var(--font-outfit)" }}
                      >
                        Visit {p.name} ↗
                      </a>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ol>
        </section>

        {/* Methodology — E-E-A-T transparency */}
        <section aria-labelledby="method-heading" className="mb-12">
          <h2
            id="method-heading"
            className="mb-4 text-2xl font-semibold"
            style={{ fontFamily: "var(--font-display)", color: "var(--foreground)", fontVariationSettings: '"opsz" 36' }}
          >
            How we picked
          </h2>
          <p
            className="text-base leading-relaxed"
            style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-outfit)" }}
          >
            {article.methodology}
          </p>
        </section>

        {/* FAQ */}
        <section aria-labelledby="faq-heading" className="mb-12">
          <h2
            id="faq-heading"
            className="mb-6 text-2xl font-semibold"
            style={{ fontFamily: "var(--font-display)", color: "var(--foreground)", fontVariationSettings: '"opsz" 36' }}
          >
            Frequently asked questions
          </h2>
          <dl className="space-y-3">
            {article.faq.map((faq) => (
              <details key={faq.question} className="rounded-xl border" style={{ borderColor: "var(--border)" }}>
                <summary
                  className="flex cursor-pointer select-none items-center justify-between gap-4 px-5 py-4 text-sm font-medium"
                  style={{ color: "var(--foreground)", fontFamily: "var(--font-outfit)", listStyle: "none" }}
                >
                  <dt>{faq.question}</dt>
                  <span className="shrink-0 text-xs" style={{ color: "var(--accent)" }} aria-hidden="true">▾</span>
                </summary>
                <dd className="px-5 pb-4 text-sm leading-relaxed" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-outfit)" }}>
                  {faq.answer}
                </dd>
              </details>
            ))}
          </dl>
        </section>
      </main>

      <Footer />
    </>
  );
}
