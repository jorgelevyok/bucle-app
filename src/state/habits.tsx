"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { toDateKey } from "@/domain/dates";
import { completionSummary, isHabitCompleted, scheduledHabits } from "@/domain/schedule";
import { createId, createWriteQueue, parseStoredData, STORAGE_KEYS } from "@/domain/storage";
import type { Habit, HabitDraft, StoredData } from "@/domain/types";

const EMPTY: StoredData = { habits: [], completions: [] };

type HabitsContextValue = {
  ready: boolean;
  habits: StoredData["habits"];
  habitsForDate: (date: Date) => Habit[];
  isCompleted: (habitId: string, date: Date) => boolean;
  progressForDate: (date: Date) => { done: number; total: number; percent: number };
  getHabit: (id: string) => Habit | undefined;
  addHabit: (draft: HabitDraft) => void;
  updateHabit: (id: string, draft: HabitDraft) => void;
  deleteHabit: (id: string) => void;
  toggleCompletion: (habitId: string, date: Date) => void;
};

const HabitsContext = createContext<HabitsContextValue | null>(null);

export function HabitsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoredData>(EMPTY);
  const [ready, setReady] = useState(false);
  const stateRef = useRef(state);
  const enqueue = useRef(createWriteQueue()).current;

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEYS.data);
        const parsed = parseStoredData(raw);
        if (active && parsed) {
          stateRef.current = parsed;
          setState(parsed);
        }
      } catch {
        // No se escribe el estado vacío si la lectura falla.
      } finally {
        if (active) setReady(true);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const commit = useCallback(
    (recipe: (current: StoredData) => StoredData) => {
      const next = recipe(stateRef.current);
      stateRef.current = next;
      setState(next);
      enqueue(() => AsyncStorage.setItem(STORAGE_KEYS.data, JSON.stringify(next)));
    },
    [enqueue],
  );

  const addHabit = useCallback(
    (draft: HabitDraft) => {
      const habit: Habit = {
        id: createId(),
        name: draft.name.trim(),
        weekdays: [...draft.weekdays].sort((a, b) => a - b),
        durationMinutes: draft.durationMinutes,
        createdAt: new Date().toISOString(),
      };
      commit((current) => ({ ...current, habits: [...current.habits, habit] }));
    },
    [commit],
  );

  const updateHabit = useCallback(
    (id: string, draft: HabitDraft) => {
      commit((current) => ({
        ...current,
        habits: current.habits.map((habit) =>
          habit.id === id
            ? {
                ...habit,
                name: draft.name.trim(),
                weekdays: [...draft.weekdays].sort((a, b) => a - b),
                durationMinutes: draft.durationMinutes,
              }
            : habit,
        ),
      }));
    },
    [commit],
  );

  const deleteHabit = useCallback(
    (id: string) => {
      commit((current) => ({
        habits: current.habits.filter((habit) => habit.id !== id),
        completions: current.completions.filter((item) => item.habitId !== id),
      }));
    },
    [commit],
  );

  const toggleCompletion = useCallback(
    (habitId: string, date: Date) => {
      const key = toDateKey(date);
      commit((current) => {
        const exists = current.completions.some((item) => item.habitId === habitId && item.date === key);
        const completions = exists
          ? current.completions.filter((item) => !(item.habitId === habitId && item.date === key))
          : [...current.completions, { habitId, date: key }];
        return { ...current, completions };
      });
    },
    [commit],
  );

  const value = useMemo<HabitsContextValue>(() => {
    return {
      ready,
      habits: state.habits,
      habitsForDate: (date) => scheduledHabits(state.habits, date),
      isCompleted: (habitId, date) => isHabitCompleted(state.completions, habitId, date),
      progressForDate: (date) => {
        const summary = completionSummary(state.habits, state.completions, date);
        return { done: summary.done, total: summary.total, percent: summary.percent };
      },
      getHabit: (id) => state.habits.find((habit) => habit.id === id),
      addHabit,
      updateHabit,
      deleteHabit,
      toggleCompletion,
    };
  }, [ready, state, addHabit, updateHabit, deleteHabit, toggleCompletion]);

  return <HabitsContext.Provider value={value}>{children}</HabitsContext.Provider>;
}

export function useHabits() {
  const value = useContext(HabitsContext);
  if (!value) throw new Error("useHabits tiene que usarse dentro de HabitsProvider");
  return value;
}
