# SceneTogether Design System

## Overview

SceneTogether uses a unified design system to ensure consistent visual language across both mobile (React Native) and web (Next.js) applications. All design tokens are centralized in the `/shared/src/theme.ts` file.

---

## 🎨 Brand Colors

### Primary Colors

- **Primary**: `#8113d5` - Purple (main brand color)
- **Accent**: `#46D4AF` - Teal/Turquoise (CTAs, highlights, interactive elements)
- **Accent Hover**: `#3BC19E` - Darker teal for hover states

### Semantic Colors

- **Success**: `#10B981` - Green (confirmations, positive actions)
- **Warning**: `#F59E0B` - Orange (cautions, alerts)
- **Error**: `#EF4444` - Red (errors, destructive actions)
- **Info**: `#3B82F6` - Blue (informational messages)

### Neutral Colors

- **Text**: `#000102` - Almost black (primary text)
- **Text Secondary**: `#6B7280` - Gray (secondary text)
- **Text Tertiary**: `#9CA3AF` - Light gray (disabled, hints)
- **Background**: `#FFFFFF` - White
- **Background Alt**: `#F9FAFB` - Light gray (cards, sections)
- **Border**: `#E5E7EB` - Light border

### Event Status Colors

- **Upcoming**: `#3B82F6` - Blue
- **Ongoing**: `#10B981` - Green
- **Past**: `#6B7280` - Gray

---

## 📏 Spacing Scale

Consistent spacing ensures visual rhythm and hierarchy:

| Token | Value | Usage                             |
| ----- | ----- | --------------------------------- |
| `xs`  | 4px   | Tight spacing, badges             |
| `sm`  | 8px   | Form field padding, compact cards |
| `md`  | 16px  | Default padding, margins          |
| `lg`  | 24px  | Section spacing                   |
| `xl`  | 32px  | Large section gaps                |
| `xxl` | 48px  | Page-level spacing                |

---

## 🔘 Border Radius

Rounded corners for modern, friendly UI:

| Token  | Value  | Usage                  |
| ------ | ------ | ---------------------- |
| `sm`   | 6px    | Small elements         |
| `md`   | 8px    | Inputs, buttons        |
| `lg`   | 12px   | Cards                  |
| `xl`   | 16px   | Large cards, modals    |
| `full` | 9999px | Pills, badges, avatars |

---

## ✍️ Typography

### Font Sizes

- `xs`: 12px - Tiny labels
- `sm`: 14px - Captions, small text
- `base`: 16px - Body text (default)
- `lg`: 18px - Emphasized body
- `xl`: 20px - Small headings
- `2xl`: 24px - Section headings
- `3xl`: 30px - Page headings
- `4xl`: 36px - Hero text

### Font Weights

- **Normal**: 400 - Body text
- **Medium**: 500 - Emphasized text
- **Semibold**: 600 - Buttons, labels
- **Bold**: 700 - Headings

### Line Heights

- **Tight**: 1.2 - Headings
- **Normal**: 1.5 - Body text
- **Relaxed**: 1.75 - Long-form content

---

## 🎭 Shadows

Elevation for depth and hierarchy:

### Small Shadow

```
shadowOffset: { width: 0, height: 1 }
shadowOpacity: 0.05
shadowRadius: 2
```

**Usage**: Subtle elevation, small cards

### Medium Shadow

```
shadowOffset: { width: 0, height: 4 }
shadowOpacity: 0.1
shadowRadius: 6
```

**Usage**: Cards, dropdowns (default)

### Large Shadow

```
shadowOffset: { width: 0, height: 10 }
shadowOpacity: 0.15
shadowRadius: 15
```

**Usage**: Modals, prominent elements

---

## 🧩 Component Guidelines

### Buttons

#### Primary Button

- **Background**: Accent color (`#46D4AF`)
- **Text**: White
- **Hover**: Accent hover (`#3BC19E`)
- **Padding**: 16px horizontal, 12px vertical
- **Border Radius**: `lg` (12px)
- **Usage**: Main actions, CTAs

#### Secondary Button

- **Background**: White
- **Text**: Text color
- **Border**: 2px solid gray
- **Hover**: Border accent color
- **Usage**: Alternative actions

### Inputs

- **Background**: White
- **Border**: 1px solid border color
- **Border (focused)**: 2px solid accent
- **Text**: Text color (dark)
- **Placeholder**: Text tertiary
- **Padding**: 16px horizontal, 12px vertical
- **Border Radius**: `md` (8px)

### Cards

- **Background**: White
- **Padding**: 16px
- **Border Radius**: `lg` (12px)
- **Shadow**: Medium
- **Usage**: Event cards, content containers

### Badges

- **Padding**: 8px horizontal, 4px vertical
- **Border Radius**: `full` (9999px)
- **Font Size**: `xs` (12px)
- **Font Weight**: Semibold
- **Usage**: Status indicators, tags

---

## 🚀 Usage Examples

### Mobile (React Native)

```tsx
import { theme } from '../../../shared/src/theme';
import { styles, colors } from '@/theme/styles';

// Using theme colors
<View style={{ backgroundColor: colors.accent }}>
  <Text style={styles.heading2}>Event Title</Text>
  <Text style={styles.bodyText}>Description</Text>
</View>

// Using predefined styles
<TouchableOpacity style={styles.buttonPrimary}>
  <Text style={styles.buttonPrimaryText}>RSVP</Text>
</TouchableOpacity>
```

### Web (Next.js)

```tsx
import { theme, INPUT_CLASSES, PRIMARY_BUTTON_CLASSES } from '@/lib/constants';

// Using Tailwind with theme colors
<div className="bg-white rounded-lg p-4" style={{ borderColor: theme.colors.accent }}>
  <h2 className="text-2xl font-bold">Event Title</h2>
</div>

// Using standardized classes
<input className={INPUT_CLASSES} placeholder="Email" />
<button className={PRIMARY_BUTTON_CLASSES}>Sign In</button>
```

---

## 📦 File Structure

```
/shared/src/theme.ts        # Source of truth for all design tokens
/mobile/src/theme/styles.ts # React Native styled components
/web/src/lib/constants.ts   # Tailwind utility classes + theme
```

---

## 🎯 Design Principles

1. **Consistency**: Use design tokens everywhere, avoid hard-coded values
2. **Accessibility**: Maintain WCAG AA contrast ratios (4.5:1 for text)
3. **Scalability**: Add new tokens to shared theme, not individual files
4. **Clarity**: Components should be self-documenting with clear naming
5. **Performance**: Reuse StyleSheet.create() styles, avoid inline styles

---

## 🔮 Future Enhancements

- [ ] Add dark mode support
- [ ] Integrate Tamagui for true cross-platform components
- [ ] Set up Storybook for component documentation
- [ ] Sync design tokens with Figma
- [ ] Add animation/transition token system
- [ ] Create shared component library package

---

## 📚 References

- [Shared Theme File](/shared/src/theme.ts)
- [Mobile Styles](/mobile/src/theme/styles.ts)
- [Web Constants](/web/src/lib/constants.ts)
- [Tailwind CSS](https://tailwindcss.com)
- [React Native StyleSheet](https://reactnative.dev/docs/stylesheet)
