import type { Weekday } from "@/domain/types";

export const WEEKDAY_LABELS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"] as const;

/**
 * Clave del día local. No usa toISOString: en Argentina (UTC-3) eso
 * mueve el registro al día anterior cuando se consulta el calendario.
 */
export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isSameDay(a: Date, b: Date): boolean {
  return toDateKey(a) === toDateKey(b);
}

/** Una fecha es futura si su día local es posterior al de hoy. */
export function isFutureDate(date: Date, today: Date = new Date()): boolean {
  return toDateKey(date) > toDateKey(today);
}

export function firstOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function addMonths(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

export function weekdayOf(date: Date): Weekday {
  return date.getDay() as Weekday;
}

function capitalize(value: string): string {
  if (!value) return value;
  return value.charAt(0).toLocaleUpperCase("es-AR") + value.slice(1);
}

/** Fecha larga en español de Argentina, por ejemplo "Martes 24 de noviembre". */
export function formatLongDate(date: Date): string {
  const formatted = new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
  return capitalize(formatted.replace(",", ""));
}

/** Encabezado del mes, por ejemplo "Noviembre 2026". */
export function formatMonthYear(date: Date): string {
  const month = new Intl.DateTimeFormat("es-AR", { month: "long" }).format(date);
  return `${capitalize(month)} ${date.getFullYear()}`;
}

/** Grilla del mes, alineada de domingo a sábado. Las celdas vacías son null. */
export function buildMonthCells(month: Date): (Date | null)[] {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const leading = new Date(year, monthIndex, 1).getDay();
  const days = new Date(year, monthIndex + 1, 0).getDate();
  const cells: (Date | null)[] = [];

  for (let index = 0; index < leading; index += 1) cells.push(null);
  for (let day = 1; day <= days; day += 1) cells.push(new Date(year, monthIndex, day));
  while (cells.length % 7 !== 0) cells.push(null);

  return cells;
}
