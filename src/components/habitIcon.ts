import type { IconName } from "@/components/AppIcon";

/** Ícono decorativo a partir del nombre. El formulario no pide una categoría. */
export function iconForHabit(name: string): IconName {
  const normalized = name.toLocaleLowerCase("es");
  if (/(le[eé]|libro)/.test(normalized)) return "book";
  if (/(dibuj|escrib|l[aá]piz|not)/.test(normalized)) return "draw";
  if (/(orden|escrit|compu|notebook|pc|laptop)/.test(normalized)) return "laptop";
  return "book";
}
