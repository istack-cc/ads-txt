import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAppBySlug } from "@/data/apps";
import { HOW_TO_ARTICLES, getHowToBySlug } from "@/data/how-to";
import { CATEGORY_DATA } from "@/data/categories";
import { getStoreUrl } from "@/lib/storeUrl";
import {
  generateGraph,
  generateOrganizationSchema,
  generateBreadcrumbListSchema,
  generateFAQPageSchema,
  generateHowToSchema,
} from "@/lib/schema";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://istack.cc";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return HOW_TO_ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getHowToBySlug(slug);
  if (!article) return { title: "Not Found | iStack" };

  return {
    title: `${article.title} | iStack`,
    description: article.description,
    alternates: { canonical: `/how-to/${article.slug}/` },
    openGraph: {
      title: `${article.title} | iStack`,
      description: article.description,
      type: "article",
      url: `/how-to/${article.slug}/`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${article.title} | iStack`,
      description: article.description,
    },
  };
}

export default async function HowToPage({ params }: PageProps) {
  const { slug } = await params;
  const article = getHowToBySlug(slug);
  if (!article) notFound();

  const app = getAppBySlug(article.app_id);
  const category = app ? CATEGORY_DATA[app.seoCategory] : null;
  const storeUrl = app ? getStoreUrl(app, "how-to", "footer") : null;

  const jsonLd = generateGraph([
    generateOrganizationSchema(),
    generateHowToSchema({
      name: article.title,
      description: article.description,
      steps: article.steps,
    }),
    generateBreadcrumbListSchema([
      { name: "Home", item: SITE_URL },
      { name: "How-to guides", item: `${SITE_URL}/how-to/` },
      { name: article.title, item: `${SITE_URL}/how-to/${article.slug}/` },
    ]),
    ...(article.faq && article.faq.length > 0
      ? [generateFAQPageSchema(article.faq)]
      : []),
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
            {app && category && (
              <>
                <li>
                  <Link href={`/category/${category.slug}/`} style={{ color: "var(--accent)" }} className="hover:underline underline-offset-2">
                    {category.name}
                  </Link>
                </li>
                <li aria-hidden="true">›</li>
                <li>
                  <Link href={`/apps/${app.id}/`} style={{ color: "var(--accent)" }} className="hover:underline underline-offset-2">
                    {app.name}
                  </Link>
                </li>
                <li aria-hidden="true">›</li>
              </>
            )}
            <li aria-current="page">{article.title}</li>
          </ol>
        </nav>

        <h1
          className="mb-4 text-4xl font-semibold leading-tight"
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
          className="mb-10 text-sm"
          style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-outfit)" }}
        >
          Updated {article.last_updated}
          {app && (
            <>
              {" · "}
              <Link href={`/apps/${app.id}/`} style={{ color: "var(--accent)" }}>
                About {app.name}
              </Link>
            </>
          )}
        </p>

        {/* Description */}
        <p
          className="mb-10 text-base leading-relaxed"
          style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-outfit)" }}
        >
          {article.description}
        </p>

        {/* Steps */}
        <section aria-labelledby="steps-heading" className="mb-12">
          <h2
            id="steps-heading"
            className="mb-6 text-2xl font-semibold"
            style={{ fontFamily: "var(--font-display)", color: "var(--foreground)", fontVariationSettings: '"opsz" 36' }}
          >
            Step-by-step guide
          </h2>
          <ol className="space-y-6">
            {article.steps.map((step, i) => (
              <li key={i} className="flex gap-4">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                  style={{ background: "var(--accent)", color: "var(--primary-foreground)", fontFamily: "var(--font-outfit)" }}
                >
                  {i + 1}
                </div>
                <div>
                  <p className="mb-1 text-sm font-semibold" style={{ color: "var(--foreground)", fontFamily: "var(--font-outfit)" }}>
                    {step.name}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-outfit)" }}>
                    {step.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* FAQ */}
        {article.faq && article.faq.length > 0 && (
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
        )}

        {/* App CTA */}
        {app && storeUrl && (
          <div
            className="rounded-2xl border p-6 text-center"
            style={{ borderColor: "var(--border)", background: "var(--surface)" }}
          >
            <p className="mb-2 text-lg font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--foreground)", fontVariationSettings: '"opsz" 36' }}>
              Try {app.name} for free
            </p>
            <p className="mb-4 text-sm" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-outfit)" }}>
              No account required. Download on {app.platform === "ios" ? "the App Store" : "Google Play"}.
            </p>
            <a
              href={storeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-xl px-7 text-sm font-semibold transition-[filter] hover:brightness-110"
              style={{ background: "var(--accent)", color: "var(--primary-foreground)", fontFamily: "var(--font-outfit)" }}
            >
              Download free →
            </a>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
