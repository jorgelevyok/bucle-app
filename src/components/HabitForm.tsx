"use client";

import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { PrimaryButton } from "@/components/PrimaryButton";
import { WEEKDAY_LABELS, weekdayOf } from "@/domain/dates";
import type { HabitDraft, Weekday } from "@/domain/types";
import { useAppTheme } from "@/state/theme";

type HabitFormProps = {
  initialName?: string;
  initialWeekdays?: Weekday[];
  initialDuration?: number;
  submitLabel: string;
  onSubmit: (draft: HabitDraft) => void;
};

type FormErrors = {
  name?: string;
  weekdays?: string;
  duration?: string;
};

/** Formulario compartido para crear y editar un hábito. */
export function HabitForm({
  initialName = "",
  initialWeekdays,
  initialDuration,
  submitLabel,
  onSubmit,
}: HabitFormProps) {
  const { colors } = useAppTheme();
  const [name, setName] = useState(initialName);
  const [weekdays, setWeekdays] = useState<Weekday[]>(initialWeekdays ?? [weekdayOf(new Date())]);
  const [duration, setDuration] = useState(initialDuration ? String(initialDuration) : "");
  const [errors, setErrors] = useState<FormErrors>({});

  const toggleDay = (day: Weekday) => {
    setWeekdays((current) => {
      if (current.includes(day)) return current.filter((item) => item !== day);
      return [...current, day].sort((a, b) => a - b);
    });
  };

  const submit = () => {
    const nextErrors: FormErrors = {};
    const trimmed = name.trim();
    if (!trimmed) nextErrors.name = "Escribí un nombre.";
    else if (trimmed.length > 40) nextErrors.name = "Usá hasta 40 caracteres.";
    if (weekdays.length === 0) nextErrors.weekdays = "Elegí al menos un día.";

    let durationMinutes: number | undefined;
    if (duration.trim()) {
      const value = Number(duration);
      if (!Number.isInteger(value) || value < 1 || value > 240) {
        nextErrors.duration = "Ingresá minutos entre 1 y 240, o dejalo vacío.";
      } else {
        durationMinutes = value;
      }
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    onSubmit({ name: trimmed, weekdays, durationMinutes });
  };

  return (
    <View style={styles.form}>
      <Text style={[styles.label, { color: colors.text }]}>Nombre</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Ej: Leer 15 minutos"
        placeholderTextColor={colors.textMuted}
        maxLength={40}
        testID="habit-name-input"
        style={[styles.input, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]}
      />
      {errors.name ? <Text style={[styles.error, { color: colors.danger }]}>{errors.name}</Text> : null}

      <Text style={[styles.label, { color: colors.text }]}>Días</Text>
      <View style={styles.days}>
        {WEEKDAY_LABELS.map((label, index) => {
          const day = index as Weekday;
          const selected = weekdays.includes(day);
          return (
            <Pressable
              key={label}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: selected }}
              aria-checked={selected}
              accessibilityLabel={label}
              onPress={() => toggleDay(day)}
              testID={`weekday-${index}`}
              style={[
                styles.day,
                {
                  backgroundColor: selected ? colors.control : colors.surface,
                  borderColor: selected ? colors.control : colors.border,
                },
              ]}
            >
              <Text style={{ color: selected ? colors.onControl : colors.text, fontWeight: "700", fontSize: 12 }}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {errors.weekdays ? <Text style={[styles.error, { color: colors.danger }]}>{errors.weekdays}</Text> : null}

      <Text style={[styles.label, { color: colors.text }]}>Duración (opcional)</Text>
      <TextInput
        value={duration}
        onChangeText={(value) => setDuration(value.replace(/[^0-9]/g, "").slice(0, 3))}
        placeholder="Minutos"
        placeholderTextColor={colors.textMuted}
        keyboardType="number-pad"
        testID="habit-duration-input"
        style={[styles.input, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]}
      />
      {errors.duration ? <Text style={[styles.error, { color: colors.danger }]}>{errors.duration}</Text> : null}

      <PrimaryButton label={submitLabel} onPress={submit} testID="habit-save-button" />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 8,
  },
  label: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: "700",
  },
  input: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  days: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 6,
  },
  day: {
    flex: 1,
    minHeight: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  error: {
    fontSize: 13,
    fontWeight: "600",
  },
});
