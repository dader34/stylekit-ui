<div align="center">

<img src="https://via.placeholder.com/120x120/2D5A3D/FDFCFA?text=SK" alt="StyleKit Logo" width="120" height="120" style="border-radius: 24px;" />

# StyleKit UI

<p>
  <strong>A React component library with 8 beautiful, distinct themes</strong>
</p>

<p>
  <a href="#installation"><img src="https://img.shields.io/badge/npm-v0.1.0-2D5A3D?style=flat-square&labelColor=1F2E21" alt="npm version" /></a>
  <a href="#themes"><img src="https://img.shields.io/badge/themes-8-D4A574?style=flat-square&labelColor=1F2E21" alt="8 themes" /></a>
  <a href="#components"><img src="https://img.shields.io/badge/components-10+-4A7C59?style=flat-square&labelColor=1F2E21" alt="10+ components" /></a>
  <a href="https://github.com/dader34/stylekit-ui/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-8B6B4A?style=flat-square&labelColor=1F2E21" alt="MIT License" /></a>
</p>

<br />

</div>

---

<br />

## Overview

StyleKit UI provides a complete set of accessible, customizable React components that adapt beautifully across **8 distinct visual themes**. Switch between aesthetics instantly—from Apple-inspired minimalism to bold brutalism to warm glassmorphism—all with a single theme change.

<br />

<table>
<tr>
<td width="50%">

### Why StyleKit?

- **8 Unique Themes** — Not just color swaps, but complete aesthetic transformations including typography, spacing, shadows, and animations
- **TypeScript First** — Full type safety with exported types for all components and themes
- **Accessible** — WCAG 2.1 compliant with proper ARIA attributes and keyboard navigation
- **Tree-Shakeable** — Import only what you need

</td>
<td width="50%">

### Quick Example

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

</td>
</tr>
</table>

<br />

---

<br />

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

<br />

---

<br />

## Themes

<table>
<tr>
<td align="center" width="25%">
<img src="https://via.placeholder.com/80x50/007AFF/FFFFFF?text=" alt="Cupertino" /><br />
<strong>Cupertino</strong><br />
<sub>Apple-inspired, clean</sub>
</td>
<td align="center" width="25%">
<img src="https://via.placeholder.com/80x50/D4A5A5/FFFFFF?text=" alt="Rose Gold" /><br />
<strong>Rose Gold</strong><br />
<sub>Elegant, warm blush</sub>
</td>
<td align="center" width="25%">
<img src="https://via.placeholder.com/80x50/F59E0B/78350F?text=" alt="Glass" /><br />
<strong>Glass</strong><br />
<sub>Desert mirage warmth</sub>
</td>
<td align="center" width="25%">
<img src="https://via.placeholder.com/80x50/000000/FFFFFF?text=" alt="Brutalist" /><br />
<strong>Brutalist</strong><br />
<sub>Bold, raw, sharp</sub>
</td>
</tr>
<tr>
<td align="center" width="25%">
<img src="https://via.placeholder.com/80x50/FAFAFA/1A1A1A?text=" alt="Minimal" /><br />
<strong>Minimal</strong><br />
<sub>Ultra-refined space</sub>
</td>
<td align="center" width="25%">
<img src="https://via.placeholder.com/80x50/0D0221/FF00FF?text=" alt="Retrowave" /><br />
<strong>Retrowave</strong><br />
<sub>80s neon synthwave</sub>
</td>
<td align="center" width="25%">
<img src="https://via.placeholder.com/80x50/0A0A0A/C9A227?text=" alt="Dark Luxe" /><br />
<strong>Dark Luxe</strong><br />
<sub>Premium dark mode</sub>
</td>
<td align="center" width="25%">
<img src="https://via.placeholder.com/80x50/2D5A3D/FDFCFA?text=" alt="Forest" /><br />
<strong>Forest</strong><br />
<sub>Organic, earthy calm</sub>
</td>
</tr>
</table>

<br />

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

<br />

---

<br />

## Components

<table>
<tr>
<td width="33%">

**Form Controls**
- `Button`
- `Input`
- `Checkbox`
- `Radio` / `RadioGroup`
- `Select`

</td>
<td width="33%">

**Feedback**
- `Alert`
- `Badge`
- `Tooltip`
- `Modal`

</td>
<td width="33%">

**Layout**
- `Card`
- `Tabs`
- `Avatar` / `AvatarGroup`
- `Dropdown`

</td>
</tr>
</table>

<br />

### Component Examples

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
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>

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

<br />

---

<br />

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

<br />

---

<br />

<div align="center">

## License

MIT License — use freely in personal and commercial projects.

<br />

<sub>
Built with care using React, TypeScript, and Vite.<br />
Designed to be beautiful across every theme.
</sub>

<br />
<br />

<a href="#stylekit-ui">Back to top</a>

</div>
