# SceneTogether Logo Assets

## 📁 File Structure

Place your logo files in this directory with the following naming convention:

```
mobile/assets/logo/
├── logo-transparent.png   # ⭐ Primary full logo with transparent background (200x120px recommended)
├── logo-icon.png          # ⭐ Icon-only version - film reel symbol without text (for app icons, favicons)
├── logo-horizontal.png    # Full horizontal layout with text (for headers)
└── logo-square.png        # Square version for app icons (1024x1024px)
```

## 🎨 Current Integrations

### ✅ **1. Login Screen**

- **Location**: `src/screens/auth/LoginScreen.tsx`
- **File Used**: `logo-transparent.png`
- **Size**: 200x120px
- **Purpose**: Welcome screen branding

### ✅ **2. SignUp Screen**

- **Location**: `src/screens/auth/SignUpScreen.tsx`
- **File Used**: `logo-transparent.png`
- **Size**: 200x120px
- **Purpose**: Registration screen branding

### ✅ **3. Events Tab Header**

- **Location**: `src/navigation/EventsStackNavigator.tsx`
- **File Used**: `logo-transparent.png`
- **Size**: 120x32px
- **Purpose**: Navigation bar branding

### ✅ **4. App Icon**

- **Location**: `assets/icon.png`
- **File Used**: `logo-icon.png` (copied from logo folder)
- **Size**: Original size from design
- **Purpose**: Home screen app icon

### ✅ **5. Splash Screen**

- **Location**: `assets/splash-icon.png`
- **File Used**: `logo-icon.png` (copied from logo folder)
- **Background**: Dark theme `#0F1419`
- **Purpose**: Launch screen while app loads

### ✅ **6. Favicon**

- **Location**: `assets/favicon.png`
- **File Used**: `logo-icon.png` (copied from logo folder)
- **Purpose**: Browser tab icon for web app

### ✅ **7. Android Adaptive Icon**

- **Location**: `assets/adaptive-icon.png`
- **Background**: Dark theme `#0F1419`
- **Purpose**: Android home screen icon

## 🚀 Recommended Future Integrations

### **3. Splash Screen** ⭐ HIGH PRIORITY

- **Update**: `app.json` → `splash.image`
- **File**: `logo-square.png` or `logo-icon-only.png`
- **Size**: 1024x1024px
- **Background**: Match with `#0F1419` (current dark theme)

### **4. App Icon** ⭐ HIGH PRIORITY

- **Update**: `app.json` → `icon`
- **File**: `logo-square.png`
- **Size**: 1024x1024px (iOS/Android will auto-resize)
- **Note**: Should work on both light/dark mode

### **5. Header Logo (EventsList Screen)**

- **Replace**: Text "SceneTogether" in header
- **File**: `logo-horizontal.png` or `logo-icon-only.png`
- **Size**: Height ~32px
- **Purpose**: Consistent branding in navigation

### **6. Profile Screen**

- **Location**: Top of profile card
- **File**: `logo-icon-only.png`
- **Size**: 60x60px
- **Purpose**: Subtle branding element

### **7. Empty States**

- **Location**: When no events exist
- **File**: `logo-icon-only.png`
- **Size**: 80x80px
- **Purpose**: Branded empty state

### **8. Web Favicon**

- **Update**: `assets/favicon.png`
- **File**: `logo-icon-only.png`
- **Size**: 32x32px or 64x64px
- **Purpose**: Browser tab icon

## 🎨 Design Specifications

### Colors from Logo

- **Teal**: `#46D4AF` (already in theme as `primary`)
- **Navy**: `#0A0E13` (matches `backgroundDark`)
- **Cream**: `#EFF0EF` (for light theme if needed)

### Recommended Variants

1. **Transparent Full Logo** ⭐ (PRIMARY - for auth screens, headers, overlays)
   - Include film reel symbol + "SceneTogether" text
   - **Transparent background** - works on any color!
   - Dimensions: ~200x120px or similar ratio

2. **Icon Only** (for app icon, small spaces)
   - Just the film reel binoculars symbol
   - Square: 1024x1024px (for app stores)
   - Small: 80x80px (for UI elements)
   - Transparent background preferred

3. **Horizontal** (for navigation headers)
   - Film reel + text in horizontal layout
   - Height: 32-40px, width flexible
   - Transparent background preferred

## 📝 Next Steps

1. **Export your logo** in the recommended sizes and formats
2. **Save them** in this directory with proper naming
3. **Test on both iOS and Android** to ensure clarity
4. **Update app.json** for splash screen and icon
5. **Consider accessibility** - ensure contrast ratios meet standards

## 🔧 Updating App Icon & Splash

After adding your logo files, update `app.json`:

```json
{
  "expo": {
    "icon": "./assets/logo/logo-square.png",
    "splash": {
      "image": "./assets/logo/logo-square.png",
      "backgroundColor": "#0F1419" // Match your dark theme
    }
  }
}
```

Then rebuild:

```bash
npx expo prebuild --clean
```

## 🎯 Brand Guidelines

- **Primary Use**: Dark background (`#0F1419`)
- **Accent Color**: Teal (`#46D4AF`) for highlights
- **Minimum Size**: Don't scale below 40px height for legibility
- **Clear Space**: Maintain 20px padding around logo
- **File Format**: PNG with transparency preferred

---

**Created**: 2025-01-12
**Updated**: 2025-01-12
