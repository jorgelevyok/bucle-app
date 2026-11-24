"use client";

import { Image } from "expo-image";
import { useNavigation } from "expo-router";
import { StyleSheet, View } from "react-native";

import { AppIconButton } from "@/components/AppIcon";
import { goBack } from "@/lib/navigation";
import { useAppTheme } from "@/state/theme";

const logo = require("../../assets/images/bucle-logo.png");

function useOpenDrawer() {
  const navigation = useNavigation();
  return () => {
    const current = navigation as { dispatch?: (action: { type: string }) => void };
    current.dispatch?.({ type: "TOGGLE_DRAWER" });
  };
}

type AppHeaderProps = {
  mode: "menu" | "back";
};

/** Encabezado reutilizable: menú del drawer o volver, con el logo oficial. */
export function AppHeader({ mode }: AppHeaderProps) {
  const { colors } = useAppTheme();
  const openDrawer = useOpenDrawer();

  return (
    <View style={styles.bar}>
      <View pointerEvents="none" style={styles.logoWrap}>
        <Image source={logo} style={styles.logo} contentFit="contain" accessibilityLabel="Bucle" />
      </View>
      <AppIconButton
        icon={mode === "menu" ? "menu" : "back"}
        label={mode === "menu" ? "Abrir menú" : "Volver"}
        color={colors.accent}
        onPress={mode === "menu" ? openDrawer : goBack}
        testID={mode === "menu" ? "open-drawer" : "go-back"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: 60,
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  logoWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  logo: {
    width: 148,
    height: 46,
  },
});
