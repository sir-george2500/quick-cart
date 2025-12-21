/**
 * Profile Screen
 * Beautiful, modern profile with glassmorphism design
 * Features: User info, settings, logout, theme toggle
 */

import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Switch,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";

const { width } = Dimensions.get("window");

interface SettingsItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightComponent?: React.ReactNode;
  iconColor?: string;
  theme: typeof Colors.light;
}

const SettingsItem = ({
  icon,
  title,
  subtitle,
  onPress,
  rightComponent,
  iconColor,
  theme,
}: SettingsItemProps) => (
  <TouchableOpacity
    style={[
      styles.settingsItem,
      { backgroundColor: theme.card, borderColor: theme.border },
    ]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View
      style={[
        styles.settingsIconContainer,
        { backgroundColor: `${iconColor || theme.primary}15` },
      ]}
    >
      <Ionicons name={icon} size={22} color={iconColor || theme.primary} />
    </View>
    <View style={styles.settingsTextContainer}>
      <Text style={[styles.settingsTitle, { color: theme.text }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.settingsSubtitle, { color: theme.textSecondary }]}>
          {subtitle}
        </Text>
      )}
    </View>
    {rightComponent || (
      <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
    )}
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const { colorScheme, toggleTheme } = useThemeStore();
  const isDark = colorScheme === "dark";
  const theme = Colors[colorScheme ?? "light"];

  const router = useRouter();
  const { user, logout, loading } = useAuthStore();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const handleEditProfile = () => {
    Alert.alert("Coming Soon", "Edit profile feature coming soon!");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header with Gradient */}
      <LinearGradient
        colors={[theme.primary, theme.primaryDark]}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Decorative circles */}
        <View style={[styles.decorativeCircle, styles.circle1]} />
        <View style={[styles.decorativeCircle, styles.circle2]} />

        <View style={styles.headerContent}>
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <View
                style={[
                  styles.avatarPlaceholder,
                  { backgroundColor: "rgba(255,255,255,0.2)" },
                ]}
              >
                <Text style={styles.avatarInitials}>
                  {user?.name ? getInitials(user.name) : "U"}
                </Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.editAvatarButton}
              onPress={handleEditProfile}
            >
              <Ionicons name="camera" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* User Info */}
          <Text style={styles.userName}>{user?.name || "Guest User"}</Text>
          <Text style={styles.userEmail}>
            {user?.email || "guest@example.com"}
          </Text>

          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>
            <View
              style={[
                styles.statDivider,
                { backgroundColor: "rgba(255,255,255,0.3)" },
              ]}
            />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>4</Text>
              <Text style={styles.statLabel}>Wishlist</Text>
            </View>
            <View
              style={[
                styles.statDivider,
                { backgroundColor: "rgba(255,255,255,0.3)" },
              ]}
            />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>2</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Settings Sections */}
      <View style={styles.settingsContainer}>
        {/* Account Section */}
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          Account
        </Text>
        <View style={styles.settingsGroup}>
          <SettingsItem
            icon="person-outline"
            title="Edit Profile"
            subtitle="Update your personal information"
            onPress={handleEditProfile}
            theme={theme}
          />
          <SettingsItem
            icon="location-outline"
            title="Addresses"
            subtitle="Manage delivery addresses"
            onPress={() =>
              Alert.alert("Coming Soon", "Addresses feature coming soon!")
            }
            theme={theme}
            iconColor="#3B82F6"
          />
          <SettingsItem
            icon="card-outline"
            title="Payment Methods"
            subtitle="Add or remove payment options"
            onPress={() =>
              Alert.alert("Coming Soon", "Payment methods coming soon!")
            }
            theme={theme}
            iconColor="#8B5CF6"
          />
        </View>

        {/* Preferences Section */}
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          Preferences
        </Text>
        <View style={styles.settingsGroup}>
          <SettingsItem
            icon="notifications-outline"
            title="Notifications"
            subtitle="Manage push notifications"
            onPress={() =>
              Alert.alert("Coming Soon", "Notifications settings coming soon!")
            }
            theme={theme}
            iconColor="#F59E0B"
          />
          <SettingsItem
            icon={isDark ? "moon" : "sunny"}
            title="Dark Mode"
            subtitle={isDark ? "Dark theme enabled" : "Light theme enabled"}
            onPress={toggleTheme}
            theme={theme}
            iconColor={isDark ? "#6366F1" : "#F59E0B"}
            rightComponent={
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor="#FFFFFF"
              />
            }
          />
        </View>

        {/* Support Section */}
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          Support
        </Text>
        <View style={styles.settingsGroup}>
          <SettingsItem
            icon="help-circle-outline"
            title="Help Center"
            subtitle="FAQs and support"
            onPress={() =>
              Alert.alert("Coming Soon", "Help center coming soon!")
            }
            theme={theme}
            iconColor="#14B8A6"
          />
          <SettingsItem
            icon="chatbubble-outline"
            title="Contact Us"
            subtitle="Get in touch with support"
            onPress={() =>
              Alert.alert("Coming Soon", "Contact support coming soon!")
            }
            theme={theme}
            iconColor="#EC4899"
          />
          <SettingsItem
            icon="document-text-outline"
            title="Terms & Privacy"
            subtitle="Legal information"
            onPress={() =>
              Alert.alert("Coming Soon", "Terms and privacy coming soon!")
            }
            theme={theme}
            iconColor="#6B7280"
          />
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[
            styles.logoutButton,
            { backgroundColor: `${theme.error}15`, borderColor: theme.error },
          ]}
          onPress={handleLogout}
          activeOpacity={0.7}
          disabled={loading}
        >
          <Ionicons name="log-out-outline" size={22} color={theme.error} />
          <Text style={[styles.logoutText, { color: theme.error }]}>
            {loading ? "Logging out..." : "Logout"}
          </Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={[styles.versionText, { color: theme.textLight }]}>
          Quick-Cart v1.0.0
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
  },
  decorativeCircle: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  circle1: {
    width: 200,
    height: 200,
    top: -50,
    right: -50,
  },
  circle2: {
    width: 150,
    height: 150,
    bottom: -30,
    left: -40,
  },
  headerContent: {
    alignItems: "center",
    zIndex: 1,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.3)",
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.3)",
  },
  avatarInitials: {
    fontSize: 36,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 16,
    padding: 16,
    width: "100%",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: "100%",
  },
  settingsContainer: {
    padding: 24,
    paddingTop: 32,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  settingsGroup: {
    marginBottom: 24,
    gap: 10,
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  settingsIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  settingsTextContainer: {
    flex: 1,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  settingsSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 8,
    gap: 10,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
  },
  versionText: {
    textAlign: "center",
    marginTop: 24,
    marginBottom: 40,
    fontSize: 12,
  },
});
