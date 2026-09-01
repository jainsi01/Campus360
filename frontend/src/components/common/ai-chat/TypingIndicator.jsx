import React from 'react';
import AIAvatar from './AIAvatar';

const TypingIndicator = () => <div className="ai-message-wrapper bot-wrapper"><div className="ai-message-avatar"><AIAvatar size="message" /></div><div className="ai-typing-indicator"><span>Campus360 AI is thinking</span><b><i /><i /><i /></b></div></div>;

export default TypingIndicator;
