import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAppBySlug } from "@/data/apps";
import { GLOSSARY_TERMS, getGlossaryByTerm } from "@/data/glossary";
import { CATEGORY_DATA } from "@/data/categories";
import {
  generateGraph,
  generateOrganizationSchema,
  generateBreadcrumbListSchema,
} from "@/lib/schema";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://istack.cc";

interface PageProps {
  params: Promise<{ term: string }>;
}

export function generateStaticParams() {
  return GLOSSARY_TERMS.map((t) => ({ term: t.term }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { term } = await params;
  const entry = getGlossaryByTerm(term);
  if (!entry) return { title: "Not Found | iStack" };

  return {
    title: `What is ${entry.name}? | iStack Glossary`,
    description: entry.definition.slice(0, 160),
    alternates: { canonical: `/glossary/${entry.term}/` },
    openGraph: {
      title: `What is ${entry.name}? | iStack Glossary`,
      description: entry.definition.slice(0, 160),
      type: "article",
      url: `/glossary/${entry.term}/`,
    },
    twitter: {
      card: "summary_large_image",
      title: `What is ${entry.name}? | iStack Glossary`,
      description: entry.definition.slice(0, 160),
    },
  };
}

export default async function GlossaryPage({ params }: PageProps) {
  const { term } = await params;
  const entry = getGlossaryByTerm(term);
  if (!entry) notFound();

  const relatedApps = (entry.related_apps ?? [])
    .map((id) => getAppBySlug(id))
    .filter(Boolean);

  const jsonLd = generateGraph([
    generateOrganizationSchema(),
    {
      "@type": "DefinedTerm",
      "@id": `${SITE_URL}/glossary/${entry.term}/#term`,
      name: entry.name,
      description: entry.definition,
      inDefinedTermSet: {
        "@type": "DefinedTermSet",
        name: "iStack App Glossary",
        url: `${SITE_URL}/glossary/`,
      },
    },
    generateBreadcrumbListSchema([
      { name: "Home", item: SITE_URL },
      { name: "Glossary", item: `${SITE_URL}/glossary/` },
      { name: entry.name, item: `${SITE_URL}/glossary/${entry.term}/` },
    ]),
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
            <li aria-current="page">{entry.name}</li>
          </ol>
        </nav>

        <p
          className="mb-3 text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--accent)", fontFamily: "var(--font-outfit)" }}
        >
          {entry.category} · Glossary
        </p>

        <h1
          className="mb-6 text-4xl font-semibold leading-tight"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--foreground)",
            fontVariationSettings: '"opsz" 48',
          }}
        >
          What is {entry.name}?
        </h1>

        <p
          className="mb-10 text-base leading-relaxed"
          style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-outfit)" }}
        >
          {entry.definition}
        </p>

        {/* Related apps */}
        {relatedApps.length > 0 && (
          <section aria-labelledby="related-apps-heading" className="mb-12">
            <h2
              id="related-apps-heading"
              className="mb-6 text-xl font-semibold"
              style={{ fontFamily: "var(--font-display)", color: "var(--foreground)", fontVariationSettings: '"opsz" 36' }}
            >
              Related apps
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {relatedApps.map((app) => {
                if (!app) return null;
                const cat = CATEGORY_DATA[app.seoCategory];
                return (
                  <Link
                    key={app.id}
                    href={`/apps/${app.id}/`}
                    className="flex items-center gap-3 rounded-xl border p-4 transition-colors hover:bg-[--surface]"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <div className="shrink-0 overflow-hidden rounded-[14px] border" style={{ borderColor: "var(--border)" }}>
                      <Image
                        src={app.iconUrl}
                        alt={`${app.name} icon`}
                        width={52}
                        height={52}
                        className="h-[52px] w-[52px] object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold" style={{ color: "var(--foreground)", fontFamily: "var(--font-outfit)" }}>
                        {app.name}
                      </p>
                      <p className="text-xs" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-outfit)" }}>
                        {cat.name} · Free
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Related terms */}
        {entry.related_terms && entry.related_terms.length > 0 && (
          <section aria-labelledby="related-terms-heading">
            <h2
              id="related-terms-heading"
              className="mb-4 text-xl font-semibold"
              style={{ fontFamily: "var(--font-display)", color: "var(--foreground)", fontVariationSettings: '"opsz" 36' }}
            >
              Related terms
            </h2>
            <div className="flex flex-wrap gap-2">
              {entry.related_terms.map((t) => (
                <Link
                  key={t}
                  href={`/glossary/${t}/`}
                  className="rounded-full border px-4 py-2 text-xs font-medium transition-colors hover:bg-[--surface]"
                  style={{ borderColor: "var(--border)", color: "var(--foreground)", fontFamily: "var(--font-outfit)" }}
                >
                  {t.replace(/-/g, " ")}
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
