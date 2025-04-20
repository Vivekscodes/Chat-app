import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import ChatUI from './ChatUI';
import LoginForm from './LoginForm';

// Socket configuration
const socket = io("http://localhost:4000", {
  transports: ['websocket', 'polling'],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 20000,
  autoConnect: true
});

socket.on('connect', () => {
  console.log('Connected to server with ID:', socket.id);
});

function ChatInterface() {
  // State management
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const navigate = useNavigate();

  // Socket event listeners
  useEffect(() => {
    // Listen for incoming messages from the server
    socket.on('receive-message', (msg) => {
      setChat((prev) => [...prev, { ...msg, time: new Date() }]);
    });

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('online-users', (users) => {
      setOnlineUsers(users);
    });

    // Cleanup function to remove event listeners
    return () => {
      socket.off('receive-message');
      socket.off('connect');
      socket.off('disconnect');
      socket.off('online-users');
    };
  }, []);

  // Event handlers
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setIsUsernameSet(true);
      socket.emit('user-joined', username);
      navigate('/ChatUI');
    }
  };

  const sendMessage = (e) => {
    e?.preventDefault();
    if (message.trim() && isUsernameSet) {
      const msgObj = {
        message,
        sender: username,
        time: new Date()
      };
      socket.emit('send-message', msgObj);
      setChat((prev) => [...prev, msgObj]);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-r from-gray-900 to-gray-800">
      {!isUsernameSet ? (
        <LoginForm
          username={username}
          handleUsernameChange={handleUsernameChange}
          handleUsernameSubmit={handleUsernameSubmit}
        />
      ) : (
        <ChatUI
          chat={chat}
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
          username={username}
          onlineUsers={onlineUsers}
          isConnected={isConnected}
          handleKeyPress={handleKeyPress}
        />
      )}
    </div>
  );
}

export default ChatInterface;