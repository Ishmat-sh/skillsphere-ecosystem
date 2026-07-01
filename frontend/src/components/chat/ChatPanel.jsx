import { useEffect, useState, useRef } from 'react';
import api from '../../services/api';
import { glassCard, btnPrimary, inputClass } from '../../styles/dashboardStyles';

export default function ChatPanel({ socketHook }) {
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    api.get('/api/chat/rooms').then((res) => setRooms(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!activeRoom) return;
    socketHook.joinChat(activeRoom);
    api.get(`/api/chat/${activeRoom}/messages`).then((res) => setMessages(res.data)).catch(() => {});
    const cleanup = socketHook.onMessage?.((msg) => {
      setMessages((m) => [...m, msg]);
    });
    return cleanup;
  }, [activeRoom, socketHook]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = (e) => {
    e.preventDefault();
    if (!text.trim() || !activeRoom) return;
    socketHook.sendMessage(activeRoom, text.trim());
    setText('');
  };

  return (
    <div className={`${glassCard} p-5 flex flex-col h-[420px]`}>
      <h3 className="text-white font-semibold mb-3">Workspace Chat</h3>
      <div className="flex gap-2 mb-3 flex-wrap">
        {rooms.map((r) => (
          <button
            key={r._id}
            className={`text-xs px-3 py-1 rounded-lg border ${activeRoom === r._id ? 'border-[#7B61FF] bg-[#7B61FF]/20 text-white' : 'border-white/10 text-[#A2A2D0]/70'}`}
            onClick={() => setActiveRoom(r._id)}
          >
            {r.gig?.title || 'Contract'}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto space-y-2 mb-3 bg-black/20 rounded-xl p-3">
        {messages.map((m) => (
          <div key={m._id} className={`text-sm ${m.sender?.role === 'Client' ? 'text-[#00D2FF]' : 'text-[#FF5E62]'}`}>
            <span className="font-medium">{m.sender?.name}: </span>
            <span className="text-white/80">{m.content}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      {activeRoom ? (
        <form onSubmit={send} className="flex gap-2">
          <input className={`${inputClass} flex-1`} value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message..." />
          <button type="submit" className={btnPrimary}>Send</button>
        </form>
      ) : (
        <p className="text-xs text-[#A2A2D0]/50 text-center">Select a contract to chat</p>
      )}
    </div>
  );
}
