"use client";

import { ScrollView, StyleSheet, Text } from "react-native";

import { AppHeader } from "@/components/AppHeader";
import { HabitForm } from "@/components/HabitForm";
import { Screen } from "@/components/Screen";
import { goBack } from "@/lib/navigation";
import { useHabits } from "@/state/habits";
import { useAppTheme } from "@/state/theme";

export default function NuevoHabitoScreen() {
  const { colors } = useAppTheme();
  const { addHabit } = useHabits();

  return (
    <Screen edges={["top", "bottom", "left", "right"]}>
      <AppHeader mode="back" />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={[styles.title, { color: colors.text }]}>Nuevo hábito</Text>
        <HabitForm
          submitLabel="Guardar hábito"
          onSubmit={(draft) => {
            addHabit(draft);
            goBack();
          }}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 8,
  },
});
