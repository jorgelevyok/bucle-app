"use client";

import { useLocalSearchParams } from "expo-router";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";

import { AppHeader } from "@/components/AppHeader";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { WEEKDAY_LABELS, weekdayOf } from "@/domain/dates";
import type { Weekday } from "@/domain/types";
import { goBack, pushPath } from "@/lib/navigation";
import { useHabits } from "@/state/habits";
import { useAppTheme } from "@/state/theme";

export default function DetalleHabitoScreen() {
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

  const today = new Date();
  const scheduledToday = habit.weekdays.includes(weekdayOf(today));
  const completedToday = habits.isCompleted(habit.id, today);

  const remove = () => {
    Alert.alert("Eliminar hábito", `¿Eliminar «${habit.name}» y sus registros?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          habits.deleteHabit(habit.id);
          goBack();
        },
      },
    ]);
  };

  return (
    <Screen edges={["top", "bottom", "left", "right"]}>
      <AppHeader mode="back" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>{habit.name}</Text>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.cardLabel, { color: colors.textMuted }]}>Días</Text>
          <View style={styles.days}>
            {WEEKDAY_LABELS.map((label, index) => {
              const active = habit.weekdays.includes(index as Weekday);
              return (
                <View
                  key={label}
                  style={[
                    styles.day,
                    {
                      backgroundColor: active ? colors.control : "transparent",
                      borderColor: active ? colors.control : colors.border,
                    },
                  ]}
                >
                  <Text style={{ color: active ? colors.onControl : colors.textMuted, fontWeight: "700", fontSize: 12 }}>
                    {label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.cardLabel, { color: colors.textMuted }]}>Duración</Text>
          <Text style={[styles.cardValue, { color: colors.text }]}>
            {habit.durationMinutes ? `${habit.durationMinutes} min` : "Sin duración"}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.cardLabel, { color: colors.textMuted }]}>Hoy</Text>
          <Text style={[styles.cardValue, { color: colors.text }]} testID="detail-today-status">
            {!scheduledToday ? "No está programado para hoy" : completedToday ? "Completado" : "Pendiente"}
          </Text>
          {scheduledToday ? (
            <PrimaryButton
              label={completedToday ? "Deshacer cumplimiento" : "Marcar como completado"}
              onPress={() => habits.toggleCompletion(habit.id, today)}
              tone="ghost"
              testID="detail-toggle"
            />
          ) : null}
        </View>

        <PrimaryButton label="Editar hábito" onPress={() => pushPath(`/habito/editar/${habit.id}`)} testID="edit-habit" />
        <PrimaryButton label="Eliminar hábito" onPress={remove} tone="danger" testID="delete-habit" />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 4,
  },
  missing: {
    fontSize: 18,
    fontWeight: "700",
    padding: 20,
  },
  card: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 16,
    gap: 10,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: "700",
  },
  cardValue: {
    fontSize: 16,
    fontWeight: "700",
  },
  days: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 6,
  },
  day: {
    flex: 1,
    minHeight: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
});
