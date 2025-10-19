import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { PencilSquareIcon, UserIcon } from "react-native-heroicons/solid";
import { theme } from "../../../theme";
import { styles } from "../ProfileScreen.styles";

interface ProfileHeaderProps {
  userProfile: {
    name?: string | null;
    avatarUrl?: string | null;
  } | null;
  userEmail?: string;
  onEditPress: () => void;
}

/**
 * Profile header component displaying user avatar, name, email, and edit button
 */
export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  userProfile,
  userEmail,
  onEditPress,
}) => {
  return (
    <View style={styles.profileCard}>
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
      <Text style={styles.email}>{userEmail}</Text>

      <TouchableOpacity style={styles.editButton} onPress={onEditPress}>
        <PencilSquareIcon size={20} color={theme.colors.primary} />
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
};
