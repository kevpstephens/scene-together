import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { CreditCardIcon, XMarkIcon } from "react-native-heroicons/outline";
import { theme } from "../../../theme";
import { styles } from "../EventDetailScreen.styles";
import type { Event } from "../../../types";

interface PWYCModalProps {
  visible: boolean;
  event: Event | null;
  rsvpLoading: boolean;
  onClose: () => void;
  onConfirm: (amountInCents: number) => void;
  showToast: (message: string, type: "success" | "error" | "info") => void;
}

export const PWYCModal: React.FC<PWYCModalProps> = ({
  visible,
  event,
  rsvpLoading,
  onClose,
  onConfirm,
  showToast,
}) => {
  const [pwycAmount, setPwycAmount] = useState("");

  const handleClose = () => {
    onClose();
    setPwycAmount("");
  };

  const handleConfirm = () => {
    const amountInPounds = parseFloat(pwycAmount);
    if (isNaN(amountInPounds) || amountInPounds <= 0) {
      showToast("Please enter a valid amount", "error");
      return;
    }

    const amountInCents = Math.round(amountInPounds * 100);
    const minPrice = event?.minPrice || 0;

    if (amountInCents < minPrice) {
      showToast(
        `Amount must be at least £${(minPrice / 100).toFixed(2)}`,
        "error"
      );
      return;
    }

    onConfirm(amountInCents);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent} pointerEvents="box-none">
                <Text style={styles.modalTitle}>Pay What You Can</Text>
                <Text style={styles.modalSubtitle}>
                  Minimum: £{((event?.minPrice || 0) / 100).toFixed(2)}
                </Text>

                <View style={styles.amountInputContainer}>
                  <Text style={styles.currencySymbol}>£</Text>
                  <TextInput
                    style={styles.amountInput}
                    placeholder="0.00"
                    placeholderTextColor={theme.colors.text.tertiary}
                    keyboardType="decimal-pad"
                    value={pwycAmount}
                    onChangeText={(text) => {
                      // Only allow numbers and decimal point
                      const cleaned = text.replace(/[^0-9.]/g, "");
                      // Only allow one decimal point
                      const parts = cleaned.split(".");
                      if (parts.length > 2) return;
                      setPwycAmount(cleaned);
                    }}
                    autoFocus
                  />
                </View>

                <View style={styles.modalButtons} pointerEvents="box-none">
                  <TouchableOpacity
                    style={styles.modalCancelButton}
                    onPress={() => {
                      handleClose();
                    }}
                    activeOpacity={0.7}
                  >
                    <XMarkIcon size={22} color={theme.colors.primary} />
                    <Text style={styles.modalCancelButtonText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.modalConfirmButton,
                      rsvpLoading && { opacity: 0.6 },
                    ]}
                    onPress={() => {
                      handleConfirm();
                    }}
                    disabled={rsvpLoading}
                    activeOpacity={0.7}
                  >
                    {rsvpLoading ? (
                      <ActivityIndicator
                        size="small"
                        color={theme.colors.text.inverse}
                      />
                    ) : (
                      <>
                        <CreditCardIcon
                          size={20}
                          color={theme.colors.text.inverse}
                        />
                        <Text style={styles.modalConfirmButtonText}>
                          Continue to Payment
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};
