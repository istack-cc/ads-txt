import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAppBySlug } from "@/data/apps";
import { COMPARISON_ARTICLES, getComparisonBySlug } from "@/data/compare";
import { CATEGORY_DATA } from "@/data/categories";
import { getStoreUrl } from "@/lib/storeUrl";
import {
  generateGraph,
  generateOrganizationSchema,
  generateBreadcrumbListSchema,
  generateSoftwareApplicationSchema,
} from "@/lib/schema";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://istack.cc";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return COMPARISON_ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getComparisonBySlug(slug);
  if (!article) return { title: "Not Found | iStack" };

  return {
    title: `${article.title} | iStack`,
    description: article.description,
    alternates: { canonical: `/compare/${article.slug}/` },
    openGraph: {
      title: `${article.title} | iStack`,
      description: article.description,
      type: "article",
      url: `/compare/${article.slug}/`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${article.title} | iStack`,
      description: article.description,
    },
  };
}

const SCORE_LABEL: Record<string, string> = {
  yes: "✓",
  no: "✗",
  partial: "~",
};

const SCORE_COLOR: Record<string, string> = {
  yes: "#22c55e",
  no: "#ef4444",
  partial: "#f59e0b",
};

export default async function ComparePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getComparisonBySlug(slug);
  if (!article) notFound();

  const app = getAppBySlug(article.app_id);
  const category = app ? CATEGORY_DATA[app.seoCategory] : null;
  const storeUrl = app ? getStoreUrl(app, "compare", "footer") : null;

  const jsonLd = generateGraph([
    generateOrganizationSchema(),
    generateBreadcrumbListSchema([
      { name: "Home", item: SITE_URL },
      { name: "App comparisons", item: `${SITE_URL}/compare/` },
      { name: article.title, item: `${SITE_URL}/compare/${article.slug}/` },
    ]),
    ...(app ? [generateSoftwareApplicationSchema(app)] : []),
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
        </p>

        <p
          className="mb-10 text-base leading-relaxed"
          style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-outfit)" }}
        >
          {article.description}
        </p>

        {/* Comparison table */}
        {article.features.length > 0 && (
          <section aria-labelledby="compare-heading" className="mb-12">
            <h2
              id="compare-heading"
              className="mb-6 text-2xl font-semibold"
              style={{ fontFamily: "var(--font-display)", color: "var(--foreground)", fontVariationSettings: '"opsz" 36' }}
            >
              Feature comparison
            </h2>
            <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "var(--border)" }}>
              <table className="w-full text-sm" style={{ fontFamily: "var(--font-outfit)", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid var(--border)`, background: "var(--surface)" }}>
                    <th className="p-4 text-left font-semibold" style={{ color: "var(--foreground)" }}>Feature</th>
                    <th className="p-4 text-center font-semibold" style={{ color: "var(--foreground)" }}>
                      {app?.name ?? "iStack app"}
                    </th>
                    <th className="p-4 text-center font-semibold" style={{ color: "var(--foreground)" }}>
                      <a href={article.vs_url} target="_blank" rel="noopener noreferrer nofollow" style={{ color: "var(--accent)" }}>
                        {article.vs_name}
                      </a>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {article.features.map((row, i) => (
                    <tr
                      key={i}
                      style={{ borderBottom: i < article.features.length - 1 ? `1px solid var(--border)` : "none" }}
                    >
                      <td className="p-4" style={{ color: "var(--foreground)" }}>
                        {row.feature}
                        {row.note && (
                          <p className="mt-0.5 text-xs" style={{ color: "var(--muted-foreground)" }}>{row.note}</p>
                        )}
                      </td>
                      <td className="p-4 text-center font-bold" style={{ color: SCORE_COLOR[row.ours] }}>
                        {SCORE_LABEL[row.ours]}
                      </td>
                      <td className="p-4 text-center font-bold" style={{ color: SCORE_COLOR[row.theirs] }}>
                        {SCORE_LABEL[row.theirs]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Verdict */}
        <section aria-labelledby="verdict-heading" className="mb-12">
          <h2
            id="verdict-heading"
            className="mb-4 text-2xl font-semibold"
            style={{ fontFamily: "var(--font-display)", color: "var(--foreground)", fontVariationSettings: '"opsz" 36' }}
          >
            Verdict
          </h2>
          <p className="text-base leading-relaxed" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-outfit)" }}>
            {article.verdict}
          </p>
        </section>

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
              {app.short_description}
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
