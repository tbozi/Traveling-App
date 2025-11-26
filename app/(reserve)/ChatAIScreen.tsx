import type { User } from '@flyerhq/react-native-chat-ui'
import { Chat } from '@flyerhq/react-native-chat-ui'
import { useState } from 'react'

const user: User = { id: 'user' }
const ai: User = { id: 'ai' }

export default function ChatAIScreen() {
  const [messages, setMessages] = useState<any[]>([])

  const addMessage = (msg: any) => setMessages(prev => [msg, ...prev])

  const fetchAI = async (prompt: string): Promise<string> => {
    try {
      const res = await fetch(" https://travelappai.onrender.com/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      })

      const data = await res.json()
      return data.reply
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

  return <Chat user={user} messages={messages} onSendPress={handleSend} />
}
