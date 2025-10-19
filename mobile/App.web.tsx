import React from "react";
import { AuthProvider } from "./src/contexts/auth";
import { ToastProvider } from "./src/contexts/toast";
import RootNavigator from "./src/navigation/RootNavigator";

// Web version - no Stripe Provider (native module not supported on web)
export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <RootNavigator />
      </ToastProvider>
    </AuthProvider>
  );
}



