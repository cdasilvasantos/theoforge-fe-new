# Theoforge - Typography Guide (v1.3 - Applied Design Psychology & Archetypal Alignment)

## 1. Philosophy & Psychological Strategy: Typography as Cognitive Architecture

Typography is the **cognitive architecture** of Theoforge's communication. As the embodiment of **The Sage guiding the Hero/Outlaw**, our typographic system must be meticulously crafted to:

*   **Maximize Cognitive Ease & Clarity (Sage):** Ensure effortless information processing through optimal legibility, clear hierarchy, and reduced cognitive load, allowing complex insights to be absorbed fluidly.
*   **Convey Authority & Trustworthiness (Sage/Hero):** Utilize typographic signals research-proven to correlate with perceived expertise, stability, and reliability. Consistency reinforces this trust.
*   **Signal Precision & Structure (Sage):** Employ measured rhythm, clear alignments, and structured layouts to subconsciously communicate analytical rigor and methodical thinking.
*   **Enable Focused Action & Mastery (Hero):** Establish clear pathways through content, enabling efficient understanding that leads to confident decision-making.
*   **Subtly Hint at Innovation (Outlaw - Controlled):** Maintain a clean, modern aesthetic that feels current and capable of handling disruptive concepts without resorting to chaotic or overtly rebellious styles.
*   **Ensure Universal Accessibility (Sage Ethics):** Exceed WCAG AA standards, particularly for body text, embodying the Sage's commitment to accessible knowledge for all leaders.

## 2. Core Typefaces: Psychological Intent & Configuration

Our typeface selections are deliberate choices grounded in legibility research and their capacity to evoke the desired **Sage/Hero** attributes. They are configured in `tailwind.config.js` under `theme.extend.fontFamily`.

*   **Headings: Inter (Recommended over Poppins):** An exceptionally versatile and highly legible sans-serif designed specifically for UI and screen readability. Its neutral-to-slightly-geometric structure conveys **modern competence (Hero)** and **objective clarity (Sage)** without the potential for feeling overly "soft" or "trendy" that Poppins sometimes carries, especially for a C-suite audience. Inter's extensive weight range allows for precise hierarchy control.
    *   *Implementation:* Use CSS variable `var(--font-inter)` or Tailwind class `font-heading`.
    *   *Available Weights:* Variable font, but typically use 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold). Apply via `font-medium`, `font-semibold`, `font-bold`.
*   **Body & UI: Public Sans (Confirmed):** Remains an excellent choice. Its neutral, clear, USWDS-derived design ensures high legibility and minimizes cognitive friction for complex content, fostering **trust through straightforwardness (Sage)**. Its robustness supports the reliable feeling associated with the **Hero**.
    *   *Implementation:* Use CSS variable `var(--font-public-sans)` or Tailwind class `font-sans` (default).
    *   *Available Weights:* 400 (Regular), 500 (Medium), 700 (Bold). Apply via `font-normal`, `font-medium`, `font-bold`. **Use bold sparingly** in body text; reserve for emphasis or UI states.
*   **(Optional) Accent/Code: Source Code Pro or JetBrains Mono:** For code snippets or specific data callouts, using a monospace font signals **precision, technical accuracy (Sage)**, and differentiates specialized information clearly.
    *   *Implementation:* Use `var(--font-mono)` or `font-mono`.

**Tailwind Configuration Example (Refined):**

```javascript
// tailwind.config.js
const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Public Sans', 'var(--font-public-sans)', ...fontFamily.sans], // Body & Default UI
        heading: ['Inter', 'var(--font-inter)', ...fontFamily.sans], // Headings
        mono: ['Source Code Pro', 'var(--font-mono)', ...fontFamily.mono], // Optional: Code / Data
      },
      // fontSize & other scales defined below
    },
  },
  plugins: [],
};
```
*Rationale:* Recommending *Inter* for headings provides potentially better alignment with the desired authoritative, clear, yet modern Sage/Hero feel compared to Poppins, which can sometimes skew slightly more playful (Jester/Innocent hints) depending on usage. Public Sans remains optimal for body text legibility and trust. Adding an optional mono font enhances the Sage's technical precision where needed.

## 3. Typographic Scale & Vertical Rhythm: Architecting Attention

A meticulously defined scale for size and line height structures information, guides attention, and creates a calming, predictable reading rhythm, reinforcing **Sage control and Heroic clarity**. Configured in `theme.extend.fontSize`. Values are starting points; **visual testing with real content is crucial.**

| Use Case          | Font Family | Weight        | Config (`fontSize` array: [size, { lineHeight }]) | Semantic Element | Psychological Intent & Notes                                                                      |
| :---------------- | :---------- | :------------ | :--------------------------------------------- | :--------------- | :---------------------------------------------------------------------------------------------- |
| Page Title (H1)   | Inter       | `font-bold`   | `'4xl': ['2.5rem', { lineHeight: '1.2' }]`       | `<h1>`           | ~40px. Strong authority, clear entry point.                                                     |
| Section Title (H2)| Inter       | `font-semibold` | `'3xl': ['2rem', { lineHeight: '1.25' }]`      | `<h2>`           | ~32px. Major structural division, confident guidance.                                           |
| Sub-Section (H3)  | Inter       | `font-semibold` | `'2xl': ['1.5rem', { lineHeight: '1.3' }]`       | `<h3>`           | ~24px. Clear thematic grouping, structured thought.                                               |
| Component Title(H4)| Inter       | `font-semibold` | `'xl': ['1.25rem', { lineHeight: '1.4' }]`       | `<h4>`           | ~20px. E.g., Card titles. Focused expertise.                                                   |
| Label/Small Head(H5)| Inter       | `font-medium`   | `'lg': ['1.125rem', { lineHeight: '1.5' }]`      | `<h5>`           | ~18px. Clear labeling, organized detail.                                                       |
| Subtle Heading (H6)| Inter       | `font-medium`   | `'base': ['1rem', { lineHeight: '1.5' }]`        | `<h6>`           | ~16px. Use judiciously; ensure distinction from body. Consider `font-semibold`.                   |
| Body Text 1       | Public Sans | `font-normal` | `'base': ['1rem', { lineHeight: '1.7' }]`        | `<p>`            | ~16px. **Optimal Readability Focus.** Generous line height (~27px) essential for dense content.    |
| Body Text 2       | Public Sans | `font-normal` | `'sm': ['0.875rem', { lineHeight: '1.6' }]`      | `<p class="text-sm">` | ~14px. Secondary info, captions. Maintain generous line height.                                 |
| Button Text (Std) | Public Sans | `font-medium`   | `'sm': ['0.875rem', { lineHeight: '1.25' }]`     | `<button>`       | ~14px. Clear action, slightly elevated importance.                                              |
| Microcopy/Caption | Public Sans | `font-normal` | `'xs': ['0.75rem', { lineHeight: '1.5' }]`       | `<small>`/`<span>`| ~12px. Tertiary info, footnotes. Ensure AA contrast.                                          |
| Code/Data         | Source Code | `font-normal` | `'sm': ['0.875rem', { lineHeight: '1.6' }]`      | `<code>`/`<pre>`  | ~14px. Clear distinction, precision signal.                                                  |

**Configuration Example (`theme.extend.fontSize` - Refined):**

```javascript
// tailwind.config.js -> theme.extend
fontSize: {
  // Using rem for scalability, comments show approx px at 16px base
  '4xl': ['2.5rem', { lineHeight: '1.2' }],      // ~40px
  '3xl': ['2rem', { lineHeight: '1.25' }],     // ~32px
  '2xl': ['1.5rem', { lineHeight: '1.3' }],      // ~24px
  'xl':  ['1.25rem', { lineHeight: '1.4' }],     // ~20px
  'lg':  ['1.125rem', { lineHeight: '1.5' }],    // ~18px
  'base': ['1rem', { lineHeight: '1.7' }],       // ~16px, Body text focus
  'sm':  ['0.875rem', { lineHeight: '1.6' }],    // ~14px, Secondary text
  'xs':  ['0.75rem', { lineHeight: '1.5' }],     // ~12px, Microcopy
  // Consider separate sizes for buttons if needed, e.g.:
  // 'btn': ['0.875rem', { lineHeight: '1.25' }], // Explicit button size
}
```
*Rationale:* Increased body text line height (`1.7`) significantly enhances readability for dense, expert content (Sage). Adjusted some heading sizes/line heights for better rhythm and distinction based on Inter's characteristics. Always test with `max-w-prose` or similar constraints.

## 4. Color & Contrast (Reinforced - Link to Color Guide)

Strictly adhere to the **[Color Guide (v1.3)](./color_guide.md)**.

*   **Primary Text:** `text-neutral-900` or `text-neutral-800` on light backgrounds for maximum legibility (Sage clarity, Heroic strength).
*   **Secondary Text:** `text-neutral-700` for de-emphasis, ensuring AA+ contrast.
*   **Emphasis:** Use `font-semibold` or `font-bold` within body text *very sparingly*. Use `text-primary` for inline links or subtle emphasis. Reserve `text-secondary` (Gold) only for designated high-value textual highlights as defined in the Color Guide.
*   **Accessibility:** **AAA target** for body text (`neutral-800` on `white`/`neutral-50`) is strongly advised. Mandatory AA for all other text.

## 5. Responsive Typography & Measure

*   Use Tailwind responsive variants (`md:text-lg`) consistently to scale typography appropriately.
*   **Crucially, enforce optimal line length (measure)** for body text using `max-w-prose` or equivalent container constraints (typically 45-75 characters). This is non-negotiable for sustained reading comfort and cognitive ease (*Sage*). Test across breakpoints.

## 6. Implementation & Governance (Reinforced Abstraction)

*   **Single Source of Truth:** `tailwind.config.js`.
*   **Component Abstraction (Primary Method):** This is the **preferred and recommended** approach. Create semantic components `<Heading level={1-6}>`, `<Paragraph variant="body1"|"body2"|"caption">`, `<Button size="md">`, `<CodeBlock>` etc. These components encapsulate all typographic logic (family, size, weight, line height, responsive variants, color defaults).
    *   *Psychological Benefit:* Enforces consistency system-wide, reduces developer cognitive load (they use semantic components, not raw utilities), ensures psychological intent is preserved, makes updates trivial. Directly reflects the **Sage's value for structured systems**.
*   **Utility Classes (Secondary/Internal):** Use utilities primarily *within* the abstract components or for highly specific, non-reusable layout adjustments.

## 7. Spacing & Vertical Rhythm (Link to Spacing Guide)

Refer to the **[Spacing Guide (v1.2)](./spacing_guide.md)**.

*   **Apply rigorously:** Use the 8pt-based scale for all margins (especially `mb-*` after headings/paragraphs) and padding.
*   **Establish Clear Rhythm:** Consistent vertical spacing creates predictability and guides the eye smoothly, reinforcing the **Sage's structured approach**. Test paragraph and heading margins carefully with the defined line heights.

---
*Version 1.3 - Revised by Dr. Elena Varga. Recommended 'Inter' for headings for stronger Sage/Hero alignment. Refined typographic scale with emphasis on body text line height for optimal readability (cognitive ease). Added optional monospace font. Strengthened rationale linking choices to psychological objectives and archetype. Heavily emphasized component abstraction as the primary implementation method for system integrity and Sage principles.*