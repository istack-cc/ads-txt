export interface HowToStep {
  name: string;
  text: string;
  image?: string;
}

export interface HowToArticle {
  slug: string;
  title: string;
  description: string;
  app_id: string;
  steps: HowToStep[];
  faq?: Array<{ question: string; answer: string }>;
  last_updated: string;
}

export const HOW_TO_ARTICLES: HowToArticle[] = [
  {
    slug: "how-to-scan-documents-with-pdf-scanner",
    title: "How to scan documents with PDF Scanner",
    description:
      "PDF Scanner turns your Android camera into a portable document scanner. In a few taps you can scan paper documents, receipts, and forms into clean, shareable PDFs — no account needed, no subscription required.",
    app_id: "pdf-scanner",
    steps: [
      {
        name: "Download PDF Scanner for free",
        text: 'Search for "PDF Scanner" on Google Play or tap the install button on this page. The app is completely free with no account required.',
      },
      {
        name: "Point your camera at the document",
        text: "Open the app and tap the scan button. Hold your phone steadily over the document — the scanner auto-detects edges and corrects perspective automatically. Tap the shutter when the document fills the frame.",
      },
      {
        name: "Review and crop the scan",
        text: "After capturing, drag the corner handles to fine-tune the crop area. Adjust brightness or apply a black-and-white filter for cleaner text scans.",
      },
      {
        name: "Save or share the PDF",
        text: "Tap Save as PDF. The file saves to your device. Share directly via email, WhatsApp, Google Drive, or any other app on your phone.",
      },
    ],
    faq: [
      {
        question: "Is PDF Scanner free?",
        answer: "Yes, PDF Scanner is completely free to download on Google Play. It is ad-supported with no paywalls or subscription tiers.",
      },
      {
        question: "Can PDF Scanner do OCR?",
        answer: "Yes, PDF Scanner includes OCR (optical character recognition) to extract text from scanned documents, making them searchable and copy-pasteable.",
      },
      {
        question: "What file formats does PDF Scanner support?",
        answer: "PDF Scanner saves scans as PDF files. It can also convert existing images (JPG, PNG) from your gallery into PDF format.",
      },
    ],
    last_updated: "April 19, 2026",
  },

  {
    slug: "how-to-use-cool-fonts-on-instagram-with-font-generator",
    title: "How to use cool fonts on Instagram with Font Generator",
    description:
      "Font Generator creates stylish, decorative text that you can copy and paste into any app — Instagram bios, WhatsApp status, Twitter, or anywhere else. No special keyboard or app permissions needed.",
    app_id: "font-generator",
    steps: [
      {
        name: "Download Font Generator",
        text: 'Install Font Generator from Google Play — it\'s free. No account required. Search "Font Generator iStack" to find the right app.',
      },
      {
        name: "Type your text",
        text: "Open the app and tap the text field at the top. Type the word, name, or phrase you want to style — for example your Instagram username or a bio line.",
      },
      {
        name: "Browse and pick a font style",
        text: "Scroll through the list of generated styles. Each line shows your text in a different decorative Unicode font — bold, italic, cursive, bubble letters, and more. Tap any style to select it.",
      },
      {
        name: "Copy and paste",
        text: "Tap the Copy button. Then open Instagram (or any other app), tap into the bio or caption field, and paste. The styled text works on any platform that supports Unicode.",
      },
    ],
    faq: [
      {
        question: "Why does Font Generator work on Instagram without a special keyboard?",
        answer: "Font Generator uses Unicode characters that look like different fonts but are actually standard text symbols. Any app that accepts text input will display them — no special permissions needed.",
      },
      {
        question: "Will the fonts look the same on every phone?",
        answer: "The characters are Unicode standard, so they display on all modern devices. Older devices may show some characters as boxes if they lack the required Unicode support.",
      },
      {
        question: "Does Font Generator work for WhatsApp?",
        answer: "Yes. Copy the styled text from Font Generator and paste it into any WhatsApp message, status, or display name.",
      },
    ],
    last_updated: "April 19, 2026",
  },

  {
    slug: "how-to-start-a-home-workout-routine-no-equipment",
    title: "How to start a home workout routine with no equipment",
    description:
      "Home Workout delivers structured, no-equipment fitness routines for beginners through advanced athletes. You can start a full-body training plan in under two minutes — no gym membership, no gear required.",
    app_id: "home-workout",
    steps: [
      {
        name: "Download Home Workout",
        text: "Install Home Workout from Google Play. It is completely free. Open the app — no account or sign-in is required to start training.",
      },
      {
        name: "Choose your fitness goal",
        text: "Select your goal from the home screen: lose weight, build muscle, improve endurance, or stay active. The app generates a personalized plan based on your selection.",
      },
      {
        name: "Pick a workout and start",
        text: "Browse the routine list and tap any workout to begin. Each exercise includes an animated demonstration with clear instructions on form and breathing. Rest timers run automatically between sets.",
      },
      {
        name: "Track your progress",
        text: "After completing a session, mark it done. Home Workout tracks your completed workouts, total reps, and training streaks over time so you can see improvement week by week.",
      },
    ],
    faq: [
      {
        question: "Do I need any equipment for Home Workout?",
        answer: "No. Every routine in Home Workout uses only your bodyweight — squats, push-ups, planks, lunges, and similar movements that require no dumbbells or machines.",
      },
      {
        question: "Is Home Workout suitable for beginners?",
        answer: "Yes. The app includes beginner-friendly routines with low intensity and clear form guides. You can progress to harder workouts as your fitness improves.",
      },
      {
        question: "How long are the workouts?",
        answer: "Most workouts range from 10 to 30 minutes. You can choose shorter sessions for busy days or longer ones for a full training block.",
      },
    ],
    last_updated: "April 19, 2026",
  },

  {
    slug: "how-to-track-daily-steps-with-step-counter",
    title: "How to track your daily steps with Step Counter",
    description:
      "Step Counter uses your phone's built-in pedometer sensor to count every step you take throughout the day. No wearable needed — just carry your phone and let the app do the work.",
    app_id: "step-counter",
    steps: [
      {
        name: "Install Step Counter",
        text: "Download Step Counter from Google Play for free. Open the app and grant the physical activity permission when prompted — this allows the app to read your phone's step sensor.",
      },
      {
        name: "Set your daily goal",
        text: "Tap the goal icon and enter your target steps for the day. The default goal is 10,000 steps, but you can adjust it up or down based on your fitness level.",
      },
      {
        name: "Carry your phone and walk",
        text: "Put your phone in your pocket, bag, or hand. Step Counter runs in the background and counts your steps automatically throughout the day. No manual logging needed.",
      },
      {
        name: "Review your stats",
        text: "Open the app anytime to see your step count, distance walked, calories burned, and active time for the day. The weekly chart shows your 7-day trend at a glance.",
      },
    ],
    faq: [
      {
        question: "Does Step Counter drain the battery?",
        answer: "Step Counter uses the hardware step sensor chip in your phone, which is extremely power-efficient. Battery impact is negligible — typically less than 1% per day.",
      },
      {
        question: "Does Step Counter work with Google Fit?",
        answer: "Step Counter operates independently using your device's built-in sensor. It does not require Google Fit or any wearable device.",
      },
      {
        question: "Is Step Counter accurate?",
        answer: "Accuracy depends on your phone's pedometer sensor quality. Most modern Android phones have accurate step detection within a 2-5% margin. Carrying your phone in your pocket gives the best results.",
      },
    ],
    last_updated: "April 19, 2026",
  },

  {
    slug: "how-to-translate-voice-in-real-time-with-translate-app",
    title: "How to translate voice in real time with Translate",
    description:
      "Translate supports real-time voice translation between dozens of languages. Speak naturally into your phone and hear the translation instantly — useful for travel, meetings, and everyday multilingual conversations.",
    app_id: "translate",
    steps: [
      {
        name: "Download Translate",
        text: 'Install Translate from Google Play. It is free. Open the app and grant microphone permission when prompted so voice translation can work.',
      },
      {
        name: "Select your languages",
        text: "Tap the language dropdowns at the top of the screen. Choose your source language (the language you will speak) and the target language (the language you want to hear the translation in).",
      },
      {
        name: "Tap the microphone and speak",
        text: "Press and hold the microphone button, then speak clearly into your phone. Release when you have finished speaking. The app processes your speech and displays the translation text on screen.",
      },
      {
        name: "Hear the translation",
        text: "Tap the speaker icon next to the translated text to hear it spoken aloud. You can show the screen to the other person or play the audio through your phone speaker.",
      },
    ],
    faq: [
      {
        question: "How many languages does Translate support?",
        answer: "Translate supports dozens of the most widely spoken languages including English, Spanish, French, German, Arabic, Chinese, Japanese, Portuguese, and more.",
      },
      {
        question: "Does Translate work offline?",
        answer: "Voice translation requires an internet connection. Text translation for some language pairs may work offline with a previously cached model.",
      },
      {
        question: "Can Translate scan text from a photo?",
        answer: "Yes. Tap the camera icon to open the scan mode. Point your camera at any sign, menu, or printed text and the app will recognize and translate it instantly.",
      },
    ],
    last_updated: "April 19, 2026",
  },

  {
    slug: "how-to-sign-a-pdf-on-android-with-signature-maker",
    title: "How to sign a PDF on Android with Signature Maker",
    description:
      "Signature Maker lets you draw a digital signature on your screen and apply it directly to PDF documents on Android. The whole process takes under a minute — no printing or scanning required.",
    app_id: "signature-maker",
    steps: [
      {
        name: "Download Signature Maker",
        text: "Install Signature Maker from Google Play. It is free. No account, no cloud upload — everything stays on your device.",
      },
      {
        name: "Create your digital signature",
        text: "Tap Create Signature. Use your finger to draw your signature on the pad. Draw slowly for better accuracy. You can clear and redraw as many times as you need until it looks right.",
      },
      {
        name: "Import the PDF you want to sign",
        text: "Tap Import PDF and select the file from your device storage, email attachment, or cloud storage. The PDF opens in the signature editor.",
      },
      {
        name: "Place the signature and save",
        text: "Drag your signature to the correct position on the document. Resize it by pinching if needed. Tap Save to export the signed PDF back to your device.",
      },
    ],
    faq: [
      {
        question: "Are digital signatures from Signature Maker legally valid?",
        answer: "A digital signature drawn with Signature Maker is functionally equivalent to a wet signature for most personal and informal documents. For legally binding contracts, check your jurisdiction's requirements — some may require a certified electronic signature service.",
      },
      {
        question: "Does Signature Maker upload my documents to a server?",
        answer: "No. All processing happens on your device. Your PDF and signature are never uploaded to any server.",
      },
      {
        question: "Can I save my signature and reuse it?",
        answer: "Yes. Once you create a signature, Signature Maker saves it so you can apply it to future documents without drawing it again.",
      },
    ],
    last_updated: "April 19, 2026",
  },

  {
    slug: "how-to-eject-water-from-phone-speaker-with-speaker-cleaner",
    title: "How to eject water from your phone speaker with Speaker Cleaner",
    description:
      "Speaker Cleaner plays precisely calibrated sound frequencies through your phone speaker to push out trapped water droplets. It works within seconds and can restore muffled audio after rain, splashes, or submersion.",
    app_id: "speaker-cleaner",
    steps: [
      {
        name: "Download Speaker Cleaner",
        text: "Install Speaker Cleaner from Google Play. It is free. Open the app immediately after your phone gets wet — the sooner you clean, the better.",
      },
      {
        name: "Turn your phone speaker-side down",
        text: "Hold your phone with the speaker grille facing downward so gravity helps the water escape as the sound frequencies push it out.",
      },
      {
        name: "Tap the clean button",
        text: "Tap Start Cleaning. The app plays a series of low-frequency sound waves through the speaker for 10-30 seconds. You may see small droplets of water exit the grille during this process.",
      },
      {
        name: "Repeat if needed and let it dry",
        text: "Run one to three cleaning cycles until the sound returns to normal clarity. Leave the phone in a dry place for a few minutes before playing media to let any remaining moisture evaporate.",
      },
    ],
    faq: [
      {
        question: "How does Speaker Cleaner actually work?",
        answer: "Speaker Cleaner plays low-frequency sound waves that cause the speaker membrane to vibrate rapidly. This vibration pushes trapped water droplets out through the speaker grille — the same technique used in the Apple Watch water lock feature.",
      },
      {
        question: "Will this work after dropping my phone in water?",
        answer: "Speaker Cleaner can help remove surface water from the speaker grille. For significant water submersion, let the phone dry for 24 hours and use Speaker Cleaner as a supplementary step, not a replacement for full drying.",
      },
      {
        question: "Can I use Speaker Cleaner to clean the earpiece too?",
        answer: "Yes. Switch the output to the earpiece in the app settings and run a cleaning cycle for the top speaker as well.",
      },
    ],
    last_updated: "April 19, 2026",
  },

  {
    slug: "how-to-make-a-photo-collage-on-android",
    title: "How to make a photo collage on Android with Photo Collage",
    description:
      "Photo Collage lets you combine multiple photos into a single image using grid layouts, frames, and stickers. Create shareable collages for Instagram, WhatsApp, or printing in under a minute.",
    app_id: "photo-collage",
    steps: [
      {
        name: "Download Photo Collage",
        text: "Install Photo Collage from Google Play for free. Open the app and tap Create Collage to begin.",
      },
      {
        name: "Select your photos",
        text: "Tap the photo slots to add pictures from your gallery. You can add 2 to 9 photos depending on the layout you choose. Pinch or drag within each slot to zoom and reposition the photo.",
      },
      {
        name: "Choose a layout and customize",
        text: "Swipe through the layout options at the bottom to find a grid style that fits your photos. Adjust border thickness, corner rounding, and background color using the style controls.",
      },
      {
        name: "Add stickers or text, then save",
        text: "Optionally add stickers, emoji, or text labels. Tap Save to export the finished collage to your camera roll at full resolution, ready to share.",
      },
    ],
    faq: [
      {
        question: "What is the maximum number of photos in a collage?",
        answer: "Photo Collage supports layouts with up to 9 photos in a single collage. For larger groups of photos, create multiple collages.",
      },
      {
        question: "What resolution does Photo Collage export at?",
        answer: "The app exports at high resolution suitable for printing and social media. The exact output resolution depends on the resolution of your source photos.",
      },
      {
        question: "Can I use Photo Collage for Instagram Stories?",
        answer: "Yes. Select a portrait-orientation layout (9:16 ratio) from the templates to create a collage sized for Instagram Stories or TikTok.",
      },
    ],
    last_updated: "April 19, 2026",
  },
];

export function getHowToBySlug(slug: string): HowToArticle | undefined {
  return HOW_TO_ARTICLES.find((a) => a.slug === slug);
}
