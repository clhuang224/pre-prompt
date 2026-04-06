## Project Overview

- This is a static frontend project with no backend.
- The app is used to manage reusable mapping rules and replace sensitive text before sending content to an LLM.
- Data is stored in browser LocalStorage, so changes should preserve the local-first, serverless workflow.
- The primary project language is English.
- The project also includes Traditional Chinese and Japanese localization.
- README content, localized README files, and localized screenshots should be kept in sync when user-facing behavior or documentation changes.

## Project Structure

- `index.html` contains the main page structure and mount points.
- `assets/css/base.css` contains shared tokens and global styles.
- `assets/css/layout.css` contains layout and page-level structure.
- `assets/css/components.css` contains component styling and interaction states.
- `assets/js/app.js` is the main entry point and wiring layer.
- Other files in `assets/js/*.js` should keep a focused responsibility instead of moving unrelated logic back into `app.js`.
- `assets/js/locales/*.js` contains UI translations; any user-facing copy change should be updated across all locales.
- `README.md` is the primary English README.
- `README.zh-TW.md` and `README.ja.md` are localized README files and should be updated alongside the English README when needed.
- `demo.png`, `demo.zh-TW.png`, and `demo.ja.png` are localized screenshots and should be updated together when the UI changes in a way that affects the documentation images.

## General Working Rules

- Keep changes small, clear, and aligned with the current structure and naming style.
- Avoid introducing new frameworks, build steps, or dependencies unless clearly necessary.
- Keep responsibilities separated: styling in CSS, copy in locale files, behavior in the relevant JS module.
- If a change affects UI display, interaction state, and copy, check all three instead of editing only one layer.
- When changing search, drag-and-drop, import/export, copy, or locale switching behavior, verify that those flows still work together.

## Commit Message Guidelines

- Use Conventional Commits.
- Match the existing repository style and prefer prefixes such as `feat:`, `fix:`, `docs:`, `refactor:`, and `style:`.
- Keep the subject concise and specific.
- If helpful, include a body with bullet points describing the change and its purpose.

## HTML Guidelines

- Keep HTML structure simple and avoid unnecessary wrapper elements.
- When adding interactive controls, include appropriate attributes such as `id`, `for`, `aria-label`, and `title` where needed.
- Prefer BEM-style class names for new or renamed UI classes, using `block__element` and `block--modifier` patterns where practical.
- Use `is-*` state classes for temporary UI states such as visibility, sorting, disabled-like, or active states.
- Prefer semantic, plain-English class names over landing-page or marketing terms such as `hero` and `eyebrow`.
- Follow existing naming patterns such as `page-header`, `mapping-*`, and `action-*`.
- If a title or action area must not wrap or be compressed, handle that explicitly in CSS instead of relying on available space.

## JavaScript Guidelines

- Use native ES modules and keep the current modular structure.
- `app.js` should coordinate flow, while reusable or focused UI logic should stay in dedicated modules.
- When changing list rendering, preserve the distinction between source-data indexes and filtered/rendered indexes.
- If a feature is unavailable in a given state, disable both the logic and the UI affordance when possible.
- Keep code style consistent with the existing codebase and avoid unnecessary rewrites into a different style.

## i18n Guidelines

- Any user-visible copy change should be updated in:
  - `assets/js/locales/zh-TW.js`
  - `assets/js/locales/en.js`
  - `assets/js/locales/ja.js`
- Placeholders, button labels, empty states, toast messages, and confirm messages are all part of localized UI copy.
- Do not update only the static HTML fallback text and forget the locale files.

## Documentation Guidelines

- English is the source language for project documentation.
- When README content changes, review and update:
  - `README.md`
  - `README.zh-TW.md`
  - `README.ja.md`
- When screenshots become outdated due to UI changes, update:
  - `demo.png`
  - `demo.zh-TW.png`
  - `demo.ja.png`
- Localized README files and screenshots should stay meaningfully aligned with the English source.

## CSS / UI Style Guide

- Prefer even-numbered values for fixed sizes and spacing.
- Use `px` for width, height, spacing, and border radius where practical.
- Avoid `rem` for spacing and size values in this project.
- Avoid `min()`.
- Prefer `flex` for layout and avoid CSS Grid unless there is a clear layout need that flex cannot handle cleanly.
- Responsive layout may still use `%`, `calc()`, `max-width`, and `min-width`, but fixed dimensions should prefer `px`.
- Button `border-radius` should be consistent, and `div` containers should match when practical.
- Circular UI elements may still use `50%` or `999px` when appropriate.
- Hover, focus, disabled, and readonly states should have clear and consistent visual feedback.
- Interactive controls should expose the correct cursor and disabled state when they are not available.
- Search bars, drag controls, and action groups should not compress important headings or cause layout breakage.

## Verification Checklist

- After UI changes, check both desktop and narrow viewport layouts.
- After interaction changes, verify normal and edge states such as:
  - active search
  - empty state
  - after import
  - after locale switch
- After JavaScript changes, use `node --check` for a basic syntax check when appropriate.
- If a change affects repo-wide conventions, update this file as part of the same work.
