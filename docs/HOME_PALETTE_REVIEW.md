# Home palette review

Date: 16 October 2026

## Palette identified before editing

Home was inspected in source and in the rendered browser. Its existing `main.css` variables remain the owner of the core brand values.

| Role | Existing Home value | Source |
| --- | --- | --- |
| Primary | `#6754E9` | `--theme-color`, purple Home sections/header |
| Accent / secondary | `#F15F25` | `--theme-color-2`, Home calls to action |
| Page / surface | `#FFFFFF` | `--body`, `--white` |
| Soft background | `#F7FAE2` | `--bg-2`, hero and Algebra card |
| Heading / foreground | `#070713` | `--header` |
| Body / secondary text | `#4B5563` | `--text` |
| Border | `#E6EFFF` | `--border` |
| Deep surface | `#0D0643` | `--bg-3` |
| Warning / rating accent | `#F8BC26` | `--ratting` |
| Pink surface | `#FFDEE4` | Measurement & Geometry Home card |
| Pale indigo surface | `#E3E8FF` | Statistics & Probability Home card |
| Mint surface | `#DBFFF9` | Problem Solving Home card |
| Success accent | `#2ECC71` | Home newsletter confirmation |

Other Home decoration colors, including peach, yellow, and slate navigation text, remain unchanged in the original Home stylesheet. Existing images, videos, character art, and logos retain their original colors.

No rendered Home element used a linear UI gradient during the initial inspection. Independent blue/cyan/violet/tutor gradients elsewhere were therefore replaced with existing flat Home colors rather than introducing a new gradient. Home has no dedicated error palette: errors reuse its orange accent, pink surface, and readable heading ink, with text/icons retaining their existing meaning.

## Implementation

- `src/theme/home-palette.css` aliases existing Home brand variables into shared semantic tokens. The three Home subject-card colors and newsletter success color now have named tokens; Home's corresponding CSS declarations reference those tokens too.
- `src/theme/colors.js` exposes the same CSS variables to JSX style objects. Tutor profiles share one appearance; the dashboard consumes one semantic theme rather than maintaining independent light/dark color tables.
- `src/theme/components.css` supplies shared color and contrast rules for controls, input fields, auth forms, subject lessons, practice, quiz/results, dialogs, Home controls, and dashboard states. Component files retain their layout and behavior.
- Removed independent literals from component-owned styles, auth styles, and quiz styles. The quiz's automatic OS-dark palette no longer conflicts with Home's light identity. The existing dashboard theme toggle uses Home's deep purple and dark heading surface with white/pale Home text.
- Practice subject markers reuse their exact corresponding Home subject-card surfaces. Labels on soft indigo use Home deep ink, because normal-size primary-purple text on that surface falls slightly below 4.5:1.
- Home orange CTA labels now use Home dark ink. Orange with white normal-size text was about 3.28:1; orange with dark ink exceeds 4.5:1. Purple buttons retain white labels. Small orange Home topic links and orange-section body labels were also changed to existing readable Home ink.
- Added explicit keyboard focus colors for auth fields and retained status labels/icons, so color is not the only source of meaning. Quiz map legends now name the state rather than depending on an old color name.

The source navigation files changed during this work. Palette changes were rebased onto the latest files; the current routes, controls, and source deletions were preserved. This work does not reintroduce the previous navigation refactor.

## Validation performed

- Production build passed using Vite.
- Client tests: **17/17 passed**, including four new theme tests for exact Home brand values, resolved JSX tokens, normal text/status/button contrast in both themes, focus contrast, and preventing independent component palettes/gradients.
- Reviewed the **13 current routed screens** at **1440×900, 390×844, and 320×568**: **39 rendered palette checks**. Pages were awaited after lazy loading. Final foreground/background colors belonged to Home's existing palette; no independent linear UI gradients remained. Raw measurements: `home-palette-screen-checks.json`.
- Reviewed Home, login, registration, introduction, all four subject lesson screens, tutor selection, tutor session, practice, mock tests, and dashboard.
- Inspected the current mobile drawer, selected subject tab, selected tutor appearance, auth keyboard focus, dashboard light/dark toggle, lesson modal, invalid numeric answer, answered/flagged map states, multiple-choice selection, completion dialog, and results. After corrections, the checked quiz/result/modal and dashboard text samples had no reported low-contrast pairs.
- Verified the settled auth password-field keyboard focus uses the exact primary purple and a visible 3px outline. CSS transitions can show interpolated values between palette endpoints while animating.
- Completed a preview practice attempt and inspected both correct and unanswered result rows. No scoring, routing, fetching, or other business behavior was changed for this theme task.

## Limits

Testing used the production client in a local preview with isolated auth/profile/curriculum fixtures and the actual practice controller backed by in-memory data. No live student data was changed. This is not a full production backend test or a formal accessibility certification. Automated DOM contrast sampling cannot reliably infer image-backed surfaces or animated pseudo-elements; Home image-backed header/decorative areas were reviewed visually rather than treated as a conformance claim. Physical-device rendering, color calibration, and real OS keyboards were not tested.

Full client lint still reports the four pre-existing tutor-request defects: undefined `pendingRef`, undefined `requestRef`, and duplicate `signal`. They are outside this color-only change and remain unchanged.

Preview: `home-palette-preview.jpg`.
