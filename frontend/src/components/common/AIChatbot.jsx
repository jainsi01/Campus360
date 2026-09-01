import React, { useEffect, useRef, useState } from 'react';
import { BookOpen, CalendarDays, ClipboardList, GraduationCap, PenLine, UsersRound } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import AIAvatar from './ai-chat/AIAvatar';
import ChatComposer from './ai-chat/ChatComposer';
import ChatHeader from './ai-chat/ChatHeader';
import ChatMessage from './ai-chat/ChatMessage';
import ClearChatDialog from './ai-chat/ClearChatDialog';
import SuggestedPrompts from './ai-chat/SuggestedPrompts';
import TypingIndicator from './ai-chat/TypingIndicator';

const ROLE_SUGGESTIONS = {
  STUDENT: [
    { title: 'Submit an assignment', description: 'Share work before the deadline', icon: PenLine, prompt: 'How do I submit an assignment?' },
    { title: 'Check attendance', description: 'See your attendance record', icon: UsersRound, prompt: 'Where can I check my attendance?' },
    { title: 'View my results', description: 'Find marks and exam results', icon: GraduationCap, prompt: 'Where are my results?' },
    { title: 'Raise a complaint', description: 'Get help with an issue', icon: ClipboardList, prompt: 'How do I submit a complaint?' }
  ],
  FACULTY: [
    { title: 'Create assignment', description: 'Set coursework and due dates', icon: PenLine, prompt: 'How do I create an assignment?' },
    { title: 'Mark attendance', description: "Record today's attendance", icon: UsersRound, prompt: 'How do I mark attendance?' },
    { title: 'Enter marks', description: 'Publish student evaluation marks', icon: GraduationCap, prompt: 'How do I enter marks?' },
    { title: 'Upload material', description: 'Share notes and resources', icon: BookOpen, prompt: 'How do I upload study material?' },
    { title: 'View courses', description: 'Review assigned courses', icon: BookOpen, prompt: 'How do I view my courses?' },
    { title: 'View timetable', description: 'Check your class schedule', icon: CalendarDays, prompt: 'How do I view my timetable?' }
  ],
  HOD: [
    { title: 'Manage faculty', description: 'Review faculty information', icon: UsersRound, prompt: 'How do I manage faculty?' },
    { title: 'Department performance', description: 'Review department insights', icon: GraduationCap, prompt: 'How do I view department performance?' },
    { title: 'Manage courses', description: 'Organise department courses', icon: BookOpen, prompt: 'How do I manage courses?' },
    { title: 'View reports', description: 'Access department reports', icon: ClipboardList, prompt: 'How do I view department reports?' }
  ],
  ADMIN: [
    { title: 'Manage students', description: 'Add and update student records', icon: UsersRound, prompt: 'How do I manage students?' },
    { title: 'Manage faculty', description: 'Maintain faculty profiles', icon: UsersRound, prompt: 'How do I manage faculty?' },
    { title: 'Manage courses', description: 'Create and update courses', icon: BookOpen, prompt: 'How do I manage courses?' },
    { title: 'System reports', description: 'Review university reports', icon: ClipboardList, prompt: 'How do I view system reports?' }
  ]
};

const AIChatbot = () => {
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const messagesEndRef = useRef(null);
  const composerRef = useRef(null);

  const role = user?.role || 'STUDENT';
  const suggestions = ROLE_SUGGESTIONS[role] || ROLE_SUGGESTIONS.STUDENT;

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      window.setTimeout(() => composerRef.current?.focus(), 150);
    }
  }, [messages, isOpen, loading]);

  useEffect(() => {
    const handleEscape = (event) => { if (event.key === 'Escape' && isOpen && !showClearDialog) setIsOpen(false); };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, showClearDialog]);

  // Keep hooks in the same order on both sides of an authentication change.
  // Returning before the effects makes React crash immediately after sign-in.
  if (!isAuthenticated) return null;

  const handleSendMessage = async (textToSend) => {
    const queryText = (textToSend || input).trim();
    if (!queryText || loading) return;

    const userMsg = { id: Date.now().toString(), sender: 'user', text: queryText, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const conversation = messages.slice(-16)
        .map((message) => ({ role: message.sender === 'bot' ? 'assistant' : 'user', content: message.text }));
      const response = await api.post('/chat', { message: queryText, conversation });

      const botReply = response.data?.data?.reply || response.data?.data?.message || 'I am sorry, I could not process that request.';

      const botMsg = { id: (Date.now() + 1).toString(), sender: 'bot', text: botReply, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => { setMessages([]); setInput(''); setError(false); setShowClearDialog(false); };
  const retryLastMessage = () => { const lastUserMessage = [...messages].reverse().find((message) => message.sender === 'user'); if (lastUserMessage) handleSendMessage(lastUserMessage.text); };
  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <>
      {!isOpen && <button type="button" onClick={() => setIsOpen(true)} className="ai-chat-trigger-btn" aria-label="Open Campus360 AI assistant"><AIAvatar size="trigger" /><span>Campus360 AI</span></button>}
      {isOpen && (
        <section className="ai-chat-container" aria-label="Campus360 AI assistant">
          <ChatHeader role={role} loading={loading} onNewChat={clearChat} onClear={() => setShowClearDialog(true)} onClose={() => setIsOpen(false)} />
          <main className={`ai-chat-messages ${messages.length === 0 ? 'ai-chat-messages-empty' : ''}`} aria-live="polite">
            {messages.length === 0 ? <div className="ai-chat-welcome"><AIAvatar size="welcome" /><p className="ai-welcome-eyebrow">CAMPUS360 AI</p><h2>Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {firstName} <span aria-hidden="true">👋</span></h2><p>How can I help with your academic work today?</p><SuggestedPrompts prompts={suggestions} onSelect={handleSendMessage} disabled={loading} /></div> : <>{messages.map((message) => <ChatMessage key={message.id} message={message} userName={firstName} />)}{error && <div className="ai-inline-error" role="alert"><strong>Unable to connect to Campus360 AI</strong><span>Please try again in a moment.</span><button type="button" onClick={retryLastMessage}>Retry</button></div>}{loading && <TypingIndicator />}</>}
            <div ref={messagesEndRef} />
          </main>
          <ChatComposer ref={composerRef} value={input} onChange={setInput} onSend={handleSendMessage} disabled={loading} />
          <ClearChatDialog open={showClearDialog} onCancel={() => setShowClearDialog(false)} onConfirm={clearChat} />
        </section>
      )}
    </>
  );
};

export default AIChatbot;
