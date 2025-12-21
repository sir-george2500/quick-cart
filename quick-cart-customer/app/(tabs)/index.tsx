/**
 * Home Screen
 * Premium e-commerce home with clean component composition
 */

import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { useThemeStore } from "@/store/themeStore";
import { useAuthStore } from "@/store/authStore";
import {
  Header,
  SearchBar,
  HeroCarousel,
  CategoryCard,
  DealCard,
  ProductCard,
  HERO_BANNERS,
  CATEGORIES,
  FEATURED_PRODUCTS,
  DEALS,
} from "@/components/home";

export default function HomeScreen() {
  const { colorScheme } = useThemeStore();
  const theme = Colors[colorScheme ?? "light"];
  const { user } = useAuthStore();

  const userName = user?.name?.split(" ")[0] || "Guest";

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      {/* Header */}
      <Header userName={userName} theme={theme} avatarUrl={user?.avatar} />

      {/* Search */}
      <SearchBar theme={theme} />

      {/* Hero Carousel */}
      <HeroCarousel banners={HERO_BANNERS} />

      {/* Categories */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Categories
          </Text>
          <TouchableOpacity>
            <Text style={[styles.seeAll, { color: theme.primary }]}>
              See All
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        >
          {CATEGORIES.map((category) => (
            <CategoryCard key={category.id} category={category} theme={theme} />
          ))}
        </ScrollView>
      </View>

      {/* Special Deals */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Special Deals
          </Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        >
          {DEALS.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </ScrollView>
      </View>

      {/* Featured Products */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Fresh From Farms
          </Text>
          <TouchableOpacity>
            <Text style={[styles.seeAll, { color: theme.primary }]}>
              See All
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.productsGrid}>
          {FEATURED_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} theme={theme} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 100,
  },
  section: {
    marginTop: 28,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  seeAll: {
    fontSize: 14,
    fontWeight: "600",
  },
  horizontalList: {
    paddingLeft: 20,
    paddingRight: 4,
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 14,
    gap: 12,
  },
});
