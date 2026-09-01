import React from 'react';

const SuggestedPrompts = ({ prompts, onSelect, disabled }) => <div className="ai-suggestions-grid" aria-label="Suggested questions">{prompts.map(({ title, description, icon: Icon, prompt }) => <button key={title} type="button" onClick={() => onSelect(prompt)} disabled={disabled} className="ai-suggestion-card"><span className="ai-suggestion-icon"><Icon size={17} /></span><span><strong>{title}</strong><small>{description}</small></span></button>)}</div>;

export default SuggestedPrompts;
