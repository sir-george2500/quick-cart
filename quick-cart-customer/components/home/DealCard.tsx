/**
 * DealCard Component
 * Premium deal card with image and gradient overlay
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Deal } from "./types";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.7;

interface DealCardProps {
  deal: Deal;
  onPress?: () => void;
}

export function DealCard({ deal, onPress }: DealCardProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <ImageBackground
        source={{ uri: deal.image }}
        style={styles.imageBackground}
        imageStyle={styles.image}
      >
        <LinearGradient
          colors={[`${deal.backgroundColor}E6`, deal.backgroundColor]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.overlay}
        >
          <Text style={styles.discount}>{deal.discount}</Text>
          <Text style={styles.title}>{deal.title}</Text>
          <Text style={styles.subtitle}>{deal.subtitle}</Text>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: 120,
    marginRight: 16,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  imageBackground: {
    flex: 1,
  },
  image: {
    borderRadius: 20,
  },
  overlay: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  discount: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.85)",
  },
});
