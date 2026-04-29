export interface GlossaryTerm {
  term: string;
  name: string;
  definition: string;
  category: string;
  related_apps?: string[];
  related_terms?: string[];
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: "ocr",
    name: "OCR (Optical Character Recognition)",
    definition:
      "OCR is a technology that converts images of typed, handwritten, or printed text into machine-readable text. In mobile apps, OCR lets you scan a document, receipt, or sign with your camera and extract the text so you can copy, edit, or search it. PDF Scanner uses OCR to make scanned documents searchable and editable without manual retyping.",
    category: "Productivity",
    related_apps: ["pdf-scanner", "document-reader"],
    related_terms: ["pdf", "document-scanner"],
  },

  {
    term: "pdf",
    name: "PDF (Portable Document Format)",
    definition:
      "PDF is a file format developed by Adobe that preserves the visual layout of a document regardless of the device, operating system, or software used to view it. PDFs are widely used for forms, contracts, invoices, and scanned documents because the formatting is fixed and cannot be accidentally changed. On Android, you can create PDFs by scanning paper documents or converting images using apps like PDF Scanner.",
    category: "Productivity",
    related_apps: ["pdf-scanner", "document-reader", "office-reader", "signature-maker"],
    related_terms: ["ocr", "digital-signature", "document-scanner"],
  },

  {
    term: "digital-signature",
    name: "Digital signature",
    definition:
      "A digital signature is an electronic mark used to authenticate the identity of the signer on a digital document. At its simplest, it is a drawn or typed representation of a handwritten signature applied to a PDF. More advanced digital signatures use cryptographic verification to prove the signer's identity and that the document has not been altered since signing. For everyday personal use on Android, Signature Maker lets you draw and apply a digital signature to any PDF in seconds.",
    category: "Productivity",
    related_apps: ["signature-maker", "pdf-scanner"],
    related_terms: ["pdf", "ocr"],
  },

  {
    term: "pedometer",
    name: "Pedometer",
    definition:
      "A pedometer is a device or sensor that counts the number of steps a person takes by detecting the motion of their body. Modern smartphones have a built-in hardware pedometer chip that consumes very little battery. Pedometer apps like Step Counter read this sensor and display your daily step count, distance walked, and calories burned. The term comes from the Latin 'pedis' (foot) and the Greek 'metron' (measure).",
    category: "Health",
    related_apps: ["step-counter"],
    related_terms: ["step-counter-vs-pedometer", "calorie-tracking"],
  },

  {
    term: "nfc",
    name: "NFC (Near Field Communication)",
    definition:
      "NFC is a short-range wireless technology that allows devices to exchange small amounts of data when held within a few centimeters of each other. On smartphones, NFC is used for contactless payments (like Google Pay), reading smart cards, exchanging contact information, and scanning NFC tags. NFC Card Reader uses your phone's NFC chip to read compatible bank cards and NFC tags, displaying the stored data on screen.",
    category: "Utilities",
    related_apps: ["nfc-card-reader"],
    related_terms: ["emv-card", "contactless-payment"],
  },

  {
    term: "background-removal",
    name: "Background removal",
    definition:
      "Background removal is the process of isolating the main subject of a photo — usually a person or object — and making the rest of the image transparent or replacing it with a different background. In mobile apps, AI-powered background removal automatically detects edges and removes the background in a single tap. Transparency: Magic Eraser uses on-device AI to remove backgrounds and export clean PNG cutouts for use in design, social media, or compositing.",
    category: "AI & Photo",
    related_apps: ["transparency", "cut-paste-photo"],
    related_terms: ["png", "photo-editing"],
  },

  {
    term: "unicode-fonts",
    name: "Unicode fonts",
    definition:
      "Unicode is an international text encoding standard that assigns a unique code point to every character in every writing system. Within Unicode, there are thousands of characters that visually resemble bold, italic, script, or decorative letters — allowing text to appear styled without requiring a special font to be installed on the reader's device. Font Generator apps use these Unicode character sets to create stylish text that you can copy and paste into Instagram bios, Twitter names, WhatsApp messages, and anywhere else that accepts plain text.",
    category: "Personalization",
    related_apps: ["font-generator"],
    related_terms: ["instagram-fonts", "fancy-text"],
  },

  {
    term: "live-wallpaper",
    name: "Live wallpaper",
    definition:
      "A live wallpaper is an animated or interactive background image used on a smartphone's home screen or lock screen instead of a static image. Live wallpapers use the device's GPU to render continuous animations, which can range from subtle particle effects to complex 3D scenes. They consume slightly more battery than static wallpapers but add personality to the phone's appearance. Apps like Funky Smiles and Neon Clock provide free live wallpapers for Android home screens.",
    category: "Personalization",
    related_apps: ["funky-smiles", "smart-clock", "kawaii-wallpaper"],
    related_terms: ["android-wallpaper", "home-screen"],
  },

  {
    term: "document-scanner",
    name: "Document scanner app",
    definition:
      "A document scanner app uses a smartphone camera to photograph paper documents and convert them into digital files — typically PDFs. The app uses image processing to detect the document edges, correct perspective distortion (so a photo taken at an angle looks flat and straight), and enhance contrast for readable text. Advanced scanner apps also include OCR to make the resulting file searchable. PDF Scanner is a free document scanner app for Android that combines all these features in a single, lightweight app.",
    category: "Productivity",
    related_apps: ["pdf-scanner"],
    related_terms: ["ocr", "pdf"],
  },

  {
    term: "calorie-tracking",
    name: "Calorie tracking",
    definition:
      "Calorie tracking is the practice of recording the energy content of food consumed and energy burned through physical activity to manage body weight. In fitness apps, calorie estimates are typically calculated from step count, distance walked, exercise duration, and the user's body weight. Home Workout and Step Counter both provide calorie burn estimates based on your workout intensity and daily movement, helping you understand your daily energy expenditure without manual food logging.",
    category: "Health",
    related_apps: ["home-workout", "step-counter"],
    related_terms: ["pedometer", "bodyweight-workout"],
  },

  {
    term: "bodyweight-workout",
    name: "Bodyweight workout",
    definition:
      "A bodyweight workout is a form of strength and conditioning exercise that uses only the weight of the trainee's own body as resistance — no dumbbells, barbells, or gym machines required. Common bodyweight exercises include push-ups, squats, lunges, planks, burpees, and pull-ups. Bodyweight training is accessible to anyone regardless of budget or location, making it ideal for home fitness. Home Workout is a free Android app with structured bodyweight training plans for all fitness levels.",
    category: "Health",
    related_apps: ["home-workout"],
    related_terms: ["calorie-tracking", "pedometer"],
  },

  {
    term: "ar-measurement",
    name: "AR measurement",
    definition:
      "AR (augmented reality) measurement uses a smartphone camera combined with software to estimate real-world distances, dimensions, and lengths by analyzing the camera feed. The app overlays measurement lines and values onto the live camera view. AR measurement apps like AR Measure can estimate room dimensions, object sizes, and distances without a physical tape measure, though they are best suited for quick estimates rather than precision measurements requiring sub-centimeter accuracy.",
    category: "Utilities",
    related_apps: ["ar-measure"],
    related_terms: ["augmented-reality"],
  },
];

export function getGlossaryByTerm(term: string): GlossaryTerm | undefined {
  return GLOSSARY_TERMS.find((t) => t.term === term);
}
