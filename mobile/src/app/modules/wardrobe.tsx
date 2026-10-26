import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useWardrobe } from "../../features/wardrobe/useWardrobe";

export default function WardrobeScreen() {
  const { items, addItem, markWorn, removeItem } = useWardrobe();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("");

  const canAdd = name.trim().length > 0 && category.trim().length > 0 && color.trim().length > 0;

  const onAdd = async () => {
    if (!canAdd) return;
    await addItem({ name: name.trim(), category: category.trim(), color: color.trim() });
    setName("");
    setCategory("");
    setColor("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="e.g. Blue denim jacket"
          placeholderTextColor="#9ca3af"
        />
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.half]}
            value={category}
            onChangeText={setCategory}
            placeholder="Category"
            placeholderTextColor="#9ca3af"
          />
          <TextInput
            style={[styles.input, styles.half]}
            value={color}
            onChangeText={setColor}
            placeholder="Color"
            placeholderTextColor="#9ca3af"
          />
        </View>
        <Pressable style={[styles.addButton, !canAdd && styles.addButtonDisabled]} onPress={onAdd} disabled={!canAdd}>
          <Text style={styles.addButtonText}>+ Add item</Text>
        </Pressable>
      </View>

      <FlatList
        data={items}
        keyExtractor={(i) => String(i.id)}
        contentContainerStyle={{ padding: 16, paddingTop: 0, gap: 10 }}
        ListEmptyComponent={<Text style={styles.empty}>No items yet.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.meta}>
                {item.category} · {item.color}
              </Text>
              <Text style={styles.meta}>{item.lastWornDate ? `Last worn ${item.lastWornDate}` : "Never worn yet"}</Text>
            </View>
            <Pressable style={styles.wornButton} onPress={() => markWorn(item.id)}>
              <Text style={styles.wornButtonText}>Worn today</Text>
            </Pressable>
            <Pressable onPress={() => removeItem(item.id)} hitSlop={8}>
              <Text style={styles.delete}>✕</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f8fa" },
  form: { padding: 16, gap: 10 },
  row: { flexDirection: "row", gap: 10 },
  half: { flex: 1 },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: "#fff",
  },
  addButton: { backgroundColor: "#5B8DEF", borderRadius: 10, paddingVertical: 12, alignItems: "center" },
  addButtonDisabled: { opacity: 0.5 },
  addButtonText: { color: "#fff", fontWeight: "600" },
  empty: { color: "#6b7280", textAlign: "center", marginTop: 40 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: "600", color: "#1a1a1a" },
  meta: { fontSize: 12, color: "#6b7280", marginTop: 2 },
  wornButton: { backgroundColor: "#f3f4f6", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  wornButtonText: { fontSize: 12, fontWeight: "600", color: "#374151" },
  delete: { color: "#9ca3af", fontSize: 16, paddingHorizontal: 4 },
});
