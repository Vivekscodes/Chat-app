
import { useRef, useEffect, useState } from 'react';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

// Utility for avatar color based on username
function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ('00' + value.toString(16)).slice(-2);
  }
  return color;
}

function getInitials(name) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function ChatUI({
  chat,
  message,
  setMessage,
  sendMessage,
  username,
  onlineUsers,
  isConnected,
  handleKeyPress
}) {
  const messagesEndRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedUser, setSelectedUser] = useState('All'); // 'All' for group chat

  // Auto-scroll to bottom when new messages arrive or selected user changes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat, selectedUser]);
  
  // Insert emoji at cursor position
  const addEmoji = (emoji) => {
    setMessage((prev) => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  // Filter messages for current chat context
  const filteredChat = chat.filter((m) => {
    if (selectedUser === 'All') {
      // Group chat: recipient is 'All' or undefined
      return !m.recipient || m.recipient === 'All';
    } else {
      // Private chat: (me <-> selectedUser)
      return (
        (m.sender === username && m.recipient === selectedUser) ||
        (m.sender === selectedUser && m.recipient === username)
      );
    }
  });

  // Modified sendMessage to include recipient
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    sendMessage(message, selectedUser); // Pass recipient
    setMessage('');
  };

  return (
    <div className="relative flex flex-col h-full min-h-screen w-full overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 z-0 animate-gradient bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900 opacity-90"></div>
      {/* Decorative Circles */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-blue-700 opacity-30 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-56 h-56 bg-purple-700 opacity-20 rounded-full blur-3xl animate-pulse"></div>
      {/* Main Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="bg-gray-900 bg-opacity-80 border-b border-blue-800 p-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg border-2 border-blue-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5s-3 1.343-3 3 1.343 3 3 3zm0 2c-2.67 0-8 1.337-8 4v2h16v-2c0-2.663-5.33-4-8-4z" />
              </svg>
            </div>
            <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 tracking-wide drop-shadow-lg">
              Chat Wave
            </h2>
            <div className={`ml-4 px-3 py-1 rounded-full text-xs font-semibold shadow ${isConnected ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </div>
          </div>
          <div className="text-gray-300 flex items-center gap-2">
            <span className="font-bold text-blue-400">{username}</span>
            <span className="text-xs text-gray-400">[You]</span>
          </div>
        </div>

        {/* Chat Container */}
        <div className="flex flex-1 overflow-hidden">
          {/* Online Users Sidebar */}
          <div className="hidden md:block w-72 bg-gray-900 bg-opacity-80 border-r border-blue-800 p-4">
            <h3 className="text-lg font-semibold text-blue-300 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" /></svg>
              Online Users
            </h3>
            <span className="ml-2 text-green-400 font-bold">({onlineUsers.length})</span>
            <ul className="space-y-3">
              {/* Group chat option */}
              <li
                className={`flex items-center gap-3 cursor-pointer p-2 ${selectedUser === 'All' ? 'bg-blue-800 bg-opacity-30 rounded' : ''}`}
                onClick={() => setSelectedUser('All')}
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500">
                  GC
                </div>
                <span className="text-gray-200 font-bold">Group Chat</span>
              </li>
              {/* Private chat users */}
              {onlineUsers.length > 0 ? (
                onlineUsers.filter(u => u !== username).map((user, index) => (
                  <li
                    key={index}
                    className={`flex items-center gap-3 cursor-pointer p-2 ${selectedUser === user ? 'bg-blue-800 bg-opacity-30 rounded' : ''}`}
                    onClick={() => setSelectedUser(user)}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow"
                      style={{ background: stringToColor(user) }}
                    >
                      {getInitials(user)}
                    </div>
                    <span className="text-gray-200">{user}</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-500">No users online</li>
              )}
              {/* You (current user) */}
              <li className="flex items-center gap-3 mt-4">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow"
                  style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #a78bfa 100%)' }}
                >
                  {getInitials(username)}
                </div>
                <span className="font-bold text-blue-400">You</span>
              </li>
            </ul>
          </div>

          {/* Messages Area */}
          <div className="flex-1 flex flex-col bg-transparent">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {filteredChat.length > 0 ? (
                filteredChat.map((m, i) => (
                  <div
                    key={i}
                    className={`flex items-end gap-2 ${m.sender === username ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  >
                    {/* Avatar */}
                    {m.sender !== username && (
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white shadow"
                        style={{
                          background: stringToColor(m.sender)
                        }}
                        title={m.sender}
                      >
                        {getInitials(m.sender)}
                      </div>
                    )}
                    {/* Message Bubble */}
                    <div
                      className={`max-w-xs md:max-w-md lg:max-w-lg px-5 py-3 rounded-2xl shadow-lg transition-all duration-200 ${m.sender === username
                        ? 'bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white rounded-br-none'
                        : 'bg-gray-800 bg-opacity-80 text-gray-200 rounded-bl-none'
                        }`}
                    >
                      <div className="font-bold text-xs mb-1 flex items-center gap-2">
                        {m.sender === username ? 'You' : m.sender}
                        {/* Private badge */}
                        {selectedUser !== 'All' && (
                          <span className="text-pink-400 text-[10px] font-semibold px-2 py-0.5 rounded bg-pink-900 bg-opacity-30 ml-1">Private</span>
                        )}
                      </div>
                      <div className="break-words">{m.message}</div>
                      <div className="text-xs opacity-70 text-right mt-1">
                        {m.time ? format(new Date(m.time), 'HH:mm') : ''}
                      </div>
                    </div>
                    {/* Avatar for your own messages */}
                    {m.sender === username && (
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white shadow"
                        style={{
                          background: 'linear-gradient(135deg, #3b82f6 0%, #a78bfa 100%)'
                        }}
                        title="You"
                      >
                        {getInitials(username)}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 mt-10 text-lg animate-pulse">
                  No messages yet. Start the conversation!
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-blue-800 bg-gray-900 bg-opacity-80">
              <div className="flex rounded-xl overflow-hidden shadow-lg relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 bg-gray-800 text-white border-none focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-base"
                  rows="2"
                  style={{ minHeight: 48 }}
                />
                {/* Emoji Picker Toggle Button */}
                <button
                  type="button"
                  className="px-3 flex items-center justify-center bg-transparent hover:bg-gray-700"
                  onClick={() => setShowEmojiPicker((v) => !v)}
                  tabIndex={-1}
                  title="Add emoji"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#fbbf24" />
                    <circle cx="9" cy="10" r="1" fill="#fff" />
                    <circle cx="15" cy="10" r="1" fill="#fff" />
                    <path d="M8 15c1.333 1 2.667 1 4 0" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:to-pink-700 text-white px-6 text-lg font-bold transition duration-200 flex items-center justify-center"
                  disabled={!message.trim()}
                  title="Send"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
                {/* Emoji Picker Dropdown */}
                {showEmojiPicker && (
                  <div className="absolute bottom-16 left-0 z-50">
                    <Picker data={data} onEmojiSelect={addEmoji} theme="dark" />
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Chatting with: <span className="font-semibold">{selectedUser === 'All' ? 'Group Chat' : selectedUser}</span>
              </p>
              <p className="text-xs text-gray-400">
                Press <span className="font-semibold">Enter</span> to send, <span className="font-semibold">Shift+Enter</span> for new line
              </p>
            </form>
          </div>
        </div>
      </div>
      {/* Custom animation for gradient and fade-in */}
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
          .animate-fade-in {
            animation: fadeIn 0.5s;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px);}
            to { opacity: 1; transform: translateY(0);}
          }
        `}
      </style>
    </div>
  );
}

ChatUI.propTypes = {
  chat: PropTypes.array.isRequired,
  message: PropTypes.string.isRequired,
  setMessage: PropTypes.func.isRequired,
  sendMessage: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  onlineUsers: PropTypes.array.isRequired,
  isConnected: PropTypes.bool.isRequired,
  handleKeyPress: PropTypes.func.isRequired
};

export default ChatUI;
