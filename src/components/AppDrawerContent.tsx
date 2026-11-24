"use client";

import { Image } from "expo-image";
import { DrawerContentScrollView, type DrawerContentComponentProps } from "expo-router/drawer";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppIcon, type IconName } from "@/components/AppIcon";
import { navigatePath, pushPath } from "@/lib/navigation";
import { useAppTheme } from "@/state/theme";

const logo = require("../../assets/images/bucle-logo.png");

export function AppDrawerContent(props: DrawerContentComponentProps) {
  const { colors } = useAppTheme();

  const goHome = () => {
    props.navigation.closeDrawer();
    navigatePath("/");
  };

  const createHabit = () => {
    props.navigation.closeDrawer();
    pushPath("/habito/nuevo");
  };

  return (
    <DrawerContentScrollView
      {...props}
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
    >
      <Image source={logo} style={styles.logo} contentFit="contain" accessibilityLabel="Bucle" />
      <Text style={[styles.caption, { color: colors.textMuted }]}>Tu cuaderno de hábitos</Text>
      <DrawerLink icon="home" label="Inicio" onPress={goHome} testID="drawer-home" />
      <DrawerLink icon="add" label="Nuevo hábito" onPress={createHabit} testID="drawer-new-habit" />
    </DrawerContentScrollView>
  );
}

function DrawerLink({
  icon,
  label,
  onPress,
  testID,
}: {
  icon: IconName;
  label: string;
  onPress: () => void;
  testID: string;
}) {
  const { colors } = useAppTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => [
        styles.link,
        { backgroundColor: pressed ? colors.mintSoft : "transparent" },
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: colors.mintSoft }]}>
        <AppIcon name={icon} color={colors.accent} size={20} />
      </View>
      <Text style={[styles.linkLabel, { color: colors.text }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 8,
  },
  logo: {
    width: 150,
    height: 48,
    marginBottom: 4,
  },
  caption: {
    fontSize: 14,
    marginBottom: 12,
  },
  link: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  linkLabel: {
    fontSize: 16,
    fontWeight: "700",
  },
});
