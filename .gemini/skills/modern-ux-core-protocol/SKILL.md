---
name: modern-ux-core-protocol
description: Core UI/UX and Design Standards (CSS, JS, HTML, Mobile-First). Basic conventions to achieve a fashionable, modern, cool design and robust implementation.
---

# Modern UX Core Protocol (Basic Conventions)

These conventions are the common design and technical guidelines for building the highest-level "fashionable, modern, and cool" user experience (UX) on Liferay DXP.

## 1. Visual & Design Standards

### Overwhelming Visual Impact
- **Use High-Quality Images:** Make full use of `object-fit: cover` and `aspect-ratio` to maintain layout while preserving resolution.
- **Texture and Depth:** Combine high-definition images, delicate gradients, and sharp shadows (`box-shadow: 0 20px 40px rgba(0,0,0,0.1)`) to create a modern three-dimensional effect.
- **Bold Typography:** Contrast by combining ultra-thin (100-200) and ultra-thick (800-900) fonts. Apply `letter-spacing: 0.1em` and `text-transform: uppercase` to headings to create an editorial (magazine-like) luxurious feel.
- **CSS Animations:** Avoid static displays, and come standard with "movements" such as fade-ins, slides, and zooms using the `Intersection Observer`.

### Easy Navigation
- **Simple and Clear Menus:** Do not deepen the hierarchy; name categories intuitively (e.g., "New Arrivals", "Collections").
- **Refined Search Experience:** Provide real-time results during input or offer a full-screen search interface in a modal.
- **Consistent Labeling:** Standardize terminology across all pages. Make clickable elements recognizable at a glance.

### Clear CTAs (Call to Actions)
- **High-Contrast Buttons:** Standout color schemes that are not buried in the background or images.
- **Strategic Placement:** Always place CTAs at times when users make decisions, such as the first view (Hero Area), scroll breaks, and footers.
- **Microinteractions:** Add not only color changes but also slight movements (`translateY(-2px)`) and expansions (`scale`) on hover and click to heighten expectations for the operation.

### Strong Branding
- **Consistent Color Palette:** Strictly manage brand colors, accent colors, and background colors.
- **Unified Tone and Manner:** Standardize typography fonts, line spacing, margins, and rounded corners (sharp choices like `border-radius: 4px` or `0px`) across all components.
- **Reflect Brand Personality:** Choose design elements tailored to the strategy, such as using strong colors and large text if the brand is "Bold", or using margins luxuriously if it is "Minimal".

## 2. Implementation Protocols - [Strict Compliance]

### CSS Architecture
- **No `position: fixed`:** To avoid scroll instability and overlay overlap issues on mobile, the use of `position: fixed` is prohibited. If header fixing, etc., is necessary, always use **`position: sticky`**.
- **Semantic Shielding:** UI should generally consist of **`<div>` or `<span>`** to avoid interference from Liferay or external library global definitions (direct specifications to `h1`, `p`, `a`, etc.).
- **BEM Naming Convention:** Adopt BEM for class names and ensure encapsulation by appending a unique prefix (e.g., `lux-`, `ui-`, `ln-`) (e.g., `lux-card`, `lux-btn--primary`).
- **Modern Layout:** Use `grid` and `flex` as the main axes, and perform fluid size adjustments utilizing `clamp()`.

### JavaScript & Data Integration Rules
- **Variable Definition:** Dynamic values such as environment variables and API settings must be defined as variables as default values at the beginning of the code.
- **Async/Await & Error Handling:** Use `try-catch` for all API interactions and display an Elegant Error State on the UI even upon failure.
- **Performance:** Limit animations to `transform` and `opacity`, and maintain 60fps using `will-change`.

### Mobile-First Approach
- **Priority (Implementation Order):** Always start writing styles based on **smartphones (from 375px)** and extend them to desktops.
- **Secure Touch Targets:** Ensure a minimum area of **44px x 44px** for buttons and links.
- **Lightweight and Fast:** Thoroughly implement Lazy Load for images (`loading="lazy"`). Prioritize native CSS/JS to achieve a smooth operational feel at 60fps.
- **Full-Screen Menus:** From hamburger menus on mobile, deploy bold navigation using the entire screen (opaque background `background: #ffffff !important`).

## 3. Interactions & Motion

- **Easing:** Heavily use `cubic-bezier(0.23, 1, 0.32, 1)` (extremely smooth movement) for pleasant motion.
- **Scroll Shrink:** Dynamically change the height of elements and the transparency of the background according to the scroll amount (e.g., toggle the `is-shrunk` class) to increase focus on the content.
- **Scroll Reveal:** Utilize the `Intersection Observer` to standardly implement a Reveal Effect where elements gently appear when they enter the screen.
- **Loading State:** Implement skeleton screens or refined loading animations.
- **Microinteractions:** For user actions like hover and click, add not only color changes but also slight movements (`translateY(-2px)`) and expansions (`scale(1.05)`) to heighten expectations for the operation.