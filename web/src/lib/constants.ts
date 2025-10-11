/**
 * Shared constants and styles for the admin dashboard
 * Use these to ensure consistency across all components
 *
 * These classes reference the shared design system theme
 * imported from the shared package
 */

import { theme } from "../../../shared/src/theme";

// Re-export theme for easy access
export { theme };

// Standardized input styles for all forms
// Ensures dark text on white background with proper contrast and focus states
export const INPUT_CLASSES = `w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[${theme.colors.accent}] focus:border-transparent transition-colors text-gray-900 bg-white placeholder:text-gray-400`;

// Button styles
export const PRIMARY_BUTTON_CLASSES = `px-6 py-3 bg-[${theme.colors.accent}] text-white rounded-lg hover:bg-[${theme.colors.accentHover}] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed`;

export const SECONDARY_BUTTON_CLASSES = `px-6 py-3 bg-white text-[${theme.colors.text}] border-2 border-gray-300 rounded-lg hover:border-[${theme.colors.accent}] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed`;

export const DANGER_BUTTON_CLASSES = `px-4 py-2 bg-[${theme.colors.error}] text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed`;

// Card styles
export const CARD_CLASSES = "bg-white rounded-xl shadow-md p-6";

// Label styles
export const LABEL_CLASSES = "block text-sm font-medium text-gray-700 mb-2";
