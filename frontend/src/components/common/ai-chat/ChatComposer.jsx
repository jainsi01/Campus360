import React, { forwardRef } from 'react';
import { Send } from 'lucide-react';

const ChatComposer = forwardRef(({ value, onChange, onSend, disabled }, ref) => <footer className="ai-chat-composer"><div className="ai-composer-shell"><textarea ref={ref} rows="1" value={value} onChange={(event) => onChange(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); onSend(); } }} disabled={disabled} placeholder="Ask Campus360 AI..." aria-label="Message Campus360 AI" /><button type="button" onClick={() => onSend()} disabled={!value.trim() || disabled} aria-label="Send message" title="Send message"><Send size={18} /></button></div><span className="ai-composer-hint">Enter to send · Shift + Enter for a new line</span></footer>);

ChatComposer.displayName = 'ChatComposer';
export default ChatComposer;
