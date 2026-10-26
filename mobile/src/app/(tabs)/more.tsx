import { router } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

const MODULE_LINKS = [
  { id: "reminders", name: "Reminders", icon: "🔔", description: "One-off things to not forget", route: "/modules/reminders" as const },
  { id: "wardrobe", name: "Wardrobe", icon: "👕", description: "Track what you own and wear", route: "/modules/wardrobe" as const },
];

export default function MoreScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>More</Text>
      <FlatList
        data={MODULE_LINKS}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => router.push(item.route)}>
            <Text style={styles.icon}>{item.icon}</Text>
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f8fa", padding: 16 },
  header: { fontSize: 28, fontWeight: "700", marginBottom: 16, color: "#1a1a1a" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    gap: 12,
  },
  icon: { fontSize: 28 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: "600", color: "#1a1a1a" },
  description: { fontSize: 13, color: "#6b7280", marginTop: 2 },
});
