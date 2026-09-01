import React from 'react';
import AIAvatar from './AIAvatar';

const formatText = (text) => text.split('\n').map((line, index) => <p key={index}>{line.split(/(\*\*[^*]+\*\*)/g).map((part, partIndex) => part.startsWith('**') && part.endsWith('**') ? <strong key={partIndex}>{part.slice(2, -2)}</strong> : part)}</p>);

const ChatMessage = ({ message, userName }) => { const isUser = message.sender === 'user'; return <article className={`ai-message-wrapper ${isUser ? 'user-wrapper' : 'bot-wrapper'}`}><div className="ai-message-avatar">{isUser ? <span>{userName.charAt(0).toUpperCase()}</span> : <AIAvatar size="message" />}</div><div className={`ai-message-bubble ${isUser ? 'user' : 'bot'}`}><div className="message-content">{formatText(message.text)}</div><time className="message-timestamp">{message.timestamp}</time></div></article>; };

export default ChatMessage;
