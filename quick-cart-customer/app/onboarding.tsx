import { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  useColorScheme,
} from "react-native";
import { useRouter } from "expo-router";
import Swiper from "react-native-swiper";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

const { width, height } = Dimensions.get("window");

const slides = [
  {
    id: 1,
    title: "Shop Anywhere",
    description:
      "Browse thousands of products from your favorite brands all in one place",
    image: require("@/assets/onboarding_shopping_1765841076943.png"),
  },
  {
    id: 2,
    title: "Fast Delivery",
    description:
      "Get your orders delivered quickly and safely right to your doorstep",
    image: require("@/assets/onboarding_delivery_1765841092393.png"),
  },
  {
    id: 3,
    title: "Secure Payment",
    description:
      "Shop with confidence using our secure and encrypted payment system",
    image: require("@/assets/onboarding_payment_1765841109616.png"),
  },
];

export default function OnboardingScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const styles = createStyles(theme);

  const handleGetStarted = () => {
    router.replace("/(auth)/login");
  };

  const handleSkip = () => {
    router.replace("/(auth)/login");
  };

  return (
    <View style={styles.container}>
      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Swiper */}
      <Swiper
        loop={false}
        showsPagination
        onIndexChanged={setActiveIndex}
        dotStyle={styles.dot}
        activeDotStyle={styles.activeDot}
        paginationStyle={styles.pagination}
      >
        {slides.map((slide) => (
          <View key={slide.id} style={styles.slide}>
            {/* Image */}
            <View style={styles.imageContainer}>
              <Image
                source={slide.image}
                style={styles.image}
                resizeMode="contain"
              />
            </View>

            {/* Content */}
            <View style={styles.content}>
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.description}>{slide.description}</Text>
            </View>
          </View>
        ))}
      </Swiper>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        {activeIndex === slides.length - 1 ? (
          <TouchableOpacity
            style={styles.getStartedContainer}
            onPress={handleGetStarted}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[theme.primary, theme.primaryDark]}
              style={styles.getStartedButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.getStartedText}>Get Started</Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <View style={styles.navigationHint}>
            <Text style={styles.swipeText}>Swipe to continue</Text>
            <Ionicons name="arrow-forward" size={20} color={theme.primary} />
          </View>
        )}
      </View>
    </View>
  );
}

const createStyles = (theme: typeof Colors.light) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    skipButton: {
      position: "absolute",
      top: 60,
      right: 24,
      zIndex: 10,
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    skipText: {
      color: theme.textSecondary,
      fontSize: 16,
      fontWeight: "600",
    },
    slide: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 32,
    },
    imageContainer: {
      width: width * 0.8,
      height: height * 0.4,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 40,
    },
    image: {
      width: "100%",
      height: "100%",
    },
    content: {
      alignItems: "center",
      paddingHorizontal: 20,
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 16,
      textAlign: "center",
    },
    description: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: "center",
      lineHeight: 24,
    },
    pagination: {
      bottom: 180,
    },
    dot: {
      backgroundColor: theme.border,
      width: 8,
      height: 8,
      borderRadius: 4,
      marginHorizontal: 4,
    },
    activeDot: {
      backgroundColor: theme.primary,
      width: 24,
      height: 8,
      borderRadius: 4,
      marginHorizontal: 4,
    },
    bottomContainer: {
      position: "absolute",
      bottom: 60,
      left: 0,
      right: 0,
      paddingHorizontal: 32,
    },
    getStartedContainer: {
      borderRadius: 16,
      overflow: "hidden",
    },
    getStartedButton: {
      paddingVertical: 18,
      alignItems: "center",
      justifyContent: "center",
    },
    getStartedText: {
      color: "#FFFFFF",
      fontSize: 18,
      fontWeight: "700",
      letterSpacing: 0.5,
    },
    navigationHint: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 8,
    },
    swipeText: {
      color: theme.textSecondary,
      fontSize: 15,
    },
    arrowText: {
      color: theme.primary,
      fontSize: 24,
      fontWeight: "bold",
    },
  });
