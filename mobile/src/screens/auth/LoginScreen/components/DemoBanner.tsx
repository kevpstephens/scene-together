import React from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import {
  ShieldCheckIcon,
  InformationCircleIcon,
} from "react-native-heroicons/outline";
import { theme } from "../../../../theme";
import { styles } from "../LoginScreen.styles";

interface DemoBannerProps {
  onDemoFill: () => void;
  onShowInfo: () => void;
  formTranslateY: Animated.Value;
  formOpacity: Animated.Value;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({
  onDemoFill,
  onShowInfo,
  formTranslateY,
  formOpacity,
}) => {
  return (
    <Animated.View
      style={[
        styles.demoBanner,
        {
          transform: [{ translateY: formTranslateY }],
          opacity: formOpacity,
        },
      ]}
    >
      <View style={styles.demoHeader}>
        <ShieldCheckIcon
          size={24}
          color={theme.colors.primary}
          style={styles.demoIcon}
        />
        <Text style={styles.demoTitle}>Demo Admin Account</Text>
        <TouchableOpacity onPress={onShowInfo} style={styles.infoButton}>
          <InformationCircleIcon
            size={20}
            color={theme.colors.text.secondary}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.demoText}>
        <Text style={styles.demoLabel}>Email: </Text>
        demo@scenetogether.com
      </Text>
      <Text style={styles.demoText}>
        <Text style={styles.demoLabel}>Password: </Text>
        DemoPassword123!
      </Text>
      <TouchableOpacity style={styles.demoButton} onPress={onDemoFill}>
        <Text style={styles.demoButtonText}>← Click to Auto-Fill</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};
