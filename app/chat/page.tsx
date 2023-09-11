'use client';

import React, { useContext } from 'react';
import { useSession } from 'next-auth/react';
import { ChatBotContext } from '../components/ChatBotProvider/ChatBotContextProvider';
import { ChatMessage } from '@/interfaces';
import { format } from 'date-fns';
import cn from 'classnames';
import ChatMessageElement from './components/ChatMessage/ChatMessage';
import { NotAuthorized, ProgressBar } from '@/components';

const ChatPage = (): React.JSX.Element => {
    const { chatBot, messages } = useContext(ChatBotContext);
    const { data } = useSession();

    const getUserName = (message: ChatMessage): string => {
        if (message.isSystem) {
            return 'СИСТЕМА';
        }
        const userName = message.userState?.['display-name']
            ? message.userState['display-name']
            : 'Неизвестный';
        return userName;
    };

    const getBadgesString = (message: ChatMessage): string => {
        let badgeString = '';
        if (!message.userState) {
            return badgeString;
        }
        const userState = message.userState;
        if (userState.badges && userState.badges.broadcaster) {
            badgeString +=
                userState.badges.broadcaster == '1' ? '[BROADCASTER]' : '';
        }
        if (userState.mod) {
            badgeString += userState.mod === true ? '[MOD]' : '';
        }
        if (userState.subscriber) {
            badgeString += userState.subscriber === true ? '[SUB]' : '';
        }
        return badgeString;
    };

    if (!data?.user) {
        return <NotAuthorized />;
    }

    return (
        <>
            {!chatBot ? (
                <ProgressBar appearance="circle" />
            ) : (
                <div
                    className={cn(
                        'h-full rounded-md bg-slate-100 p-2.5 text-sm shadow-sm shadow-slate-300 dark:bg-inherit dark:shadow-none sm:text-base',
                        'border-0 border-primary dark:border'
                    )}
                >
                    {messages?.map((message: ChatMessage): JSX.Element => {
                        const userName = getUserName(message);
                        const badgeString = getBadgesString(message);

                        return (
                            <div key={messages.indexOf(message)}>
                                <strong>
                                    {`${format(
                                        message.timestamp,
                                        'H:mm:ss'
                                    )}, ${badgeString}`}
                                    <span
                                        className={cn({
                                            [`text-primary`]:
                                                !message?.userState?.color,
                                        })}
                                        style={{
                                            color: message?.userState?.color?.toString(),
                                        }}
                                    >
                                        {`${userName}: `}
                                    </span>
                                    <ChatMessageElement
                                        className={cn({
                                            ['text-error']: message.isSystem,
                                        })}
                                        message={message.message}
                                    />
                                </strong>
                            </div>
                        );
                    })}
                </div>
            )}
        </>
    );
};

export default ChatPage;
