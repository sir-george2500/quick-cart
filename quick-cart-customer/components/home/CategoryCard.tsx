/**
 * CategoryCard Component
 * Circular category card with image overlay
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Category } from "./types";
import { Colors } from "@/constants/Colors";

interface CategoryCardProps {
  category: Category;
  theme: typeof Colors.light;
  onPress?: () => void;
}

export function CategoryCard({ category, theme, onPress }: CategoryCardProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.imageContainer, { backgroundColor: theme.surface }]}>
        <Image source={{ uri: category.image }} style={styles.image} />
      </View>
      <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
        {category.name}
      </Text>
      <Text style={[styles.count, { color: theme.textSecondary }]}>
        {category.productCount} items
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginRight: 16,
    width: 80,
  },
  imageContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    overflow: "hidden",
    marginBottom: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  name: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 2,
  },
  count: {
    fontSize: 11,
  },
});
