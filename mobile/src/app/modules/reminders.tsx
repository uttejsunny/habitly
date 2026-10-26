import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useReminders } from "../../features/reminders/useReminders";

export default function RemindersScreen() {
  const { reminders, addReminder, toggleDone, removeReminder } = useReminders();
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");

  const dueDateValid = dueDate === "" || /^\d{4}-\d{2}-\d{2}$/.test(dueDate);
  const canAdd = title.trim().length > 0 && dueDateValid;

  const onAdd = async () => {
    if (!canAdd) return;
    await addReminder({ title: title.trim(), dueDate: dueDate || null });
    setTitle("");
    setDueDate("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Renew passport"
          placeholderTextColor="#9ca3af"
        />
        <TextInput
          style={[styles.input, !dueDateValid && styles.inputError]}
          value={dueDate}
          onChangeText={setDueDate}
          placeholder="Due date, optional (YYYY-MM-DD)"
          placeholderTextColor="#9ca3af"
        />
        <Pressable style={[styles.addButton, !canAdd && styles.addButtonDisabled]} onPress={onAdd} disabled={!canAdd}>
          <Text style={styles.addButtonText}>+ Add reminder</Text>
        </Pressable>
      </View>

      <FlatList
        data={reminders}
        keyExtractor={(r) => String(r.id)}
        contentContainerStyle={{ padding: 16, paddingTop: 0, gap: 10 }}
        ListEmptyComponent={<Text style={styles.empty}>No reminders yet.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Pressable
              onPress={() => toggleDone(item.id, !item.done)}
              style={[styles.checkbox, item.done && styles.checkboxDone]}
            >
              {item.done ? <Text style={styles.check}>✓</Text> : null}
            </Pressable>
            <View style={styles.info}>
              <Text style={[styles.title, item.done && styles.titleDone]}>{item.title}</Text>
              {item.dueDate && <Text style={styles.due}>Due {item.dueDate}</Text>}
            </View>
            <Pressable onPress={() => removeReminder(item.id)} hitSlop={8}>
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
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: "#fff",
  },
  inputError: { borderColor: "#dc2626" },
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
    gap: 12,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: "#5B8DEF",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxDone: { backgroundColor: "#5B8DEF" },
  check: { color: "#fff", fontWeight: "700", fontSize: 13 },
  info: { flex: 1 },
  title: { fontSize: 15, fontWeight: "600", color: "#1a1a1a" },
  titleDone: { textDecorationLine: "line-through", color: "#9ca3af" },
  due: { fontSize: 12, color: "#6b7280", marginTop: 2 },
  delete: { color: "#9ca3af", fontSize: 16, paddingHorizontal: 4 },
});
