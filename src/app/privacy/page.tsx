import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { SUPPORT_EMAIL } from "@/data/apps";

export const metadata: Metadata = {
  title: "Privacy Policy | iStack",
  description: "Privacy Policy for iStack apps.",
};

export default function PrivacyPage() {
  return (
    <>
      <Nav appsHref="/#apps" />
      <main className="mx-auto max-w-3xl px-6 py-24 lg:px-10">
        <h1
          className="mb-2 text-4xl font-semibold"
          style={{
            fontFamily: "var(--font-fraunces)",
            fontVariationSettings: '"opsz" 48',
          }}
        >
          Privacy Policy
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
            iStack (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) builds
            and publishes mobile applications. This Privacy Policy explains how
            our apps collect, use, and protect your information.
          </p>
          <p>
            By using any iStack app, you agree to the practices described in
            this policy. Each app may use a different subset of the services
            listed below depending on its features.
          </p>

          <Section title="1. Information We Collect">
            <SubSection title="a) Google Account Information">
              <p>
                Some of our apps allow you to sign in with your Google account.
                When you do, we receive your name, email address, and profile
                photo. This information is used solely to authenticate you and
                display your profile within the app. We do not store your Google
                account credentials on our servers.
              </p>
            </SubSection>
            <SubSection title="b) Google API Data">
              <p>
                Certain apps access Google services (such as Google Forms or
                Google Drive) through Google APIs with your explicit permission.
                This data is used only to provide the app&apos;s core
                functionality. We do not copy, store, or share your Google data
                on any external server. A local cache may be stored on your
                device to improve performance.
              </p>
            </SubSection>
            <SubSection title="c) Device and Usage Information">
              <p>
                We may collect non-personal information such as device type,
                operating system version, and app usage statistics through
                Firebase Analytics. This data is collected in aggregate and
                cannot be used to identify you personally.
              </p>
            </SubSection>
            <SubSection title="d) Push Notification Tokens">
              <p>
                If you enable push notifications, Firebase Cloud Messaging
                generates a device token used solely for delivering
                notifications. It is not linked to your personal identity.
              </p>
            </SubSection>
          </Section>

          <Section title="2. Third-Party Services">
            <p>Our apps may use the following third-party services:</p>
            <ul className="ml-4 list-disc space-y-2">
              <li>
                <strong>Google Sign-In</strong> &mdash; Authentication.{" "}
                <ExtLink href="https://policies.google.com/privacy">
                  Google Privacy Policy
                </ExtLink>
              </li>
              <li>
                <strong>Google APIs (Forms, Drive)</strong> &mdash; Access your
                data with your permission. Governed by Google&apos;s Terms of
                Service.
              </li>
              <li>
                <strong>Firebase</strong> (Analytics, Cloud Messaging, Remote
                Config) &mdash;{" "}
                <ExtLink href="https://firebase.google.com/support/privacy">
                  Firebase Privacy Policy
                </ExtLink>
              </li>
              <li>
                <strong>Google AdMob</strong> &mdash; Serves advertisements.{" "}
                <ExtLink href="https://policies.google.com/technologies/ads">
                  Google Ads Privacy
                </ExtLink>
              </li>
              <li>
                <strong>OpenRouter AI</strong> &mdash; Powers AI features. No
                personal data is sent.{" "}
                <ExtLink href="https://openrouter.ai/privacy">
                  OpenRouter Privacy
                </ExtLink>
              </li>
              <li>
                <strong>Google Fonts</strong> &mdash;{" "}
                <ExtLink href="https://policies.google.com/privacy">
                  Google Privacy Policy
                </ExtLink>
              </li>
            </ul>
          </Section>

          <Section title="3. How We Use Your Information">
            <ul className="ml-4 list-disc space-y-1">
              <li>Authenticate your identity and provide app functionality</li>
              <li>Improve app performance through cached data</li>
              <li>Send push notifications (if enabled)</li>
              <li>Display advertisements</li>
              <li>Improve and maintain our apps</li>
            </ul>
          </Section>

          <Section title="4. Data Storage and Security">
            <ul className="ml-4 list-disc space-y-1">
              <li>
                Authentication tokens are stored securely on your device using
                encrypted storage.
              </li>
              <li>
                Local data is cached on your device for offline access and
                performance.
              </li>
              <li>
                We do not operate backend servers that store your personal data.
              </li>
              <li>
                All communication with APIs and third-party services is
                encrypted using HTTPS/TLS.
              </li>
            </ul>
          </Section>

          <Section title="5. Ad Consent and Personalization">
            <p>
              Our apps use Google&apos;s User Messaging Platform (UMP) to obtain
              your consent for ad personalization where required by law (e.g.,
              GDPR, CCPA). You can manage your ad consent choices through the
              Privacy Choices option in each app&apos;s settings. If you do not
              consent to personalized ads, you will still see non-personalized
              ads.
            </p>
          </Section>

          <Section title="6. Children's Privacy">
            <p>
              Our apps are not directed at children under the age of 13. We do
              not knowingly collect personal information from children under 13.
              If you are a parent or guardian and believe your child has provided
              us with personal information, please contact us.
            </p>
          </Section>

          <Section title="7. Your Rights">
            <p>Depending on your location, you may have the right to:</p>
            <ul className="ml-4 list-disc space-y-1">
              <li>Access the personal data we hold about you</li>
              <li>Request deletion of your data</li>
              <li>Opt out of personalized advertising</li>
              <li>
                Revoke Google account access at any time through{" "}
                <ExtLink href="https://myaccount.google.com/permissions">
                  Google Account settings
                </ExtLink>
              </li>
            </ul>
          </Section>

          <Section title="8. Data Retention">
            <p>
              We retain your data only for as long as necessary to provide app
              functionality. Local cached data is removed when you sign out or
              uninstall the app. You can revoke any app&apos;s access to your
              Google account at any time.
            </p>
          </Section>

          <Section title="9. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. Changes will
              be posted on this page with an updated date. We encourage you to
              review this page periodically.
            </p>
          </Section>

          <Section title="10. Contact Us">
            <p>
              If you have questions about this Privacy Policy, contact us at:{" "}
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

function SubSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <h3 className="font-medium" style={{ color: "var(--foreground)" }}>
        {title}
      </h3>
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
