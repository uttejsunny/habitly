import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { StreakHeatmap } from "../../components/StreakHeatmap";
import { deleteHabit, getHabitWithStats, getLogDatesForHabit, toggleCompletion } from "../../features/habits/repository";
import type { HabitWithStats } from "../../features/habits/types";

export default function HabitDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const habitId = Number(id);
  const [habit, setHabit] = useState<HabitWithStats | null>(null);
  const [completedDates, setCompletedDates] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    const [h, dates] = await Promise.all([getHabitWithStats(habitId), getLogDatesForHabit(habitId)]);
    setHabit(h ?? null);
    setCompletedDates(dates);
  }, [habitId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  if (!habit) return null;

  const onToggleToday = async () => {
    await toggleCompletion(habitId);
    await load();
  };

  const onDelete = () => {
    Alert.alert("Delete habit", `Delete "${habit.name}" and all its history?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteHabit(habitId);
          router.back();
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, gap: 20 }}>
      <View style={styles.titleRow}>
        <Text style={styles.icon}>{habit.icon}</Text>
        <Text style={styles.name}>{habit.name}</Text>
      </View>

      <View style={styles.statsRow}>
        <Stat label="Current streak" value={`${habit.currentStreak}`} />
        <Stat label="Best streak" value={`${habit.longestStreak}`} />
        <Stat label="Completion" value={`${Math.round(habit.completionRate * 100)}%`} />
      </View>

      <Pressable
        style={[styles.toggleButton, { backgroundColor: habit.completedToday ? habit.color : "#f3f4f6" }]}
        onPress={onToggleToday}
      >
        <Text style={[styles.toggleButtonText, { color: habit.completedToday ? "#fff" : "#1a1a1a" }]}>
          {habit.completedToday ? "✓ Done today" : "Mark done for today"}
        </Text>
      </Pressable>

      <View>
        <Text style={styles.sectionLabel}>History</Text>
        <StreakHeatmap completedDateKeys={completedDates} activeDays={habit.activeDays} color={habit.color} />
      </View>

      <Pressable style={styles.deleteButton} onPress={onDelete}>
        <Text style={styles.deleteButtonText}>Delete habit</Text>
      </Pressable>
    </ScrollView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  icon: { fontSize: 32 },
  name: { fontSize: 24, fontWeight: "700", color: "#1a1a1a" },
  statsRow: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "#f7f8fa", borderRadius: 14, padding: 16 },
  stat: { alignItems: "center", flex: 1 },
  statValue: { fontSize: 20, fontWeight: "700", color: "#1a1a1a" },
  statLabel: { fontSize: 12, color: "#6b7280", marginTop: 2 },
  toggleButton: { borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  toggleButtonText: { fontWeight: "700", fontSize: 16 },
  sectionLabel: { fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 10 },
  deleteButton: { alignItems: "center", paddingVertical: 12 },
  deleteButtonText: { color: "#dc2626", fontWeight: "600" },
});
