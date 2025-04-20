import { useRef, useEffect } from 'react';
import { format } from 'date-fns';
import PropTypes from 'prop-types';

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

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll to bottom whenever chat updates
  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
        <div className="flex items-center">
          <h2 className="text-2xl font-bold text-blue-500">Chat Room</h2>
          <div className={`ml-4 px-3 py-1 rounded-full text-xs ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </div>
        </div>
        <div className="text-gray-300">
          Logged in as <span className="font-bold text-blue-400">{username}</span>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Online Users Sidebar */}
        <div className="hidden md:block w-64 bg-gray-800 border-r border-gray-700 p-4">
          <h3 className="text-lg font-semibold text-gray-300 mb-4">Online Users</h3>
          <ul>
            {onlineUsers.length > 0 ? (
              onlineUsers.map((user, index) => (
                <li key={index} className="flex items-center mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-gray-300">{user}</span>
                </li>
              ))
            ) : (
              <li className="text-gray-500">No users online</li>
            )}
          </ul>
        </div>

        {/* Messages Area */}
        <div className="flex-1 flex flex-col bg-gray-900">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chat.length > 0 ? (
              chat.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.sender === username ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${m.sender === username
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-gray-700 text-gray-200 rounded-bl-none'
                      }`}
                  >
                    <div className="font-bold text-xs mb-1">
                      {m.sender === username ? 'You' : m.sender}
                    </div>
                    <div className="break-words">{m.message}</div>
                    <div className="text-xs opacity-70 text-right mt-1">
                      {m.time ? format(new Date(m.time), 'HH:mm') : ''}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 mt-10">
                No messages yet. Start the conversation!
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <form onSubmit={sendMessage} className="p-4 border-t border-gray-700 bg-gray-800">
            <div className="flex">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-l focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                rows="2"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-r transition duration-200 flex items-center justify-center"
                disabled={!message.trim()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Press Enter to send, Shift+Enter for new line</p>
          </form>
        </div>
      </div>
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