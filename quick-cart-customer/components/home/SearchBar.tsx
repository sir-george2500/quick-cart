/**
 * SearchBar Component
 * Modern search input with filter button
 */

import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

interface SearchBarProps {
  theme: typeof Colors.light;
  placeholder?: string;
  onSearch?: (text: string) => void;
  onFilterPress?: () => void;
}

export function SearchBar({
  theme,
  placeholder = "Search fresh produce...",
  onSearch,
  onFilterPress,
}: SearchBarProps) {
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.surface, borderColor: theme.border },
      ]}
    >
      <Ionicons
        name="search"
        size={20}
        color={theme.textSecondary}
        style={styles.searchIcon}
      />
      <TextInput
        style={[styles.input, { color: theme.text }]}
        placeholder={placeholder}
        placeholderTextColor={theme.placeholder}
        onChangeText={onSearch}
      />
      <TouchableOpacity
        style={[styles.filterBtn, { backgroundColor: theme.primary }]}
        onPress={onFilterPress}
        activeOpacity={0.8}
      >
        <Ionicons name="options-outline" size={18} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 8,
  },
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});
