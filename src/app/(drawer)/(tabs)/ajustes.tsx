"use client";

import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { AppHeader } from "@/components/AppHeader";
import { NotebookMascot } from "@/components/NotebookMascot";
import { Screen } from "@/components/Screen";
import type { AppearancePreference } from "@/domain/types";
import { useAppTheme } from "@/state/theme";

const OPTIONS: { value: AppearancePreference; label: string }[] = [
  { value: "light", label: "Claro" },
  { value: "dark", label: "Oscuro" },
  { value: "system", label: "Sistema" },
];

export default function AjustesScreen() {
  const { colors, preference, setPreference } = useAppTheme();

  return (
    <Screen>
      <AppHeader mode="menu" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Ajustes</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.cardHeader, { backgroundColor: colors.mint }]}>
            <Text style={styles.cardTitle}>Apariencia</Text>
          </View>
          <View style={styles.options}>
            {OPTIONS.map((option) => {
              const selected = preference === option.value;
              return (
                <Pressable
                  key={option.value}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selected }}
                  aria-checked={selected}
                  accessibilityLabel={option.label}
                  testID={`appearance-${option.value}`}
                  onPress={() => setPreference(option.value)}
                  style={[
                    styles.option,
                    { backgroundColor: selected ? colors.mintSoft : "transparent" },
                  ]}
                >
                  <View
                    style={[
                      styles.radio,
                      { borderColor: colors.accent },
                    ]}
                  >
                    {selected ? <View style={[styles.radioDot, { backgroundColor: colors.accent }]} /> : null}
                  </View>
                  <Text style={[styles.optionLabel, { color: colors.text }]}>{option.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
        <View style={styles.mascot}>
          <NotebookMascot variant="sunMoon" size={210} testID="mascot-appearance" />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    flexGrow: 1,
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    marginTop: 4,
    marginBottom: 18,
  },
  card: {
    borderWidth: 1,
    borderRadius: 22,
    overflow: "hidden",
  },
  cardHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  cardTitle: {
    color: "#275A4E",
    fontSize: 16,
    fontWeight: "800",
  },
  options: {
    padding: 10,
    gap: 6,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  mascot: {
    alignItems: "center",
    marginTop: 28,
  },
});
