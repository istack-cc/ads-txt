import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { SUPPORT_EMAIL } from "@/data/apps";

export const metadata: Metadata = {
  title: "Terms of Service | iStack",
  description: "Terms of Service for iStack apps.",
  alternates: { canonical: "/terms/" },
};

export default function TermsPage() {
  return (
    <>
      <Nav appsHref="/#apps" />
      <main className="mx-auto max-w-3xl px-6 py-24 lg:px-10">
        <h1
          className="mb-2 text-4xl font-semibold"
          style={{
            fontFamily: "var(--font-display)",
            fontVariationSettings: '"opsz" 48',
          }}
        >
          Terms of Service
        </h1>
        <p
          className="mb-10 text-sm"
          style={{
            color: "var(--muted-foreground)",
            fontFamily: "var(--font-outfit)",
          }}
        >
          Last updated: April 8, 2026
        </p>

        <div
          className="prose-policy space-y-6 text-sm leading-relaxed"
          style={{
            color: "var(--muted-foreground)",
            fontFamily: "var(--font-outfit)",
          }}
        >
          <p>
            Please read these Terms of Service (&quot;Terms&quot;) carefully
            before using any application published by iStack (&quot;we,&quot;
            &quot;us,&quot; or &quot;our&quot;). By downloading, installing, or
            using our apps, you agree to be bound by these Terms.
          </p>

          <Section title="1. Description of Service">
            <p>
              iStack publishes free, ad-supported mobile applications for
              Android and iOS. Our apps are independent, third-party products
              and are not affiliated with, endorsed by, or sponsored by Google
              LLC, Apple Inc., or any other platform provider unless explicitly
              stated. All trademarks are the property of their respective
              owners.
            </p>
          </Section>

          <Section title="2. Account and Authentication">
            <p>
              Some apps require you to sign in with a Google account. By signing
              in, you authorize the app to access your data as permitted by the
              OAuth scopes you approve. You are responsible for maintaining the
              security of your account. You may revoke access at any time
              through{" "}
              <ExtLink href="https://myaccount.google.com/permissions">
                Google Account permissions
              </ExtLink>
              .
            </p>
          </Section>

          <Section title="3. Acceptable Use">
            <p>You agree not to:</p>
            <ul className="ml-4 list-disc space-y-1">
              <li>Use any app for unlawful or prohibited purposes</li>
              <li>
                Attempt to reverse-engineer, decompile, or disassemble the app
              </li>
              <li>
                Distribute spam, malware, or harmful content through our apps
              </li>
              <li>
                Interfere with or disrupt app functionality, servers, or
                networks
              </li>
              <li>Circumvent or disable any security or ad-serving features</li>
            </ul>
          </Section>

          <Section title="4. Google API Services">
            <p>
              Our use of Google APIs complies with the{" "}
              <ExtLink href="https://developers.google.com/terms/api-services-user-data-policy">
                Google API Services User Data Policy
              </ExtLink>
              , including the Limited Use requirements. We do not transfer your
              Google data to third parties except as necessary to provide app
              features, as required by law, or with your explicit consent. Your
              use of Google services through our apps is also subject to{" "}
              <ExtLink href="https://policies.google.com/terms">
                Google&apos;s Terms of Service
              </ExtLink>
              .
            </p>
          </Section>

          <Section title="5. AI-Generated Content">
            <p>
              Some apps offer AI-assisted features powered by third-party
              models. AI-generated content is provided &quot;as is&quot; and may
              contain errors or inaccuracies. You are solely responsible for
              reviewing and editing any AI-generated content before use.
            </p>
          </Section>

          <Section title="6. Advertisements">
            <p>
              Our apps are free and ad-supported. Ads are served by Google
              AdMob and may be personalized based on your consent preferences.
              Ad availability and content are controlled by third-party ad
              networks.
            </p>
          </Section>

          <Section title="7. Intellectual Property">
            <p>
              Our apps and their original content, features, and functionality
              are owned by iStack and protected by applicable intellectual
              property laws. You retain ownership of all content you create
              through our apps.
            </p>
          </Section>

          <Section title="8. Disclaimer of Warranties">
            <p className="uppercase">
              Our apps are provided &quot;as is&quot; and &quot;as
              available&quot; without warranties of any kind, either express or
              implied, including but not limited to implied warranties of
              merchantability, fitness for a particular purpose, and
              non-infringement.
            </p>
            <p>We do not warrant that:</p>
            <ul className="ml-4 list-disc space-y-1">
              <li>
                Apps will be available at all times or function without
                interruption
              </li>
              <li>Apps will be free of errors or bugs</li>
              <li>Data loss will not occur</li>
              <li>
                Apps will be compatible with all devices or OS versions
              </li>
            </ul>
          </Section>

          <Section title="9. Limitation of Liability">
            <p className="uppercase">
              To the maximum extent permitted by law, iStack shall not be liable
              for any indirect, incidental, special, consequential, or punitive
              damages, including but not limited to loss of data, loss of
              profits, or business interruption, arising out of or related to
              your use of our apps.
            </p>
          </Section>

          <Section title="10. Data and Content">
            <p>
              Our apps may rely on third-party APIs. We are not responsible for
              data loss, corruption, or unauthorized access within those
              services. You are responsible for backing up your own data. Local
              cached data may be lost if you uninstall an app, clear app data,
              or experience device failure.
            </p>
          </Section>

          <Section title="11. Termination">
            <p>
              You may stop using any app at any time by uninstalling it and
              revoking its account access. We reserve the right to suspend or
              terminate your access for conduct that violates these Terms.
            </p>
          </Section>

          <Section title="12. Changes to These Terms">
            <p>
              We may update these Terms from time to time. Changes will be
              posted on this page with an updated date. Continued use of our
              apps after changes constitutes acceptance.
            </p>
          </Section>

          <Section title="13. Governing Law">
            <p>
              These Terms shall be governed by and construed in accordance with
              applicable laws, without regard to conflict of law principles.
            </p>
          </Section>

          <Section title="14. Contact Us">
            <p>
              If you have questions about these Terms, contact us at:{" "}
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                style={{ color: "var(--accent)" }}
              >
                {SUPPORT_EMAIL}
              </a>
            </p>
          </Section>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <h2
        className="text-lg font-semibold"
        style={{ color: "var(--foreground)" }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

function ExtLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline underline-offset-2"
      style={{ color: "var(--accent)" }}
    >
      {children}
    </a>
  );
}
