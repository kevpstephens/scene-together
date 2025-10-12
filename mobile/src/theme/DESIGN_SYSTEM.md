# SceneTogether Design System

A comprehensive guide to applying consistent styling across the SceneTogether app.

## 🎨 Design Language

Our design language features:

- **Dark theme** with semi-transparent surfaces
- **Teal (#46D4AF) accents** for highlights and glows
- **Multi-layered glow effects** on featured content
- **Consistent spacing and borders** throughout

## 📦 Import What You Need

```typescript
import { theme } from "@/theme";
import {
  getCardStyle,
  getPlatformGlow,
  getPosterWrapperStyle,
  getSectionStyle,
} from "@/theme/styles";
```

## 🔧 Design Tokens

### Surfaces (Semi-transparent backgrounds)

```typescript
// Main card background (shows gradient behind)
backgroundColor: theme.components.surfaces.card; // rgba(21, 28, 35, 0.5)

// Elevated card (more opaque)
backgroundColor: theme.components.surfaces.cardElevated; // rgba(21, 28, 35, 0.7)

// Light section within cards
backgroundColor: theme.components.surfaces.section; // rgba(15, 20, 25, 0.3)

// Overlay/modal backgrounds
backgroundColor: theme.components.surfaces.overlay; // rgba(10, 15, 20, 0.8)
```

### Borders (Teal accents)

```typescript
// Very subtle
borderColor: theme.components.borders.subtle; // rgba(70, 212, 175, 0.1)

// Standard (most common)
borderColor: theme.components.borders.default; // rgba(70, 212, 175, 0.2)

// Emphasized
borderColor: theme.components.borders.strong; // rgba(70, 212, 175, 0.4)

// Glowing borders
borderColor: theme.components.borders.glow; // rgba(70, 212, 175, 0.6)
```

### Border Radius

```typescript
borderRadius: theme.components.radii.card; // 16 (for cards)
borderRadius: theme.components.radii.poster; // 12 (for images/posters)
borderRadius: theme.components.radii.button; // 8 (for buttons)
borderRadius: theme.components.radii.badge; // 20 (for badges)
```

## ✨ Helper Functions

### 1. Card Styles

Apply consistent card styling with one helper:

```typescript
// Standard card
const styles = StyleSheet.create({
  card: {
    ...getCardStyle(),
    // Additional custom styles
  },

  // More prominent card
  cardElevated: {
    ...getCardStyle("cardElevated"),
  },
});
```

**What it does:**

- Semi-transparent background
- Teal border
- Correct border radius
- Consistent padding

### 2. Platform-Specific Glows

Apply glow effects that work on both web and native:

```typescript
const styles = StyleSheet.create({
  // Subtle glow (for list items)
  posterContainer: {
    width: "100%",
    height: 240,
    borderRadius: 12,
    ...getPlatformGlow("subtle"),
  },

  // Strong glow (for detail pages)
  featuredPoster: {
    width: "85%",
    aspectRatio: 2 / 3,
    borderRadius: 12,
    ...getPlatformGlow("strong"),
  },
});
```

**What it does:**

- **Web**: Multi-layered `boxShadow` with teal glow
- **Native**: `shadowColor`, `shadowOpacity`, `shadowRadius`, `elevation`
- Automatically handles platform differences

### 3. Poster Wrapper (All-in-one)

Create poster containers with glow in one line:

```typescript
const styles = StyleSheet.create({
  // Mobile: 85% width, strong glow
  posterMobile: {
    ...getPosterWrapperStyle({
      width: "85%",
      intensity: "strong",
    }),
  },

  // Web: 70% width, strong glow
  posterWeb: {
    ...getPosterWrapperStyle({
      width: "70%",
      intensity: "strong",
    }),
  },
});
```

**What it does:**

- Sets width and aspect ratio (2:3)
- Applies glow effect (platform-specific)
- Centers content
- Sets correct border radius

### 4. Section Styles

Create sections within cards:

```typescript
const styles = StyleSheet.create({
  section: {
    ...getSectionStyle(),
    // Additional custom styles
  },
});
```

**What it does:**

- Light semi-transparent background
- Subtle border
- Correct radius and padding

## 📱 Complete Examples

### Example 1: Event Card (List View)

```typescript
import { StyleSheet } from "react-native";
import { theme } from "@/theme";
import { getCardStyle, getPlatformGlow } from "@/theme/styles";

const styles = StyleSheet.create({
  card: {
    ...getCardStyle(),
    marginBottom: theme.spacing.lg,
    overflow: "hidden",
  },

  posterContainer: {
    width: "100%",
    height: 240,
    borderRadius: theme.components.radii.poster,
    overflow: "hidden",
    ...getPlatformGlow("subtle"),
  },

  poster: {
    width: "100%",
    height: "100%",
  },
});
```

### Example 2: Detail Page Poster

```typescript
import { StyleSheet, Platform } from "react-native";
import { theme } from "@/theme";
import { getPosterWrapperStyle } from "@/theme/styles";

const styles = StyleSheet.create({
  shadowWrapper: {
    ...getPosterWrapperStyle({
      width: Platform.OS === "web" ? "70%" : "85%",
      intensity: "strong",
    }),
  },

  posterWrapper: {
    width: "100%",
    height: "100%",
    borderRadius: theme.components.radii.poster,
    borderWidth: 2,
    borderColor: theme.components.borders.strong,
    overflow: "hidden",
  },
});
```

### Example 3: Info Card with Sections

```typescript
import { StyleSheet } from "react-native";
import { theme } from "@/theme";
import { getCardStyle, getSectionStyle } from "@/theme/styles";

const styles = StyleSheet.create({
  infoCard: {
    ...getCardStyle(),
    marginTop: theme.spacing.lg,
  },

  section: {
    ...getSectionStyle(),
    marginBottom: theme.spacing.md,
  },

  lastSection: {
    ...getSectionStyle(),
    marginBottom: 0,
  },
});
```

## 🎯 Quick Reference

| What You Need    | Use This                           |
| ---------------- | ---------------------------------- |
| Card background  | `theme.components.surfaces.card`   |
| Card border      | `theme.components.borders.default` |
| Card radius      | `theme.components.radii.card`      |
| Full card style  | `getCardStyle()`                   |
| Subtle glow      | `getPlatformGlow('subtle')`        |
| Strong glow      | `getPlatformGlow('strong')`        |
| Poster with glow | `getPosterWrapperStyle({...})`     |
| Section in card  | `getSectionStyle()`                |

## 🚀 Benefits

1. **Consistency**: All components use the same design tokens
2. **Maintainability**: Change values in one place, apply everywhere
3. **Platform Support**: Automatically handles web vs native differences
4. **Type Safety**: TypeScript autocomplete for all tokens
5. **Professional**: Clean, reusable, industry-standard approach

## 📝 Migration Example

**Before:**

```typescript
card: {
  backgroundColor: 'rgba(21, 28, 35, 0.5)',
  borderRadius: 16,
  borderWidth: 1,
  borderColor: 'rgba(70, 212, 175, 0.2)',
  padding: 16,
  ...(Platform.OS === 'web'
    ? { boxShadow: '0 0 20px rgba(70, 212, 175, 0.3)' }
    : { shadowColor: '#46D4AF', shadowOpacity: 0.4, shadowRadius: 20 }
  ),
}
```

**After:**

```typescript
card: {
  ...getCardStyle(),
  ...getPlatformGlow('subtle'),
}
```

Much cleaner! 🎉
