
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import ChatUI from './ChatUI';

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

  // Enhanced Username form component
  const UsernameForm = (
    <div className="relative flex flex-col items-center justify-center h-screen w-screen overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 z-0 animate-gradient bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900 opacity-90"></div>
      {/* Decorative Circles */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-blue-700 opacity-30 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-56 h-56 bg-purple-700 opacity-20 rounded-full blur-3xl animate-pulse"></div>
      {/* Card */}
      <form
        onSubmit={handleUsernameSubmit}
        className="relative z-10 bg-gray-900 bg-opacity-95 p-10 rounded-3xl shadow-2xl flex flex-col items-center border border-blue-800"
        style={{ minWidth: 340, maxWidth: 380 }}
      >
        {/* Logo/Avatar */}
        <div className="mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg border-4 border-blue-300 animate-spin-slow">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5s-3 1.343-3 3 1.343 3 3 3zm0 2c-2.67 0-8 1.337-8 4v2h16v-2c0-2.663-5.33-4-8-4z" />
            </svg>
          </div>
        </div>
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-2 tracking-wide drop-shadow-lg">
          Welcome to ChatWave
        </h2>
        <p className="text-gray-300 mb-6 text-center text-sm">
          Please choose a username to join the chat room.
        </p>
        <input
          type="text"
          value={username}
          onChange={handleUsernameChange}
          placeholder="Enter your username"
          className="px-5 py-3 rounded-xl bg-gray-800 text-white border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4 w-full text-lg transition"
          autoFocus
          maxLength={20}
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow-md transition duration-200 w-full"
          disabled={!username.trim()}
        >
          Join Chat
        </button>
      </form>
      {/* Attribution */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-gray-400 z-10">
        Made with <span className="text-pink-400">♥</span> by ChatWave
      </div>
      {/* Custom animation for gradient */}
      <style>
        {`
          .animate-gradient {
            background-size: 200% 200%;
            animation: gradientMove 8s ease-in-out infinite;
          }
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-spin-slow {
            animation: spin 6s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
        `}
      </style>
    </div>
  );

  return (
    <div className="flex flex-col h-screen w-screen bg-gradient-to-r from-gray-900 to-gray-800">
      {!isUsernameSet ? (
        UsernameForm
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
