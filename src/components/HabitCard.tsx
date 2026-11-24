"use client";

import { Pressable, StyleSheet, Text } from "react-native";

import { AppIcon } from "@/components/AppIcon";
import { Card } from "@/components/Screen";
import { iconForHabit } from "@/components/habitIcon";
import type { Habit } from "@/domain/types";
import { useAppTheme } from "@/state/theme";

type HabitCardProps = {
  habit: Habit;
  completed: boolean;
  onToggle: () => void;
  onOpen: () => void;
};

export function HabitCard({ habit, completed, onToggle, onOpen }: HabitCardProps) {
  const { colors } = useAppTheme();
  const status = completed ? "Completado" : "Pendiente";

  return (
    <Card tone={completed ? "completed" : "surface"} style={styles.card}>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: completed }}
        aria-checked={completed}
        accessibilityLabel={`${status}: ${habit.name}`}
        onPress={onToggle}
        hitSlop={6}
        testID={`habit-toggle-${habit.id}`}
        style={[
          styles.check,
          {
            backgroundColor: completed ? colors.control : "transparent",
            borderColor: colors.control,
          },
        ]}
      >
        {completed ? <AppIcon name="check" color={colors.onControl} size={16} /> : null}
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Abrir ${habit.name}`}
        onPress={onOpen}
        style={styles.body}
        testID={`habit-open-${habit.id}`}
      >
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>
          {habit.name}
        </Text>
        <Text style={[styles.status, { color: completed ? colors.accent : colors.textMuted }]}>{status}</Text>
      </Pressable>
      <AppIcon name={iconForHabit(habit.name)} color={colors.accent} size={22} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
  },
  check: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
  },
  status: {
    fontSize: 13,
    fontWeight: "600",
  },
});
