/**
 * HeroBanner Component
 * Premium hero section with background image overlay
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Banner } from "./types";

interface HeroBannerProps {
  banner: Banner;
}

export function HeroBanner({ banner }: HeroBannerProps) {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: banner.image }}
        style={styles.imageBackground}
        imageStyle={styles.image}
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.7)"]}
          style={styles.overlay}
        >
          <View style={styles.content}>
            <Text style={styles.title}>{banner.title}</Text>
            <Text style={styles.subtitle}>{banner.subtitle}</Text>
            <TouchableOpacity style={styles.button} activeOpacity={0.9}>
              <Text style={styles.buttonText}>{banner.buttonText}</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 24,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  imageBackground: {
    height: 180,
  },
  image: {
    borderRadius: 24,
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 20,
  },
  content: {},
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    lineHeight: 20,
    marginBottom: 16,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10B981",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignSelf: "flex-start",
    gap: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
});
