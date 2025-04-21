# Theoforge - Color Guide (v1.3 - Tailwind CSS, Design Psychology & Contextual Application)

## 1. Color Philosophy & Psychological Strategy (Reinforced)

Color is a primary subconscious communicator of **Theoforge's identity as The Sage**: the discerning, expert guide bringing **structured clarity** to technological complexity. Our color strategy is precisely engineered to evoke **trust, intellectual rigor, calm competence, and objective authority** in senior enterprise leaders (CEO/CIO/CTO). It aims to reduce cognitive load, facilitate effortless comprehension, signal premium wisdom, and provide focused guidance, all while demonstrating meticulous professionalism through universal accessibility.

**Core Psychological Objectives (Reiterated):**

*   **Establish Foundational Trust & Calm Confidence:** Primary Teal signals stability, reliability, and measured intellectual depth.
*   **Optimize Cognitive Processing & Clarity:** Structured Neutrals minimize visual noise, maximize readability, and underscore objectivity.
*   **Signal Premium Expertise & Enduring Value:** Secondary Gold accents subtly convey achieved wisdom and the high value of strategic insight.
*   **Direct Attention with Purposeful Precision:** Accent Orange highlights critical information or guides decisive action, mirroring the Sage's focused guidance.
*   **Embody Professionalism & Accessible Knowledge:** Rigorous adherence to WCAG AA+ contrast standards is fundamental.

## 2. Core Palette: Psychological Intent & Configuration (Refined)

This palette **must be configured** in `tailwind.config.js` under `theme.extend.colors`. Rationale is critical for consistent application.

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Primary: Deep Teal - Calm competence, intellectual depth, stability, trust. Authoritative but not overly dominant.
        primary: {
          DEFAULT: '#00695C', // Teal 700 (Main - Balanced authority)
          light: '#26A69A',   // Teal 500 (Hover/Focus states - Approachable interaction cue)
          dark: '#004D40',   // Teal 900 (Strong grounding, deep expertise signal)
          lightest: '#E0F2F1', // Teal 50 (Subtle backgrounds, highlighting containers)
        },
        // Secondary: Muted Gold - Achieved wisdom, premium value, insight highlight. Use with extreme reserve.
        secondary: {
          DEFAULT: '#B8860B', // DarkGoldenrod (Main - Signals high value/key insight)
          // Variants rarely needed; maintain singularity for impact. Consider a slightly desaturated version for subtle print accents if required.
        },
        // Accent: Focused Orange - Precise attention direction for critical actions/data. Signals decisiveness.
        accent: {
          DEFAULT: '#F57C00', // Orange 700 (Main - Primary CTA, critical alerts)
          // Variants rarely needed; maintain singularity for impact.
        },
        // Neutrals: Gray Scale - Structure, clarity, objectivity, minimal cognitive load. Foundation of the UI.
        neutral: {
          // Renaming suggestion for semantic clarity: e.g., neutral-text-primary, neutral-border-subtle
          900: '#111827', // Gray 900 (Strongest text/structural contrast) - Adjusted for deeper black
          800: '#374151', // Gray 700 (Primary body text - Optimal readability) - Adjusted for slightly softer primary text
          700: '#6B7280', // Gray 500 (Secondary text/metadata - Clear hierarchy) - Adjusted for standard secondary
          500: '#9CA3AF', // Gray 400 (Disabled states/placeholders)
          300: '#D1D5DB', // Gray 300 (Subtle borders/dividers)
          200: '#E5E7EB', // Gray 200 (Slight background variation/Card backgrounds)
          100: '#F3F4F6', // Gray 100 (Hover states on neutrals, off-white backgrounds)
           50: '#F9FAFB', // Gray 50 (Lightest background/paper feel)
        },
        // Backgrounds: Primarily light Neutrals for clarity and focus in light mode.
        background: {
          DEFAULT: '#FFFFFF', // Primary page background (Maximum Clarity)
          paper: 'var(--color-neutral-50)', // Card/module background
          // Consider using primary-lightest for specific highlighted sections if needed.
        },
        // System Feedback: Clear semantic indicators, ensuring accessibility.
        feedback: {
          error:   '#DC2626', // Red 600 (Slightly brighter for visibility)
          info:    '#2563EB', // Blue 600 (Clear informational cue)
          success: '#16A34A', // Green 600 (Clear positive confirmation)
          warning: '#F59E0B', // Amber 500 (Requires dark text - Use neutral-900)
        }
      },
      // Add subtle focus ring styles aligned with Sage (e.g., thin, primary or neutral)
      ringColor: theme => ({
        ...theme('colors'),
        'primary-focus': theme('colors.primary.light'), // Example
      }),
      ringWidth: { // Example
        'focus': '2px',
      },
      ringOffsetWidth: { // Example
        'focus': '2px',
      }
    },
  },
  plugins: [
    // Consider adding headless UI or Radix plugin for enhanced accessibility primitives if using
  ],
};
```

*   **Rationale Enhanced:** More specific psychological descriptions for each color family.
*   **Neutral Palette Adjusted:** Slightly shifted standard Tailwind gray names to specific hex codes for fine-tuning contrast and feel, potentially using slightly cooler grays to enhance the Teal's intellectual feel. Added comments for potential semantic renaming in code (`neutral-text-primary`, etc.) for better developer experience.
*   **Feedback Colors Refined:** Adjusted some feedback colors for potentially better standard contrast/visibility while retaining semantic meaning. Explicitly noted dark text requirement for warning.
*   **Focus States Added:** Included example configuration for focus rings, essential for accessibility and conveying deliberate interaction, a Sage trait.

## 3. Color Usage Guidelines & Psychological Application (Expanded)

*   **Foundation (Trust & Clarity):** Reinforce: Use `bg-white` or `bg-neutral-50` for primary backgrounds. `text-neutral-800` for body ensures comfort during prolonged reading (essential for absorbing wisdom). `text-neutral-900` for headings establishes clear authority. Use `border-primary` or subtle `bg-primary-lightest` to delineate key structural areas or guidance sections.
*   **Hierarchy & Structure:** Emphasize systematic use. `border-neutral-300` defines boundaries clearly but unobtrusively. Use `bg-neutral-100` or `bg-neutral-200` for nested elements (like sidebars, code blocks, or blockquotes) to create depth and structure without color noise.
*   **Highlighting Wisdom (Secondary Gold):** Reiterate extreme sparsity. *Specific Use Cases:* Key performance indicators (KPIs) in dashboards, pull quotes of critical insights, author names on thought leadership pieces, perhaps subtle decorative elements in highest-level reports. **Never** interactive. Its purpose is to signal *achieved* value.
*   **Directing Focus (Accent Orange):** Reiterate single primary CTA per view. *Specific Use Cases:* "Book Consultation," "Download Strategic Framework," "Finalize Assessment." Also applicable for critical error states or urgent system messages within `Alert` components. Secondary CTAs: `bg-primary` for important actions, `outline` or `ghost` variants with `text-primary` or `text-neutral-800` for less critical actions.
*   **Interactive States:**
    *   **Hover/Focus:** Interactive elements (`Button`, `Link`, navigation items) using `bg-primary` should transition to `bg-primary-light` (or `dark` depending on base) for clear but calm feedback. Neutral interactive elements hover to `bg-neutral-100`.
    *   **Focus Rings:** Use thin (`ring-focus`), offset (`ring-offset-focus`) rings in `ring-primary-focus` for keyboard navigation – signals precision and accessibility.
*   **Data Visualization:** Use the Neutral scale for base chart elements. Employ Primary Teal for primary data series. Use Accent Orange *or* Secondary Gold (choose one consistently for charts) *only* to highlight the single most critical data point or series requiring attention. Prioritize clarity over decoration.

## 4. Accessibility & Contrast (Reinforced & Expanded)

*   **Minimum:** WCAG 2.1 AA remains mandatory.
*   **Enhanced Target:** **AAA** for all body text (`text-neutral-800` on `bg-white`/`bg-neutral-50`) and primary UI text is strongly recommended for demonstrating meticulous care and ensuring readability for all users.
*   **Verification:** Mandatory, automated checks in CI/CD pipelines if possible, plus manual checks during design reviews.
*   **Specific Checks:** Reiterate need for dark text on Gold/Orange/Warning backgrounds. Text on `bg-primary` must be light (e.g., `text-white` or `text-neutral-50`). Text on `bg-primary-dark` must be light.

## 5. Dark Mode Considerations (New Section)

*   **Philosophy:** Maintain the core Sage principles of clarity, structure, and calm authority while reducing eye strain in low-light environments. Hierarchy and focus must be preserved. Avoid pure black backgrounds; opt for dark Neutrals.
*   **Palette Mapping (Example):**
    *   `background.DEFAULT`: `neutral-900`
    *   `background.paper`: `neutral-800` (or a custom very dark gray)
    *   `text.primary` (body): `neutral-100` or `neutral-200`
    *   `text.secondary`: `neutral-300` or `neutral-400`
    *   `primary.DEFAULT` (accents): `primary.light` (Teal 500 might offer better visibility)
    *   `secondary.DEFAULT`: `secondary.DEFAULT` (Gold may need slight brightness increase for visibility on dark bg)
    *   `accent.DEFAULT`: `accent.light` (Orange may need adjustment for accessible contrast)
    *   Borders: Lighter Neutrals (`neutral-700` or `600`).
*   **Implementation:** Utilize Tailwind's `dark:` variant (`dark:bg-neutral-900`, `dark:text-neutral-100`). Requires careful configuration and testing.

## 6. Implementation Notes (Refined)

*   **Source of Truth:** `tailwind.config.js`. Centralize all color definitions.
*   **Utility-First:** Enforce utility class usage. Discourage arbitrary color values.
*   **Component Abstraction:** **Crucial.** Build themed Shadcn components (or wrappers) that handle light/dark mode switching, interactive states, and correct text/background pairings internally. This ensures consistency and psychological intent implementation across the application with minimal developer overhead. E.g., `<ThemedButton variant="primary">` applies all correct classes for default, hover, focus, dark mode.
*   **Cross-Media Consistency:** Ensure palette translations for print and presentation materials maintain the same psychological hierarchy and feel.

---
*Version 1.3 - Revised by Dr. Elena Varga. Added Dark Mode considerations. Refined psychological rationale for shade choices and usage guidelines, including interactive states and data visualization. Enhanced accessibility recommendations. Strengthened emphasis on component abstraction for flawless implementation.*