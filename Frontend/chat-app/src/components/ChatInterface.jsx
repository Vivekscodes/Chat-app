import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// Mock data for contacts and messages
const mockContacts = [
  { id: 1, name: 'John Doe', avatar: 'JD', status: 'online', lastMessage: 'Hey, how are you?', timestamp: '10:30 AM', unread: 2 },
  {
    id: 2, name: 'Sarah Smith', avatar: 'SS', status: 'offline', lastMessage: 'Let me know when youre free', timestamp: 'Yesterday', unread: 0
  },
  { id: 3, name: 'Mike Johnson', avatar: 'MJ', status: 'online', lastMessage: 'The project is due tomorrow', timestamp: 'Yesterday', unread: 3 },
  { id: 4, name: 'Emily Davis', avatar: 'ED', status: 'away', lastMessage: 'Did you see the latest update?', timestamp: 'Monday', unread: 0 },
  { id: 5, name: 'Alex Wilson', avatar: 'AW', status: 'online', lastMessage: 'Thanks for your help!', timestamp: 'Sunday', unread: 0 },
];

const mockMessages = [
  {
    id: 1, senderId: 1, text: 'Hey there! Hows it going?', timestamp: '10: 30 AM', status: 'read'
  },
  { id: 2, senderId: 'me', text: 'Pretty good! Just working on this new chat app.', timestamp: '10:32 AM', status: 'read' },
  { id: 3, senderId: 1, text: 'It looks amazing! The interface is so clean.', timestamp: '10:33 AM', status: 'read' },
  {
    id: 4, senderId: 'me', text: 'Thanks! Ive been working hard on it.', timestamp: '10: 34 AM', status: 'read'
  },
  { id: 5, senderId: 1, text: 'What features are you planning to add next?', timestamp: '10:36 AM', status: 'read' },
  {
    id: 6, senderId: 'me', text: 'Im thinking about adding voice messages and file sharing.What do you think?', timestamp: '10: 38 AM', status: 'sent'
  },
  { id: 7, senderId: 1, text: 'That would be awesome! Especially file sharing, its so useful.', timestamp: '10: 40 AM', status: 'delivered' },
];

const ChatInterface = () => {
  const [contacts, setContacts] = useState(mockContacts);
  const [messages, setMessages] = useState(mockMessages);
  const [selectedContact, setSelectedContact] = useState(mockContacts[0]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Filter contacts based on search query
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const newMsg = {
      id: messages.length + 1,
      senderId: 'me',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');

    // Simulate received message after 1-2 seconds
    setTimeout(() => {
      const replyMsg = {
        id: messages.length + 2,
        senderId: selectedContact.id,
        text: `Thanks for your message! This is an automated reply.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'delivered'
      };
      setMessages(prevMessages => [...prevMessages, replyMsg]);
    }, 1000 + Math.random() * 1000);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getMessageStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      case 'delivered':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'read':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex bg-gray-900 text-white">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-20">
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="p-2 rounded-md bg-gray-800 text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <div className={`w-80 bg-gray-800 border-r border-gray-700 flex flex-col ${isMobileSidebarOpen ? 'fixed inset-y-0 left-0 z-10' : 'hidden'} lg:flex`}>
        {/* User profile */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              ME
            </div>
            <div className="ml-3">
              <h2 className="text-lg font-semibold">My Account</h2>
              <p className="text-sm text-gray-400">Online</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-full hover:bg-gray-700"
            title="Logout"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm1 2h10v10H4V5zm4.293 2.293a1 1 0 011.414 0l2 2a1 1 0 010 1.414l-2 2a1 1 0 01-1.414-1.414L9.586 10 8.293 8.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search contacts..."
              className="w-full bg-gray-700 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute left-3 top-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Contacts list */}
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No contacts found
            </div>
          ) : (
            filteredContacts.map(contact => (
              <div
                key={contact.id}
                className={`p-4 border-b border-gray-700 hover:bg-gray-700 cursor-pointer ${selectedContact.id === contact.id ? 'bg-gray-700' : ''}`}
                onClick={() => {
                  setSelectedContact(contact);
                  setIsMobileSidebarOpen(false);
                }}
              >
                <div className="flex items-center">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold">
                      {contact.avatar}
                    </div>
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${getStatusColor(contact.status)} border-2 border-gray-800`}></div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="text-md font-semibold">{contact.name}</h3>
                      <span className="text-xs text-gray-400">{contact.timestamp}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-sm text-gray-400 truncate max-w-[150px]">{contact.lastMessage}</p>
                      {contact.unread > 0 && (
                        <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {contact.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        <div className="p-4 border-b border-gray-700 flex items-center">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold">
              {selectedContact.avatar}
            </div>
            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${getStatusColor(selectedContact.status)} border-2 border-gray-900`}></div>
          </div>
          <div className="ml-3">
            <h2 className="text-lg font-semibold">{selectedContact.name}</h2>
            <p className="text-sm text-gray-400">{selectedContact.status}</p>
          </div>
          <div className="ml-auto flex">
            <button className="p-2 rounded-full hover:bg-gray-800" title="Voice call">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </button>
            <button className="p-2 rounded-full hover:bg-gray-800" title="Video call">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
            </button>
            <button className="p-2 rounded-full hover:bg-gray-800" title="More options">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-900">
          <div className="space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                {message.senderId !== 'me' && (
                  <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold mr-2">
                    {selectedContact.avatar}
                  </div>
                )}
                <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${message.senderId === 'me'
                  ? 'bg-blue-600 rounded-lg rounded-tr-none'
                  : 'bg-gray-700 rounded-lg rounded-tl-none'
                  } p-3`}>
                  <p className="text-sm">{message.text}</p>
                  <div className="mt-1 flex justify-end items-center space-x-1">
                    <span className="text-xs text-gray-300">{message.timestamp}</span>
                    {message.senderId === 'me' && getMessageStatusIcon(message.status)}
                  </div>
                </div>
                {message.senderId === 'me' && (
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold ml-2">
                    ME
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message input */}
        <div className="p-4 border-t border-gray-700">
          <form onSubmit={handleSendMessage} className="flex items-center">
            <button
              type="button"
              className="p-2 rounded-full hover:bg-gray-800 text-gray-400"
              title="Attach file"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              type="button"
              className="p-2 rounded-full hover:bg-gray-800 text-gray-400 mr-2"
              title="Emoji"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd" />
              </svg>
            </button>
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 bg-gray-700 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button
              type="submit"
              className="ml-2 p-2 rounded-full bg-blue-600 hover:bg-blue-700"
              disabled={!newMessage.trim()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;