import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { Bot, User } from 'lucide-react'

export default function Home() {
  const [message, setMessage] = useState('')
  const [chat, setChat] = useState([])
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    scrollToBottom()
  }, [chat, loading])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const sendMessage = async () => {
    if (!message.trim()) return
    const newChat = [...chat, { sender: 'user', text: message }]
    setChat(newChat)
    setMessage('')
    setLoading(true)

    try {
      const res = await axios.post('http://localhost:5000/chat', { message })
      if (!res.data || !res.data.response) {
        throw new Error('Invalid response from server')
      }
      // Append bot response to chat
      setChat([...newChat, { sender: 'bot', text: res.data.response }])
    } catch (err) {
      console.error(err)
      setChat([...newChat, { sender: 'bot', text: 'Error connecting to backend.' }])
    }
    setLoading(false)
  }

  return (
    <div className="bg-white text-black min-h-screen transition-all">
      <header className="flex justify-between items-center p-4 border-b border-gray-300">
        <h1 className="text-xl font-bold">🤖 ChatBot</h1>
      </header>

      <main className="max-w-xl mx-auto p-4">
        <div className="h-[70vh] overflow-y-auto bg-gray-100 rounded-lg p-4 space-y-4">
          {chat.map((c, i) => (
            <div key={i} className={`flex ${c.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className="flex items-end gap-2 max-w-[80%]">
                {c.sender === 'bot' && <Bot className="text-green-600" />}
                <div
                  className={`p-3 rounded-lg text-sm ${
                    c.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-gray-300 text-black rounded-bl-none'
                  }`}
                >
                  {c.text}
                </div>
                {c.sender === 'user' && <User className="text-blue-600" />}
              </div>
            </div>
          ))}
          {loading && (
            <div className="text-gray-500 text-sm animate-pulse">Bot is typing...</div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="mt-4 flex">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-grow p-3 border rounded-l bg-white text-black focus:outline-none border-gray-300"
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-6 rounded-r hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </main>
    </div>
  )
}
