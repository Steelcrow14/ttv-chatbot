import { Dispatch, HTMLAttributes, SetStateAction } from 'react';
import { DetailedHTMLProps } from 'react';
import { ChatBotCommand } from '@prisma/client';
import { CommandFormTypes } from '@/enums/Command.enum';

export interface CommandProps
    extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    command?: ChatBotCommand;
    isOpened: boolean;
    setOpenedCommandId?: Dispatch<SetStateAction<string | undefined>>;
    formType: CommandFormTypes;
    checkCommandNameAvailability: (
        name: string,
        command?: ChatBotCommand
    ) => boolean;
}
