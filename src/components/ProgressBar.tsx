"use client";

import { StyleSheet, View } from "react-native";

import { useAppTheme } from "@/state/theme";

type ProgressBarProps = {
  percent: number;
  thickness?: number;
};

export function ProgressBar({ percent, thickness = 10 }: ProgressBarProps) {
  const { colors } = useAppTheme();
  const width = `${Math.max(0, Math.min(100, percent))}%` as const;

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: percent }}
      style={[styles.track, { height: thickness, backgroundColor: colors.track, borderRadius: thickness }]}
    >
      <View style={[styles.fill, { width, backgroundColor: colors.progress, borderRadius: thickness }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: "100%",
    overflow: "hidden",
  },
  fill: {
    height: "100%",
  },
});
