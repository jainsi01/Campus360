import React from 'react';

const ClearChatDialog = ({ open, onCancel, onConfirm }) => !open ? null : <div className="ai-dialog-backdrop" role="presentation"><section className="ai-clear-dialog" role="dialog" aria-modal="true" aria-labelledby="clear-chat-title"><h2 id="clear-chat-title">Clear conversation?</h2><p>This will remove the current conversation history from this assistant.</p><div><button type="button" onClick={onCancel}>Cancel</button><button type="button" className="ai-danger-btn" onClick={onConfirm}>Clear</button></div></section></div>;

export default ClearChatDialog;
