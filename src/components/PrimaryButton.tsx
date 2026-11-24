"use client";

import { Pressable, StyleSheet, Text } from "react-native";

import { AppIcon, type IconName } from "@/components/AppIcon";
import { useAppTheme } from "@/state/theme";

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  icon?: IconName;
  tone?: "primary" | "danger" | "ghost";
  disabled?: boolean;
  testID?: string;
};

export function PrimaryButton({
  label,
  onPress,
  icon,
  tone = "primary",
  disabled = false,
  testID,
}: PrimaryButtonProps) {
  const { colors } = useAppTheme();
  const backgroundColor =
    tone === "primary" ? colors.primary : tone === "danger" ? "transparent" : "transparent";
  const textColor = tone === "primary" ? colors.onPrimary : tone === "danger" ? colors.danger : colors.accent;
  const borderColor = tone === "primary" ? colors.primary : tone === "danger" ? colors.danger : colors.border;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor, borderColor, opacity: disabled ? 0.5 : pressed ? 0.85 : 1 },
      ]}
    >
      {icon ? <AppIcon name={icon} color={textColor} size={20} /> : null}
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  label: {
    fontSize: 17,
    fontWeight: "700",
  },
});
