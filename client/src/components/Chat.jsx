import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:8000');

function formatDateTime(date) {
  const options = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  return date.toLocaleString(undefined, options);
}

export default function ChatPopup() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const myName = "Me";

  useEffect(() => {
    const cached = localStorage.getItem('chat_messages');
    if (cached) setMessages(JSON.parse(cached));

    socket.on('initial_message', (msgs) => {
      setMessages(msgs);
      localStorage.setItem('chat_messages', JSON.stringify(msgs));
    });

    socket.on('receive_message', (msg) => {
      setMessages(prev => {
        const exists = msg._id && prev.find(m => m._id === msg._id);
        if (exists) return prev;

        const updated = [...prev, msg];
        localStorage.setItem('chat_messages', JSON.stringify(updated));
        return updated;
      });
    });

    return () => {
      socket.off('initial_message');
      socket.off('receive_message');
    };
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;

    const now = new Date();
    const tempId = now.getTime().toString();

    const messageData = {
      text: input,
      sender: 'me',
      name: myName,
      timestamp: now.toISOString(),
      tempId,
    };

    setMessages(prev => {
      const updated = [...prev, messageData];
      localStorage.setItem('chat_messages', JSON.stringify(updated));
      return updated;
    });

    socket.emit('send_message', messageData);
    setInput('');
  };

  return (
    <>
      <button
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          padding: '10px 15px',
          borderRadius: '50%',
          fontSize: '20px',
          cursor: 'pointer',
          zIndex: 1000,
        }}
        onClick={() => setOpen(!open)}
      >
        💬
      </button>

      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: 70,
            right: 20,
            width: 300,
            height: 400,
            border: '1px solid #ccc',
            backgroundColor: 'white',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              flex: 1,
              padding: '10px',
              overflowY: 'auto',
              borderBottom: '1px solid #eee',
            }}
          >
            {messages.map((msg, idx) => (
              <div
                key={msg._id || msg.tempId || idx}
                style={{
                  textAlign: msg.sender === 'me' ? 'right' : 'left',
                  margin: '8px 0',
                }}
              >
                <div
                  style={{
                    fontSize: '12px',
                    color: '#666',
                    marginBottom: '3px',
                    fontWeight: 'bold',
                  }}
                >
                  {msg.name} · {formatDateTime(new Date(msg.timestamp))}
                </div>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '8px 12px',
                    borderRadius: '20px',
                    backgroundColor: msg.sender === 'me' ? '#DCF8C6' : '#E4E6EB',
                  }}
                >
                  {msg.text}
                </span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', padding: '10px' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '20px',
                border: '1px solid #ccc',
              }}
              placeholder="Type a message"
            />
            <button
              onClick={sendMessage}
              style={{
                marginLeft: 8,
                padding: '8px 12px',
                borderRadius: '20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
