import Link from "next/link";
import { DEVELOPER_URL } from "@/data/apps";

interface NavProps {
  appsHref?: string;
}

export function Nav({ appsHref = "/#apps" }: NavProps) {
  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "saturate(1.8) blur(16px)",
        WebkitBackdropFilter: "saturate(1.8) blur(16px)",
        borderBottom: "1px solid #eee",
      }}
    >
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-[60px] w-full max-w-[1200px] items-center justify-between px-6 sm:px-12"
      >
        <Link
          href="/"
          aria-label="iStack home"
          className="focus-visible:outline-2 focus-visible:outline-offset-4"
          style={{
            fontWeight: 800,
            fontSize: 20,
            letterSpacing: "-0.02em",
            color: "#0f0f0f",
          }}
        >
          iStack
        </Link>

        <div className="flex items-center gap-6 sm:gap-8">
          <Link
            href={appsHref}
            className="hidden sm:inline-block"
            style={{ fontSize: 14, fontWeight: 600, color: "#444", textDecoration: "none" }}
          >
            All Apps
          </Link>
          <a
            href={DEVELOPER_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#fff",
              background: "#1a1a1a",
              padding: "8px 18px",
              borderRadius: 10,
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            Google Play ↗
          </a>
        </div>
      </nav>
    </header>
  );
}
