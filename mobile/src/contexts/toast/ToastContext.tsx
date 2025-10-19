/*===============================================
 * Toast Context
 * ==============================================
 * Provides global toast notification functionality.
 * Manages display of success, error, info, and warning messages.
 * ==============================================
 */

import React, { createContext, useContext, useState, ReactNode } from "react";
import Toast from "../../components/Toast";

type ToastType = "success" | "error" | "info" | "warning";

type ToastContextType = {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

/**
 * Toast Provider Component
 * Wraps the app to provide toast notification functionality
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<ToastType>("info");
  const [duration, setDuration] = useState(3000);

  /**
   * Show a toast notification
   * @param msg - Message to display
   * @param toastType - Type of toast (success, error, info, warning)
   * @param toastDuration - Duration in milliseconds
   */
  const showToast = (
    msg: string,
    toastType: ToastType = "info",
    toastDuration: number = 3000
  ) => {
    setMessage(msg);
    setType(toastType);
    setDuration(toastDuration);
    setVisible(true);
  };

  const hideToast = () => {
    setVisible(false);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast
        message={message}
        type={type}
        visible={visible}
        onHide={hideToast}
        duration={duration}
      />
    </ToastContext.Provider>
  );
}

/**
 * Hook to access toast notification functionality
 * @throws Error if used outside ToastProvider
 */
export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
