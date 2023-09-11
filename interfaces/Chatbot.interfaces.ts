import tmi from 'tmi.js';

export interface ChatMessage {
    userState?: tmi.ChatUserstate;
    isSystem: boolean;
    message: string;
    timestamp: number;
}
