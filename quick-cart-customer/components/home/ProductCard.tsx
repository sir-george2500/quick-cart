/**
 * ProductCard Component
 * Premium product card with image, rating, and price
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Product } from "./types";
import { Colors } from "@/constants/Colors";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 52) / 2;

interface ProductCardProps {
  product: Product;
  theme: typeof Colors.light;
  onPress?: () => void;
  onAddToCart?: () => void;
  onToggleFavorite?: () => void;
}

export function ProductCard({
  product,
  theme,
  onPress,
  onAddToCart,
  onToggleFavorite,
}: ProductCardProps) {
  const hasDiscount =
    product.originalPrice && product.originalPrice > product.price;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: theme.card, borderColor: theme.border },
      ]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Image Section */}
      <View style={styles.imageSection}>
        <Image source={{ uri: product.image }} style={styles.productImage} />

        {/* Organic Badge */}
        {product.isOrganic && (
          <View style={styles.organicBadge}>
            <Text style={styles.organicText}>Organic</Text>
          </View>
        )}

        {/* Discount Badge */}
        {hasDiscount && (
          <View
            style={[styles.discountBadge, { backgroundColor: theme.error }]}
          >
            <Text style={styles.discountText}>
              -{Math.round((1 - product.price / product.originalPrice!) * 100)}%
            </Text>
          </View>
        )}

        {/* Favorite Button */}
        <TouchableOpacity
          style={[styles.favoriteBtn, { backgroundColor: theme.card }]}
          onPress={onToggleFavorite}
        >
          <Ionicons
            name="heart-outline"
            size={18}
            color={theme.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {/* Info Section */}
      <View style={styles.infoSection}>
        <Text style={[styles.farm, { color: theme.primary }]}>
          {product.farm}
        </Text>
        <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
          {product.name}
        </Text>

        {/* Rating */}
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={12} color="#F59E0B" />
          <Text style={[styles.rating, { color: theme.text }]}>
            {product.rating}
          </Text>
          <Text style={[styles.reviews, { color: theme.textSecondary }]}>
            ({product.reviewCount})
          </Text>
        </View>

        {/* Price Row */}
        <View style={styles.priceRow}>
          <View>
            <Text style={[styles.price, { color: theme.text }]}>
              ${product.price.toFixed(2)}
              <Text style={styles.unit}>/{product.unit}</Text>
            </Text>
            {hasDiscount && (
              <Text
                style={[styles.originalPrice, { color: theme.textSecondary }]}
              >
                ${product.originalPrice!.toFixed(2)}
              </Text>
            )}
          </View>
          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: theme.primary }]}
            onPress={onAddToCart}
          >
            <Ionicons name="add" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  imageSection: {
    height: 120,
    position: "relative",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  organicBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#10B981",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  organicText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  discountBadge: {
    position: "absolute",
    top: 8,
    right: 44,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  discountText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  favoriteBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  infoSection: {
    padding: 12,
  },
  farm: {
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  rating: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  reviews: {
    fontSize: 11,
    marginLeft: 2,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
  },
  unit: {
    fontSize: 11,
    fontWeight: "400",
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: "line-through",
  },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
