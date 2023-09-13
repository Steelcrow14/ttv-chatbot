'use client';

import {
	MessageActionTypesEnum,
	MessagesReducer,
} from '@/app/reducers/messages.reducer';
import {
	Dispatch,
	useContext,
	useEffect,
	useReducer,
	useRef,
	useState,
} from 'react';
import { createContext } from 'react';
import tmi from 'tmi.js';
import { ChatBotContextProviderProps } from './ChatBotContextProvider.props';
import {
	ApiResponseSettings,
	ApiResponseUploads,
	ChatMessage,
} from '@/interfaces';
import { useSession } from 'next-auth/react';
import { initializeChatBot } from '@/app/helpers/ChatBotInitialization';
import { ChatBotCommand, Settings, UserFile } from '@prisma/client';
import axios from 'axios';
import { AlertsContext } from '../AlertsProvider/AlertsProvider';
import {
	CommandsActions,
	CommandsReducer,
} from '@/app/reducers/commands.reducer';
import { Howl } from 'howler';

export interface CachedCommandAudio {
	name: string;
	howl: Howl;
}

export interface ChatBotContext {
	chatBot?: tmi.Client;
	messages: ChatMessage[];
	files: UserFile[];
	commands: ChatBotCommand[];
	settings?: Settings;
	updateFiles: () => void;
	dispatchCommands: Dispatch<CommandsActions>;
	updateSettings: (newSettings: Settings) => void;
}

export const ChatBotContext = createContext<ChatBotContext>({
	files: [],
	commands: [],
	messages: [],
	updateFiles: (): void => {
		return;
	},
	dispatchCommands: (): void => {
		return;
	},
	updateSettings: (): void => {
		return;
	},
});

const initTmiClient = (accessToken: string, username: string): tmi.Client => {
	const newClient = new tmi.Client({
		options: {
			skipUpdatingEmotesets: true,
		},
		identity: {
			username: username,
			password: `oauth:${accessToken}`,
		},
	});
	return newClient;
};

export const ChatBotContextProvider = ({
	files: initialFiles,
	commands: initialCommands,
	settings: initialSettings,
	children,
}: ChatBotContextProviderProps): JSX.Element => {
	const { data: session } = useSession();
	const [messages, dispatchMessages] = useReducer(MessagesReducer, []);
	const [files, setFiles] = useState<UserFile[]>(initialFiles);
	const [commands, dispatchCommands] = useReducer(
		CommandsReducer,
		initialCommands
	);
	const [settings, setSettings] = useState<Settings | undefined>(
		initialSettings
	);
	const chatBotClient = useRef<tmi.Client>();
	const { addAlert } = useContext(AlertsContext);
	const commandAudioCache = useRef<CachedCommandAudio[]>([]);
	const audioPlaybackStack = useRef<string[]>([]);
	const activeTimersArray = useRef<NodeJS.Timer[]>([]);

	const updateUserFiles = async (): Promise<void> => {
		try {
			const { data } = await axios.get<ApiResponseUploads>(
				process.env.NEXT_PUBLIC_DOMAIN + '/api/uploads'
			);
			if (data.error === false) {
				setFiles(data.data || []);
			} else {
				setFiles([]);
				addAlert({
					appearance: 'error',
					message: `${data.message}.`,
				});
			}
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : String(err);
			addAlert({
				appearance: 'error',
				message: `${errorMessage}.`,
			});
		}
	};

	const updateSettings = async (newSettings: Settings): Promise<void> => {
		try {
			const { data } = await axios.post<ApiResponseSettings>(
				process.env.NEXT_PUBLIC_DOMAIN + '/api/settings',
				{
					...newSettings,
				}
			);
			if (data.error === false) {
				setSettings(data.data);
				addAlert({
					appearance: 'success',
					message: `${data.message}.`,
				});
			} else {
				addAlert({
					appearance: 'error',
					message: `${data.message}.`,
				});
			}
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : String(err);
			addAlert({
				appearance: 'error',
				message: `${errorMessage}.`,
			});
		}
	};

	useEffect((): (() => void) => {
		const currentChatBot = chatBotClient.current;
		const cleanup = async (): Promise<void> => {
			//part channels, disconnect from server, shut down timed commands, stop all audio playback
			if (currentChatBot) {
				const channels = currentChatBot.getChannels();
				await Promise.all(
					channels.map(
						(channel): Promise<[string]> =>
							currentChatBot.part(channel)
					)
				);
				const chatBotState = currentChatBot.readyState();
				if (chatBotState == 'CONNECTING' || chatBotState == 'OPEN') {
					await currentChatBot.disconnect();
				}
			}
			if (activeTimersArray.current) {
				activeTimersArray.current.forEach(
					(timer: NodeJS.Timer): void => {
						clearInterval(timer);
					}
				);
			}
			if (commandAudioCache.current) {
				commandAudioCache.current.forEach((cachedAudio): void => {
					if (cachedAudio.howl.playing()) {
						cachedAudio.howl.stop();
					}
				});
			}
		};

		if (session?.user.accessToken && session.user.name) {
			const accessToken = session.user.accessToken;
			const userName = session.user.name.toLowerCase();

			cleanup().then((): void => {
				chatBotClient.current = initTmiClient(accessToken, userName);

				if (chatBotClient.current && settings?.channel) {
					initializeChatBot(
						chatBotClient.current,
						settings.channel,
						dispatchMessages,
						commands,
						files,
						commandAudioCache,
						audioPlaybackStack,
						activeTimersArray
					);
					chatBotClient.current
						.connect()
						.then((): void => {
							if (chatBotClient.current && settings?.channel) {
								chatBotClient.current.join(settings.channel);
							}
						})
						.catch((e: any): void => {
							dispatchMessages({
								type: MessageActionTypesEnum.AddNew,
								message: {
									isSystem: true,
									message:
										'Не удалось подключиться к серверу.',
									timestamp: Date.now(),
								},
							});
						});
				}
			});
		}

		return cleanup;
	}, [
		session?.user.accessToken,
		session?.user.name,
		commands,
		files,
		settings,
	]);

	return (
		<ChatBotContext.Provider
			value={{
				chatBot: chatBotClient.current,
				messages: messages,
				files: files,
				commands: commands,
				settings: settings,
				updateFiles: updateUserFiles,
				dispatchCommands: dispatchCommands,
				updateSettings: updateSettings,
			}}
		>
			{children}
		</ChatBotContext.Provider>
	);
};
