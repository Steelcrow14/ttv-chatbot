import { ChatMessage } from '@/interfaces';

export enum MessageActionTypesEnum {
    AddNew,
    Clear,
}

export type MessagesActions =
    | { type: MessageActionTypesEnum.Clear }
    | { type: MessageActionTypesEnum.AddNew; message: ChatMessage };

export const MessagesReducer = (
    state: ChatMessage[],
    action: MessagesActions
): ChatMessage[] => {
    switch (action.type) {
        case MessageActionTypesEnum.Clear:
            return [];
        case MessageActionTypesEnum.AddNew:
            return [...state, action.message];
        default:
            throw new Error(
                'Ошибка: передан некорректный тип действия при работе с массивом сообщений.'
            );
    }
};
