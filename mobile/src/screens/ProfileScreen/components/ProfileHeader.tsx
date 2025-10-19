import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { PencilSquareIcon, UserIcon } from "react-native-heroicons/solid";
import { theme } from "../../../theme";
import { styles } from "../ProfileScreen.styles";

interface ProfileHeaderProps {
  userProfile: {
    name?: string | null;
    avatarUrl?: string | null;
    role?: string | null;
    createdAt?: string | null;
  } | null;
  userEmail?: string | null;
  onEditPress?: () => void;
}

/**
 * Format role for display
 */
const formatRole = (role?: string | null): string => {
  if (!role) return "Member";
  if (role === "SUPER_ADMIN") return "Super Admin";
  if (role === "ADMIN") return "Admin";
  return "Member";
};

/**
 * Get role badge colors
 */
const getRoleBadgeStyle = (role?: string | null) => {
  if (role === "SUPER_ADMIN") {
    return {
      backgroundColor: "#FFD70020",
      borderColor: "#FFD700",
      textColor: "#DAA520",
    }; // Gold
  }
  if (role === "ADMIN") {
    return {
      backgroundColor: "#9B59B620",
      borderColor: "#9B59B6",
      textColor: "#8E44AD",
    }; // Purple
  }
  return {
    backgroundColor: `${theme.colors.primary}20`,
    borderColor: theme.colors.primary,
    textColor: theme.colors.primary,
  }; // Teal for Member
};

/**
 * Format joined date
 */
const formatJoinedDate = (dateString?: string | null): string => {
  if (!dateString) return "Recently";
  const date = new Date(dateString);
  const monthYear = date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  return monthYear;
};

/**
 * Profile header component displaying user avatar, name, email, role, joined date, and optional edit button
 */
export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  userProfile,
  userEmail,
  onEditPress,
}) => {
  const roleStyle = getRoleBadgeStyle(userProfile?.role);

  return (
    <View style={styles.profileCard}>
      {/* Edit Button - Top Right */}
      {onEditPress && (
        <TouchableOpacity
          style={styles.editButtonTopRight}
          onPress={onEditPress}
        >
          <PencilSquareIcon size={18} color={theme.colors.primary} />
        </TouchableOpacity>
      )}

      {userProfile?.avatarUrl ? (
        <Image
          source={{ uri: userProfile.avatarUrl }}
          style={styles.avatarImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.avatar}>
          {userProfile?.name ? (
            <Text style={styles.avatarText}>
              {userProfile.name.charAt(0).toUpperCase()}
            </Text>
          ) : (
            <UserIcon size={50} color={theme.colors.text.inverse} />
          )}
        </View>
      )}
      <Text style={styles.name}>{userProfile?.name || "User"}</Text>
      {userEmail && <Text style={styles.email}>{userEmail}</Text>}

      {/* Role and Joined Date */}
      <View style={styles.metaInfo}>
        <View
          style={[
            styles.roleBadge,
            {
              backgroundColor: roleStyle.backgroundColor,
              borderColor: roleStyle.borderColor,
            },
          ]}
        >
          <Text style={[styles.roleText, { color: roleStyle.textColor }]}>
            {formatRole(userProfile?.role)}
          </Text>
        </View>
        <Text style={styles.joinedText}>
          Joined {formatJoinedDate(userProfile?.createdAt)}
        </Text>
      </View>
    </View>
  );
};
