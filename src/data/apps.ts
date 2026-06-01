import { LOCAL_BANNER_MAP } from "./local-banner-map";
import { LOCAL_ICON_MAP } from "./local-icon-map";
import { LOCAL_SCREENSHOT_MAP } from "./local-screenshot-map";
import { PLAY_STORE_FULL_DESCRIPTIONS } from "./play-store-full-descriptions";
import { PLAY_STORE_METADATA } from "./play-store-metadata";

const PL = "https://play-lh.googleusercontent.com/";

/** Build an icon URL at the given square size */
function icon(hash: string, size = 128) {
  return `${PL}${hash}=w${size}-h${size}-rw`;
}

/** Banner / feature graphic URL (landscape 16:9) */
function banner(hash: string) {
  return `${PL}${hash}=w416-h235-rw`;
}

export type AppPlatform = "android" | "ios" | "both";

export type SeoCategory =
  | "productivity"
  | "ai-photo"
  | "utilities"
  | "health"
  | "education"
  | "personalization"
  | "voice";

export type AppCategory =
  | "All"
  | "Photography"
  | "Productivity"
  | "Health"
  | "Utilities"
  | "Personalization"
  | "Education";

export interface AppFeature {
  title: string;
  description: string;
}

export interface AppFaq {
  question: string;
  answer: string;
}

export interface AppCompetitor {
  name: string;
  url: string;
}

export interface App {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  platform: AppPlatform;
  playStoreShortDescription?: string;
  playStoreUpdatedOn?: string;
  playStoreInstalls?: string;
  playStoreCategory?: string;
  playStoreContentRating?: string;
  playStoreWhatsNew?: string;
  packageId: string;
  /** Apple App Store numeric ID (iOS only) */
  appStoreId?: string;
  /** Apple App Store URL slug when it differs from the local app slug. */
  appStoreSlug?: string;
  category: Exclude<AppCategory, "All">;
  iconUrl: string;
  bannerUrl: string;
  /** Local portrait screenshot URLs (phone mockups), scraped from the store listing */
  screenshots?: string[];
  /** Fallback gradient colours used if image fails to load */
  gradientFrom: string;
  gradientTo: string;
  featured?: boolean;
  // SEO/GEO extended fields
  seoCategory: SeoCategory;
  primary_keyword: string;
  secondary_keywords: string[];
  short_description: string;
  long_description: string;
  features: AppFeature[];
  faq: AppFaq[];
  competitors: AppCompetitor[];
  release_date?: string;
  rating?: number;
}

export const CATEGORIES: AppCategory[] = [
  "All",
  "Photography",
  "Productivity",
  "Health",
  "Utilities",
  "Personalization",
  "Education",
];

function buildFallbackLongDescription(
  app: { name: string; platform?: AppPlatform },
  seo: { primary_keyword: string; secondary_keywords: string[] },
  shortDescription: string
) {
  const platform =
    app.platform === "ios"
      ? "iPhone"
      : app.platform === "both"
        ? "Android and iPhone"
        : "Android";
  const keyword = seo.primary_keyword || app.name.toLowerCase();
  const secondary = seo.secondary_keywords.slice(0, 3);
  const featureList = secondary.length
    ? secondary.map((item) => `- ${item}`).join("\n")
    : `- Fast setup\n- Simple controls\n- Mobile-first workflow`;

  return `${app.name} is built for ${platform} users who want ${keyword} without a complicated setup. ${shortDescription}

Open the app, complete the task, and move on. The interface is focused on the core workflow, so you do not need an account, a long onboarding flow, or a subscription gate before using the main feature.

Key ways to use ${app.name}

${featureList}

${app.name} is part of the iStack portfolio of small, practical mobile apps. Each app is designed around one clear job, with lightweight screens, quick launch behavior, and a free path for everyday use.`;
}

export const PLAY_STORE_BASE = "https://play.google.com/store/apps/details?id=";
export const APP_STORE_BASE = "https://apps.apple.com/us/app/";
export const DEVELOPER_URL = "https://play.google.com/store/apps/developer?id=iStack";
export const IOS_DEVELOPER_URL = "https://apps.apple.com/us/developer/mohamed-haizoun/id1788796086";
export const ADS_TXT_REPO_URL = "https://github.com/istack-cc/ads-txt";
export const SUPPORT_EMAIL = "contact@istack.cc";

export function getPlayStoreUrl(packageId: string) {
  return `${PLAY_STORE_BASE}${packageId}`;
}

export function getAppStoreUrl(app: App) {
  if (!app.appStoreId) return "";
  return `${APP_STORE_BASE}${app.appStoreSlug ?? app.id}/id${app.appStoreId}`;
}

export function getStoreUrl(app: App) {
  if (app.platform === "ios") return getAppStoreUrl(app);
  return getPlayStoreUrl(app.packageId);
}

const APP_DESCRIPTIONS: Record<string, string> = {
  "com.istack.formsapp":
    "Forms is a third-party Google Forms manager for Android. Create, edit, and manage Google Forms on your phone with AI-assisted form generation, response charts, QR code sharing, and PDF export.",
  "com.istack.sweet_camera":
    "Sweet Camera is a beauty selfie app for Android with real-time filters, skin smoothing, and quick retouch tools. Capture photos with live effects and share polished selfies instantly.",
  "com.istack.photo_collage":
    "Photo Collage helps you combine pictures into modern grid layouts with frames, stickers, text, and custom backgrounds. It is built for creating social-ready collages in seconds.",
  "com.istack.time_warp_scan":
    "Time Warp Scan lets you create trending warp effects and fun distortions with a simple scan-line camera workflow. Make viral-style videos and photos directly from your Android phone.",
  "com.istack.photo_lock":
    "Photo Vault secures private photos and videos behind a calculator-style lock and encrypted storage. Keep sensitive media hidden while maintaining fast access for you only.",
  "com.istack.gps.photo":
    "GPS Photo adds location, date, and map information to your photos for travel, work, and field documentation. Stamp shots automatically with accurate geotag overlays.",
  "com.istack.cut_and_paste_photos":
    "Cut Paste Photo Editor gives you quick background removal and object cutout tools for creative edits. Build clean composites with easy drag-and-place controls.",
  "com.istack.sticker_maker":
    "Sticker Maker converts your images into custom stickers with transparent background support and export-ready packs. Design personal emoji and sticker sets for chat apps.",
  "com.istack.word.reader":
    "Document Reader opens Word and office files on Android with a lightweight, fast-reading interface. Access DOC, DOCX, and other formats without complicated setup.",
  "com.istack.office.reader":
    "Office Reader is an all-in-one document viewer for PDFs and office files with smooth navigation. Review important files quickly on mobile for work or study.",
  "com.istack.img2.pdf":
    "PDF Scanner turns paper documents and images into clean PDFs with OCR support and quality controls. Scan, convert, and share files from your phone in a few taps.",
  "com.istack.sigature.app":
    "Signature Maker lets you create digital signatures and sign PDF files on Android. Use it for forms, approvals, and lightweight document workflows on the go.",
  "com.istack.artfonts":
    "Font Generator creates stylish text for social bios, captions, and messages using decorative font styles. Copy and share formatted text instantly across apps.",
  "com.istack.speakandtranslate":
    "Translate supports voice translation and camera text scanning for everyday multilingual conversations. Speak, scan, and convert text quickly while traveling or working.",
  "com.istack.home_workout":
    "Home Workout delivers no-equipment fitness plans with guided routines for strength, fat loss, and consistency. Train anywhere with structured sessions and progress tracking.",
  "com.istack.step_tracker":
    "Step Counter tracks your daily steps, distance, and activity trends with a clean pedometer interface. Build healthy habits with clear goals and simple daily insights.",
  "com.istack.wifi_speed_test":
    "Speed Test measures internet download, upload, and ping performance in real time. Diagnose Wi-Fi quality quickly and verify connection stability on Android.",
  "com.istack.nfc.wallet":
    "NFC Card Reader scans compatible cards and helps manage card information in a secure wallet experience. Quickly read NFC data and validate card details on device.",
  "com.istack.speaker_cleaner":
    "Speaker Cleaner plays tuned sound frequencies to help eject water and improve muffled speaker output. Restore audio clarity with one-tap cleaning sessions.",
  "com.istack.guitar_tuner":
    "Guitar Tuner provides accurate chromatic tuning for guitar and other string instruments. Tune faster with responsive pitch detection and clear visual feedback.",
  "com.istack.ar.meter":
    "AR Measure uses your camera to estimate object lengths and room dimensions quickly. Take rough measurements without carrying a physical tape measure.",
  "com.istack.phone_mirror":
    "Mirror transforms your phone into a quick front camera mirror with optional light tools. Use it for makeup checks, grooming, and low-light touchups.",
  "com.istack.color_identification":
    "Color Picker detects and identifies colors from camera input and images with practical accuracy. Capture color values quickly for design, decor, and creative work.",
  "com.istack.speedometer":
    "GPS Speedometer tracks speed, distance, and trip metrics for driving and outdoor travel. Monitor movement in real time with easy-to-read speed dashboards.",
  "com.istack.screen_mirroring":
    "Screen Mirroring helps cast your Android screen to compatible TVs for media, demos, and presentations. Share your display quickly over supported wireless standards.",
  "com.istack.hearing_from_distance":
    "Hearing Amplifier boosts environmental sound to help you hear distant or quiet audio more clearly. Adjust levels and listen with simple on-device controls.",
  "com.istack.compass.app":
    "Compass provides reliable direction tools with GPS-assisted orientation for navigation and outdoor use. Get heading information fast in a minimal interface.",
  "com.istack.live.earth":
    "Live Earth Map offers satellite-style map views and location tools for exploration and navigation. Browse global locations with mobile-friendly map features.",
  "com.istack.minimal_watch_faces":
    "Watch Faces delivers minimalist designs for Wear OS users who want clean, readable styles. Personalize your smartwatch with polished, modern face options.",
  "com.istack.funky_smiles":
    "Funky Smiles brings animated live wallpapers and playful visual themes to your Android home screen. Refresh your phone look with vibrant personality.",
  "com.istack.wallpaper_kawaii":
    "Kawaii Wallpaper provides cute HD backgrounds curated for aesthetic phone customization. Browse and apply high-quality wallpaper styles in one place.",
  "com.istack.birthday_greetings":
    "Birthday Cards helps you design birthday wishes with templates, frames, text, and animated greeting styles. Create memorable digital cards quickly.",
  "com.istack.wedding_invitation_maker":
    "Wedding Invitation Maker lets you design elegant invitation cards with customizable text and layouts. Produce share-ready invite designs directly from Android.",
  "com.istack.smart_clock":
    "Neon Clock offers live wallpaper clock visuals and stylish time displays for your lock and home screen. Customize your phone with glowing clock themes.",
  "com.istack.edge_lighting":
    "Edge Lighting adds animated edge effects and wallpaper accents to make notifications and screens stand out. Personalize your device with dynamic border glow.",
  "com.istack.led_scroller":
    "LED Banner turns your phone into a scrolling text display for events, messages, and attention-grabbing signs. Type once and present bright marquee-style text.",
  "com.istack.house_design_plan_3d":
    "Home Design 3D helps you sketch floor plans and visualize room layouts for home projects. Plan spaces faster with practical mobile design tools.",
  "ru.commands.voice.assistant":
    "Voice Commands helps users trigger assistant actions with command presets and voice workflows. Speed up everyday phone tasks through voice-driven controls.",
  "ios.appx.sunglow.uv.index":
    "Tanning UV Index - Sun Tracker helps iPhone users plan sun exposure with live UV index, Fitzpatrick skin type, SPF level, a sunburn risk timer, vitamin D estimates, 7-day forecast, SPF reminders, and session history for beach days, vacations, and everyday outdoor routines.",
  "ios.appx.tcg.card.value.scanner":
    "TCG Scanner lets you scan trading cards instantly, see real market value, and track your collection portfolio over time. Supports raw and graded pricing for Japanese cards, rare finds, and high-value collectibles.",
  "ios.hair.color.changer.appx":
    "Hair Cut - Color Changer lets you try any hairstyle or hair color in seconds using AI. Upload your photo and preview realistic cuts and shades with smart lighting and automatic hair masking.",
  "ios.appx.math.solver.ai":
    "Math AI helps you solve math problems instantly. Use your camera to scan equations and get accurate, step-by-step answers powered by AI. Covers algebra, geometry, calculus, and word problems.",
  "ios.appx.nano.banana.image":
    "Gimin turns any snap into a scroll-stopping photo with one tap. AI-powered enhancements, polaroid generator, cartoon filters, tattoo try-on, interior design visualization, and professional headshots.",
  "ios.appx.background.remover":
    "Transparency: Magic Eraser creates clean transparent PNGs in one tap. Remove backgrounds with AI, replace with photos or solid colors, blur for portraits, and export as PNG or JPG.",
  "ios.appx.currency.converter":
    "Currency Converter & Calc converts any currency instantly with real-time exchange rates. Supports 180+ currencies, works offline, and includes an interactive Home Screen widget.",
  "com.appx.bptracker":
    "Blood Pressure Diary helps you log blood pressure, glucose, SpO2, heart rate, and health notes in one place. Track readings over time with a simple mobile diary built for daily check-ins.",
  "ios.appx.periodtracker":
    "Period Tracker & Cycle Diary helps users follow cycles, ovulation windows, fertility timing, and recurring symptoms. Keep a clear private diary for period and wellness patterns.",
  "ios.appx.g1.ontario":
    "Ontario G1 Practice Test 2026 helps drivers prepare for the G1 knowledge exam with MTO-style practice questions, mock tests, and focused study sessions.",
  "ios.appx.electricianhandbook":
    "Electrician Calc & Reference provides offline electrical calculations, wiring references, and NEC-style study support for field work and exam preparation.",
  "ios.appx.lgvhgv":
    "LGV Theory Test: 4 in 1 Kit UK helps learners prepare for DVSA LGV and HGV theory with mock tests, hazard practice, and driver exam revision tools.",
  "ios.appx.teleprompter":
    "Teleprompter: Script for Video turns scripts into an easy scrolling prompt for recording videos, speeches, reels, and presentations with smoother delivery.",
  "ios.appx.dmv.practice.test":
    "DMV Practice Test 2026 helps learners prepare for U.S. permit tests, driver license written exams, CDL practice, motorcycle permit review, road signs, and traffic rules across all 50 states. Built for quick study sessions before a DMV appointment, with search-friendly support for examen de manejo and prueba de manejo learners.",
};

type AppSeed = Omit<App, "description" | "platform" | "seoCategory" | "primary_keyword" | "secondary_keywords" | "short_description" | "long_description" | "features" | "faq" | "competitors"> & { platform?: AppPlatform };

interface AppSeoData {
  seoCategory: SeoCategory;
  primary_keyword: string;
  secondary_keywords: string[];
  features: AppFeature[];
  faq: AppFaq[];
  competitors: AppCompetitor[];
  rating?: number;
  release_date?: string;
}

const SEO_APP_DATA: Record<string, AppSeoData> = {
  /* ─── Productivity ──────────────────────────────────────── */
  "forms": {
    seoCategory: "productivity",
    primary_keyword: "free google forms manager android",
    secondary_keywords: ["google forms app android", "ai form generator android", "google forms mobile app", "form creator android free"],
    features: [], faq: [], competitors: [],
  },
  "document-reader": {
    seoCategory: "productivity",
    primary_keyword: "free word document reader android",
    secondary_keywords: ["docx viewer android", "word file opener android", "doc reader free", "office file viewer android"],
    features: [], faq: [], competitors: [],
  },
  "office-reader": {
    seoCategory: "productivity",
    primary_keyword: "free office document viewer android",
    secondary_keywords: ["pdf viewer android free", "excel viewer android", "pptx reader android", "all document viewer offline"],
    features: [], faq: [], competitors: [],
  },
  "pdf-scanner": {
    seoCategory: "productivity",
    primary_keyword: "free pdf scanner android",
    secondary_keywords: ["image to pdf converter android", "ocr scanner android free", "document scanner android", "scan to pdf offline"],
    features: [], faq: [], competitors: [],
  },
  "signature-maker": {
    seoCategory: "productivity",
    primary_keyword: "free digital signature app android",
    secondary_keywords: ["esign pdf android", "sign documents android", "digital signature creator free", "pdf signature app"],
    features: [], faq: [], competitors: [],
  },
  /* ─── AI & Photo ────────────────────────────────────────── */
  "sweet-camera": {
    seoCategory: "ai-photo",
    primary_keyword: "beauty selfie camera app android",
    secondary_keywords: ["beauty filter camera android", "selfie camera free android", "face smooth camera app", "beauty cam android"],
    features: [], faq: [], competitors: [],
  },
  "photo-collage": {
    seoCategory: "ai-photo",
    primary_keyword: "free photo collage maker android",
    secondary_keywords: ["photo grid maker android", "collage app android free", "picture collage maker", "photo layout creator android"],
    features: [], faq: [], competitors: [],
  },
  "time-warp-scan": {
    seoCategory: "ai-photo",
    primary_keyword: "time warp scan camera android",
    secondary_keywords: ["warp effect camera android", "scan distortion camera", "viral photo effects android", "time warp video android"],
    features: [], faq: [], competitors: [],
  },
  "cut-paste-photo": {
    seoCategory: "ai-photo",
    primary_keyword: "cut and paste photo editor android",
    secondary_keywords: ["background remover android", "photo cutout app free", "image composite editor", "object cut paste photo"],
    features: [], faq: [], competitors: [],
  },
  "sticker-maker": {
    seoCategory: "ai-photo",
    primary_keyword: "custom sticker maker android",
    secondary_keywords: ["whatsapp sticker maker android", "photo sticker creator free", "sticker pack maker android", "emoji sticker creator"],
    features: [], faq: [], competitors: [],
  },
  "hair-cut": {
    seoCategory: "ai-photo",
    primary_keyword: "ai hairstyle try on app ios",
    secondary_keywords: ["hair color changer app ios", "virtual haircut ios", "ai hair transformation app", "hairstyle simulator free"],
    features: [], faq: [], competitors: [],
  },
  "gimin": {
    seoCategory: "ai-photo",
    primary_keyword: "ai photo editor polaroid filter ios",
    secondary_keywords: ["ai photo effects ios", "polaroid filter app ios", "cartoon filter camera ios", "ai image enhancement free"],
    features: [], faq: [], competitors: [],
  },
  "transparency": {
    seoCategory: "ai-photo",
    primary_keyword: "background remover ai ios",
    secondary_keywords: ["magic eraser app ios", "remove background ai free", "transparent png maker ios", "cutout photo editor ios"],
    features: [], faq: [], competitors: [],
  },
  /* ─── Utilities ─────────────────────────────────────────── */
  "speed-test": {
    seoCategory: "utilities",
    primary_keyword: "free internet speed test android",
    secondary_keywords: ["wifi speed test android", "download speed checker", "ping test android free", "network speed test app"],
    features: [], faq: [], competitors: [],
  },
  "nfc-card-reader": {
    seoCategory: "utilities",
    primary_keyword: "nfc card reader android",
    secondary_keywords: ["emv card scanner android", "nfc wallet app android", "nfc scanner free android", "card reader nfc app"],
    features: [], faq: [], competitors: [],
  },
  "speaker-cleaner": {
    seoCategory: "utilities",
    primary_keyword: "water eject speaker cleaner android",
    secondary_keywords: ["speaker cleaner android free", "water from phone speaker", "fix muffled speaker android", "sound cleaner phone"],
    features: [], faq: [], competitors: [],
  },
  "guitar-tuner": {
    seoCategory: "utilities",
    primary_keyword: "free guitar tuner app android",
    secondary_keywords: ["chromatic tuner android", "guitar pitch tuner app", "instrument tuner android free", "guitar tuner offline"],
    features: [], faq: [], competitors: [],
  },
  "ar-measure": {
    seoCategory: "utilities",
    primary_keyword: "ar ruler tape measure android",
    secondary_keywords: ["augmented reality measure app", "ar tape measure android free", "measure distance camera android", "ruler app android"],
    features: [], faq: [], competitors: [],
  },
  "mirror": {
    seoCategory: "utilities",
    primary_keyword: "phone mirror app android",
    secondary_keywords: ["selfie mirror app android", "front camera mirror free", "mirror with flashlight android", "pocket mirror app"],
    features: [], faq: [], competitors: [],
  },
  "color-picker": {
    seoCategory: "utilities",
    primary_keyword: "color picker camera android",
    secondary_keywords: ["color detector android free", "hex color picker app", "identify color from camera", "color identifier android"],
    features: [], faq: [], competitors: [],
  },
  "speedometer": {
    seoCategory: "utilities",
    primary_keyword: "gps speedometer app android",
    secondary_keywords: ["car speedometer android", "speed tracker android free", "trip meter app android", "gps speed meter app"],
    features: [], faq: [], competitors: [],
  },
  "screen-mirroring": {
    seoCategory: "utilities",
    primary_keyword: "screen mirroring android to tv",
    secondary_keywords: ["miracast android app", "cast android to tv free", "wireless screen cast android", "phone to tv mirror app"],
    features: [], faq: [], competitors: [],
  },
  "hearing-amplifier": {
    seoCategory: "utilities",
    primary_keyword: "hearing amplifier app android",
    secondary_keywords: ["sound amplifier android free", "microphone amplifier app", "hearing aid app android", "ear amplifier android"],
    features: [], faq: [], competitors: [],
  },
  "compass": {
    seoCategory: "utilities",
    primary_keyword: "free compass app android",
    secondary_keywords: ["gps compass android free", "direction finder app", "magnetic compass android", "navigation compass free"],
    features: [], faq: [], competitors: [],
  },
  "live-earth": {
    seoCategory: "utilities",
    primary_keyword: "live satellite map android",
    secondary_keywords: ["satellite view app android", "earth map android free", "world map satellite app", "live earth view android"],
    features: [], faq: [], competitors: [],
  },
  "photo-vault": {
    seoCategory: "utilities",
    primary_keyword: "photo vault calculator lock android",
    secondary_keywords: ["hide photos android app", "photo locker app free", "private photo vault android", "calculator vault android"],
    features: [], faq: [], competitors: [],
  },
  "gps-photo": {
    seoCategory: "utilities",
    primary_keyword: "gps photo stamp android",
    secondary_keywords: ["geotag photo android free", "location stamp camera app", "gps coordinates on photo", "photo location tagger android"],
    features: [], faq: [], competitors: [],
  },
  "speak-translate": {
    seoCategory: "utilities",
    primary_keyword: "voice translator camera android",
    secondary_keywords: ["speak translate app android", "camera text translator android", "voice translation app free", "live translation android"],
    features: [], faq: [], competitors: [],
  },
  "tcg-scanner": {
    seoCategory: "utilities",
    primary_keyword: "trading card scanner app ios",
    secondary_keywords: ["pokemon card scanner ios", "tcg card value tracker", "card collection app ios", "trading card price checker"],
    features: [], faq: [], competitors: [],
  },
  "currency-converter": {
    seoCategory: "utilities",
    primary_keyword: "currency converter offline app ios",
    secondary_keywords: ["exchange rate converter ios", "forex calculator app ios", "currency conversion widget ios", "real time currency app"],
    features: [], faq: [], competitors: [],
  },
  "electrician-calc": {
    seoCategory: "utilities",
    primary_keyword: "electrician calculator reference app ios",
    secondary_keywords: ["electrical calculator ios", "wiring guide app", "nec reference app ios", "electrician handbook offline"],
    features: [], faq: [], competitors: [],
  },
  "teleprompter": {
    seoCategory: "utilities",
    primary_keyword: "teleprompter script app ios",
    secondary_keywords: ["video script reader ios", "voice prompter app", "scrolling script app ios", "teleprompter for reels"],
    features: [], faq: [], competitors: [],
  },
  /* ─── Health & Fitness ──────────────────────────────────── */
  "home-workout": {
    seoCategory: "health",
    primary_keyword: "free home workout app no equipment",
    secondary_keywords: ["workout app android free", "no gym fitness app", "home exercise android no equipment", "bodyweight workout free"],
    features: [], faq: [], competitors: [],
  },
  "step-counter": {
    seoCategory: "health",
    primary_keyword: "free step counter pedometer android",
    secondary_keywords: ["step tracker android free", "pedometer app free android", "daily steps counter app", "walking tracker android"],
    features: [], faq: [], competitors: [],
  },
  "ai-tanning": {
    seoCategory: "health",
    primary_keyword: "uv index tanning timer app ios",
    secondary_keywords: [
      "safer sun exposure app ios",
      "sunburn timer app",
      "spf reminder app ios",
      "vitamin d tracker app",
      "sun exposure tracker ios",
      "fitzpatrick skin type tanning app",
      "uv forecast beach app",
      "uv index tanning timer Mexico",
      "indice UV bronceado app",
      "protector solar recordatorio app",
      "aplicacion para tomar el sol seguro",
      "quemaduras solares temporizador app",
    ],
    features: [
      {
        title: "Personalized UV tanning timer",
        description:
          "Plan sun exposure around live UV index, Fitzpatrick skin type, SPF level, and your session goal instead of relying on a generic weather number.",
      },
      {
        title: "Sunburn risk and SPF reminders",
        description:
          "Use countdown-based guidance for when to flip, seek shade, or reapply sunscreen during beach days, pool time, vacations, and outdoor routines.",
      },
      {
        title: "Vitamin D and UV forecast planning",
        description:
          "Review estimated vitamin D exposure and a 7-day UV forecast so you can choose lower-risk outdoor windows before stepping into the sun.",
      },
      {
        title: "Built for U.S. and Mexico sun-seekers",
        description:
          "Useful for people searching in English or Spanish for UV index, indice UV, protector solar reminders, bronceado seguro, and sunburn prevention.",
      },
    ],
    faq: [
      {
        question: "What does Tanning UV Index - Sun Tracker do?",
        answer:
          "Tanning UV Index - Sun Tracker helps users plan sun exposure with live UV index, Fitzpatrick skin type, SPF level, sunburn risk timing, vitamin D estimates, SPF reminders, a 7-day forecast, and session history.",
      },
      {
        question: "Is this a UV index app or a tanning timer app?",
        answer:
          "It is both. The app uses UV index data as the input, then turns it into a more practical tanning and sun-exposure timer based on skin type, SPF, and session goals.",
      },
      {
        question: "Can it help users in the U.S. and Mexico?",
        answer:
          "Yes. The app is built for location-based UV planning, which is useful for U.S. and Mexico beach, pool, vacation, and daily outdoor sun exposure. Spanish-search users may find it through terms like indice UV, bronceado seguro, protector solar, and quemaduras solares.",
      },
      {
        question: "Can I use it for beach or summer trip planning?",
        answer:
          "Yes. The app is designed for beach days, pool sessions, vacations, and summer outdoor planning. Check the UV forecast before going out, then use SPF, Fitzpatrick skin type, and timer reminders as guidance while you follow sunscreen labels and local weather alerts.",
      },
      {
        question: "How should users treat UV and tanning guidance?",
        answer:
          "Use UV, SPF, tanning, sunburn, and vitamin D estimates as planning guidance only. UV exposure can still damage skin, and users should follow public-health advice, sunscreen label directions, and professional medical guidance for personal risk.",
      },
      {
        question: "Does the app replace medical advice?",
        answer:
          "No. Tanning UV Index - Sun Tracker provides guidance based on UV data and personal inputs. It is not a medical device and is not a substitute for professional medical advice, diagnosis, or treatment.",
      },
      {
        question: "Is Tanning UV Index - Sun Tracker free?",
        answer:
          "Yes. The app is free to download on the App Store and offers optional premium access through Apple in-app purchases or subscriptions.",
      },
    ],
    competitors: [],
  },
  "blood-pressure-diary": {
    seoCategory: "health",
    primary_keyword: "blood pressure diary app ios",
    secondary_keywords: ["bp log app ios", "heart rate diary ios", "glucose tracker app", "spo2 log app"],
    features: [], faq: [], competitors: [],
  },
  "period-tracker": {
    seoCategory: "health",
    primary_keyword: "period tracker cycle diary ios",
    secondary_keywords: ["ovulation tracker ios", "fertility calendar app", "cycle diary app", "period calendar ios"],
    features: [], faq: [], competitors: [],
  },
  /* ─── Education ─────────────────────────────────────────── */
  "math-ai": {
    seoCategory: "education",
    primary_keyword: "ai math solver camera ios",
    secondary_keywords: ["photo math solver ios", "homework helper app ios", "step by step math ios", "algebra solver camera app"],
    features: [], faq: [], competitors: [],
  },
  "ontario-g1-test": {
    seoCategory: "education",
    primary_keyword: "ontario g1 practice test app ios",
    secondary_keywords: ["g1 driver exam app", "mto practice test ios", "ontario driving test 2026", "g1 knowledge test simulator"],
    features: [], faq: [], competitors: [],
  },
  "lgv-theory-test": {
    seoCategory: "education",
    primary_keyword: "lgv theory test app uk ios",
    secondary_keywords: ["hgv theory test ios", "dvsa mock test app", "hazard perception practice", "driver theory test uk"],
    features: [], faq: [], competitors: [],
  },
  "dmv-practice-test": {
    seoCategory: "education",
    primary_keyword: "dmv practice test 2026 app",
    secondary_keywords: [
      "dmv permit test app",
      "cdl practice test app",
      "driver license written exam practice",
      "dmv practice test spanish learners",
      "examen de manejo DMV practica",
      "prueba de manejo estados unidos",
      "examen de manejo en espanol estados unidos",
      "road signs practice test",
      "all 50 states DMV practice",
      "CA DMV TX DPS FL DMV practice test",
    ],
    features: [
      {
        title: "All 50 states",
        description:
          "Practice for U.S. driver license knowledge tests across state DMV, DPS, BMV, MVA, MVC, DOT, and related agencies.",
      },
      {
        title: "CDL, Class C, and motorcycle prep",
        description:
          "Review general permit questions, commercial driver license topics, motorcycle permit practice, road signs, and traffic rules in one iPhone app.",
      },
      {
        title: "Mock exam rhythm",
        description:
          "Use short practice sessions and full-length simulator-style tests to build confidence before a DMV appointment.",
      },
      {
        title: "Spanish-search friendly",
        description:
          "Helpful for Spanish-speaking learners searching for examen de manejo, prueba de manejo, and U.S. DMV written test practice.",
      },
    ],
    faq: [
      {
        question: "What is DMV Practice Test 2026 used for?",
        answer:
          "DMV Practice Test 2026 helps learners prepare for U.S. driver license written exams, permit tests, CDL practice, motorcycle permit review, road signs, and traffic rules.",
      },
      {
        question: "Does the app cover all U.S. states?",
        answer:
          "The app is built for all 50 U.S. states and common agencies such as DMV, DPS, BMV, MVA, MVC, RMV, DOT, and DOL. Always confirm official requirements with your state agency before scheduling a test.",
      },
      {
        question: "Can Spanish-speaking learners use it for examen de manejo practice?",
        answer:
          "Yes. The app page is useful for people searching for examen de manejo DMV, prueba de manejo, and U.S. driver license practice. The App Store listing is in English, so learners should check the app before relying on it for Spanish-language study.",
      },
      {
        question: "Which DMV exams does the app focus on?",
        answer:
          "The app focuses on permit test and written exam practice for Class C driver licenses, CDL topics, motorcycle permit review, road signs, traffic rules, and common state agency formats across the United States.",
      },
      {
        question: "Is DMV Practice Test 2026 an official DMV app?",
        answer:
          "No. DMV Practice Test 2026 is an independent study tool from iStack and is not affiliated with, endorsed by, or connected to any U.S. DMV or government agency.",
      },
      {
        question: "Is DMV Practice Test 2026 free?",
        answer:
          "Yes, DMV Practice Test 2026 is free to download on the App Store. Optional premium access may be offered through Apple in-app purchase.",
      },
    ],
    competitors: [],
  },
  /* ─── Personalization ───────────────────────────────────── */
  "font-generator": {
    seoCategory: "personalization",
    primary_keyword: "font generator copy paste android",
    secondary_keywords: ["fancy text generator android", "cool fonts for instagram", "stylish text creator app", "unicode font changer android"],
    features: [], faq: [], competitors: [],
  },
  "watch-faces": {
    seoCategory: "personalization",
    primary_keyword: "wear os watch faces android",
    secondary_keywords: ["wear os themes android", "smart watch face app", "minimal watch face android", "free watch faces wear os"],
    features: [], faq: [], competitors: [],
  },
  "funky-smiles": {
    seoCategory: "personalization",
    primary_keyword: "live wallpaper app android",
    secondary_keywords: ["animated wallpaper android free", "live background android", "moving wallpaper android", "custom live wallpaper app"],
    features: [], faq: [], competitors: [],
  },
  "kawaii-wallpaper": {
    seoCategory: "personalization",
    primary_keyword: "kawaii wallpaper app android",
    secondary_keywords: ["cute wallpaper android free", "aesthetic backgrounds android", "hd anime wallpaper app", "kawaii phone theme android"],
    features: [], faq: [], competitors: [],
  },
  "birthday-cards": {
    seoCategory: "personalization",
    primary_keyword: "birthday card maker app android",
    secondary_keywords: ["digital birthday cards app", "birthday wishes creator android", "birthday greeting designer free", "animated birthday cards android"],
    features: [], faq: [], competitors: [],
  },
  "wedding-invitation": {
    seoCategory: "personalization",
    primary_keyword: "wedding invitation maker android",
    secondary_keywords: ["digital wedding card maker", "invitation card designer android", "wedding card app free", "e-invitation android"],
    features: [], faq: [], competitors: [],
  },
  "smart-clock": {
    seoCategory: "personalization",
    primary_keyword: "neon clock live wallpaper android",
    secondary_keywords: ["glowing clock widget android", "neon wallpaper clock app", "clock live wallpaper free", "led clock android app"],
    features: [], faq: [], competitors: [],
  },
  "edge-lighting": {
    seoCategory: "personalization",
    primary_keyword: "edge lighting notification android",
    secondary_keywords: ["edge glow notification android", "border light android app", "notification edge light free", "edge effects wallpaper android"],
    features: [], faq: [], competitors: [],
  },
  "led-scroller": {
    seoCategory: "personalization",
    primary_keyword: "led banner scrolling text android",
    secondary_keywords: ["marquee text display android", "scrolling sign app android", "led display android free", "ticker text app android"],
    features: [], faq: [], competitors: [],
  },
  "house-design": {
    seoCategory: "personalization",
    primary_keyword: "3d home design app android free",
    secondary_keywords: ["floor plan maker android", "room planner 3d android", "interior design app free android", "home layout designer mobile"],
    features: [], faq: [], competitors: [],
  },
  /* ─── Voice & Commands ──────────────────────────────────── */
  "voice-commands": {
    seoCategory: "voice",
    primary_keyword: "voice commands android assistant",
    secondary_keywords: ["voice control android app", "voice shortcuts android", "hands free android commands", "voice automation android free"],
    features: [], faq: [], competitors: [],
  },
};

const REMOTE_APPS: AppSeed[] = [
  /* ─── Photography ──────────────────────────────────────── */
  {
    id: "sweet-camera",
    name: "Sweet Camera",
    subtitle: "Beauty filters & selfie cam",
    packageId: "com.istack.sweet_camera",
    category: "Photography",
    iconUrl: icon("RPLk07hUzOjrHMmZtl36XTG9hUIcbR4GpTWwK4euwdcr2i52Sqb8vqeNesERS16lr4Fu7wvDNptT2G_EYkZX"),
    bannerUrl: banner("lv7WOGyuyv9IFhr7cFB4A-OB75BoqazSUe7XAXNrsky_cU9T1Uv27q3bPr73IWk5UiLlAPCek2yIZh06x6M5zg"),
    gradientFrom: "#f472b6",
    gradientTo: "#ec4899",
  },
  {
    id: "photo-collage",
    name: "Photo Collage",
    subtitle: "Pic grid maker & 500+ layouts",
    packageId: "com.istack.photo_collage",
    category: "Photography",
    iconUrl: icon("Aj-ckFw6HLSsjyNCgQO_cbr083FINl-hsW9Xfecw8Ev-o1ejYTPEPqIaWTbFNjbiC9HplY-cXkqP7-fmc0mheQ"),
    bannerUrl: banner("fTjzjDWGcjVMtCW3DZQGH_U26q9zRB1UXlcJbz2QlD_DmEQcFsDV3hN5WikXxV6-KRQHUFzfHGjasCKWqtntRQ"),
    gradientFrom: "#a78bfa",
    gradientTo: "#7c3aed",
  },
  {
    id: "time-warp-scan",
    name: "Time Warp Scan",
    subtitle: "Warp camera & slow-motion art",
    packageId: "com.istack.time_warp_scan",
    category: "Photography",
    iconUrl: icon("MMeyTbgsd0wMTFmT1_VOqdfvJmuU8EPMXRm2f9fTWUMWXah5bCI59C9zxNFtWiZ_dA5Oc17hKpYpmu5dq0D9wA"),
    bannerUrl: banner("qe95ZmAbWufCqlIbeeyXPFOLKnYSMXQBpVScSySJLLluUiKRuoOwDLVb6u6CqHeE9DiwgMWKfaj4OXEvhk17Gg"),
    gradientFrom: "#38bdf8",
    gradientTo: "#0284c7",
  },
  {
    id: "photo-vault",
    name: "Photo Vault",
    subtitle: "Calculator lock & private album",
    packageId: "com.istack.photo_lock",
    category: "Photography",
    iconUrl: icon("qsuPaKJEwg_0j_62aP0OBbHuQiS_yzRoX1GJztiaByc7XoLgndaFvu1d7Pipr576C8Fo33fbhZphNq2htNd5"),
    bannerUrl: banner("TyCcFPCDE-d07TO_eb7nHV-R1sobX-q-o2qE56dHbI_ldxxTbSurcHMeZW1rqemyl_5JrK5XI_ansh7-p26DLg"),
    gradientFrom: "#4ade80",
    gradientTo: "#15803d",
  },
  {
    id: "gps-photo",
    name: "GPS Photo",
    subtitle: "Location stamp on every shot",
    packageId: "com.istack.gps.photo",
    category: "Photography",
    iconUrl: icon("Y_JP_xxJyYTdxon_P06Y6wVWP69F3IibMKOSLQ_cF3rSgPJ2pC6S8RkrJ1fFLmLO0Xbmgbz5Ok4x8Vz1p7i9Bw"),
    bannerUrl: banner("JigiTTAzVoDp0uVYPgbZxDiHOTFzjNwK7dcEfMVWoaoenfyq0Er-RoHCqxpDV82zCMPXPiMP_BOOqMy6cYmxSwc"),
    gradientFrom: "#fb923c",
    gradientTo: "#c2410c",
  },
  {
    id: "cut-paste-photo",
    name: "Cut Paste Photo",
    subtitle: "Background eraser & editor",
    packageId: "com.istack.cut_and_paste_photos",
    category: "Photography",
    iconUrl: icon("ESR1BoXt95C3BBfbNS6-gNjBIuCHxoXsd_HwqZVOEeISOs23a7SgO3MtAEkcsjX3pgfqks_9hMErCKQgh2qM"),
    bannerUrl: banner("9faG-lY-h7mbk1nY88WjKhHaof8hwwlwXzMgpFjhfPeWR0PHzq6RWT9gA58A8HesucfcOpIjUWXa3OBS4ueLIW8"),
    gradientFrom: "#f87171",
    gradientTo: "#b91c1c",
  },
  {
    id: "sticker-maker",
    name: "Sticker Maker",
    subtitle: "Photo & emoji stickers for WhatsApp",
    packageId: "com.istack.sticker_maker",
    category: "Photography",
    iconUrl: icon("Yv8VHwjN_ZwcqbpDmIVvrwqDF9Sf4ZboDM9AVS6nKa53f6ygfJbR2ys4hCcX7x1Q7gtUAYwsC-qbF4a6foZk"),
    bannerUrl: banner("wwlWb89Ahrw0gC7EEhbvH460L0RR3yzNrZHliV4E1IAKKh4tAHquuUJWNE24UYjPShUPGBeBSWtELtsVZKPX-dI"),
    gradientFrom: "#fbbf24",
    gradientTo: "#d97706",
  },
  /* ─── Productivity ──────────────────────────────────────── */
  {
    id: "forms",
    name: "Forms",
    subtitle: "Google Forms manager with AI",
    packageId: "com.istack.formsapp",
    category: "Productivity",
    iconUrl: "/app-icons/com.istack.formsapp.png",
    bannerUrl: "/app-icons/com.istack.formsapp.png",
    gradientFrom: "#a78bfa",
    gradientTo: "#7c3aed",
  },
  {
    id: "document-reader",
    name: "Document Reader",
    subtitle: "Word & Docs viewer",
    packageId: "com.istack.word.reader",
    category: "Productivity",
    iconUrl: icon("hTEn-6tV6_FyngfmYK-1A-MPBNyzXGcTCu4oNemqmaP4he44Go16j7a_8pRM_OHv_5gxPR2-L8Oz24V-fIkNgUY"),
    bannerUrl: banner("lh9km5EIvd4mMgKGnC_ghJV6u3emODl1YylAOrV7wtM3MZzDNFvcgLrQGZAi3WJPRouhJqcQdKD5SADYntkRepQ"),
    gradientFrom: "#60a5fa",
    gradientTo: "#1d4ed8",
  },
  {
    id: "office-reader",
    name: "Office Reader",
    subtitle: "PDF & document suite",
    packageId: "com.istack.office.reader",
    category: "Productivity",
    iconUrl: icon("eYr-cG5WyOo139ykCA4ivVStL0a3B2faMVPmYTLEeG9IFNKwacGEv9AKv3Sn__UBDF8iyRP90gtf6FctM8G8"),
    bannerUrl: banner("yMCPBFvgadN1atQ9VStafyaohJDeARu-5lXji2AnEq4WtNVJU4ZxW6GwzoXPnB68MRQZa3UyKEG5yfLS7k05tKU"),
    gradientFrom: "#34d399",
    gradientTo: "#065f46",
  },
  {
    id: "pdf-scanner",
    name: "PDF Scanner",
    subtitle: "Image to PDF & OCR",
    packageId: "com.istack.img2.pdf",
    category: "Productivity",
    iconUrl: icon("sM7Mu_FeBfz1oaE0kr9iBojvNeJzOD-Ugmdrq70001N4d4WrLjM1PWH_7CrIG03YJccOosqg_chs2Xwgs5i2og"),
    bannerUrl: banner("_0aDmCq_cxi3jP82cMbzJohk75dQB5NAMmbJGWxGE85a2PFesRzerKNoeP_eW5hrmtAfcQzaabJfbqYR01ChaEI"),
    gradientFrom: "#f97316",
    gradientTo: "#9a3412",
    featured: true,
  },
  {
    id: "signature-maker",
    name: "Signature Maker",
    subtitle: "Sign & annotate PDFs",
    packageId: "com.istack.sigature.app",
    category: "Productivity",
    iconUrl: icon("K8w3q9ZzKR98TeyRFBjSIHMAQdKtIxheXiXYWqHeybhRy3o863BDxber6rDgxMzxfvuccQtyUl5qCp1zmpkPiQ"),
    bannerUrl: banner("5M5B2IlzIsQ0wEK7JXtizT6Mn2J_mmEcgFrToq7zt5nEAQ1FjPS7TlZd03fhZMkmar6R-YpQmhAWNUJG3msN"),
    gradientFrom: "#c084fc",
    gradientTo: "#7e22ce",
  },
  {
    id: "font-generator",
    name: "Font Generator",
    subtitle: "Stylish text & typography",
    packageId: "com.istack.artfonts",
    category: "Productivity",
    iconUrl: icon("LcZ5s51Cr7Xx05PkIrT_HDqG2zIKIshHhYhGu33Nse56xCKXcVDbogOuHh9WkY6bbp8qxM_ChUjedUbJxkomZw"),
    bannerUrl: banner("Eht4SgSTLnobuIPOkjIuKOSsTWO_nCvg7j2Jt0bhtHTKMJlifWvH2bpHhrEF9mgl2lMNq4Wf28UB_9HaAzQkVQ"),
    gradientFrom: "#e879f9",
    gradientTo: "#a21caf",
  },
  {
    id: "speak-translate",
    name: "Translate",
    subtitle: "Voice & camera scan translator",
    packageId: "com.istack.speakandtranslate",
    category: "Productivity",
    iconUrl: icon("RL3-etm7nfiAPEyePLR2VJcPC5wL82lxNUvXtQ71XLaLhr0tFa5RF84JGFAV8vIgeQ"),
    bannerUrl: banner("RyX0CFqrFVc9h1QOLhbcThuu6q6RbQWgBiflX-j79NhNCs1Y1BG23QNFJSUS0ujikUxtiK6w2VRtik6bBtTE"),
    gradientFrom: "#67e8f9",
    gradientTo: "#0e7490",
  },
  /* ─── Health ────────────────────────────────────────────── */
  {
    id: "home-workout",
    name: "Home Workout",
    subtitle: "No equipment gym & 500+ exercises",
    packageId: "com.istack.home_workout",
    category: "Health",
    iconUrl: icon("3ZJgXQ_Gdkre1ryGFejCwUXQcyN2Tc2cX6aVzeXSnBPTV-Lfm0FeuF4Yttf-GiCSJTcrk19ZfMI08Qk0nYbWAlw"),
    bannerUrl: banner("7CuRaLrM0wi9rHXc4Rv7U_ryQVF7y6C7wJBjINNJjOofl7hcfqR9_gRuB0F1COYRTynQhDh6I1VQo00AYim4-5M"),
    gradientFrom: "#4ade80",
    gradientTo: "#16a34a",
    featured: true,
  },
  {
    id: "step-counter",
    name: "Step Counter",
    subtitle: "Pedometer & daily activity tracker",
    packageId: "com.istack.step_tracker",
    category: "Health",
    iconUrl: icon("2DtFNJKaFtYO4JOstz7ZwfnCp9Ax56xDI5i265qVjlm3SYeuVJ20zqj2N9WktQ-9kFim-pQ1d31n1R9vt5FXWw"),
    bannerUrl: banner("70HjzkwdPStgrfE5D5y6j3RX2H3QZJandTijdygRKNV-iMhUP2HhLKzOfzR3pH3LpbWT759vElDFK3CXT-tfuRo"),
    gradientFrom: "#2dd4bf",
    gradientTo: "#0f766e",
  },
  /* ─── Utilities ─────────────────────────────────────────── */
  {
    id: "speed-test",
    name: "Speed Test",
    subtitle: "Download & upload checker",
    packageId: "com.istack.wifi_speed_test",
    category: "Utilities",
    iconUrl: icon("CWRS1SNMTU1ZD6t5ivqUYjq5q-haSCoBSjSzYC5u5lBm2wviHixSTwzZcB156eppUkvnXHc8p28zai6rS6YP"),
    bannerUrl: banner("6z5JQ1EENUlGo70NNAVMIvSltjc3hNcN9UIFARxyukxCJrM0RS9vQsc-XFQoZjbCMo_Ihw2V2pe7OCMdOaSU"),
    gradientFrom: "#38bdf8",
    gradientTo: "#0369a1",
  },
  {
    id: "nfc-card-reader",
    name: "NFC Card Reader",
    subtitle: "EMV scanner & digital wallet",
    packageId: "com.istack.nfc.wallet",
    category: "Utilities",
    iconUrl: icon("IwIiZtElMAJMD6inmcVSehfx2GINjS7EQ_VqPQJ_l0Eww45v7AhjgWy0yqArtcUzcG6xsHDjRf9QDEYJShhm"),
    bannerUrl: banner("QWuCwWBIwl56JZaP3fU57O8vSm4HrSNPKHwwMqZ29CvCzXBsHFlMoZsWfha5--b2ll6JoJRh9MriHqYehNZt"),
    gradientFrom: "#a3e635",
    gradientTo: "#3f6212",
    featured: true,
  },
  {
    id: "speaker-cleaner",
    name: "Speaker Cleaner",
    subtitle: "Water ejector & sound fix",
    packageId: "com.istack.speaker_cleaner",
    category: "Utilities",
    iconUrl: icon("n9EjdJll6Xk1sBUgW3JBMfrZtNyiTDxyLtZHmvj2bk910TSbHoj3DY5eVHD12Ad2Yt4q420vXUuH4WKsu8hPbA"),
    bannerUrl: banner("n_G8PJmZdCnxLy2ICkj2Wu9blDclAKbV_3i0-aNy64oANNZPGpUnGMJ_ZZuet1D6NyO6qusij0mEKli38z1gcw"),
    gradientFrom: "#94a3b8",
    gradientTo: "#334155",
  },
  {
    id: "guitar-tuner",
    name: "Guitar Tuner",
    subtitle: "Chromatic pitch detector",
    packageId: "com.istack.guitar_tuner",
    category: "Utilities",
    iconUrl: icon("YaO2iwNKTmTu1eI4zhqkk4Q53nBvku5nQqijIPke5mf_8-EXqChZm6gkmoNokNu2yLbsGxVzQtngPf9HDvcZ0w"),
    bannerUrl: banner("NkxeiUqtxFl3PBHMkS9RFvvQ2TbPhJAqGjmkpLuidJ3s5YdhaamkR1jHIbrfOnuSs7LK4pZkYaa4gQPaBc6QjcM"),
    gradientFrom: "#fb923c",
    gradientTo: "#7c2d12",
  },
  {
    id: "ar-measure",
    name: "AR Measure",
    subtitle: "Tape measure & AR ruler",
    packageId: "com.istack.ar.meter",
    category: "Utilities",
    iconUrl: icon("Y5MU4wIHs75De9JEiSBS-VGHrQ6C9t_CUDVRcmYjM_6-mWh1O4BP43hma4Bfkx3UV7qn8DYk8uzcGucWyZ0ZoJI"),
    bannerUrl: banner("JL9lKqyH9BZO1Ib6XZNp7IzW5bwkPUR-DrgtZMnur-Y9r5h_9yDxO9Lq10R7irfiTWzH8U517Ub4pNItCGti8Ug"),
    gradientFrom: "#67e8f9",
    gradientTo: "#0e7490",
  },
  {
    id: "mirror",
    name: "Mirror",
    subtitle: "Phone mirror & flashlight",
    packageId: "com.istack.phone_mirror",
    category: "Utilities",
    iconUrl: icon("wqseXHb5k1I9GsVkRu73ywB9x-t90bjvIFIGwYJLiOXXNMEU-EIQQPLJFDBZ5IQxdyXa2wUrmvhXDwY2kfyi"),
    bannerUrl: banner("ruX5E_anqpilMp0e3dYIuJ9aY7s_IVGqZoCf4um_hT1moqfTKhd6QtmOsUIByKprMQQGx-p6wrAC00Kk88ynzQ"),
    gradientFrom: "#e2e8f0",
    gradientTo: "#64748b",
  },
  {
    id: "color-picker",
    name: "Color Picker",
    subtitle: "Color detector & identifier",
    packageId: "com.istack.color_identification",
    category: "Utilities",
    iconUrl: icon("A5AVBWldiKB1eP0Wt_AyoSM4sR8B1vPFA7yRW11SsCRnogD8NFVERi8QggVsZhVzFAAB-Mbodzl7dLmoOYtbtiw"),
    bannerUrl: banner("fxpYkh5YTsteChfaNg9Dlo_-tDm1_Bs9fYVRutdwu40s0Ajxz5oXAS3Nhv407Ls9oGuQKIpP6srckj4i7wN93A"),
    gradientFrom: "#f472b6",
    gradientTo: "#7c3aed",
  },
  {
    id: "speedometer",
    name: "GPS Speedometer",
    subtitle: "Speed & trip tracker",
    packageId: "com.istack.speedometer",
    category: "Utilities",
    iconUrl: icon("Mr8zDzxhWjiy1QZkTujCJYJTIGOjHC6lyXNEy8DmRTnWyz1Y-CV6mWuHHQEPzgHhdLMzUx6PHal8fOpeUIczIp4"),
    bannerUrl: banner("Nq37b2nr_WSHJOfE_zM4gbJ9yHp0N7wDK3qcVYSAX4NwEYnTMeFqruahJQ6ix_-OxFo6TvAP-kvgYWXPMioTe_E"),
    gradientFrom: "#fbbf24",
    gradientTo: "#b45309",
  },
  {
    id: "screen-mirroring",
    name: "Screen Mirroring",
    subtitle: "Cast to TV via Miracast",
    packageId: "com.istack.screen_mirroring",
    category: "Utilities",
    iconUrl: icon("vax_OUHdMUZ_yE059_w9QZSrd06GRMIV7psOwy7SheWQQJaJ995YKkAnsX2h_W3NdCD6B82WhYBt2T4Se6kV"),
    bannerUrl: banner("ERynkuVW1mZteADjCeN04exSvi7qOTgWV73sgVHHRbn-8xXvN8kMFZE0uVDahtLgxBfbwjNWPglOLgi8Xq8IuA"),
    gradientFrom: "#818cf8",
    gradientTo: "#3730a3",
  },
  {
    id: "hearing-amplifier",
    name: "Hearing Amplifier",
    subtitle: "Sound boost from a distance",
    packageId: "com.istack.hearing_from_distance",
    category: "Utilities",
    iconUrl: icon("PKhjCmkTqCJC_awdk6v-TLded8hVxBNWZKSVRTdxpmlVPWHtl6KJPnJ_7YzpOyP--rycQqFvOoaap8jeP9QPPg"),
    bannerUrl: banner("cKAfWrVsuMQ7IAYwFdfn9_Qjste7An6_ZP1gZllnOCK-4P8pc6cqg99PxaypOnGpCb74vDxC-dufPNb-sMYp1Q"),
    gradientFrom: "#34d399",
    gradientTo: "#065f46",
  },
  {
    id: "compass",
    name: "Compass",
    subtitle: "GPS direction finder",
    packageId: "com.istack.compass.app",
    category: "Utilities",
    iconUrl: icon("PoXqi96gquLKBmXSRWfn-iMWrwIjbPAGND0TVn7HcU9qYOexdRASVqvgpEdRb5r-nx5W3OTbDRIwzpOfbA40"),
    bannerUrl: banner("mjRfFAxg7tabmUMVMboNbdQd1z70LHpdW05zMZ-L9RaKUDkbSMr4hbpqV9d5jAKFVVRO8ajddPaKquO5gd0OpQ"),
    gradientFrom: "#2dd4bf",
    gradientTo: "#0f766e",
  },
  {
    id: "live-earth",
    name: "Live Earth Map",
    subtitle: "Satellite GPS & world map",
    packageId: "com.istack.live.earth",
    category: "Utilities",
    iconUrl: icon("mGIlFgmcnUKocXubhVfQHKD0OW4pinZaCIcHY_tJPs3retrS7kg8ZKAzQxWBrigoFlWjtuqDiahgy0weD4xZ"),
    bannerUrl: banner("qQ6lrE_Jl9o8-APetsjwptdkgcCTS8auz-6vYKG_CmQcIZNqhEISfqOo_nQdc8Toi_1rAnxT6iT9JAN6lsHhpw"),
    gradientFrom: "#60a5fa",
    gradientTo: "#1d4ed8",
  },
  /* ─── Personalization ───────────────────────────────────── */
  {
    id: "watch-faces",
    name: "Watch Faces",
    subtitle: "Minimal Wear OS designs",
    packageId: "com.istack.minimal_watch_faces",
    category: "Personalization",
    iconUrl: icon("sqj317PAPiZQsEggI8IUankYxtOccNnHBg5qfUIjBAnRE643n4K7yedfe0gKrYhVbFBDGjhDXN9il3j361rK"),
    bannerUrl: banner("Ofu5Lvh7H76dwIbMfBNn2CQVeVYx8fCR2WzecrOcL-6yg3iPpbCC1DK6VWaIYBXGR0MYLWTknhsBsiAWemqjQQ"),
    gradientFrom: "#818cf8",
    gradientTo: "#3730a3",
  },
  {
    id: "funky-smiles",
    name: "Funky Smiles",
    subtitle: "Live wallpaper & animations",
    packageId: "com.istack.funky_smiles",
    category: "Personalization",
    iconUrl: icon("O2fevjZzWvkqQU7KLEAfUws_HQN5pCKbjOSAMqT6QXLuOCosFCC-iKGvUJCJL475HJ6ZlIyWT7yR8Q01n5heZw"),
    bannerUrl: banner("nvg9Cqt0dgtu1Al4aUBFcaWI5PHhp1WbOIbJc2tRXReCWZHoSP_5FYL3r0papmD8lVChP5rrXTZ946cwsoNAA3Y"),
    gradientFrom: "#fb7185",
    gradientTo: "#be185d",
  },
  {
    id: "kawaii-wallpaper",
    name: "Kawaii Wallpaper",
    subtitle: "Aesthetic HD backgrounds",
    packageId: "com.istack.wallpaper_kawaii",
    category: "Personalization",
    iconUrl: icon("JXpyCU4ECgfmnAnFtKc4VTrEP3f1Iud4lu-UHJP8HADe_JM46VYddT-UER_CjSA025xY6-_vvJnxSuAf2H8_SRw"),
    bannerUrl: banner("Uo44SYdrAAagrSybAtgAX4CPmLWHT-AnDiw33yefNTc5cd-IjkaJ--nYfGS8r83EfVYDw5S5QbzZR9gTQzQy"),
    gradientFrom: "#f9a8d4",
    gradientTo: "#db2777",
  },
  {
    id: "birthday-cards",
    name: "Birthday Cards",
    subtitle: "Maker, wishes & animated GIFs",
    packageId: "com.istack.birthday_greetings",
    category: "Personalization",
    iconUrl: icon("3Ts8SVsLLY4COQnRH8Y1X0wwxPtVzfwujFNatM9bq7NjMt_3Wfto2upnY0MiJMBIAKEIMkdbCE2_IkpaBHjRjw"),
    bannerUrl: banner("utnrUK7SsT63t66n4fNPAcjwGFWuxVyhwu64dt7jbgmIcyv2nznpiXY6hfgpPdXoIKlztKMUsMEL1roOY4faYg"),
    gradientFrom: "#fde68a",
    gradientTo: "#b45309",
  },
  {
    id: "wedding-invitation",
    name: "Wedding Invitation",
    subtitle: "Card maker & designer",
    packageId: "com.istack.wedding_invitation_maker",
    category: "Personalization",
    iconUrl: icon("WUs33odhmbPakR-TXiDBv65qwPYfeBCHSwtroOTBGi0xbJAreRKSzengdfxG1Kupc2sXCQ4RHAT7-LuO9JgPgc4"),
    bannerUrl: banner("NZ1cg8Y1mWU6uCmxX5WS85iwWw0wQXN39ZD4bgDQ-Ohv4r-KNVIagbEJ2cjoDeZkSUbt7xVEYUDOvND8qwdRa0k"),
    gradientFrom: "#f9a8d4",
    gradientTo: "#9d174d",
  },
  {
    id: "smart-clock",
    name: "Neon Clock",
    subtitle: "Live wallpaper & clock widget",
    packageId: "com.istack.smart_clock",
    category: "Personalization",
    iconUrl: icon("afvJP7yGE4k8zgZrxU-2otVZ6anFYPLd48--u41BxVohtWyHQ6pQ0qpjrdFRxHWNA5HFvUMAAVB43znG_wRJig"),
    bannerUrl: banner("88lGRCYcRyrJReaCBLekeJXriar7b70yOAiXxdCtVFhLHsVowU27jNbDMfXW-kCecNeqghUUC3qiYo7tJNq5VJs"),
    gradientFrom: "#818cf8",
    gradientTo: "#6d28d9",
  },
  {
    id: "edge-lighting",
    name: "Edge Lighting",
    subtitle: "Live wallpaper & border glow",
    packageId: "com.istack.edge_lighting",
    category: "Personalization",
    iconUrl: icon("yh4Lkujg6n_IdDU99az9wwNIw4uUx80lZo1098JJQeD9_idi9gmRqaLSQKmFpU9RJS_q3-ePA5Pcd58awUTJ2SI"),
    bannerUrl: banner("0DT9x7-4rNHqKAWFKtCfGtM8hSSgqPFQApC0NESqp0dgivqfhiZjZtbxRDeG69cg0w2ehCuRVXyqq5shTYU2SDY"),
    gradientFrom: "#38bdf8",
    gradientTo: "#7c3aed",
  },
  {
    id: "led-scroller",
    name: "LED Banner",
    subtitle: "Text scroller & marquee display",
    packageId: "com.istack.led_scroller",
    category: "Personalization",
    iconUrl: icon("zJt-WRI37ewrM7lSIzENIH4JQrFdca98CSNurNE9d-DRl5pU1TNNoQd3jDOfFlTmdZk87YB-cgchEMkZRxa1Ww"),
    bannerUrl: banner("equWpQDNURMh_6HEi4Yx0HbQBjQF6tKCDoSB6nJpb7FjpUJnTElbHpWUsWKHkvQUXgt4x7u-zebOPCbKh2Lc5A"),
    gradientFrom: "#fbbf24",
    gradientTo: "#dc2626",
  },
  {
    id: "house-design",
    name: "Home Design 3D",
    subtitle: "Floor plan & interior designer",
    packageId: "com.istack.house_design_plan_3d",
    category: "Personalization",
    iconUrl: icon("jkQEwytiQD0-ztDCSiR4IYwDbIxCo3aut5AIjSXQTs4tfWbOW11ACxfm-rf9NsS-uRkXfpfEQTplQ2JGIQgamw"),
    bannerUrl: banner("caFJSVDlkKPVg_terDyQHpBE7X0arYXdlUe0SK4B11oqHQHZDUJxYm9kx8W1yOgcG-e0XHfcaNYdVNqHh_xKfA"),
    gradientFrom: "#fb923c",
    gradientTo: "#7c2d12",
  },
  {
    id: "voice-commands",
    name: "Voice Commands",
    subtitle: "Voice assistant & automation",
    packageId: "ru.commands.voice.assistant",
    category: "Utilities",
    iconUrl: icon("VzHWA4un_cvRs6GmaXjwhvJrbhT3ym5sIIXRS5JGQXbfsuCltKBq8pgtdfcek5O0DThEeT-gmtWVWb-Oizo9Wg"),
    bannerUrl: banner("xeixfZmNT-wxFuTCEEK6wEvsO0JmyTsBJIB65fZ_Av4I60Lqbde7C-XKgfnqXRgUEP557pZqr0ll8ZjItxDEcQ"),
    gradientFrom: "#94a3b8",
    gradientTo: "#1e293b",
  },
  /* ─── iOS Apps ────────────────────────────────────────── */
  {
    id: "blood-pressure-diary",
    name: "Blood Pressure Diary: BP Log",
    subtitle: "Glucose, SpO2 & Heart Rate Log",
    packageId: "com.appx.bptracker",
    appStoreId: "6765660918",
    platform: "ios",
    category: "Health",
    iconUrl: "/app-icons/com.appx.bptracker.jpg",
    bannerUrl: "/app-icons/com.appx.bptracker.jpg",
    gradientFrom: "#ef4444",
    gradientTo: "#7f1d1d",
    featured: true,
  },
  {
    id: "period-tracker",
    name: "Period Tracker & Cycle Diary",
    subtitle: "Ovulation & Fertility Tracker",
    packageId: "ios.appx.periodtracker",
    appStoreId: "6765661587",
    platform: "ios",
    category: "Health",
    iconUrl: "/app-icons/ios.appx.periodtracker.jpg",
    bannerUrl: "/app-icons/ios.appx.periodtracker.jpg",
    gradientFrom: "#f472b6",
    gradientTo: "#be185d",
    featured: true,
  },
  {
    id: "ontario-g1-test",
    name: "Ontario G1 Practice Test 2026",
    subtitle: "G1 Driver Exam - MTO Simulator",
    packageId: "ios.appx.g1.ontario",
    appStoreId: "6765660407",
    platform: "ios",
    category: "Education",
    iconUrl: "/app-icons/ios.appx.g1.ontario.jpg",
    bannerUrl: "/app-icons/ios.appx.g1.ontario.jpg",
    gradientFrom: "#38bdf8",
    gradientTo: "#1d4ed8",
    featured: true,
  },
  {
    id: "electrician-calc",
    name: "Electrician Calc & Reference",
    subtitle: "Offline NEC & Wiring Guide",
    packageId: "ios.appx.electricianhandbook",
    appStoreId: "6765661973",
    platform: "ios",
    category: "Utilities",
    iconUrl: "/app-icons/ios.appx.electricianhandbook.jpg",
    bannerUrl: "/app-icons/ios.appx.electricianhandbook.jpg",
    gradientFrom: "#f59e0b",
    gradientTo: "#854d0e",
    featured: true,
  },
  {
    id: "lgv-theory-test",
    name: "LGV Theory Test: 4 in 1 Kit UK",
    subtitle: "DVSA Mock Test & Hazard Clips",
    packageId: "ios.appx.lgvhgv",
    appStoreId: "6765661241",
    platform: "ios",
    category: "Education",
    iconUrl: "/app-icons/ios.appx.lgvhgv.jpg",
    bannerUrl: "/app-icons/ios.appx.lgvhgv.jpg",
    gradientFrom: "#fb7185",
    gradientTo: "#9f1239",
    featured: true,
  },
  {
    id: "teleprompter",
    name: "Teleprompter: Script for Video",
    subtitle: "Script Reader & Voice Prompter",
    packageId: "ios.appx.teleprompter",
    appStoreId: "6765661790",
    platform: "ios",
    category: "Utilities",
    iconUrl: "/app-icons/ios.appx.teleprompter.jpg",
    bannerUrl: "/app-icons/ios.appx.teleprompter.jpg",
    gradientFrom: "#6366f1",
    gradientTo: "#312e81",
    featured: true,
  },
  {
    id: "dmv-practice-test",
    name: "DMV Practice Test 2026 - CDL",
    subtitle: "Driver License - Written Exam",
    packageId: "ios.appx.dmv.practice.test",
    appStoreId: "6765659835",
    platform: "ios",
    category: "Education",
    iconUrl: "/app-icons/ios.appx.dmv.practice.test.jpg",
    bannerUrl: "/app-icons/ios.appx.dmv.practice.test.jpg",
    gradientFrom: "#22c55e",
    gradientTo: "#166534",
    featured: true,
  },
  {
    id: "ai-tanning",
    name: "Tanning UV Index - Sun Tracker",
    subtitle: "Sunburn Timer, Vitamin D & SPF",
    packageId: "ios.appx.sunglow.uv.index",
    appStoreId: "6746761686",
    appStoreSlug: "tanning-uv-index-sun-tracker",
    platform: "ios",
    category: "Health",
    iconUrl: "/app-icons/ios.appx.sunglow.uv.index.jpg",
    bannerUrl: "/app-icons/ios.appx.sunglow.uv.index.jpg",
    gradientFrom: "#f59e0b",
    gradientTo: "#d97706",
  },
  {
    id: "tcg-scanner",
    name: "TCG Scanner: Value Tracker",
    subtitle: "Scan Cards & Track Value",
    packageId: "ios.appx.tcg.card.value.scanner",
    appStoreId: "6752676234",
    platform: "ios",
    category: "Utilities",
    iconUrl: "/app-icons/ios.appx.tcg.card.value.scanner.jpg",
    bannerUrl: "/app-icons/ios.appx.tcg.card.value.scanner.jpg",
    gradientFrom: "#3b82f6",
    gradientTo: "#1d4ed8",
  },
  {
    id: "hair-cut",
    name: "Hair Cut - Color Changer",
    subtitle: "AI hairstyle try-on",
    packageId: "ios.hair.color.changer.appx",
    appStoreId: "6752723064",
    platform: "ios",
    category: "Photography",
    iconUrl: "/app-icons/ios.hair.color.changer.appx.jpg",
    bannerUrl: "/app-icons/ios.hair.color.changer.appx.jpg",
    gradientFrom: "#ec4899",
    gradientTo: "#be185d",
    featured: true,
  },
  {
    id: "math-ai",
    name: "Math AI",
    subtitle: "Photo math solver & homework helper",
    packageId: "ios.appx.math.solver.ai",
    appStoreId: "6756818053",
    platform: "ios",
    category: "Education",
    iconUrl: "/app-icons/ios.appx.math.solver.ai.jpg",
    bannerUrl: "/app-icons/ios.appx.math.solver.ai.jpg",
    gradientFrom: "#8b5cf6",
    gradientTo: "#6d28d9",
  },
  {
    id: "gimin",
    name: "Gimin - AI Photo Editor",
    subtitle: "Create polaroid-style images",
    packageId: "ios.appx.nano.banana.image",
    appStoreId: "6751965282",
    platform: "ios",
    category: "Photography",
    iconUrl: "/app-icons/ios.appx.nano.banana.image.jpg",
    bannerUrl: "/app-icons/ios.appx.nano.banana.image.jpg",
    gradientFrom: "#f472b6",
    gradientTo: "#db2777",
    featured: true,
  },
  {
    id: "transparency",
    name: "Transparency: Magic Eraser",
    subtitle: "Remove background with AI",
    packageId: "ios.appx.background.remover",
    appStoreId: "6751505697",
    platform: "ios",
    category: "Photography",
    iconUrl: "/app-icons/ios.appx.background.remover.jpg",
    bannerUrl: "/app-icons/ios.appx.background.remover.jpg",
    gradientFrom: "#06b6d4",
    gradientTo: "#0891b2",
  },
  {
    id: "currency-converter",
    name: "Currency Converter & Calc",
    subtitle: "Exchange conversion calculator",
    packageId: "ios.appx.currency.converter",
    appStoreId: "6746950991",
    platform: "ios",
    category: "Utilities",
    iconUrl: "/app-icons/ios.appx.currency.converter.jpg",
    bannerUrl: "/app-icons/ios.appx.currency.converter.jpg",
    gradientFrom: "#10b981",
    gradientTo: "#059669",
  },
];

export const APPS: App[] = REMOTE_APPS.map((app) => {
  const platform = app.platform ?? "android";
  const seo = SEO_APP_DATA[app.id] ?? {
    seoCategory: "utilities" as SeoCategory,
    primary_keyword: app.name.toLowerCase(),
    secondary_keywords: [],
    features: [],
    faq: [],
    competitors: [],
  };

  const short_description =
    PLAY_STORE_METADATA[app.packageId]?.shortDescription ??
    APP_DESCRIPTIONS[app.packageId] ??
    app.subtitle;

  const long_description =
    PLAY_STORE_FULL_DESCRIPTIONS[app.packageId] ??
    buildFallbackLongDescription(app, seo, short_description);

  return {
    ...app,
    platform,
    description: long_description,
    short_description,
    long_description,
    ...seo,
    playStoreShortDescription: PLAY_STORE_METADATA[app.packageId]?.shortDescription,
    playStoreUpdatedOn: PLAY_STORE_METADATA[app.packageId]?.updatedOn,
    playStoreInstalls: PLAY_STORE_METADATA[app.packageId]?.installs,
    playStoreCategory: PLAY_STORE_METADATA[app.packageId]?.category,
    playStoreContentRating: PLAY_STORE_METADATA[app.packageId]?.contentRating,
    playStoreWhatsNew: PLAY_STORE_METADATA[app.packageId]?.whatsNew,
    iconUrl: LOCAL_ICON_MAP[app.packageId] ?? app.iconUrl,
    bannerUrl: LOCAL_BANNER_MAP[app.packageId] ?? app.bannerUrl,
    screenshots: LOCAL_SCREENSHOT_MAP[app.packageId],
  };
});

export const FEATURED_APPS = APPS.filter((app) => app.featured);

export function getAppBySlug(slug: string) {
  return APPS.find((app) => app.id === slug);
}
