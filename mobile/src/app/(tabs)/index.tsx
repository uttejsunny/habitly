import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { HabitCard } from "../../components/HabitCard";
import { useHabits } from "../../features/habits/useHabits";

export default function TodayScreen() {
  const { habits, loading, refresh, toggleToday } = useHabits();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const today = new Date();
  const dueToday = habits.filter((h) => h.activeDays.includes(today.getDay()));

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Today</Text>
      {!loading && dueToday.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No habits scheduled for today.</Text>
          <Pressable style={styles.addButton} onPress={() => router.push("/habit/new")}>
            <Text style={styles.addButtonText}>+ Add your first habit</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={dueToday}
          keyExtractor={(h) => String(h.id)}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => (
            <HabitCard
              habit={item}
              onToggleToday={() => toggleToday(item.id)}
              onPress={() => router.push(`/habit/${item.id}`)}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f8fa", padding: 16 },
  header: { fontSize: 28, fontWeight: "700", marginBottom: 16, color: "#1a1a1a" },
  empty: { alignItems: "center", marginTop: 60, gap: 16 },
  emptyText: { color: "#6b7280", fontSize: 15 },
  addButton: { backgroundColor: "#5B8DEF", paddingVertical: 10, paddingHorizontal: 18, borderRadius: 10 },
  addButtonText: { color: "#fff", fontWeight: "600" },
});
