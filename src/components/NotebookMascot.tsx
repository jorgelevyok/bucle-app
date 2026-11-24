"use client";

import { StyleSheet, View } from "react-native";

import { brand } from "@/state/theme";

type NotebookMascotProps = {
  variant: "idle" | "calendar" | "sunMoon";
  size?: number;
  testID?: string;
};

/**
 * La carita vive en esta mascota. bucle-logo.png es el wordmark,
 * sin ilustraciones separadas en assets.
 */
export function NotebookMascot({ variant, size = 168, testID }: NotebookMascotProps) {
  const scale = size / 160;

  return (
    <View
      testID={testID}
      accessibilityRole="image"
      accessibilityLabel={
        variant === "calendar"
          ? "Cuaderno con calendario"
          : variant === "sunMoon"
            ? "Cuaderno con sol y luna"
            : "Cuaderno de Bucle"
      }
      style={{ width: size, height: size }}
    >
      <View
        style={[
          styles.stage,
          { transform: [{ scale }], left: (size - 160) / 2, top: (size - 160) / 2 },
        ]}
      >
        {variant === "sunMoon" ? (
          <>
            <Sun />
            <Moon />
          </>
        ) : null}
        <View style={styles.body} />
        <Ring top={48} />
        <Ring top={74} />
        <Ring top={100} />
        <View style={styles.bookmark} />
        <View style={styles.eyeLeft} />
        <View style={styles.eyeRight} />
        <View style={styles.shineLeft} />
        <View style={styles.shineRight} />
        <View style={styles.smile} />
        {variant === "calendar" ? <MiniCalendar /> : null}
        {variant === "sunMoon" ? (
          <>
            <View style={[styles.arm, styles.armUpLeft]} />
            <View style={[styles.arm, styles.armUpRight]} />
          </>
        ) : (
          <>
            <View style={[styles.arm, styles.armLeft]} />
            <View style={[styles.arm, styles.armRight]} />
          </>
        )}
      </View>
    </View>
  );
}

function Ring({ top }: { top: number }) {
  return <View style={[styles.ring, { top }]} />;
}

function Sun() {
  return (
    <View style={styles.sun}>
      <View style={styles.sunCore} />
      {[0, 45, 90, 135].map((angle) => (
        <View key={angle} style={[styles.sunRay, { transform: [{ rotate: `${angle}deg` }] }]} />
      ))}
    </View>
  );
}

function Moon() {
  return <View style={styles.moon} />;
}

function MiniCalendar() {
  return (
    <View style={styles.calendar}>
      <View style={styles.calendarHeader} />
      <View style={styles.calendarGrid}>
        {Array.from({ length: 6 }, (_, index) => (
          <View key={index} style={[styles.calendarDot, index === 4 && styles.calendarDotActive]} />
        ))}
      </View>
    </View>
  );
}

const forest = brand.forest;
const mint = brand.mint;
const cream = "#F7F3EA";

const styles = StyleSheet.create({
  stage: {
    position: "absolute",
    width: 160,
    height: 160,
  },
  body: {
    position: "absolute",
    left: 46,
    top: 36,
    width: 72,
    height: 88,
    borderRadius: 18,
    backgroundColor: cream,
    borderWidth: 3,
    borderColor: forest,
  },
  ring: {
    position: "absolute",
    left: 34,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: mint,
    borderWidth: 3,
    borderColor: forest,
  },
  bookmark: {
    position: "absolute",
    left: 74,
    top: 112,
    width: 16,
    height: 22,
    backgroundColor: mint,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 8,
    borderWidth: 2,
    borderColor: forest,
  },
  eyeLeft: {
    position: "absolute",
    left: 66,
    top: 64,
    width: 8,
    height: 11,
    borderRadius: 4,
    backgroundColor: forest,
  },
  eyeRight: {
    position: "absolute",
    left: 90,
    top: 64,
    width: 8,
    height: 11,
    borderRadius: 4,
    backgroundColor: forest,
  },
  shineLeft: {
    position: "absolute",
    left: 68,
    top: 66,
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#FFFFFF",
  },
  shineRight: {
    position: "absolute",
    left: 92,
    top: 66,
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#FFFFFF",
  },
  smile: {
    position: "absolute",
    left: 74,
    top: 84,
    width: 18,
    height: 10,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderColor: forest,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  arm: {
    position: "absolute",
    width: 26,
    height: 8,
    borderRadius: 4,
    backgroundColor: forest,
  },
  armLeft: {
    left: 18,
    top: 86,
    transform: [{ rotate: "18deg" }],
  },
  armRight: {
    right: 16,
    top: 86,
    transform: [{ rotate: "-18deg" }],
  },
  armUpLeft: {
    left: 16,
    top: 58,
    transform: [{ rotate: "-40deg" }],
  },
  armUpRight: {
    right: 14,
    top: 58,
    transform: [{ rotate: "40deg" }],
  },
  calendar: {
    position: "absolute",
    right: 6,
    top: 78,
    width: 40,
    height: 46,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: forest,
    overflow: "hidden",
  },
  calendarHeader: {
    height: 12,
    backgroundColor: mint,
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 3,
    padding: 4,
  },
  calendarDot: {
    width: 6,
    height: 6,
    borderRadius: 2,
    backgroundColor: "#D5E8DF",
  },
  calendarDotActive: {
    backgroundColor: forest,
  },
  sun: {
    position: "absolute",
    left: 8,
    top: 10,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  sunCore: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#F2C14E",
  },
  sunRay: {
    position: "absolute",
    width: 28,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#F2C14E",
  },
  moon: {
    position: "absolute",
    right: 12,
    top: 16,
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 3,
    borderColor: mint,
    borderRightColor: "transparent",
    transform: [{ rotate: "-25deg" }],
  },
});
