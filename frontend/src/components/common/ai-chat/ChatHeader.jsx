import React from 'react';
import { MessageSquarePlus, Trash2, X } from 'lucide-react';
import AIAvatar from './AIAvatar';

const IconButton = ({ label, className = '', children, ...props }) => <button type="button" className={`ai-header-icon-btn ${className}`} aria-label={label} title={label} {...props}>{children}</button>;

const ChatHeader = ({ role, loading, onNewChat, onClear, onClose }) => <header className="ai-chat-header"><div className="ai-chat-header-info"><AIAvatar /><div><h2>Campus360 AI</h2><p>Academic Assistant</p><span className={`ai-status-badge ${loading ? 'thinking' : ''}`}><i />{loading ? 'Thinking...' : `Role: ${role}`}</span></div></div><div className="ai-chat-header-actions"><IconButton label="New conversation" onClick={onNewChat}><MessageSquarePlus size={17} /></IconButton><IconButton label="Clear conversation" onClick={onClear}><Trash2 size={16} /></IconButton><IconButton label="Close assistant" className="ai-close-btn" onClick={onClose}><X size={18} /></IconButton></div></header>;

export default ChatHeader;
