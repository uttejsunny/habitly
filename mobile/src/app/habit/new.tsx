import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { createHabit } from "../../features/habits/repository";

const ICONS = ["⭐", "💧", "🏃", "📚", "🧘", "💪", "🎯", "📝", "🥗", "😴"];
const COLORS = ["#5B8DEF", "#EF5B8D", "#5BEFA8", "#EFA85B", "#8D5BEF", "#EF5B5B"];
const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export default function NewHabitScreen() {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState(ICONS[0]);
  const [color, setColor] = useState(COLORS[0]);
  const [activeDays, setActiveDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [reminderTime, setReminderTime] = useState("");
  const [saving, setSaving] = useState(false);

  const toggleDay = (day: number) => {
    setActiveDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()));
  };

  const valid = name.trim().length > 0 && activeDays.length > 0 && /^$|^([01]\d|2[0-3]):[0-5]\d$/.test(reminderTime);

  const save = async () => {
    if (!valid || saving) return;
    setSaving(true);
    try {
      await createHabit({
        name: name.trim(),
        icon,
        color,
        activeDays,
        reminderTime: reminderTime || null,
      });
      router.back();
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, gap: 20 }}>
      <View>
        <Text style={styles.label}>Habit name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="e.g. Meditate"
          placeholderTextColor="#9ca3af"
        />
      </View>

      <View>
        <Text style={styles.label}>Icon</Text>
        <View style={styles.swatchRow}>
          {ICONS.map((i) => (
            <Pressable
              key={i}
              onPress={() => setIcon(i)}
              style={[styles.iconSwatch, icon === i && styles.swatchSelected]}
            >
              <Text style={{ fontSize: 20 }}>{i}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View>
        <Text style={styles.label}>Color</Text>
        <View style={styles.swatchRow}>
          {COLORS.map((c) => (
            <Pressable
              key={c}
              onPress={() => setColor(c)}
              style={[styles.colorSwatch, { backgroundColor: c }, color === c && styles.swatchSelected]}
            />
          ))}
        </View>
      </View>

      <View>
        <Text style={styles.label}>Repeat on</Text>
        <View style={styles.swatchRow}>
          {DAY_LABELS.map((label, day) => (
            <Pressable
              key={day}
              onPress={() => toggleDay(day)}
              style={[styles.dayChip, activeDays.includes(day) && { backgroundColor: color, borderColor: color }]}
            >
              <Text style={[styles.dayChipText, activeDays.includes(day) && { color: "#fff" }]}>{label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View>
        <Text style={styles.label}>Daily reminder (optional, HH:mm)</Text>
        <TextInput
          style={styles.input}
          value={reminderTime}
          onChangeText={setReminderTime}
          placeholder="e.g. 08:00"
          placeholderTextColor="#9ca3af"
          keyboardType="numbers-and-punctuation"
        />
      </View>

      <Pressable style={[styles.saveButton, !valid && styles.saveButtonDisabled]} onPress={save} disabled={!valid}>
        <Text style={styles.saveButtonText}>{saving ? "Saving..." : "Save habit"}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  label: { fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  swatchRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  iconSwatch: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
    backgroundColor: "#f3f4f6",
  },
  colorSwatch: { width: 36, height: 36, borderRadius: 18, borderWidth: 3, borderColor: "transparent" },
  swatchSelected: { borderColor: "#1a1a1a" },
  dayChip: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#d1d5db",
    alignItems: "center",
    justifyContent: "center",
  },
  dayChipText: { fontWeight: "600", color: "#374151" },
  saveButton: { backgroundColor: "#5B8DEF", borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  saveButtonDisabled: { opacity: 0.5 },
  saveButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
