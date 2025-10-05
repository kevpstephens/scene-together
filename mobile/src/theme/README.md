# SceneTogether Theme Guide

## Usage

Import the theme in any component:

```typescript
import { theme } from "../theme";
```

## Examples

### Basic Styling

```typescript
const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.base,
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
});
```

### Using Cards with Shadows

```typescript
const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.base,
    ...theme.shadows.md, // Spread shadow properties
  },
});
```

### Responsive Spacing

```typescript
const styles = StyleSheet.create({
  section: {
    marginBottom: theme.spacing.lg, // 24px
    paddingHorizontal: theme.spacing.base, // 16px
  },
});
```

### Color Variations

```typescript
// Text colors
color: theme.colors.text.primary; // Dark text
color: theme.colors.text.secondary; // Medium gray
color: theme.colors.text.tertiary; // Light gray

// Status colors
color: theme.colors.success; // Green
color: theme.colors.error; // Red
color: theme.colors.warning; // Orange
```

## Best Practices

1. **Always use theme values** instead of hardcoded colors/sizes
2. **Use semantic names** from the theme (e.g., `text.primary` not hex codes)
3. **Consistent spacing** - use the spacing scale (xs, sm, md, base, lg, xl)
4. **Typography** - use fontSize and fontWeight from theme
5. **Shadows** - spread shadow objects for consistent elevation

## Adding New Values

If you need a new color or size:

1. Add it to `theme/index.ts`
2. Use semantic naming (e.g., `colors.accent` not `colors.blue500`)
3. Consider if it fits existing categories or needs a new one

## TypeScript Support

The theme is fully typed! You'll get autocomplete for:

- `theme.colors.*`
- `theme.spacing.*`
- `theme.typography.*`
- `theme.shadows.*`
