import { DEVELOPER_URL, IOS_DEVELOPER_URL, SUPPORT_EMAIL } from "@/data/apps";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      id="site-footer"
      aria-label="Site footer"
      style={{
        background: "#f9f9f9",
        borderTop: "1px solid #eee",
        padding: "48px 24px",
        textAlign: "center",
      }}
    >
      <div style={{ fontWeight: 800, fontSize: 22, marginBottom: 8, color: "#0f0f0f", letterSpacing: "-0.02em" }}>
        iStack
      </div>
      <p style={{ fontSize: 13, color: "#999", marginBottom: 24 }}>
        Built by one person. All apps free, forever.
      </p>

      <nav
        aria-label="Footer navigation"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px 28px",
          justifyContent: "center",
          marginBottom: 24,
        }}
      >
        <FooterLink href={DEVELOPER_URL} external>Google Play</FooterLink>
        <FooterLink href={IOS_DEVELOPER_URL} external>App Store</FooterLink>
        <FooterLink href="/app-ads.txt" external>app-ads.txt</FooterLink>
        <FooterLink href="/privacy/">Privacy</FooterLink>
        <FooterLink href="/terms/">Terms</FooterLink>
        <FooterLink href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</FooterLink>
      </nav>

      <p style={{ fontSize: 12, color: "#bbb" }}>© {year} iStack</p>
    </footer>
  );
}

function FooterLink({
  href,
  children,
  external,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      style={{
        fontSize: 13,
        fontWeight: 600,
        color: "#555",
        textDecoration: "none",
      }}
    >
      {children}
    </a>
  );
}
