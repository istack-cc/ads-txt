import { DEVELOPER_URL } from "@/data/apps";

export function CtaStrip() {
  return (
    <section
      aria-label="Download call to action"
      className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-10"
    >
      <div
        className="flex flex-col items-start justify-between gap-6 rounded-3xl border px-6 py-8 md:flex-row md:items-center md:px-8"
        style={{
          borderColor: "var(--border-hover)",
          background:
            "linear-gradient(120deg, oklch(0.78 0.12 80 / 14%), oklch(0.78 0.12 80 / 6%))",
        }}
      >
        <div>
          <p
            className="mb-2 text-xs font-semibold uppercase tracking-[0.18em]"
            style={{ color: "var(--accent)", fontFamily: "var(--font-outfit)" }}
          >
            Need Something Useful?
          </p>
          <h3
            className="text-2xl font-semibold leading-tight"
            style={{
              fontFamily: "var(--font-fraunces)",
              color: "var(--foreground)",
            }}
          >
            Start with the job you need done today
          </h3>
          <p
            className="mt-2 text-sm"
            style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-outfit)" }}
          >
            Browse focused apps for workouts, files, utilities, creativity, and
            phone customization. Most are free to download and simple to try.
          </p>
        </div>

        <a
          href={DEVELOPER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold transition-all duration-200 hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{
            background: "var(--accent)",
            color: "var(--primary-foreground)",
            fontFamily: "var(--font-outfit)",
            touchAction: "manipulation",
          }}
          aria-label="Browse all iStack apps on Google Play"
        >
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-4 w-4"
          >
            <path d="M3.18 23.76c.3.17.66.19.98.05l13.79-7.95-2.87-2.88-11.9 10.78zm-1.4-20.98C1.46 3.14 1.25 3.6 1.25 4.14v15.72c0 .54.21 1 .53 1.36l.07.07 8.81-8.81v-.21L1.85 3.41l-.07.37zm17.22 8.7-3.02-1.74-3.14 3.14 3.14 3.14 3.04-1.76c.87-.5.87-1.32-.02-1.78zM4.16.24l13.79 7.96-2.87 2.87L3.18.28C2.86.14 2.5.17 2.2.34c.9-.52 2-.48 1.96-.1z" />
          </svg>
          Browse on Google Play
        </a>
      </div>
    </section>
  );
}
