"use client";

import type { BottomTabBarProps } from "expo-router/js-tabs";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppIcon, type IconName } from "@/components/AppIcon";
import { brand, useAppTheme } from "@/state/theme";

const ICONS: Record<string, IconName> = {
  index: "home",
  calendario: "calendar",
  ajustes: "settings",
};

export function BucleTabBar({ state, descriptors, navigateToTab, insets }: BottomTabBarProps) {
  const { colors } = useAppTheme();

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          paddingBottom: Math.max(insets.bottom, 10),
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const options = descriptors[route.key]?.options;
        const label = options?.title ?? route.name;
        const icon = ICONS[route.name] ?? "home";
        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={label}
            testID={`tab-${route.name}`}
            onPress={() => navigateToTab(route.key)}
            style={[styles.item, focused && { backgroundColor: brand.mint }]}
          >
            <AppIcon name={icon} color={focused ? brand.forest : colors.tabInactive} size={22} />
            <Text style={[styles.label, { color: focused ? brand.forest : colors.tabInactive }]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 8,
    paddingHorizontal: 12,
  },
  item: {
    minWidth: 92,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 18,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
  },
});
