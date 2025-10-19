import React from "react";
import { View, Text } from "react-native";
import { CreditCardIcon } from "react-native-heroicons/solid";
import { theme } from "../../../theme";
import { styles } from "../ProfileScreen.styles";
import SkeletonLoader from "../../../components/SkeletonLoader";
import type { Payment } from "../hooks";

interface PaymentHistoryProps {
  loading: boolean;
  payments: Payment[];
}

/**
 * Payment history section displaying recent transactions
 */
export const PaymentHistory: React.FC<PaymentHistoryProps> = ({
  loading,
  payments,
}) => {
  if (loading) {
    return (
      <View style={styles.paymentHistoryCard}>
        <Text style={styles.sectionTitle}>Payment History</Text>
        <Text style={styles.sectionSubtitle}>Your recent transactions</Text>
        {[1, 2, 3].map((i) => (
          <View key={i} style={styles.paymentItem}>
            <View style={styles.paymentIconContainer}>
              <SkeletonLoader width={24} height={24} borderRadius={12} />
            </View>
            <View style={styles.paymentDetails}>
              <SkeletonLoader
                width="70%"
                height={18}
                style={{ marginBottom: 6 }}
              />
              <SkeletonLoader width="50%" height={14} />
            </View>
            <View style={styles.paymentAmountContainer}>
              <SkeletonLoader
                width={60}
                height={18}
                style={{ marginBottom: 6 }}
              />
              <SkeletonLoader
                width={70}
                height={18}
                borderRadius={theme.borderRadius.sm}
              />
            </View>
          </View>
        ))}
      </View>
    );
  }

  if (payments.length === 0) {
    return null;
  }

  return (
    <View style={styles.paymentHistoryCard}>
      <Text style={styles.sectionTitle}>Payment History</Text>
      <Text style={styles.sectionSubtitle}>Your recent transactions</Text>

      {payments.slice(0, 5).map((payment) => (
        <View key={payment.id} style={styles.paymentItem}>
          <View style={styles.paymentIconContainer}>
            <CreditCardIcon size={24} color={theme.colors.primary} />
          </View>

          <View style={styles.paymentDetails}>
            <Text style={styles.paymentEventTitle} numberOfLines={1}>
              {payment.event.title}
            </Text>
            <Text style={styles.paymentDate}>
              {new Date(payment.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </Text>
          </View>

          <View style={styles.paymentAmountContainer}>
            <Text style={styles.paymentAmount}>
              £{(payment.amount / 100).toFixed(2)}
            </Text>
            <View
              style={[
                styles.paymentStatusBadge,
                {
                  backgroundColor:
                    payment.status === "succeeded"
                      ? `${theme.colors.success}20`
                      : `${theme.colors.warning}20`,
                },
              ]}
            >
              <Text
                style={[
                  styles.paymentStatusText,
                  {
                    color:
                      payment.status === "succeeded"
                        ? theme.colors.success
                        : theme.colors.warning,
                  },
                ]}
              >
                {payment.status === "succeeded"
                  ? "Paid"
                  : payment.status === "refunded"
                    ? "Refunded"
                    : payment.status}
              </Text>
            </View>
          </View>
        </View>
      ))}

      {payments.length > 5 && (
        <Text style={styles.paymentHistoryFooter}>
          Showing {Math.min(5, payments.length)} of {payments.length}{" "}
          transactions
        </Text>
      )}
    </View>
  );
};
