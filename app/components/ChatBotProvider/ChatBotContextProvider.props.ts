import { ChatBotCommand, Settings, UserFile } from '@prisma/client';
import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface ChatBotContextProviderProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	commands: ChatBotCommand[];
	files: UserFile[];
	settings?: Settings;
}
