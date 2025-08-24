'use client'

import { useState } from 'react'
import { getVision, askVision } from '@/lib/api'

export function ChatConsole() {
  const [input, setInput] = useState('Which deals are at risk this quarter?')
  const [messages, setMessages] = useState<Array<{role:'user'|'ai', text:string}>>([
    { role: 'ai', text: 'Ask anything about your pipeline or customers. Try: “Which deals will close if we add a pricing incentive?”' }
  ])
  const [loading, setLoading] = useState(false)

  const send = async () => {
    if (!input) return
    const q = input
    setMessages(m => [...m, { role: 'user', text: q }])
    setInput('')
    setLoading(true)

    try {
      const v = await getVision()
      const ans = await askVision(q)
      setMessages(m => [...m, { role: 'ai', text: ans || `Eclipse would: ${v.tagline}. AI executes follow-ups, strategies, and pricing automatically.` }])
    } catch (e) {
      setMessages(m => [...m, { role: 'ai', text: 'Backend not reachable. Ensure FastAPI is running on http://localhost:8000' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="h-64 overflow-auto rounded-lg border border-white/10 bg-black/20 p-3 space-y-2">
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'text-right' : ''}>
            <span className={m.role === 'user' ? 'inline-block bg-brand-600/40 border border-brand-500/40 px-3 py-2 rounded-lg' : 'inline-block bg-white/10 border border-white/10 px-3 py-2 rounded-lg'}>{m.text}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input className="flex-1 rounded-md bg-white/5 border border-white/10 px-3 py-2 outline-none focus:border-brand-400" value={input} onChange={e=>setInput(e.target.value)} placeholder="Ask Eclipse..." />
        <button onClick={send} disabled={loading} className="px-4 py-2 rounded-md bg-brand-600 hover:bg-brand-500 transition disabled:opacity-50">Send</button>
      </div>
    </div>
  )
}


