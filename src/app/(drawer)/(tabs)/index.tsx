"use client";

import { ScrollView, StyleSheet, Text, View } from "react-native";

import { AppHeader } from "@/components/AppHeader";
import { HabitCard } from "@/components/HabitCard";
import { NotebookMascot } from "@/components/NotebookMascot";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ProgressBar } from "@/components/ProgressBar";
import { Card, Screen } from "@/components/Screen";
import { formatLongDate } from "@/domain/dates";
import { pushPath } from "@/lib/navigation";
import { useHabits } from "@/state/habits";
import { useAppTheme } from "@/state/theme";

export default function HoyScreen() {
  const { colors } = useAppTheme();
  const habits = useHabits();
  const today = new Date();
  const scheduled = habits.habitsForDate(today);
  const progress = habits.progressForDate(today);

  return (
    <Screen>
      <AppHeader mode="menu" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Hoy</Text>
        <Text style={[styles.date, { color: colors.textMuted }]} testID="today-date">
          {formatLongDate(today)}
        </Text>

        {progress.total === 0 ? (
          <View style={styles.empty} testID="empty-today">
            <NotebookMascot variant="idle" size={180} testID="mascot-empty" />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>Todavía no hay hábitos para hoy</Text>
            <Text style={[styles.emptyBody, { color: colors.textMuted }]}>
              Creá uno y Bucle lo va a mostrar cada semana, el día que elijas.
            </Text>
            <PrimaryButton
              label="Nuevo hábito"
              icon="add"
              onPress={() => pushPath("/habito/nuevo")}
              testID="new-habit-button"
            />
          </View>
        ) : (
          <View style={styles.list}>
            <Card>
              <View style={styles.progressHeader}>
                <Text style={[styles.progressLabel, { color: colors.text }]}>
                  {progress.done} de {progress.total} completados
                </Text>
                <Text style={[styles.progressPercent, { color: colors.accent }]}>{progress.percent} %</Text>
              </View>
              <ProgressBar percent={progress.percent} thickness={12} />
            </Card>
            {scheduled.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                completed={habits.isCompleted(habit.id, today)}
                onToggle={() => habits.toggleCompletion(habit.id, today)}
                onOpen={() => pushPath(`/habito/${habit.id}`)}
              />
            ))}
          </View>
        )}
      </ScrollView>
      {progress.total > 0 ? (
        <View style={styles.footer}>
          <PrimaryButton
            label="Nuevo hábito"
            icon="add"
            onPress={() => pushPath("/habito/nuevo")}
            testID="new-habit-button"
          />
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexGrow: 1,
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    marginTop: 4,
  },
  date: {
    fontSize: 16,
    marginTop: 4,
    marginBottom: 18,
  },
  list: {
    gap: 12,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  progressLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
  },
  progressPercent: {
    fontSize: 16,
    fontWeight: "800",
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
  },
  emptyBody: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 8,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
});
