import React from 'react';
import { Sparkles } from 'lucide-react';

const AIAvatar = ({ size = 'default' }) => <span className={`campus-ai-avatar campus-ai-avatar-${size}`} aria-hidden="true"><Sparkles /></span>;

export default AIAvatar;
