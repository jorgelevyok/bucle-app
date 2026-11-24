/** Datos que Bucle guarda en el dispositivo. */

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type Habit = {
  id: string;
  name: string;
  weekdays: Weekday[];
  durationMinutes?: number;
  createdAt: string;
};

export type Completion = {
  habitId: string;
  /** Día local del dispositivo, formato YYYY-MM-DD. */
  date: string;
};

export type HabitDraft = {
  name: string;
  weekdays: Weekday[];
  durationMinutes?: number;
};

export type StoredData = {
  habits: Habit[];
  completions: Completion[];
};

export type AppearancePreference = "light" | "dark" | "system";
