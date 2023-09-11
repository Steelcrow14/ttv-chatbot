import { UserFileWithURLdata } from '@/interfaces';
import { ChatBotCommand, Settings } from '@prisma/client';
import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface ChatBotContextProviderProps
    extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
    commands: ChatBotCommand[];
    files: UserFileWithURLdata[];
    settings?: Settings;
}
