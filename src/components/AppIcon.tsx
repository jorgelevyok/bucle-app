"use client";

import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from "react-native";

export type IconName =
  | "menu"
  | "home"
  | "calendar"
  | "settings"
  | "add"
  | "back"
  | "check"
  | "book"
  | "draw"
  | "laptop"
  | "chevronLeft"
  | "chevronRight";

const ICONS: Record<IconName, { ios: string; android: string }> = {
  menu: { ios: "line.3.horizontal", android: "menu" },
  home: { ios: "house.fill", android: "home" },
  calendar: { ios: "calendar", android: "calendar_month" },
  settings: { ios: "gearshape.fill", android: "settings" },
  add: { ios: "plus", android: "add" },
  back: { ios: "chevron.left", android: "arrow_back" },
  check: { ios: "checkmark", android: "check" },
  book: { ios: "book.fill", android: "menu_book" },
  draw: { ios: "pencil", android: "draw" },
  laptop: { ios: "laptopcomputer", android: "laptop" },
  chevronLeft: { ios: "chevron.left", android: "chevron_left" },
  chevronRight: { ios: "chevron.right", android: "chevron_right" },
};

type AppIconProps = {
  name: IconName;
  color: string;
  size?: number;
};

export function AppIcon({ name, color, size = 24 }: AppIconProps) {
  const spec = ICONS[name];
  return (
    <SymbolView
      name={
        {
          ios: spec.ios,
          android: spec.android,
          web: spec.android,
        } as unknown as SymbolViewProps["name"]
      }
      tintColor={color}
      size={size}
    />
  );
}

type AppIconButtonProps = {
  icon: IconName;
  label: string;
  color: string;
  onPress: () => void;
  testID?: string;
  style?: StyleProp<ViewStyle>;
};

export function AppIconButton({ icon, label, color, onPress, testID, style }: AppIconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={8}
      testID={testID}
      style={({ pressed }) => [styles.button, style, pressed && styles.pressed]}
    >
      <AppIcon name={icon} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
  },
  pressed: {
    opacity: 0.6,
  },
});
