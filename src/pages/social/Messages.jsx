import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import useAuth from '../../hooks/useAuth';
import { showToast } from '../../redux/actions/uiActions';

const STORAGE_KEY = 'spark_messages';
const STORAGE_CONV_KEY = 'spark_conversations';

const initialConversations = [
  { id: 'conv-1', name: 'Sarah Chen', uid: 'mock-sarah', avatar: 'SC', color: '#FF3C9D', online: true, lastMsg: '', time: '' },
  { id: 'conv-2', name: 'Marcus Johnson', uid: 'mock-marcus', avatar: 'MJ', color: '#7B4DFF', online: true, lastMsg: '', time: '' },
  { id: 'conv-3', name: 'Emily Watson', uid: 'mock-emily', avatar: 'EW', color: '#A15CFF', online: false, lastMsg: '', time: '' },
  { id: 'conv-4', name: 'David Kim', uid: 'mock-david', avatar: 'DK', color: '#4A6CFF', online: false, lastMsg: '', time: '' },
  { id: 'conv-5', name: 'Alex Rivera', uid: 'mock-alex', avatar: 'AR', color: '#00C9B1', online: true, lastMsg: '', time: '' },
  { id: 'conv-6', name: 'Lena Park', uid: 'mock-lena', avatar: 'LP', color: '#FF6B6B', online: false, lastMsg: '', time: '' },
  { id: 'conv-7', name: 'James Wilson', uid: 'mock-james', avatar: 'JW', color: '#7B4DFF', online: false, lastMsg: '', time: '' },
];

const initialMessageData = {
  'conv-1': [
    { id: 'm1', text: 'Hey! How\'s the project going?', fromMe: false, time: new Date(Date.now() - 1800000).toISOString() },
    { id: 'm2', text: 'Going well! Almost done with the redesign.', fromMe: true, time: new Date(Date.now() - 1750000).toISOString() },
    { id: 'm3', text: 'Have you seen the new React docs? They\'re amazing!', fromMe: false, time: new Date(Date.now() - 1700000).toISOString() },
  ],
  'conv-2': [
    { id: 'm4', text: 'Are you free for a quick call?', fromMe: false, time: new Date(Date.now() - 3600000).toISOString() },
    { id: 'm5', text: 'Sure, give me 10 minutes.', fromMe: true, time: new Date(Date.now() - 3500000).toISOString() },
    { id: 'm6', text: 'Sounds great! Let me know when you\'re free.', fromMe: false, time: new Date(Date.now() - 3400000).toISOString() },
  ],
};

const loadPersisted = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
};

const formatTime = (iso) => {
  const d = new Date(iso);
  const now = Date.now();
  const diff = now - d.getTime();
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
  return d.toLocaleDateString();
};

const Messages = () => {
  const navigate = useNavigate();
  const reduxDispatch = useDispatch();
  const { user } = useAuth();

  const [conversations, setConversations] = useState(() => loadPersisted(STORAGE_CONV_KEY, initialConversations));
  const [messages, setMessages] = useState(() => loadPersisted(STORAGE_KEY, initialMessageData));
  const [selectedId, setSelectedId] = useState(conversations[0]?.id || null);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => { document.title = 'Messages | Spark'; }, []);

  useEffect(() => { localStorage.setItem(STORAGE_CONV_KEY, JSON.stringify(conversations)); }, [conversations]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages)); }, [messages]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, selectedId]);

  const selected = conversations.find((c) => c.id === selectedId);
  const chat = messages[selectedId] || [];

  const handleSend = () => {
    if (!input.trim()) return;
    const msg = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      text: input.trim(),
      fromMe: true,
      time: new Date().toISOString(),
    };
    setMessages((prev) => ({ ...prev, [selectedId]: [...(prev[selectedId] || []), msg] }));
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedId
          ? { ...c, lastMsg: msg.text, time: formatTime(msg.time) }
          : c,
      ),
    );
    setInput('');

    setTimeout(() => {
      const reply = {
        id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        text: ['Sounds good!', 'Great point!', 'I agree.', 'Let me check on that.', 'Awesome!'][Math.floor(Math.random() * 5)],
        fromMe: false,
        time: new Date().toISOString(),
      };
      setMessages((prev) => ({ ...prev, [selectedId]: [...(prev[selectedId] || []), reply] }));
      setConversations((prev) =>
        prev.map((c) =>
          c.id === selectedId
            ? { ...c, lastMsg: reply.text, time: formatTime(reply.time) }
            : c,
        ),
      );
    }, 1500 + Math.random() * 2000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const unreadCount = (convId) => {
    const msgs = messages[convId] || [];
    return msgs.filter((m) => !m.fromMe).length;
  };

  return (
    <div className="feed" style={{ height: 'calc(100vh - 140px)' }}>
      <div className="feed-heading">
        <h1 className="feed-title">Messages</h1>
        <p className="feed-subtitle">Private conversations</p>
      </div>

      <div style={{ display: 'flex', flex: 1, minHeight: 0, background: 'var(--bg-glass)', borderRadius: 20, border: '1px solid var(--border-light)', overflow: 'hidden' }}>
        <div style={{ width: 280, flexShrink: 0, borderRight: '1px solid var(--border-light)', overflowY: 'auto' }}>
          {conversations.map((c) => {
            const unread = unreadCount(c.id);
            return (
              <div
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                style={{
                  padding: '12px 16px', cursor: 'pointer',
                  background: selectedId === c.id ? 'var(--bg-sidebar-active)' : 'transparent',
                  borderLeft: selectedId === c.id ? '2px solid var(--color-primary-light)' : '2px solid transparent',
                  display: 'flex', alignItems: 'center', gap: 10,
                  transition: 'background 0.2s',
                }}
              >
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: '50%',
                    background: `linear-gradient(135deg, ${c.color}, var(--border-medium))`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700, color: 'var(--color-text-white)',
                  }}>
                    {c.avatar}
                  </div>
                  {c.online && (
                    <div style={{
                      position: 'absolute', bottom: 0, right: 0, width: 10, height: 10,
                      borderRadius: '50%', background: '#00C9B1',
                      border: '2px solid var(--bg-surface)',
                    }} />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>{c.name}</span>
                    <span style={{ fontSize: 11, color: 'var(--color-text-placeholder)' }}>{c.time}</span>
                  </div>
                  <p style={{
                    fontSize: 12, color: 'var(--color-text-subtitle)',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0,
                  }}>
                    {c.lastMsg || 'No messages yet'}
                  </p>
                </div>
                {unread > 0 && (
                  <div style={{
                    width: 18, height: 18, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #FF3C9D, #FF6B6B)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 700, color: 'var(--color-text-white)', flexShrink: 0,
                  }}>
                    {unread}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {selected ? (
            <>
              <div style={{
                padding: '14px 20px', borderBottom: '1px solid var(--border-light)',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: `linear-gradient(135deg, ${selected.color}, var(--border-medium))`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, color: 'var(--color-text-white)', flexShrink: 0,
                }}>
                  {selected.avatar}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}>{selected.name}</div>
                  <div style={{ fontSize: 11, color: selected.online ? '#00C9B1' : 'var(--color-text-placeholder)' }}>
                    {selected.online ? 'Online' : 'Offline'}
                  </div>
                </div>
              </div>

              <div style={{
                flex: 1, padding: 20, overflowY: 'auto',
                display: 'flex', flexDirection: 'column', gap: 12,
              }}>
                {chat.map((msg) => (
                  <div key={msg.id} style={{ display: 'flex', justifyContent: msg.fromMe ? 'flex-end' : 'flex-start' }}>
                    <div style={{
                      maxWidth: '70%', padding: '10px 16px',
                      borderRadius: msg.fromMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      background: msg.fromMe ? 'linear-gradient(135deg, #7B4DFF, #A15CFF)' : 'var(--border-light)',
                      fontSize: 13,
                      color: msg.fromMe ? 'var(--color-text-white)' : 'var(--color-text-primary)',
                      lineHeight: 1.5,
                    }}>
                      <p style={{ margin: 0 }}>{msg.text}</p>
                      <div style={{
                        fontSize: 10,
                        color: msg.fromMe ? 'var(--color-text-secondary)' : 'var(--color-text-placeholder)',
                        textAlign: 'right', marginTop: 4,
                      }}>
                        {formatTime(msg.time)}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <div style={{
                padding: '12px 20px', borderTop: '1px solid var(--border-light)',
                display: 'flex', gap: 10,
              }}>
                <input
                  type="text" value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  style={{
                    flex: 1, padding: '12px 16px', borderRadius: 14,
                    background: 'var(--bg-surface-raised)',
                    border: '1px solid var(--border-light)',
                    color: 'var(--color-text-white)', fontSize: 13, outline: 'none',
                  }}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  style={{
                    padding: '10px 24px', borderRadius: 14, border: 'none',
                    background: 'linear-gradient(135deg, #7B4DFF, #FF3C9D)',
                    color: 'var(--color-text-white)', fontSize: 13, fontWeight: 600,
                    cursor: input.trim() ? 'pointer' : 'not-allowed',
                    opacity: input.trim() ? 1 : 0.4,
                    boxShadow: input.trim() ? '0 4px 15px rgba(255,70,180,0.20)' : 'none',
                  }}
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <div style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--color-text-placeholder)', fontSize: 14,
            }}>
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;