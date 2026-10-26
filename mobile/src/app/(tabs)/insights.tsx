import { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { fetchInsights } from "../../core/ai/client";

export default function InsightsScreen() {
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchInsights();
      setInsights(result);
    } catch (e) {
      setError("Couldn't reach the AI server. Make sure it's running and reachable from this device.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, gap: 16 }}>
      <Text style={styles.header}>Insights</Text>
      <Pressable style={styles.button} onPress={analyze} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Analyze my data</Text>}
      </Pressable>

      {error && <Text style={styles.error}>{error}</Text>}

      {insights.map((insight, i) => (
        <View key={i} style={styles.card}>
          <Text style={styles.cardText}>{insight}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f8fa" },
  header: { fontSize: 28, fontWeight: "700", color: "#1a1a1a" },
  button: { backgroundColor: "#5B8DEF", borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  error: { color: "#dc2626", textAlign: "center" },
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 14 },
  cardText: { color: "#1a1a1a", fontSize: 15, lineHeight: 21 },
});
