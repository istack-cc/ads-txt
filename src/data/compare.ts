export interface CompareFeature {
  feature: string;
  ours: "yes" | "no" | "partial";
  theirs: "yes" | "no" | "partial";
  note?: string;
}

export interface ComparisonArticle {
  slug: string;
  title: string;
  description: string;
  app_id: string;
  vs_name: string;
  vs_url: string;
  features: CompareFeature[];
  verdict: string;
  last_updated: string;
}

export const COMPARISON_ARTICLES: ComparisonArticle[] = [
  {
    slug: "pdf-scanner-vs-adobe-scan",
    title: "PDF Scanner vs Adobe Scan — which is better?",
    description:
      "Both apps let you scan documents with your phone camera, but they take very different approaches to pricing and account requirements. Here is how iStack PDF Scanner compares to Adobe Scan on Android.",
    app_id: "pdf-scanner",
    vs_name: "Adobe Scan",
    vs_url: "https://acrobat.adobe.com/us/en/mobile/scanner-app.html",
    features: [
      { feature: "Completely free", ours: "yes", theirs: "partial", note: "Adobe Scan limits some export features without an Adobe subscription." },
      { feature: "No account required", ours: "yes", theirs: "no", note: "Adobe Scan requires an Adobe ID to use." },
      { feature: "OCR text recognition", ours: "yes", theirs: "yes" },
      { feature: "Works fully offline", ours: "yes", theirs: "partial", note: "Adobe Scan requires connectivity for OCR processing." },
      { feature: "PDF export", ours: "yes", theirs: "yes" },
      { feature: "Auto edge detection", ours: "yes", theirs: "yes" },
      { feature: "Cloud storage sync", ours: "no", theirs: "yes", note: "Adobe Scan integrates with Adobe Document Cloud." },
      { feature: "No data uploaded to servers", ours: "yes", theirs: "no", note: "Adobe Scan uploads documents to Adobe's cloud." },
    ],
    verdict:
      "PDF Scanner is the better choice if you want a fully free, no-account scanner that processes everything on-device and works offline. Adobe Scan has a more polished interface and deep Adobe ecosystem integration, but requires an Adobe ID and uploads your documents to the cloud — which is a privacy tradeoff some users may not want.",
    last_updated: "April 19, 2026",
  },

  {
    slug: "home-workout-vs-nike-training-club",
    title: "Home Workout vs Nike Training Club — free fitness app comparison",
    description:
      "Both apps offer free no-equipment workouts for Android, but the experience is quite different. Here is a head-to-head comparison of iStack Home Workout and Nike Training Club.",
    app_id: "home-workout",
    vs_name: "Nike Training Club",
    vs_url: "https://www.nike.com/ntc-app",
    features: [
      { feature: "Completely free", ours: "yes", theirs: "yes" },
      { feature: "No account required", ours: "yes", theirs: "no", note: "NTC requires a Nike account to access workouts." },
      { feature: "No-equipment workouts", ours: "yes", theirs: "yes" },
      { feature: "Guided exercise animations", ours: "yes", theirs: "yes" },
      { feature: "Works fully offline", ours: "yes", theirs: "partial", note: "NTC requires downloading workouts in advance for offline use." },
      { feature: "Progress tracking", ours: "yes", theirs: "yes" },
      { feature: "Personal trainer videos", ours: "no", theirs: "yes", note: "NTC features video guidance from Nike trainers." },
      { feature: "Lightweight app size", ours: "yes", theirs: "no", note: "NTC is a significantly larger install." },
    ],
    verdict:
      "Home Workout is the better pick if you want a lightweight, no-account app that works offline and gets you training immediately. Nike Training Club offers higher production quality and trainer-led video workouts, but requires a Nike account and a much larger app download. For simple, effective bodyweight training, Home Workout does the job without the overhead.",
    last_updated: "April 19, 2026",
  },

  {
    slug: "step-counter-vs-google-fit",
    title: "Step Counter vs Google Fit — which pedometer app should you use?",
    description:
      "Google Fit and iStack Step Counter both track your daily steps on Android, but they serve different needs. Step Counter is lightweight and instant; Google Fit is a full health platform. Here is the comparison.",
    app_id: "step-counter",
    vs_name: "Google Fit",
    vs_url: "https://www.google.com/fit/",
    features: [
      { feature: "Completely free", ours: "yes", theirs: "yes" },
      { feature: "No account required", ours: "yes", theirs: "no", note: "Google Fit requires a Google account sign-in." },
      { feature: "Step counting", ours: "yes", theirs: "yes" },
      { feature: "Distance and calorie tracking", ours: "yes", theirs: "yes" },
      { feature: "Works offline", ours: "yes", theirs: "yes" },
      { feature: "Lightweight app", ours: "yes", theirs: "no", note: "Google Fit includes many health tracking features that add size." },
      { feature: "Heart points / Move Minutes", ours: "no", theirs: "yes" },
      { feature: "Wearable device sync", ours: "no", theirs: "yes", note: "Google Fit syncs with Wear OS, Fitbit, and other devices." },
      { feature: "Simple one-screen dashboard", ours: "yes", theirs: "no" },
    ],
    verdict:
      "If you just want to count steps and see your progress without sign-in or complexity, Step Counter is the better choice — it launches instantly and shows what you need on one screen. Google Fit is more powerful and syncs with wearables, but it requires a Google account and has a much steeper learning curve for basic step tracking.",
    last_updated: "April 19, 2026",
  },

  {
    slug: "font-generator-vs-lingojam",
    title: "Font Generator app vs LingoJam — best fancy text for Instagram",
    description:
      "LingoJam is a popular web-based font generator, while iStack Font Generator is an Android app. Both create stylish Unicode text for Instagram and social media. Here is how they compare.",
    app_id: "font-generator",
    vs_name: "LingoJam (web)",
    vs_url: "https://lingojam.com/",
    features: [
      { feature: "Works without internet", ours: "yes", theirs: "no", note: "LingoJam requires a browser and active internet connection." },
      { feature: "Android home screen widget", ours: "yes", theirs: "no" },
      { feature: "Copy to clipboard in one tap", ours: "yes", theirs: "partial", note: "LingoJam requires manual text selection and copy." },
      { feature: "No ads in content", ours: "partial", theirs: "no", note: "Both show ads; LingoJam has heavier web ad placement." },
      { feature: "Works on iOS", ours: "no", theirs: "yes", note: "Font Generator is Android only. LingoJam works in any browser." },
      { feature: "Font previews update live", ours: "yes", theirs: "yes" },
      { feature: "Text art / ASCII art", ours: "yes", theirs: "partial" },
    ],
    verdict:
      "Font Generator is the better daily driver for Android users — it works offline, copies text in one tap, and lives on your home screen for instant access. LingoJam is more versatile since it works in any browser on any device, but it requires internet and more steps to copy styled text. For frequent Instagram or WhatsApp use on Android, the app wins.",
    last_updated: "April 19, 2026",
  },

  {
    slug: "signature-maker-vs-docusign",
    title: "Signature Maker vs DocuSign — free PDF signing for Android",
    description:
      "DocuSign is the industry standard for legally binding e-signatures. iStack Signature Maker is a free, no-account alternative for everyday document signing on Android. Here is when to use each.",
    app_id: "signature-maker",
    vs_name: "DocuSign",
    vs_url: "https://www.docusign.com/",
    features: [
      { feature: "Completely free", ours: "yes", theirs: "partial", note: "DocuSign offers a free tier limited to 3 envelopes per month." },
      { feature: "No account required", ours: "yes", theirs: "no", note: "DocuSign requires account creation." },
      { feature: "Sign PDFs directly on device", ours: "yes", theirs: "yes" },
      { feature: "No documents uploaded to cloud", ours: "yes", theirs: "no", note: "DocuSign stores all documents on its servers." },
      { feature: "Send for others to sign", ours: "no", theirs: "yes", note: "DocuSign's core feature is multi-party signature workflows." },
      { feature: "Audit trail / legal compliance", ours: "no", theirs: "yes", note: "DocuSign provides ESIGN-compliant audit trails." },
      { feature: "Works offline", ours: "yes", theirs: "no" },
      { feature: "Unlimited signatures per month", ours: "yes", theirs: "no", note: "DocuSign free tier caps at 3 sent envelopes." },
    ],
    verdict:
      "Signature Maker is the right tool for personal documents — signing a rental form, a permission slip, or a simple approval. It is free, private, and works offline. DocuSign is the right tool for professional, legally binding contracts that require multi-party workflows, audit trails, and compliance certification. Use Signature Maker for everyday signing and DocuSign when legal enforceability is required.",
    last_updated: "April 19, 2026",
  },
];

export function getComparisonBySlug(slug: string): ComparisonArticle | undefined {
  return COMPARISON_ARTICLES.find((a) => a.slug === slug);
}
