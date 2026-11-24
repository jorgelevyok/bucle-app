import { toDateKey, weekdayOf } from "@/domain/dates";
import type { Completion, Habit } from "@/domain/types";

export function scheduledHabits(habits: Habit[], date: Date): Habit[] {
  const weekday = weekdayOf(date);
  return habits
    .filter((habit) => habit.weekdays.includes(weekday))
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, "es"));
}

export function isHabitCompleted(completions: Completion[], habitId: string, date: Date): boolean {
  const key = toDateKey(date);
  return completions.some((item) => item.habitId === habitId && item.date === key);
}

export function completionSummary(habits: Habit[], completions: Completion[], date: Date) {
  const scheduled = scheduledHabits(habits, date);
  const done = scheduled.filter((habit) => isHabitCompleted(completions, habit.id, date)).length;
  const total = scheduled.length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  return { scheduled, done, total, percent };
}
