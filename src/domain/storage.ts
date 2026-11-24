import type { AppearancePreference, Completion, Habit, StoredData, Weekday } from "@/domain/types";

export const STORAGE_KEYS = {
  data: "bucle.data.v1",
  appearance: "bucle.appearance.v1",
} as const;

const DATE_KEY = /^\d{4}-\d{2}-\d{2}$/;

function isWeekday(value: unknown): value is Weekday {
  return value === 0 || value === 1 || value === 2 || value === 3 || value === 4 || value === 5 || value === 6;
}

function isHabit(value: unknown): value is Habit {
  if (!value || typeof value !== "object") return false;
  const habit = value as Partial<Habit>;
  if (typeof habit.id !== "string" || habit.id.length === 0) return false;
  if (typeof habit.name !== "string" || habit.name.trim().length === 0) return false;
  if (!Array.isArray(habit.weekdays) || habit.weekdays.length === 0 || !habit.weekdays.every(isWeekday)) {
    return false;
  }
  if (
    habit.durationMinutes !== undefined &&
    (!Number.isInteger(habit.durationMinutes) || habit.durationMinutes < 1)
  ) {
    return false;
  }
  return typeof habit.createdAt === "string";
}

function isCompletion(value: unknown): value is Completion {
  if (!value || typeof value !== "object") return false;
  const completion = value as Partial<Completion>;
  return (
    typeof completion.habitId === "string" &&
    completion.habitId.length > 0 &&
    typeof completion.date === "string" &&
    DATE_KEY.test(completion.date)
  );
}

/** Devuelve null si no hay datos o si el JSON no tiene la forma esperada. */
export function parseStoredData(raw: string | null): StoredData | null {
  if (!raw) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }

  if (!parsed || typeof parsed !== "object") return null;
  const record = parsed as { habits?: unknown; completions?: unknown };
  if (!Array.isArray(record.habits) || !Array.isArray(record.completions)) return null;

  const seenHabits = new Set<string>();
  const habits = record.habits.filter((item): item is Habit => {
    if (!isHabit(item) || seenHabits.has(item.id)) return false;
    seenHabits.add(item.id);
    return true;
  });

  const seenCompletions = new Set<string>();
  const completions = record.completions.filter((item): item is Completion => {
    if (!isCompletion(item)) return false;
    const key = `${item.habitId}:${item.date}`;
    if (seenCompletions.has(key)) return false;
    seenCompletions.add(key);
    return true;
  });

  return { habits, completions };
}

export function parseAppearance(raw: string | null): AppearancePreference | null {
  if (raw === "light" || raw === "dark" || raw === "system") return raw;
  return null;
}

export function createId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createWriteQueue() {
  let chain: Promise<void> = Promise.resolve();
  return (task: () => Promise<void>) => {
    chain = chain.then(task).catch(() => undefined);
  };
}
