import { ChatBotCommand } from '@prisma/client';

export enum CommandsActionTypesEnum {
    Create,
    Update,
    Delete,
    Refresh,
}

export type CommandsActions = {
    type: CommandsActionTypesEnum;
    commands: ChatBotCommand[];
};

export const CommandsReducer = (
    state: ChatBotCommand[],
    action: CommandsActions
): ChatBotCommand[] => {
    switch (action.type) {
        case CommandsActionTypesEnum.Create:
            return [...state, action.commands[0]];
        case CommandsActionTypesEnum.Update: {
            const filteredArray = state.filter(
                (command): boolean => command.id !== action.commands[0].id
            );
            return [...filteredArray, action.commands[0]];
        }
        case CommandsActionTypesEnum.Delete:
            return state.filter(
                (command): boolean => command.id !== action.commands[0].id
            );
        case CommandsActionTypesEnum.Refresh:
            return [...action.commands];
        default:
            throw new Error(
                'Ошибка: передан некорректный тип действия при работе c массивом комманд.'
            );
    }
};
