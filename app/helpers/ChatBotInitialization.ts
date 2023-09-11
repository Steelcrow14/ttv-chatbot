import tmi from 'tmi.js';
import {
    MessageActionTypesEnum,
    MessagesActions,
} from '../reducers/messages.reducer';
import { Dispatch, MutableRefObject } from 'react';
import { AudioSource, ChatBotCommand, CommandType } from '@prisma/client';
import { UserFileWithURLdata } from '@/interfaces';
import { CachedCommandAudio } from '../components/ChatBotProvider/ChatBotContextProvider';
import { Howl } from 'howler';

export const initializeChatBot = (
    newClient: tmi.Client,
    defaultChannel: string,
    dispatchMessages: Dispatch<MessagesActions>,
    commands: ChatBotCommand[],
    files: UserFileWithURLdata[],
    commandAudioCache: MutableRefObject<CachedCommandAudio[]>,
    audioPlaybackStack: MutableRefObject<string[]>,
    activeTimersArray: MutableRefObject<NodeJS.Timer[]>
): void => {
    const onErrorMessage = onErrorMessageConstructor(
        defaultChannel,
        newClient,
        dispatchMessages
    );

    const interactiveCommands = commands.filter(
        (command): boolean => command.isInterval === false
    );
    const timedCommands = commands.filter(
        (command): boolean => command.isInterval === true
    );

    newClient.on('connected', (): void => {
        dispatchMessages({
            type: MessageActionTypesEnum.AddNew,
            message: {
                isSystem: true,
                message: 'Успешное подключение к серверу.',
                timestamp: Date.now(),
            },
        });
    });

    newClient.on('disconnected', (): void => {
        dispatchMessages({
            type: MessageActionTypesEnum.AddNew,
            message: {
                isSystem: true,
                message: 'Произошло отключение от сервера.',
                timestamp: Date.now(),
            },
        });
    });

    newClient.on('connecting', (): void => {
        dispatchMessages({
            type: MessageActionTypesEnum.AddNew,
            message: {
                isSystem: true,
                message: 'Идет подключение к серверу.',
                timestamp: Date.now(),
            },
        });
    });

    newClient.on('reconnect', (): void => {
        dispatchMessages({
            type: MessageActionTypesEnum.AddNew,
            message: {
                isSystem: true,
                message: 'Переподключение к серверу.',
                timestamp: Date.now(),
            },
        });
    });

    newClient.on('join', (channel, username, self): void => {
        dispatchMessages({
            type: MessageActionTypesEnum.AddNew,
            message: {
                isSystem: true,
                message: `Бот подключился к каналу ${channel}`,
                timestamp: Date.now(),
            },
        });
    });

    newClient.on('part', (channel, username, self): void => {
        dispatchMessages({
            type: MessageActionTypesEnum.AddNew,
            message: {
                isSystem: true,
                message: `Бот отключился от канала ${channel}`,
                timestamp: Date.now(),
            },
        });
    });

    newClient.on('message', (channel, userState, message, self): void => {
        if (self) {
            return;
        }

        if (message.startsWith('!')) {
            const args = message.slice(1).split(' ');
            const incomingCommand = args.shift()?.toLowerCase();

            if (incomingCommand) {
                const matchingCommands = interactiveCommands.filter(
                    (command): boolean => command.name === incomingCommand
                );

                if (matchingCommands.length > 0) {
                    executeChatBotCommand(
                        newClient,
                        matchingCommands[0],
                        channel,
                        files,
                        commandAudioCache,
                        audioPlaybackStack,
                        onErrorMessage,
                        userState
                    );
                }
            }
        }

        dispatchMessages({
            type: MessageActionTypesEnum.AddNew,
            message: {
                userState: userState,
                isSystem: false,
                message: message,
                timestamp: Date.now(),
            },
        });
    });

    initiateTimedCommands(
        newClient,
        defaultChannel,
        timedCommands,
        files,
        commandAudioCache,
        audioPlaybackStack,
        activeTimersArray,
        onErrorMessage
    );
};

const executeChatBotCommand = (
    client: tmi.Client,
    command: ChatBotCommand,
    channel: string,
    files: UserFileWithURLdata[],
    commandAudioCache: MutableRefObject<CachedCommandAudio[]>,
    audioPlaybackStack: MutableRefObject<string[]>,
    onErrorMessage: (
        systemMessage: string,
        commandName: string,
        userState?: tmi.ChatUserstate,
        channel?: string,
        systemOnly?: boolean
    ) => void,
    userState?: tmi.ChatUserstate
): void => {
    switch (command.type) {
        case CommandType.say: {
            if (command.content) {
                const processedMessage = getProcessedChatMessage(
                    command.content,
                    userState
                );
                client.say(channel, processedMessage);
            } else {
                const systemMessage = `!${command.name}: отсутствует содержимое сообщения.`;
                onErrorMessage(systemMessage, command.name, userState, channel);
            }
            break;
        }
        case CommandType.audio: {
            const commandName = command.name;
            //1) Проверить, есть ли команда в кэше воспроизведения
            const matchingCachedAudio = commandAudioCache.current.filter(
                (cachedAudio): boolean => cachedAudio.name === command.name
            );
            //2) Если ее там нет, собрать новый элемент кэша воспроиведения
            if (matchingCachedAudio.length == 0) {
                const cachedAudio = initNewCachedAudio(
                    command,
                    files,
                    commandAudioCache,
                    audioPlaybackStack,
                    onErrorMessage,
                    channel,
                    userState
                );
                if (cachedAudio) {
                    commandAudioCache.current.push(cachedAudio);
                } else {
                    const systemMessage = `!${command.name}: Не удалось подготовить аудио к воспроизведению.`;
                    onErrorMessage(
                        systemMessage,
                        command.name,
                        userState,
                        channel
                    );
                    break;
                }
            }
            if (!command.ignoreAudioQueue) {
                //3) добавить команду (имя команды) в стэк воспроизведения
                audioPlaybackStack.current.push(commandName);
                //4) если длина стэка вопроизведения == 1, запустить команду проигрывания звука
                if (audioPlaybackStack.current.length == 1) {
                    startQueuedAudioPlayback(
                        commandAudioCache,
                        audioPlaybackStack,
                        onErrorMessage,
                        channel,
                        userState
                    );
                }
            } else {
                //5) Если команда игнорирует стэк вопроизведения, то вопроизведение запускается параллельно.
                startAudioPlayback(
                    commandAudioCache,
                    command.name,
                    onErrorMessage,
                    channel,
                    userState
                );
            }
            break;
        }
        default: {
            const systemMessage = `!${command.name}: получен неизвестный тип команды.`;
            onErrorMessage(systemMessage, command.name, userState, channel);
            break;
        }
    }
};

const startQueuedAudioPlayback = (
    commandAudioCache: MutableRefObject<CachedCommandAudio[]>,
    audioPlaybackStack: MutableRefObject<string[]>,
    onErrorMessage: (
        systemMessage: string,
        commandName: string,
        userState?: tmi.ChatUserstate,
        channel?: string,
        systemOnly?: boolean
    ) => void,
    channel: string,
    userState?: tmi.ChatUserstate
): void => {
    if (audioPlaybackStack.current.length === 0) {
        return;
    }

    const nextAudioCommandName = audioPlaybackStack.current[0];
    startAudioPlayback(
        commandAudioCache,
        nextAudioCommandName,
        onErrorMessage,
        channel,
        userState
    );
};

const startAudioPlayback = (
    commandAudioCache: MutableRefObject<CachedCommandAudio[]>,
    audioCommandName: string,
    onErrorMessage: (
        systemMessage: string,
        commandName: string,
        userState?: tmi.ChatUserstate,
        channel?: string,
        systemOnly?: boolean
    ) => void,
    channel: string,
    userState?: tmi.ChatUserstate
): void => {
    const cachedAudio = commandAudioCache.current.find(
        (cache): boolean => cache.name === audioCommandName
    );
    if (!cachedAudio || !cachedAudio.howl) {
        const systemMessage = `!${audioCommandName}: Не удалось воспроизвести аудио - ошибка подготовки кэша.`;
        onErrorMessage(systemMessage, audioCommandName, userState, channel);
        return;
    }

    cachedAudio.howl.play();
};

const initNewCachedAudio = (
    command: ChatBotCommand,
    files: UserFileWithURLdata[],
    commandAudioCache: MutableRefObject<CachedCommandAudio[]>,
    audioPlaybackStack: MutableRefObject<string[]>,
    onErrorMessage: (
        systemMessage: string,
        commandName: string,
        userState?: tmi.ChatUserstate,
        channel?: string,
        systemOnly?: boolean
    ) => void,
    channel: string,
    userState?: tmi.ChatUserstate
): CachedCommandAudio | undefined => {
    switch (command.audiosrc) {
        case AudioSource.file: {
            const matchingFiles = files.filter(
                (file): boolean => file.name === command.file
            );
            if (matchingFiles.length === 0) {
                const systemMessage = `!${command.name}: среди загруженных файлов нет файла для воспроизведения.`;
                onErrorMessage(
                    systemMessage,
                    command.name,
                    userState,
                    channel,
                    true
                );
                return undefined;
            }
            if (matchingFiles[0].urlData == '') {
                return undefined;
            }
            const newHowl = new Howl({
                src: [matchingFiles[0].urlData],
                html5: true,
                onend: function (): void {
                    audioPlaybackStack.current.shift();
                    if (audioPlaybackStack.current.length > 0) {
                        startQueuedAudioPlayback(
                            commandAudioCache,
                            audioPlaybackStack,
                            onErrorMessage,
                            channel,
                            userState
                        );
                    }
                },
            });
            const cachedAudio: CachedCommandAudio = {
                name: command.name,
                howl: newHowl,
            };
            return cachedAudio;
            break;
        }
        case AudioSource.url: {
            if (!command.content) {
                const systemMessage = `!${command.name}: не указан URL внешнего файла.`;
                onErrorMessage(
                    systemMessage,
                    command.name,
                    userState,
                    channel,
                    true
                );
                return undefined;
            }
            const newHowl = new Howl({
                src: [command.content],
                html5: true,
                preload: true,
                onend: function (): void {
                    audioPlaybackStack.current.shift();
                    if (audioPlaybackStack.current.length > 0) {
                        startQueuedAudioPlayback(
                            commandAudioCache,
                            audioPlaybackStack,
                            onErrorMessage,
                            channel,
                            userState
                        );
                    }
                },
            });
            const cachedAudio: CachedCommandAudio = {
                name: command.name,
                howl: newHowl,
            };
            return cachedAudio;
            break;
        }
        default: {
            const systemMessage = `!${command.name}: неизвестный источник аудиофайла.`;
            onErrorMessage(
                systemMessage,
                command.name,
                userState,
                channel,
                true
            );
            return undefined;
            break;
        }
    }
};

const initiateTimedCommands = (
    newClient: tmi.Client,
    defaultChannel: string,
    commands: ChatBotCommand[],
    files: UserFileWithURLdata[],
    commandAudioCache: MutableRefObject<CachedCommandAudio[]>,
    audioPlaybackStack: MutableRefObject<string[]>,
    activeTimersArray: MutableRefObject<NodeJS.Timer[]>,
    onErrorMessage: (
        systemMessage: string,
        commandName: string,
        userState?: tmi.ChatUserstate,
        channel?: string,
        systemOnly?: boolean
    ) => void
): void => {
    commands.forEach((command): void => {
        if (command.intervalMs !== null) {
            const newTimer = setInterval((): void => {
                executeChatBotCommand(
                    newClient,
                    command,
                    defaultChannel,
                    files,
                    commandAudioCache,
                    audioPlaybackStack,
                    onErrorMessage
                );
            }, command.intervalMs);
            activeTimersArray.current.push(newTimer);
        } else {
            const systemMessage = `!${command.name}: Не удалось инициализировать команду - не указан интервал запуска.`;
            onErrorMessage(
                systemMessage,
                command.name,
                undefined,
                defaultChannel,
                true
            );
        }
    });
};

//Функция для подстановки каких-либо переменных в сообщение.
const getProcessedChatMessage = (
    message: string,
    userState?: tmi.ChatUserstate
): string => {
    const processedMessage = message.replaceAll(
        '{{username}}',
        `@${userState?.['display-name']}`
    );

    return processedMessage;
};

const onErrorMessageConstructor = (
    defaultChannel: string,
    client: tmi.Client,
    dispatchMessages: Dispatch<MessagesActions>
): ((
    systemMessage: string,
    commandName: string,
    userState?: tmi.ChatUserstate,
    channel?: string,
    systemOnly?: boolean
) => void) => {
    return (
        systemMessage: string,
        commandName: string,
        userState?: tmi.ChatUserstate,
        channel: string = defaultChannel,
        systemOnly = false
    ): void => {
        const userMessage = `@${userState?.['display-name']} Ошибка при выполнении команды "!${commandName}". Обратитесь к администратору канала.`;
        dispatchMessages({
            type: MessageActionTypesEnum.AddNew,
            message: {
                isSystem: true,
                message: systemMessage,
                timestamp: Date.now(),
            },
        });
        if (!systemOnly) {
            client.say(channel, userMessage);
        }
    };
};
