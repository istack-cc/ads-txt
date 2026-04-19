export interface PlayStoreMetadata {
  shortDescription: string;
  updatedOn: string;
  installs: string;
  category: string;
  contentRating: string;
  whatsNew?: string;
}

export const PLAY_STORE_METADATA: Record<string, PlayStoreMetadata> = {
  "com.istack.sweet_camera": {
    shortDescription:
      "Selfie camera with beauty filter, photo editor, stickers & sweet beauty effects.",
    updatedOn: "Apr 1, 2026",
    installs: "1+",
    category: "Photography",
    contentRating: "Everyone",
  },
  "com.istack.photo_collage": {
    shortDescription:
      "Make photo grids & collages with filters, stickers, text & custom frames.",
    updatedOn: "Apr 1, 2026",
    installs: "0+",
    category: "Photography",
    contentRating: "Everyone",
  },
  "com.istack.time_warp_scan": {
    shortDescription: "Create surreal time warp scan effects with a single tap.",
    updatedOn: "Apr 4, 2026",
    installs: "0+",
    category: "Photography",
    contentRating: "Everyone",
  },
  "com.istack.photo_lock": {
    shortDescription:
      "Hide photos & videos behind a secret calculator vault. AES encrypted.",
    updatedOn: "Apr 1, 2026",
    installs: "1+",
    category: "Tools",
    contentRating: "Everyone",
  },
  "com.istack.gps.photo": {
    shortDescription:
      "Stamp GPS coordinates, address & map on photos. Geotag & organize by location.",
    updatedOn: "Mar 23, 2026",
    installs: "100+",
    category: "Photography",
    contentRating: "Everyone",
  },
  "com.istack.cut_and_paste_photos": {
    shortDescription:
      "Cut and paste photos, remove background & combine images - made simple.",
    updatedOn: "Mar 26, 2026",
    installs: "10+",
    category: "Photography",
    contentRating: "Everyone",
  },
  "com.istack.sticker_maker": {
    shortDescription:
      "Turn photos into custom stickers. Remove background, add text & emoji overlays.",
    updatedOn: "Mar 26, 2026",
    installs: "1+",
    category: "Communication",
    contentRating: "Everyone",
  },
  "com.istack.word.reader": {
    shortDescription:
      "Open DOC, DOCX & PDF files. Fast document viewer, word reader & file manager.",
    updatedOn: "Mar 14, 2026",
    installs: "50+",
    category: "Productivity",
    contentRating: "Everyone",
  },
  "com.istack.office.reader": {
    shortDescription:
      "Open PDF, DOCX, XLSX, PPTX & all documents. File viewer + manager offline.",
    updatedOn: "Mar 22, 2026",
    installs: "10+",
    category: "Productivity",
    contentRating: "Everyone",
    whatsNew: "Bug Fixes",
  },
  "com.istack.img2.pdf": {
    shortDescription:
      "Scan documents, convert photo to PDF, extract text with OCR - all offline.",
    updatedOn: "Mar 17, 2026",
    installs: "5+",
    category: "Productivity",
    contentRating: "Everyone",
  },
  "com.istack.sigature.app": {
    shortDescription:
      "Create digital signature, sign PDF docs and photos. Esign maker, document signer",
    updatedOn: "Mar 19, 2026",
    installs: "10+",
    category: "Productivity",
    contentRating: "Everyone",
  },
  "com.istack.artfonts": {
    shortDescription: "Font changer: fancy text, cool fonts, symbols & text art.",
    updatedOn: "Mar 24, 2026",
    installs: "50+",
    category: "Tools",
    contentRating: "Everyone",
  },
  "com.istack.speakandtranslate": {
    shortDescription:
      "Real-time voice, camera & text translation. 50+ languages.",
    updatedOn: "Mar 16, 2026",
    installs: "1+",
    category: "Productivity",
    contentRating: "Everyone",
  },
  "com.istack.home_workout": {
    shortDescription:
      "Build muscle & burn fat with guided home workouts. No gym needed.",
    updatedOn: "Apr 1, 2026",
    installs: "1+",
    category: "Health & Fitness",
    contentRating: "Everyone",
  },
  "com.istack.step_tracker": {
    shortDescription:
      "Track daily steps, walking distance & activity with accurate pedometer.",
    updatedOn: "Mar 31, 2026",
    installs: "0+",
    category: "Health & Fitness",
    contentRating: "Everyone",
  },
  "com.istack.wifi_speed_test": {
    shortDescription: "Test internet speed - download, upload & ping instantly.",
    updatedOn: "Apr 1, 2026",
    installs: "0+",
    category: "Tools",
    contentRating: "Everyone",
  },
  "com.istack.nfc.wallet": {
    shortDescription:
      "Scan NFC cards, read EMV data & validate card numbers with IBAN checker.",
    updatedOn: "Mar 24, 2026",
    installs: "10+",
    category: "Finance",
    contentRating: "Everyone",
  },
  "com.istack.speaker_cleaner": {
    shortDescription:
      "Remove water & dust from your speaker. Fix muffled sound with vibration waves.",
    updatedOn: "Mar 31, 2026",
    installs: "5+",
    category: "Tools",
    contentRating: "Everyone",
  },
  "com.istack.guitar_tuner": {
    shortDescription:
      "Guitar tuner with chromatic pitch detection and ear training built in.",
    updatedOn: "Mar 31, 2026",
    installs: "10+",
    category: "Music & Audio",
    contentRating: "Everyone",
  },
  "com.istack.ar.meter": {
    shortDescription:
      "AR tape measure, ruler & room scanner. Measure distance, height & area.",
    updatedOn: "Apr 4, 2026",
    installs: "0+",
    category: "Tools",
    contentRating: "Everyone",
  },
  "com.istack.phone_mirror": {
    shortDescription:
      "Lighted phone mirror: zoom, freeze & selfie. Makeup & full-screen mirror app.",
    updatedOn: "Mar 24, 2026",
    installs: "5+",
    category: "Beauty",
    contentRating: "Everyone",
  },
  "com.istack.color_identification": {
    shortDescription:
      "Point camera at any color - get HEX, RGB, HSL codes and color names instantly.",
    updatedOn: "Mar 26, 2026",
    installs: "10+",
    category: "Tools",
    contentRating: "Everyone",
  },
  "com.istack.speedometer": {
    shortDescription:
      "GPS speedometer, odometer & speed tracker - offline mileage & trip log.",
    updatedOn: "Mar 26, 2026",
    installs: "10+",
    category: "Tools",
    contentRating: "Everyone",
  },
  "com.istack.screen_mirroring": {
    shortDescription:
      "Cast to TV & screen mirror. Miracast, DLNA & wireless display for your smart TV.",
    updatedOn: "Mar 24, 2026",
    installs: "50+",
    category: "Tools",
    contentRating: "Everyone",
  },
  "com.istack.hearing_from_distance": {
    shortDescription:
      "Turn your phone into a powerful hearing amplifier that captures surrounding audio and delivers it clearly to your headphones.",
    updatedOn: "Mar 27, 2026",
    installs: "5+",
    category: "Tools",
    contentRating: "Everyone",
  },
  "com.istack.compass.app": {
    shortDescription:
      "Navigate with confidence using a compass app that combines GPS direction finding with real-time sensor accuracy.",
    updatedOn: "Mar 17, 2026",
    installs: "10+",
    category: "Maps & Navigation",
    contentRating: "Everyone",
  },
  "com.istack.live.earth": {
    shortDescription:
      "Explore satellite maps, street view & GPS navigation worldwide.",
    updatedOn: "Mar 20, 2026",
    installs: "10+",
    category: "Maps & Navigation",
    contentRating: "Everyone",
  },
  "com.istack.minimal_watch_faces": {
    shortDescription:
      "Minimal watch faces with custom complications, battery sync & notifications.",
    updatedOn: "Mar 31, 2026",
    installs: "1+",
    category: "Personalization",
    contentRating: "Everyone",
  },
  "com.istack.funky_smiles": {
    shortDescription:
      "Animated wallpapers, smile themes - browse, preview, apply in one tap.",
    updatedOn: "Apr 1, 2026",
    installs: "0+",
    category: "Personalization",
    contentRating: "Everyone",
  },
  "com.istack.wallpaper_kawaii": {
    shortDescription:
      "Kawaii, girly & cute wallpapers in HD. Set lock screen or home screen instantly.",
    updatedOn: "Mar 31, 2026",
    installs: "10+",
    category: "Personalization",
    contentRating: "Everyone",
  },
  "com.istack.birthday_greetings": {
    shortDescription:
      "Create stunning birthday greeting cards in seconds - no design experience needed.",
    updatedOn: "Apr 1, 2026",
    installs: "1+",
    category: "Photography",
    contentRating: "Everyone",
  },
  "com.istack.wedding_invitation_maker": {
    shortDescription:
      "Design stunning wedding invitations in minutes with the most complete invitation card maker for Android.",
    updatedOn: "Mar 27, 2026",
    installs: "10+",
    category: "Art & Design",
    contentRating: "Everyone",
  },
  "com.istack.smart_clock": {
    shortDescription:
      "Clock wallpaper: digital clock, night clock, widget & live weather display.",
    updatedOn: "Mar 28, 2026",
    installs: "10+",
    category: "Tools",
    contentRating: "Everyone",
  },
  "com.istack.edge_lighting": {
    shortDescription:
      "Transform your screen with edge lighting that actually moves.",
    updatedOn: "Mar 25, 2026",
    installs: "10+",
    category: "Personalization",
    contentRating: "Everyone",
  },
  "com.istack.led_scroller": {
    shortDescription:
      "Make scrolling LED signs & live wallpapers. Set text, color, speed, direction.",
    updatedOn: "Mar 26, 2026",
    installs: "1+",
    category: "Tools",
    contentRating: "Everyone",
  },
  "com.istack.house_design_plan_3d": {
    shortDescription:
      "Design home in 2D & 3D. Draw floor plans, place furniture & save projects.",
    updatedOn: "Mar 26, 2026",
    installs: "1+",
    category: "Art & Design",
    contentRating: "Everyone",
  },
  "ru.commands.voice.assistant": {
    shortDescription:
      "Voice commands for Alice: calls, music, alarms, reminders.",
    updatedOn: "Sep 3, 2025",
    installs: "10K+",
    category: "Books & Reference",
    contentRating: "Everyone",
  },
};
