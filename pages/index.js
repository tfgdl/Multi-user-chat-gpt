
import { useState } from 'react';

export default function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });
      const data = await res.json();
      setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: '⚠️ Error contacting GPT API.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🔮 Team ChatGPT</h1>
      <div className="border rounded p-4 h-96 overflow-y-scroll bg-gray-50">
        {messages.map((msg, i) => (
          <div key={i} className={\`mb-2 \${msg.role === 'user' ? 'text-right' : 'text-left'}\`}>
            <span className={\`inline-block px-3 py-2 rounded \${msg.role === 'user' ? 'bg-blue-100' : 'bg-green-100'}\`}>{msg.content}</span>
          </div>
        ))}
        {loading && <div className="text-gray-400">Assistant is typing...</div>}
      </div>
      <div className="flex mt-4 gap-2">
        <input
          className="flex-1 border px-3 py-2 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
