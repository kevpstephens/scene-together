/**
 * Auth module exports
 * Clean barrel export for authentication functionality
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
