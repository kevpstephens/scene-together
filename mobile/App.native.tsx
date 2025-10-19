import React from "react";
import { StripeProvider } from "@stripe/stripe-react-native";
import { AuthProvider } from "./src/contexts/auth";
import { ToastProvider } from "./src/contexts/toast";
import RootNavigator from "./src/navigation/RootNavigator";

const STRIPE_PUBLISHABLE_KEY =
  process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

export default function App() {
  return (
    <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
      <AuthProvider>
        <ToastProvider>
          <RootNavigator />
        </ToastProvider>
      </AuthProvider>
    </StripeProvider>
  );
}



