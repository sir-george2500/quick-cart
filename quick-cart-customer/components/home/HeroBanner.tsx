/**
 * HeroCarousel Component
 * True circular carousel - clones at both ends for seamless loop
 * [last] [1] [2] [3] [4] [first] - start at index 1
 */

import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Dimensions,
  ScrollView,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Banner } from "./types";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width * 0.85;
const ITEM_SPACING = (width - ITEM_WIDTH) / 2;
const AUTO_SCROLL_INTERVAL = 4000;

interface HeroCarouselProps {
  banners: Banner[];
  onBannerPress?: (banner: Banner) => void;
}

export function HeroCarousel({ banners, onBannerPress }: HeroCarouselProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollX = useRef(new Animated.Value(ITEM_WIDTH)).current; // Start at index 1
  const [currentIndex, setCurrentIndex] = useState(0);
  const isAutoScrolling = useRef(false);

  // Clone: [last, ...originals, first]
  const extendedBanners = [
    banners[banners.length - 1], // Clone of last at start
    ...banners,
    banners[0], // Clone of first at end
  ];

  // Start at position 1 (first real item)
  useEffect(() => {
    scrollViewRef.current?.scrollTo({ x: ITEM_WIDTH, animated: false });
  }, []);

  const scrollToPosition = useCallback((position: number, animated = true) => {
    scrollViewRef.current?.scrollTo({ x: position, animated });
  }, []);

  // Auto-scroll forward
  useEffect(() => {
    const timer = setInterval(() => {
      isAutoScrolling.current = true;

      setCurrentIndex((prev) => {
        const nextDisplayIndex = (prev + 1) % banners.length;
        const nextScrollIndex = prev + 2; // +2 because index 0 is clone

        // Scroll to next position
        scrollToPosition(nextScrollIndex * ITEM_WIDTH, true);

        // If we just scrolled to the end clone, reset after animation
        if (nextScrollIndex >= banners.length + 1) {
          setTimeout(() => {
            scrollToPosition(ITEM_WIDTH, false); // Jump to real first
            isAutoScrolling.current = false;
          }, 400);
        } else {
          setTimeout(() => {
            isAutoScrolling.current = false;
          }, 400);
        }

        return nextDisplayIndex;
      });
    }, AUTO_SCROLL_INTERVAL);

    return () => clearInterval(timer);
  }, [banners.length, scrollToPosition]);

  const handleScrollEnd = (event: any) => {
    if (isAutoScrolling.current) return;

    const offsetX = event.nativeEvent.contentOffset.x;
    const scrollIndex = Math.round(offsetX / ITEM_WIDTH);

    // Handle edge cases for manual scroll
    if (scrollIndex === 0) {
      // Scrolled to start clone - jump to real last
      scrollToPosition(banners.length * ITEM_WIDTH, false);
      setCurrentIndex(banners.length - 1);
    } else if (scrollIndex === banners.length + 1) {
      // Scrolled to end clone - jump to real first
      scrollToPosition(ITEM_WIDTH, false);
      setCurrentIndex(0);
    } else {
      setCurrentIndex(scrollIndex - 1);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={16}
      >
        {extendedBanners.map((item, index) => {
          const inputRange = [
            (index - 1) * ITEM_WIDTH,
            index * ITEM_WIDTH,
            (index + 1) * ITEM_WIDTH,
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.9, 1, 0.9],
            extrapolate: "clamp",
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.7, 1, 0.7],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={`${item.id}-${index}`}
              style={[
                styles.itemContainer,
                { transform: [{ scale }], opacity },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.95}
                onPress={() => onBannerPress?.(item)}
                style={styles.bannerContainer}
              >
                <ImageBackground
                  source={{ uri: item.image }}
                  style={styles.imageBackground}
                  imageStyle={styles.image}
                >
                  <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.75)"]}
                    style={styles.overlay}
                  >
                    <View style={styles.content}>
                      <Text style={styles.title}>{item.title}</Text>
                      <Text style={styles.subtitle}>{item.subtitle}</Text>
                      <TouchableOpacity
                        style={styles.button}
                        activeOpacity={0.9}
                      >
                        <Text style={styles.buttonText}>{item.buttonText}</Text>
                        <Ionicons
                          name="arrow-forward"
                          size={16}
                          color="#FFFFFF"
                        />
                      </TouchableOpacity>
                    </View>
                  </LinearGradient>
                </ImageBackground>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </Animated.ScrollView>

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {banners.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  scrollContent: {
    paddingHorizontal: ITEM_SPACING,
  },
  itemContainer: {
    width: ITEM_WIDTH,
    height: 200,
  },
  bannerContainer: {
    flex: 1,
    borderRadius: 24,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  imageBackground: {
    flex: 1,
  },
  image: {
    borderRadius: 24,
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 24,
  },
  content: {},
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 6,
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.9)",
    lineHeight: 18,
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
    gap: 6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10B981",
  },
  dotActive: {
    width: 24,
    opacity: 1,
  },
  dotInactive: {
    width: 8,
    opacity: 0.4,
  },
});
