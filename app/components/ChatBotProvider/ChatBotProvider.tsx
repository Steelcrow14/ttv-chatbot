import { prisma } from '@/lib/prisma';
import { ChatBotContextProvider } from './ChatBotContextProvider';
import { ChatBotProviderProps } from './ChatBotProvider.props';
import { getServerSession } from 'next-auth';
import { appAuthOptions } from '@/app/api/auth/[...nextauth]/route';
import path, { join } from 'path';
import { getBatches } from '@/app/api/uploads/helpers/uploads';
import { UserFileWithURLdata } from '@/interfaces';
import { readFile, stat } from 'fs/promises';
import mime from 'mime';
import { ChatBotContextProviderProps } from './ChatBotContextProvider.props';
import { UserFile } from '@prisma/client';

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

	const relativeUploadDir = `/uploads/${sessionEmail}`;
	const uploadDir = join(process.cwd(), 'public', relativeUploadDir);

	const batches = getBatches(userFiles as UserFileWithURLdata[], 3);

	const files: UserFileWithURLdata[] = [];
	for (const batch of batches) {
		const processedBatch = await Promise.all(
			batch.map(
				async (userFile: UserFile): Promise<UserFileWithURLdata> => {
					const { file: filename } = userFile;
					const pathToFile = `${uploadDir}/${filename}`;
					try {
						await stat(pathToFile);
						const base64string = await readFile(
							pathToFile,
							'base64'
						);
						return {
							...userFile,
							urlData: `data:${mime.getType(
								path.extname(pathToFile)
							)};base64,${base64string}`,
						};
					} catch (e: any) {
						return {
							...userFile,
							urlData: '',
						};
					}
				}
			)
		);
		files.push(...processedBatch);
	}

	return {
		commands: commands,
		files: files,
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
