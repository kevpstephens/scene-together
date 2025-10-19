import React from "react";
import { AuthProvider } from "./src/contexts/auth";
import { ToastProvider } from "./src/contexts/toast";
import RootNavigator from "./src/navigation/RootNavigator";
import { StripeProvider } from "./src/lib/stripe";

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <StripeProvider>
          <RootNavigator />
        </StripeProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
