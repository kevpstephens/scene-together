/*===============================================
 * Auth Module - Public API
 * ==============================================
 * Barrel export for all authentication functionality.
 * Exports: AuthProvider, useAuth, types, and auth actions.
 * ==============================================
 */

export type { UserRole, UserProfile, AuthContextType } from "./types";
export { fetchUserRole } from "./sessionManager";
export {
  signUpUser,
  signInUser,
  signInWithGoogleOAuth,
  signOutUser,
} from "./authActions";
export { AuthProvider, useAuth } from "./AuthContext";
