# Homepage 3D Product Museum Design

## Context

The current site is the default Next.js starter page. The redesign replaces it with a portfolio homepage where apps are presented as inspectable 3D software products. The user approved the visual direction named "Product Museum" in the local visual companion.

## Goals

- Present app products as real-time 3D objects in the browser, not flat screenshots.
- Use Three.js with `WebGLRenderer` and `GLTFLoader` for product rendering.
- Use Blender-authored packaging models exported as GLB/GLTF assets.
- Use GSAP for smooth idle rotation, hover scale, hover slow-down, and entrance choreography.
- Keep the homepage readable, performant, accessible, and responsive.

## Non-Goals

- Do not create a full CMS or dynamic backend.
- Do not build separate case-study pages in this pass.
- Do not use official third-party app store or franchise branding.
- Do not make the 3D scene so dominant that copy and navigation become hard to use.

## Visual Direction

The page uses a dark, premium product-gallery tone. The first viewport has a compact top navigation, a large headline on the left, and a real-time 3D product shelf on the right. The products are software-box packages with fictional app names and distinct color systems. The 3D packaging should look tangible: front face, spine depth, bevels, soft shadows, and studio lighting.

Approved first-viewport copy:

- Brand: `iStack App Foundry`
- Headline: `Apps presented as products you can inspect.`
- Supporting copy: `A real-time WebGL shelf where each app becomes a polished software package. Hover to slow the rotation, reveal the app's purpose, and open the case study.`
- Primary CTA: `Explore apps`
- Secondary CTA: `How it works`

## Information Architecture

1. Hero shelf: three primary app products rendered in a single WebGL scene.
2. Selected product strip: text details update when a product is hovered or focused.
3. App grid: additional product summaries with smaller live 3D package previews.
4. Build stack band: concise explanation of Blender, GLTF, Three.js, WebGL, and GSAP.
5. Contact footer: direct conversion area with a simple call to action.

## Product Set

Use fictional app products to avoid third-party IP risk:

- `FitFlow`: wellness tracking and habit coaching. Accent colors: teal and electric blue.
- `StoreOps`: app-store operations and listing workflow. Accent colors: white and cyan.
- `AdKit`: ad monetization and compliance workflow. Accent colors: amber and coral.
- `LaunchPad`: release planning and screenshot workflow. Accent colors: violet and lime.

## 3D Asset Contract

Create a Blender Python script in `tools/blender/create_product_models.py`. The script produces package models with:

- Front face with product name text.
- Visible spine depth.
- Rounded bevels.
- Simple material palette per product.
- A small base shadow catcher or contact plane if useful for export.

Export generated models to `public/models/*.glb`. If Blender is unavailable in the local environment, include the script and generate valid GLB assets using the project toolchain as a fallback so Three.js can still load real GLB files.

## Frontend Architecture

Keep the Next.js page as a Server Component and push WebGL/browser-only logic into focused Client Components.

Planned modules:

- `src/app/page.tsx`: page composition and static copy.
- `src/app/layout.tsx`: updated metadata.
- `src/app/globals.css`: project-level visual tokens and page base styles.
- `src/components/product-data.ts`: typed product data shared by page and scenes.
- `src/components/product-scene.tsx`: client component that renders product GLB files with Three.js and GSAP.
- `src/components/product-card.tsx`: repeated app product summaries using smaller 3D previews.
- `src/lib/model-paths.ts`: testable helper that returns public model paths.
- `tools/blender/create_product_models.py`: Blender source for packaging models.

## Interaction Design

- Hero products idle-rotate continuously unless `prefers-reduced-motion` is enabled.
- Hover/focus slows the selected product, scales it slightly, and updates the selected product strip.
- Product cards have clear keyboard focus states and do not rely on hover-only content.
- CTA links scroll to the app grid and build stack.
- Reduced-motion mode freezes product poses and leaves all text available.

## Performance And Accessibility

- Clamp renderer pixel ratio to avoid excessive GPU cost.
- Dispose renderer, geometries, materials, and textures on component unmount.
- Keep text outside canvas as semantic HTML.
- Provide an accessible fallback product list for users without WebGL support.
- Keep canvas dimensions stable across breakpoints.
- Test desktop and mobile viewports for nonblank WebGL render, no text overlap, and no horizontal overflow.

## Testing And Verification

- Add unit tests for `model-paths` so model URL generation and product coverage are stable.
- Run `npm run lint`.
- Run `npm run build`.
- Start the local dev server and verify the homepage in the in-app browser.
- Check WebGL canvas pixels are nonblank on desktop and mobile.
- Confirm hover/focus interactions update selected product details.
- Confirm reduced-motion does not animate product rotation.

## Open Decisions Resolved

- Visual direction: Product Museum.
- Theme: dark premium gallery.
- 3D object type: software-box packaging.
- Product names: fictional and IP-safe.
- Scope: homepage redesign only.
