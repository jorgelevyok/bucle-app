"use client";

import { useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text } from "react-native";

import { AppHeader } from "@/components/AppHeader";
import { HabitForm } from "@/components/HabitForm";
import { Screen } from "@/components/Screen";
import { goBack } from "@/lib/navigation";
import { useHabits } from "@/state/habits";
import { useAppTheme } from "@/state/theme";

export default function EditarHabitoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const habitId = Array.isArray(id) ? id[0] : id;
  const { colors } = useAppTheme();
  const habits = useHabits();
  const habit = habitId ? habits.getHabit(habitId) : undefined;

  if (!habit) {
    return (
      <Screen edges={["top", "bottom", "left", "right"]}>
        <AppHeader mode="back" />
        <Text style={[styles.missing, { color: colors.text }]}>No encontramos ese hábito.</Text>
      </Screen>
    );
  }

  return (
    <Screen edges={["top", "bottom", "left", "right"]}>
      <AppHeader mode="back" />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={[styles.title, { color: colors.text }]}>Editar hábito</Text>
        <HabitForm
          initialName={habit.name}
          initialWeekdays={habit.weekdays}
          initialDuration={habit.durationMinutes}
          submitLabel="Guardar cambios"
          onSubmit={(draft) => {
            habits.updateHabit(habit.id, draft);
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
  missing: {
    fontSize: 18,
    fontWeight: "700",
    padding: 20,
  },
});
