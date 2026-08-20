import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MessageSquare, X, Send, Bot, User, Trash2, Loader2, Sparkles, HelpCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ROLE_SUGGESTIONS = {
  STUDENT: [
    "How do I submit an assignment?",
    "Where can I check my attendance?",
    "Where are my results?",
    "How do I submit a complaint?"
  ],
  FACULTY: [
    "How do I create an assignment?",
    "How do I mark attendance?",
    "How do I upload study material?",
    "How do I enter marks?"
  ],
  HOD: [
    "How do I view department performance?",
    "How do I manage department notices?",
    "How do I view department faculty & students?"
  ],
  ADMIN: [
    "How do I add a student?",
    "How do I create a subject?",
    "How do I manage exams?",
    "How can I manage users?"
  ]
};

const AIChatbot = () => {
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const role = user?.role || 'STUDENT';
  const suggestions = ROLE_SUGGESTIONS[role] || ROLE_SUGGESTIONS.STUDENT;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Initial welcome message
  useEffect(() => {
    if (isAuthenticated && messages.length === 0 && user) {
      setMessages([
        {
          id: 'welcome',
          sender: 'bot',
          text: `Hi **${user.name?.split(' ')[0] || 'there'}**! 👋 I am your **Campus360 Help Assistant**.\nHow can I help you today with your **${role}** portal?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [isAuthenticated, user, role, messages.length]);

  // Keep hooks in the same order on both sides of an authentication change.
  // Returning before the effects makes React crash immediately after sign-in.
  if (!isAuthenticated) return null;

  const handleSendMessage = async (textToSend) => {
    const queryText = (textToSend || input).trim();
    if (!queryText || loading) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const token = localStorage.getItem('campus360_token');
      const response = await axios.post(
        'http://localhost:5000/api/chat',
        { message: queryText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const botReply = response.data?.data?.message || 'I am sorry, I could not process that request.';

      const botMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: '⚠️ Unable to connect to Campus360 AI Assistant service. Please check your backend connection.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        sender: 'bot',
        text: `Conversation cleared. Ask me anything about Campus360!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="ai-chat-trigger-btn"
          title="Open Campus360 AI Assistant"
        >
          <Sparkles size={20} className="sparkle-icon" />
          <span>Campus360 AI</span>
        </button>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="ai-chat-container">
          {/* Chat Header */}
          <div className="ai-chat-header">
            <div className="ai-chat-header-info">
              <div className="ai-bot-avatar">
                <Bot size={20} />
              </div>
              <div>
                <h4>Campus360 Assistant</h4>
                <span className="ai-status-badge">
                  <span className="online-dot"></span> Role: {role}
                </span>
              </div>
            </div>
            <div className="ai-chat-header-actions">
              <button onClick={clearChat} title="Clear conversation" className="icon-btn-subtle">
                <Trash2 size={16} />
              </button>
              <button onClick={() => setIsOpen(false)} title="Close Chat" className="icon-btn-subtle">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="ai-chat-messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`ai-message-wrapper ${msg.sender === 'user' ? 'user-wrapper' : 'bot-wrapper'}`}
              >
                <div className={`ai-message-bubble ${msg.sender}`}>
                  <div className="message-content">
                    {msg.text.split('\n').map((line, i) => (
                      <p key={i} style={{ margin: '0.2rem 0' }}>
                        {line}
                      </p>
                    ))}
                  </div>
                  <span className="message-timestamp">{msg.timestamp}</span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="ai-message-wrapper bot-wrapper">
                <div className="ai-message-bubble bot loading">
                  <Loader2 size={16} className="spin-animation" />
                  <span>Assistant is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Questions */}
          <div className="ai-suggestions-container">
            <div className="suggestions-header">
              <HelpCircle size={14} /> Suggested Questions:
            </div>
            <div className="suggestions-scroll">
              {suggestions.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(sug)}
                  disabled={loading}
                  className="suggestion-chip"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Input Bar */}
          <div className="ai-chat-input-bar">
            <input
              type="text"
              placeholder="Ask a question about Campus360..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || loading}
              className="send-btn"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatbot;
