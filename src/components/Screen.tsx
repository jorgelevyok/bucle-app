"use client";

import type { ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";

import { useAppTheme } from "@/state/theme";

type ScreenProps = {
  children: ReactNode;
  edges?: Edge[];
  testID?: string;
};

export function Screen({ children, edges = ["top", "left", "right"], testID = "screen-root" }: ScreenProps) {
  const { colors } = useAppTheme();
  return (
    <SafeAreaView testID={testID} edges={edges} style={[styles.screen, { backgroundColor: colors.background }]}>
      {children}
    </SafeAreaView>
  );
}

type CardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  tone?: "surface" | "completed";
};

export function Card({ children, style, tone = "surface" }: CardProps) {
  const { colors } = useAppTheme();
  const backgroundColor = tone === "completed" ? colors.completedCard : colors.surface;
  const borderColor = tone === "completed" ? colors.mint : colors.border;
  return <View style={[styles.card, { backgroundColor, borderColor }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  card: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 16,
  },
});
