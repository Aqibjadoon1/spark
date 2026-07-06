import { useState, useEffect, useRef } from 'react';
import useAuth from '../../hooks/useAuth';
import {
  subscribeToConversations,
  subscribeToMessages,
  sendMessage,
  markMessagesRead,
} from '../../services/messageService';

const formatTime = (timestamp) => {
  if (!timestamp) return '';
  const d = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
  const diff = Date.now() - d.getTime();
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
  return d.toLocaleDateString();
};

const Messages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => { document.title = 'Messages | Spark'; }, []);

  useEffect(() => {
    if (!user?.uid) return;
    const unsub = subscribeToConversations(user.uid, setConversations);
    return () => unsub();
  }, [user?.uid]);

  useEffect(() => {
    if (!selectedId) return;
    const unsub = subscribeToMessages(selectedId, setMessages);
    markMessagesRead(selectedId, user?.uid);
    return () => unsub();
  }, [selectedId, user?.uid]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const selected = conversations.find((c) => c.id === selectedId);

  const handleSend = async () => {
    if (!input.trim() || !selectedId) return;
    try {
      await sendMessage(selectedId, user?.uid, user?.displayName || user?.name || 'User', user?.photoURL || '', input.trim());
      setInput('');
    } catch {}
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const getOtherParticipant = (conv) => {
    if (!conv?.participants || !user?.uid) return { name: 'Unknown', avatar: '?', color: '#7B4DFF', online: false };
    const otherId = conv.participants.find((p) => p !== user?.uid);
    return { name: otherId ? otherId.slice(0, 5) : 'Unknown', avatar: otherId?.charAt(0)?.toUpperCase() || '?', color: '#7B4DFF', online: false, uid: otherId };
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
            const other = getOtherParticipant(c);
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
                    background: `linear-gradient(135deg, ${other.color}, var(--border-medium))`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700, color: 'var(--color-text-white)',
                  }}>
                    {other.avatar}
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>{other.name}</span>
                    <span style={{ fontSize: 11, color: 'var(--color-text-placeholder)' }}>{c.lastMessage?.createdAt ? formatTime(c.lastMessage.createdAt) : ''}</span>
                  </div>
                  <p style={{
                    fontSize: 12, color: 'var(--color-text-subtitle)',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0,
                  }}>
                    {c.lastMessage?.text || 'No messages yet'}
                  </p>
                </div>
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
                  background: `linear-gradient(135deg, ${getOtherParticipant(selected).color}, var(--border-medium))`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, color: 'var(--color-text-white)', flexShrink: 0,
                }}>
                  {getOtherParticipant(selected).avatar}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}>{getOtherParticipant(selected).name}</div>
                </div>
              </div>

              <div style={{
                flex: 1, padding: 20, overflowY: 'auto',
                display: 'flex', flexDirection: 'column', gap: 12,
              }}>
                {messages.map((msg) => {
                  const fromMe = msg.senderId === user?.uid;
                  return (
                    <div key={msg.id} style={{ display: 'flex', justifyContent: fromMe ? 'flex-end' : 'flex-start' }}>
                      <div style={{
                        maxWidth: '70%', padding: '10px 16px',
                        borderRadius: fromMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        background: fromMe ? 'linear-gradient(135deg, #7B4DFF, #A15CFF)' : 'var(--border-light)',
                        fontSize: 13,
                        color: fromMe ? 'var(--color-text-white)' : 'var(--color-text-primary)',
                        lineHeight: 1.5,
                      }}>
                        <p style={{ margin: 0 }}>{msg.text}</p>
                        <div style={{
                          fontSize: 10,
                          color: fromMe ? 'var(--color-text-secondary)' : 'var(--color-text-placeholder)',
                          textAlign: 'right', marginTop: 4,
                        }}>
                          {formatTime(msg.createdAt)}
                        </div>
                      </div>
                    </div>
                  );
                })}
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
