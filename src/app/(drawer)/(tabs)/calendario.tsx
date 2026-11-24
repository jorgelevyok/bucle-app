"use client";

import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { AppHeader } from "@/components/AppHeader";
import { AppIcon, AppIconButton } from "@/components/AppIcon";
import { iconForHabit } from "@/components/habitIcon";
import { NotebookMascot } from "@/components/NotebookMascot";
import { ProgressBar } from "@/components/ProgressBar";
import { Screen } from "@/components/Screen";
import {
  WEEKDAY_LABELS,
  addMonths,
  buildMonthCells,
  formatLongDate,
  formatMonthYear,
  isFutureDate,
  isSameDay,
  toDateKey,
} from "@/domain/dates";
import type { Habit } from "@/domain/types";
import { pushPath } from "@/lib/navigation";
import { useHabits } from "@/state/habits";
import { useAppTheme } from "@/state/theme";

export default function CalendarioScreen() {
  const { colors } = useAppTheme();
  const habitsApi = useHabits();
  const today = new Date();
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState(today);
  const cells = buildMonthCells(visibleMonth);
  const future = isFutureDate(selected, today);
  const scheduled = habitsApi.habitsForDate(selected);

  const shiftMonth = (amount: number) => {
    const next = addMonths(visibleMonth, amount);
    const todayInMonth = today.getFullYear() === next.getFullYear() && today.getMonth() === next.getMonth();
    setVisibleMonth(next);
    setSelected(todayInMonth ? today : next);
  };

  return (
    <Screen>
      <AppHeader mode="menu" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.monthRow}>
          <AppIconButton
            icon="chevronLeft"
            label="Mes anterior"
            color={colors.accent}
            onPress={() => shiftMonth(-1)}
            testID="month-previous"
          />
          <Text style={[styles.month, { color: colors.text }]} testID="month-label">
            {formatMonthYear(visibleMonth)}
          </Text>
          <AppIconButton
            icon="chevronRight"
            label="Mes siguiente"
            color={colors.accent}
            onPress={() => shiftMonth(1)}
            testID="month-next"
          />
        </View>

        <View style={styles.weekdays}>
          {WEEKDAY_LABELS.map((label) => (
            <Text key={label} style={[styles.weekday, { color: colors.textMuted }]}>
              {label}
            </Text>
          ))}
        </View>

        <View style={styles.grid}>
          {cells.map((date, index) => {
            if (!date) return <View key={`empty-${index}`} style={styles.cell} />;
            const selectedDay = isSameDay(date, selected);
            const todayDay = isSameDay(date, today);
            return (
              <Pressable
                key={toDateKey(date)}
                accessibilityRole="button"
                accessibilityState={{ selected: selectedDay }}
                accessibilityLabel={formatLongDate(date)}
                testID={`day-${toDateKey(date)}`}
                onPress={() => setSelected(date)}
                style={styles.cell}
              >
                <View
                  style={[
                    styles.dayBubble,
                    selectedDay && { backgroundColor: colors.control },
                    !selectedDay && todayDay && { backgroundColor: colors.mintSoft, borderWidth: 2, borderColor: colors.mint },
                  ]}
                >
                  <Text style={{ color: selectedDay ? colors.onControl : colors.text, fontWeight: selectedDay ? "800" : "600" }}>
                    {date.getDate()}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.summary}>
          <NotebookMascot variant="calendar" size={112} testID="mascot-calendar" />
          <Text style={[styles.summaryDate, { color: colors.text }]}>{formatLongDate(selected)}</Text>
        </View>

        {scheduled.length === 0 ? (
          <Text style={[styles.empty, { color: colors.textMuted }]} testID="calendar-empty">
            No hay hábitos programados para este día.
          </Text>
        ) : (
          <View style={styles.plans} testID="calendar-plans">
            {scheduled.map((habit) => (
              <HabitPlanRow
                key={habit.id}
                habit={habit}
                future={future}
                completed={habitsApi.isCompleted(habit.id, selected)}
                onOpen={() => pushPath(`/habito/${habit.id}`)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

function HabitPlanRow({
  habit,
  future,
  completed,
  onOpen,
}: {
  habit: Habit;
  future: boolean;
  completed: boolean;
  onOpen: () => void;
}) {
  const { colors } = useAppTheme();
  const percent = completed ? 100 : 0;

  return (
    <View style={styles.plan}>
      <View style={styles.planIcon}>
        <AppIcon name={iconForHabit(habit.name)} color={colors.accent} size={22} />
      </View>
      <View style={styles.planBody}>
        <View style={styles.planTop}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Abrir ${habit.name}, ${future ? "programado" : completed ? "completado" : "pendiente"}`}
            onPress={onOpen}
            style={styles.planNameButton}
          >
            <Text style={[styles.planName, { color: colors.text }]} numberOfLines={2}>
              {habit.name}
            </Text>
          </Pressable>
          {habit.durationMinutes ? (
            <Text style={[styles.duration, { color: colors.textMuted }]}>{habit.durationMinutes} min</Text>
          ) : null}
        </View>
        {future ? null : (
          <View style={styles.planProgress}>
            <View style={styles.planBar}>
              <ProgressBar percent={percent} thickness={8} />
            </View>
            <Text style={[styles.planPercent, { color: colors.accent }]}>{percent} %</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  monthRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  month: {
    flex: 1,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "800",
  },
  weekdays: {
    flexDirection: "row",
    marginTop: 8,
  },
  weekday: {
    width: "14.285%",
    textAlign: "center",
    fontSize: 12,
    fontWeight: "700",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
  },
  cell: {
    width: "14.285%",
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  dayBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  summaryDate: {
    flex: 1,
    fontSize: 22,
    fontWeight: "800",
    lineHeight: 28,
  },
  empty: {
    fontSize: 15,
    paddingHorizontal: 8,
    paddingBottom: 12,
  },
  plans: {
    gap: 16,
    paddingHorizontal: 4,
  },
  plan: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
  },
  planIcon: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  planBody: {
    flex: 1,
    gap: 6,
  },
  planTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  planNameButton: {
    flex: 1,
  },
  planName: {
    fontSize: 16,
    fontWeight: "700",
  },
  duration: {
    fontSize: 13,
    fontWeight: "600",
  },
  planProgress: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  planBar: {
    flex: 1,
  },
  planPercent: {
    width: 42,
    textAlign: "right",
    fontSize: 12,
    fontWeight: "800",
  },
});
