import { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { sendCoachMessage, type ChatMessage } from "../../core/ai/client";

export default function CoachScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Hi! I'm your personal coach. Ask me anything about your habits, reminders, or wardrobe." },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<FlatList>(null);

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;
    const next = [...messages, { role: "user", content: text } as ChatMessage];
    setMessages(next);
    setInput("");
    setSending(true);
    setError(null);
    try {
      const reply = await sendCoachMessage(next);
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (e) {
      setError("Couldn't reach the AI server. Make sure it's running and reachable from this device.");
    } finally {
      setSending(false);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(_, i) => String(i)}
        contentContainerStyle={{ padding: 16, gap: 10 }}
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.role === "user" ? styles.userBubble : styles.assistantBubble]}>
            <Text style={item.role === "user" ? styles.userText : styles.assistantText}>{item.content}</Text>
          </View>
        )}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask your coach..."
          placeholderTextColor="#9ca3af"
          onSubmitEditing={send}
        />
        <Pressable style={styles.sendButton} onPress={send} disabled={sending}>
          {sending ? <ActivityIndicator color="#fff" /> : <Text style={styles.sendButtonText}>Send</Text>}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  bubble: { borderRadius: 14, padding: 12, maxWidth: "85%" },
  userBubble: { backgroundColor: "#5B8DEF", alignSelf: "flex-end" },
  assistantBubble: { backgroundColor: "#f3f4f6", alignSelf: "flex-start" },
  userText: { color: "#fff", fontSize: 15 },
  assistantText: { color: "#1a1a1a", fontSize: 15 },
  error: { color: "#dc2626", textAlign: "center", paddingHorizontal: 16 },
  inputRow: { flexDirection: "row", gap: 8, padding: 12, borderTopWidth: 1, borderTopColor: "#e5e7eb" },
  input: { flex: 1, borderWidth: 1, borderColor: "#d1d5db", borderRadius: 10, paddingHorizontal: 12, fontSize: 15 },
  sendButton: { backgroundColor: "#5B8DEF", borderRadius: 10, paddingHorizontal: 16, justifyContent: "center" },
  sendButtonText: { color: "#fff", fontWeight: "600" },
});
