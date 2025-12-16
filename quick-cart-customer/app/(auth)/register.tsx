import { Formik } from "formik";
import * as Yup from "yup";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useColorScheme,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Colors } from "@/constants/Colors";

const { width } = Dimensions.get("window");

// Validation Schema
const RegisterSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name is too long")
    .required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain uppercase, lowercase, and number"
    )
    .required("Password is required"),
});

export default function RegisterScreen() {
  const [showPassword, setShowPassword] = useState(false);

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const styles = createStyles(theme);

  const { register, loading } = useAuthStore();
  const router = useRouter();

  const handleRegister = async (values: {
    name: string;
    email: string;
    password: string;
  }) => {
    try {
      // Register with CUSTOMER role by default (backend requirement)
      await register({
        ...values,
        role: "CUSTOMER",
      });
      router.replace("/(tabs)");
    } catch (err: any) {
      Alert.alert(
        "Registration Failed",
        err.response?.data?.message || "Please try again"
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero Section with Gradient */}
        <View style={styles.hero}>
          <LinearGradient
            colors={[theme.primary, theme.primaryDark]}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.heroContent}>
              <Ionicons name="cart" size={64} color="#FFFFFF" />
              <Text style={styles.heroTitle}>Quick-Cart</Text>
              <Text style={styles.heroSubtitle}>Join us today</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          <View style={styles.formHeader}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to get started</Text>
          </View>

          <Formik
            initialValues={{ name: "", email: "", password: "" }}
            validationSchema={RegisterSchema}
            onSubmit={handleRegister}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <>
                {/* Name Input */}
                <View style={styles.inputContainer}>
                  <View
                    style={[
                      styles.inputWrapper,
                      touched.name && errors.name && styles.inputError,
                    ]}
                  >
                    <Ionicons
                      name="person-outline"
                      size={20}
                      color={theme.textSecondary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Full name"
                      placeholderTextColor={theme.placeholder}
                      value={values.name}
                      onChangeText={handleChange("name")}
                      onBlur={handleBlur("name")}
                      autoCapitalize="words"
                      editable={!loading}
                    />
                  </View>
                  {touched.name && errors.name && (
                    <Text style={styles.errorText}>{errors.name}</Text>
                  )}
                </View>

                {/* Email Input */}
                <View style={styles.inputContainer}>
                  <View
                    style={[
                      styles.inputWrapper,
                      touched.email && errors.email && styles.inputError,
                    ]}
                  >
                    <Ionicons
                      name="mail-outline"
                      size={20}
                      color={theme.textSecondary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Email address"
                      placeholderTextColor={theme.placeholder}
                      value={values.email}
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      editable={!loading}
                    />
                  </View>
                  {touched.email && errors.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}
                </View>

                {/* Password Input */}
                <View style={styles.inputContainer}>
                  <View
                    style={[
                      styles.inputWrapper,
                      touched.password && errors.password && styles.inputError,
                    ]}
                  >
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color={theme.textSecondary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[styles.input, { flex: 1 }]}
                      placeholder="Password (min 8 characters)"
                      placeholderTextColor={theme.placeholder}
                      value={values.password}
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      editable={!loading}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeButton}
                    >
                      <Ionicons
                        name={showPassword ? "eye-outline" : "eye-off-outline"}
                        size={20}
                        color={theme.textSecondary}
                      />
                    </TouchableOpacity>
                  </View>
                  {touched.password && errors.password && (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  )}
                </View>

                {/* Register Button */}
                <TouchableOpacity
                  style={styles.buttonContainer}
                  onPress={() => handleSubmit()}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={[theme.primary, theme.primaryDark]}
                    style={styles.button}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    {loading ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <Text style={styles.buttonText}>Create Account</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}
          </Formik>

          {/* Login Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.back()} disabled={loading}>
              <Text style={styles.footerLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (theme: typeof Colors.light) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContent: {
      flexGrow: 1,
    },
    hero: {
      height: 260,
      width: "100%",
    },
    gradient: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    heroContent: {
      alignItems: "center",
      paddingTop: 60,
    },
    heroTitle: {
      fontSize: 36,
      fontWeight: "bold",
      color: "#FFFFFF",
      marginTop: 12,
      marginBottom: 8,
      letterSpacing: 1,
    },
    heroSubtitle: {
      fontSize: 16,
      color: "#FFFFFF",
      opacity: 0.9,
    },
    formCard: {
      flex: 1,
      backgroundColor: theme.background,
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      marginTop: -32,
      paddingHorizontal: 24,
      paddingTop: 32,
      paddingBottom: 24,
    },
    formHeader: {
      marginBottom: 32,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 15,
      color: theme.textSecondary,
    },
    inputContainer: {
      marginBottom: 16,
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.surface,
      borderRadius: 16,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: theme.border,
    },
    inputError: {
      borderColor: theme.error,
    },
    inputIcon: {
      marginRight: 12,
    },
    input: {
      flex: 1,
      paddingVertical: 18,
      fontSize: 16,
      color: theme.text,
    },
    eyeButton: {
      padding: 8,
    },
    errorText: {
      color: theme.error,
      fontSize: 12,
      marginTop: 4,
      marginLeft: 4,
    },
    buttonContainer: {
      borderRadius: 16,
      overflow: "hidden",
      marginTop: 8,
      marginBottom: 24,
    },
    button: {
      paddingVertical: 18,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: {
      color: "#FFFFFF",
      fontSize: 17,
      fontWeight: "700",
      letterSpacing: 0.5,
    },
    footer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 16,
    },
    footerText: {
      color: theme.textSecondary,
      fontSize: 15,
    },
    footerLink: {
      color: theme.primary,
      fontSize: 15,
      fontWeight: "700",
    },
  });
