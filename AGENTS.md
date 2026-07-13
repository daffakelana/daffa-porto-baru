# AGENTS.md

# Project Overview

This project uses:

- Next.js App Router
- React
- TypeScript
- Tailwind CSS v4

Always follow the existing project structure before generating new code.

Before writing code:

1. Read the existing components.
2. Read globals.css.
3. Reuse the current design system.

Never duplicate existing components.

---

# Figma

When a Figma frame is provided through MCP:

- Read the design first.
- Understand the layout.
- Identify reusable components.
- Identify typography styles.
- Identify colors.

Do not immediately generate code before understanding the design.

---

# Design Tokens

## Colors

Never hardcode colors.

Always use the existing CSS variables.

Examples:

- var(--text-color-default)
- var(--text-color-secondary)
- var(--text-color-tertiary)

- var(--background-color-default)
- var(--background-color-white)
- var(--background-color-hover)

- var(--primary-base)
- var(--primary-strong)
- var(--primary-soft)

- var(--divider-color)

If a required color does not exist, ask before creating a new token.

---

## Typography

Never hardcode typography.

Always use the existing typography utilities.

Available utilities:

- display-1
- display-2
- display-3

- headline-1
- headline-2

- label-1
- label-2
- label-3

- body-1
- body-2

Do not use Tailwind typography classes such as:

text-xl
text-2xl
font-bold
tracking-tight

unless explicitly requested.

---

## Fonts

Graphik is used for:

- Display
- Headline

SF Pro is used for:

- Label
- Body

Do not override the font-family manually.

---

# Components

Always reuse existing components.

Before creating a new component:

- Search the project first.
- Check components folder.
- Check ui folder.

If a component already exists:

Reuse it.

Never duplicate components.

---

# Layout

Prefer:

- Flexbox
- CSS Grid

Avoid:

- Absolute positioning

unless required by the design.

---

# Tailwind

Prefer Tailwind utilities.

Examples:

flex
grid
items-center
justify-between
rounded-xl
border

Spacing may be hardcoded.

Examples:

p-6
px-8
py-4
gap-6
mt-10
mb-8

This is acceptable.

---

# Responsive

Follow the existing responsive approach.

Typography is already responsive through design tokens.

Do not create duplicate responsive typography.

Only adjust layout when necessary.

---

# Accessibility

Use semantic HTML.

Examples:

header
nav
main
section
article
footer

Always:

- use alt on images
- use button instead of clickable div
- use label for inputs

---

# Code Style

Use TypeScript.

Prefer reusable components.

Keep components small.

Avoid unnecessary wrappers.

Avoid inline styles.

---

# When Generating Components

Always:

✓ Use existing design tokens.

✓ Use existing typography utilities.

✓ Reuse components.

✓ Use semantic HTML.

✓ Use Tailwind CSS.

✓ Keep the code clean.

Do not:

✗ Hardcode colors.

✗ Hardcode typography.

✗ Duplicate components.

✗ Ignore the current design system.