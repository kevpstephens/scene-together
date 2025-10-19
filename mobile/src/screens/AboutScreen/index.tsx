/*===============================================
 * About Screen
 * ==============================================
 * App information, version, and support details.
 * ==============================================
 */

import React from "react";
import { View, Text, ScrollView } from "react-native";
import { styles } from "./AboutScreen.styles";
import { EnvelopeIcon, GlobeAltIcon } from "react-native-heroicons/outline";
import { theme } from "../../theme";
import Constants from "expo-constants";

export default function AboutScreen() {
  const appVersion = Constants.expoConfig?.version || "1.0.0";

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* App Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.appName}>SceneTogether</Text>
          <Text style={styles.tagline}>
            Your Community Film Screening Platform
          </Text>
          <View style={styles.versionBadge}>
            <Text style={styles.versionText}>Version {appVersion}</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionText}>
            SceneTogether brings film lovers together for unforgettable
            screening experiences. Discover local events, join watchalongs, and
            connect with your community through the magic of cinema.
          </Text>
        </View>

        {/* Contact & Links - Placeholders */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Get in Touch (Coming Soon)</Text>

          <View style={styles.linkItem}>
            <View style={styles.linkIconContainer}>
              <EnvelopeIcon size={20} color={theme.colors.text.tertiary} />
            </View>
            <View style={styles.linkTextContainer}>
              <Text style={[styles.linkTitle, styles.placeholderText]}>
                Support Email
              </Text>
              <Text style={[styles.linkSubtitle, styles.placeholderSubtext]}>
                Contact information coming soon
              </Text>
            </View>
          </View>

          <View style={styles.linkItem}>
            <View style={styles.linkIconContainer}>
              <GlobeAltIcon size={20} color={theme.colors.text.tertiary} />
            </View>
            <View style={styles.linkTextContainer}>
              <Text style={[styles.linkTitle, styles.placeholderText]}>
                Website
              </Text>
              <Text style={[styles.linkSubtitle, styles.placeholderSubtext]}>
                Official website coming soon
              </Text>
            </View>
          </View>
        </View>

        {/* Copyright */}
        <View style={styles.copyrightContainer}>
          <Text style={styles.copyrightText}>
            © {new Date().getFullYear()} SceneTogether.
          </Text>
          <Text style={styles.copyrightSubtext}></Text>
        </View>
      </ScrollView>
    </View>
  );
}
