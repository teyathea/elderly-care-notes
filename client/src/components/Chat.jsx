import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";

const Chat = ({ token, userName, userEmail, userRole }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const socketIo = io(import.meta.env.VITE_BACKEND_URL, {
      auth: { token }
    });

    socketIo.on("initial_message", setMessages);
    socketIo.on("receive_message", (msg) => setMessages((prev) => [...prev, msg]));

    setSocket(socketIo);
    return () => socketIo.disconnect();
  }, [token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (content.trim() && socket) {
      socket.emit("send_message", {
        text: content,
        name: userName,
        email: userEmail,
        role: userRole,
      });
      setContent("");
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-xl hover:bg-blue-700"
        aria-label="Open Chat"
      >
        💬
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 shadow-2xl rounded-2xl flex flex-col bg-white border border-gray-300" style={{ height: "400px" }}>
      <div className="bg-blue-600 text-white p-3 font-semibold flex justify-between items-center rounded-t-2xl">
        Chat
        <button onClick={() => setIsOpen(false)} className="font-bold hover:text-gray-300" aria-label="Close Chat">
          ✕
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-3 text-sm border-b border-gray-200 pb-2">
            <div className="flex justify-between items-start">
              <div>
                <strong>{msg.name}</strong> <em className="text-gray-600">({msg.role})</em>
              </div>
              <div className="text-gray-400 text-xs text-right">
                {new Date(msg.timestamp).toLocaleString()}
              </div>
            </div>
            <div className="mt-1">{msg.text}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex border-t p-2">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 border rounded-l-xl px-3 py-2 focus:outline-none"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend} className="bg-blue-600 text-white px-4 rounded-r-xl hover:bg-blue-700">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
