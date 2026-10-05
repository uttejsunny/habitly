import { Pressable, StyleSheet, Text, View } from "react-native";
import type { HabitWithStats } from "../features/habits/types";

interface Props {
  habit: HabitWithStats;
  onToggleToday: () => void;
  onPress: () => void;
}

export function HabitCard({ habit, onToggleToday, onPress }: Props) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={[styles.iconWrap, { backgroundColor: habit.color + "22" }]}>
        <Text style={styles.icon}>{habit.icon}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{habit.name}</Text>
        <Text style={styles.streak}>
          🔥 {habit.currentStreak} day{habit.currentStreak === 1 ? "" : "s"} · best {habit.longestStreak}
        </Text>
      </View>
      <Pressable
        onPress={onToggleToday}
        hitSlop={8}
        style={[
          styles.checkbox,
          { borderColor: habit.color, backgroundColor: habit.completedToday ? habit.color : "transparent" },
        ]}
      >
        {habit.completedToday ? <Text style={styles.check}>✓</Text> : null}
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: { fontSize: 22 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: "600", color: "#1a1a1a" },
  streak: { fontSize: 13, color: "#6b7280", marginTop: 2 },
  checkbox: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  check: { color: "#fff", fontWeight: "700" },
});
