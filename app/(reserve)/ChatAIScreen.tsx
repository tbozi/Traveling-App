import { Ionicons } from "@expo/vector-icons"
import type { User } from '@flyerhq/react-native-chat-ui'
import { Chat } from '@flyerhq/react-native-chat-ui'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const user: User = { id: 'user' }
const ai: User = { id: 'ai' }

export default function ChatAIScreen() {
  const [messages, setMessages] = useState<any[]>([])
  const router = useRouter()

  const addMessage = (msg: any) => setMessages(prev => [msg, ...prev])

  const fetchAI = async (prompt: string): Promise<string> => {
    try {
      const res = await fetch("https://travelappai.onrender.com/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      })

      const data = await res.json()

      return data.reply || "Lỗi phản hồi từ server."
    } catch (err) {
      console.log(err)
      return "Lỗi kết nối server."
    }
  }

  const handleSend = async ({ text }: { text: string }) => {
    addMessage({
      id: Math.random().toString(),
      author: user,
      createdAt: Date.now(),
      type: 'text',
      text,
    })

    const reply = await fetchAI(text)

    addMessage({
      id: Math.random().toString(),
      author: ai,
      createdAt: Date.now(),
      type: 'text',
      text: reply,
    })
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      
      {/* 🔥 HEADER CUSTOM KHÔNG BỊ LỆCH */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Trợ lý AI</Text>
        </View>

        {/* placeholder để title luôn nằm giữa */}
        <View style={{ width: 40 }} />
      </View>

      {/* 🔥 CHAT UI */}
      <Chat
        user={user}
        messages={messages}
        onSendPress={handleSend}

      />

    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#013687",
    borderBottomWidth: 1,
    borderBottomColor: "#ececec",
    paddingTop: 50,
  },
  backBtn: {
    width: 40,
    justifyContent: "center",
    padding: 4,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 0,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
  },
})
