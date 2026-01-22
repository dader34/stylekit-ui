# 🌲 StyleKit UI

**A React component library with 8 beautiful, distinct themes**

[![npm version](https://img.shields.io/npm/v/@stylekit/ui?color=2D5A3D)](https://www.npmjs.com/package/@stylekit/ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-8B6B4A.svg)](https://opensource.org/licenses/MIT)

---

## Overview

StyleKit UI provides a complete set of accessible, customizable React components that adapt beautifully across **8 distinct visual themes**. Switch between aesthetics instantly—from Apple-inspired minimalism to bold brutalism to warm glassmorphism—all with a single theme change.

### Why StyleKit?

- 🎨 **8 Unique Themes** — Not just color swaps, but complete aesthetic transformations including typography, spacing, shadows, and animations
- 📘 **TypeScript First** — Full type safety with exported types for all components and themes
- ♿ **Accessible** — WCAG 2.1 compliant with proper ARIA attributes and keyboard navigation
- 🌳 **Tree-Shakeable** — Import only what you need

---

## Installation

```bash
npm install @stylekit/ui
```

```bash
yarn add @stylekit/ui
```

```bash
pnpm add @stylekit/ui
```

---

## Quick Start

```tsx
import { ThemeProvider, Button } from '@stylekit/ui';

function App() {
  return (
    <ThemeProvider defaultTheme="forest">
      <Button variant="primary">
        Get Started
      </Button>
    </ThemeProvider>
  );
}
```

---

## Themes

| Theme | Description |
|-------|-------------|
| **Cupertino** | Clean Apple-inspired design with SF Pro aesthetics |
| **Rose Gold** | Elegant and warm with sophisticated blush tones |
| **Glass** | Warm desert mirage with amber and rose glassmorphism |
| **Brutalist** | Bold and raw with sharp edges and stark contrasts |
| **Minimal** | Ultra-refined with maximum white space |
| **Retrowave** | 80s synthwave with neon colors and chrome |
| **Dark Luxe** | Premium dark mode with gold accents |
| **Forest** | Organic and calming with earthy greens |

### Using Themes

```tsx
import { ThemeProvider, useTheme } from '@stylekit/ui';

// Set a default theme
<ThemeProvider defaultTheme="forest">
  <App />
</ThemeProvider>

// Switch themes dynamically
function ThemeSwitcher() {
  const { setTheme, availableThemes } = useTheme();

  return (
    <select onChange={(e) => setTheme(e.target.value)}>
      {availableThemes.map(theme => (
        <option key={theme} value={theme}>{theme}</option>
      ))}
    </select>
  );
}
```

---

## Components

### Form Controls
- `Button` — Primary, secondary, outline, ghost, destructive, link variants
- `Input` — With labels, helper text, error/success states
- `Checkbox` — With indeterminate state support
- `Radio` / `RadioGroup` — Controlled and uncontrolled
- `Select` — Dropdown selection

### Feedback
- `Alert` — Info, success, warning, error status
- `Badge` — Solid, subtle, outline variants
- `Tooltip` — Hover tooltips
- `Modal` — Dialog overlays

### Layout
- `Card` — Elevated, outlined, filled variants
- `Tabs` — Tabbed content navigation
- `Avatar` / `AvatarGroup` — User avatars with status
- `Dropdown` — Dropdown menus

### Examples

```tsx
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardBody,
  Alert,
  Badge
} from '@stylekit/ui';

// Buttons with variants
<Button variant="primary">Primary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>

// Input with validation states
<Input
  label="Email"
  placeholder="you@example.com"
  state="success"
  helperText="Looks good!"
/>

// Cards
<Card variant="elevated">
  <CardHeader title="Welcome" subtitle="Get started" />
  <CardBody>Your content here</CardBody>
</Card>

// Alerts
<Alert status="success" title="Saved!">
  Your changes have been saved.
</Alert>

// Badges
<Badge color="success">Active</Badge>
<Badge color="warning" variant="subtle">Pending</Badge>
```

---

## Development

```bash
# Install dependencies
npm install

# Run Storybook (component explorer)
npm run dev

# Run demo app
npm run dev:demo

# Build library
npm run build

# Type check
npm run typecheck
```

---

## License

MIT License — use freely in personal and commercial projects.

---

Built with React, TypeScript, and Vite.
