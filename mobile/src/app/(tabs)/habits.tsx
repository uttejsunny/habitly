import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { HabitCard } from "../../components/HabitCard";
import { useHabits } from "../../features/habits/useHabits";

export default function HabitsScreen() {
  const { habits, refresh, toggleToday } = useHabits();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Habits</Text>
        <Pressable style={styles.addButton} onPress={() => router.push("/habit/new")}>
          <Text style={styles.addButtonText}>+ New</Text>
        </Pressable>
      </View>
      <FlatList
        data={habits}
        keyExtractor={(h) => String(h.id)}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={<Text style={styles.emptyText}>No habits yet. Tap "+ New" to create one.</Text>}
        renderItem={({ item }) => (
          <HabitCard
            habit={item}
            onToggleToday={() => toggleToday(item.id)}
            onPress={() => router.push(`/habit/${item.id}`)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f8fa", padding: 16 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  header: { fontSize: 28, fontWeight: "700", color: "#1a1a1a" },
  addButton: { backgroundColor: "#5B8DEF", paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10 },
  addButtonText: { color: "#fff", fontWeight: "600" },
  emptyText: { color: "#6b7280", fontSize: 15, marginTop: 40, textAlign: "center" },
});
