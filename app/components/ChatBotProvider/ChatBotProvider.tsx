import { prisma } from '@/lib/prisma';
import { ChatBotContextProvider } from './ChatBotContextProvider';
import { ChatBotProviderProps } from './ChatBotProvider.props';
import { getServerSession } from 'next-auth';
import { appAuthOptions } from '@/app/api/auth/[...nextauth]/route';
import { ChatBotContextProviderProps } from './ChatBotContextProvider.props';

const getProps = async (
	sessionEmail: string | null | undefined
): Promise<ChatBotContextProviderProps> => {
	if (!sessionEmail) {
		return {
			commands: [],
			files: [],
		};
	}

	const userData = await prisma.user.findFirst({
		where: {
			email: sessionEmail,
		},
		include: {
			userFiles: true,
			chatBotCommands: true,
			settings: true,
		},
	});

	if (!userData) {
		const message =
			'Ошибка при попытке получить данные пользователя. \
		Возможна проблема с cookie-файлами; удалите cookie-файлы для приложения и попробуйте еще раз.';
		throw Error(message);
	}

	const { userFiles, chatBotCommands: commands, settings } = userData;

	return {
		commands: commands,
		files: userFiles,
		settings: settings == null ? undefined : settings,
	};
};

/* @ts-expect-error Async Server Component */
export const ChatBotProvider = async ({ children }: ChatBotProviderProps): JSX.Element => {
	const session = await getServerSession(appAuthOptions);
	const props = await getProps(session?.user.email);

	return (
		<ChatBotContextProvider {...props}>{children}</ChatBotContextProvider>
	);
};
