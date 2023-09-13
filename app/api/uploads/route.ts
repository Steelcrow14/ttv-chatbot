import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { appAuthOptions } from '../auth/[...nextauth]/route';
import { ApiResponseUploads } from '@/interfaces';
import { mkdir, stat, writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import mime from 'mime';
import { Prisma } from '@prisma/client';
import { format } from 'date-fns';

export async function GET(): Promise<NextResponse> {
	const session = await getServerSession(appAuthOptions);
	let responseBody: ApiResponseUploads;

	if (!session || !session.user) {
		responseBody = {
			code: 403,
			error: true,
			message: 'Вы не авторизованы.',
		};
	} else {
		const userFiles = await prisma.userFile.findMany({
			where: {
				user: {
					email: session.user.email,
				},
			},
		});

		responseBody = {
			code: 200,
			error: false,
			message: 'Список файлов успешно обновлен.',
			data: userFiles,
		};
	}
	return NextResponse.json(responseBody);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
	const session = await getServerSession(appAuthOptions);
	let responseBody: ApiResponseUploads;

	if (!session || !session.user) {
		responseBody = {
			code: 403,
			error: true,
			message: 'Вы не авторизованы.',
		};
		return NextResponse.json(responseBody);
	} else {
		const formData = await req.formData();

		const file = formData.get('file') as Blob | null;
		if (!file) {
			responseBody = {
				code: 400,
				error: true,
				message: 'Загружаемый файл отсутствует в запросе на загрузку.',
			};
			return NextResponse.json(responseBody);
		}

		const buffer = Buffer.from(await file.arrayBuffer());
		const relativeUploadDir = `/uploads/${session.user.email}`;
		const uploadDir = join(process.cwd(), 'public', relativeUploadDir);

		try {
			await stat(uploadDir);
		} catch (e: any) {
			if (e.code === 'ENOENT') {
				await mkdir(uploadDir, { recursive: true });
			} else {
				console.error(
					'Ошибка при создании папки загрузок на сервере.\n',
					e
				);
				responseBody = {
					code: 500,
					error: true,
					message: 'Что-то пошло не так.',
				};
				return NextResponse.json(responseBody);
			}
		}

		try {
			const uniqueSuffix = `${Date.now()}-${Math.round(
				Math.random() * 1e9
			)}`;
			let cleanFilename = file.name.replace(/\.[^/.]+$/, '');
			const fileExtension = mime.getExtension(file.type);
			const filename = `${cleanFilename}-${uniqueSuffix}.${fileExtension}`;
			await writeFile(`${uploadDir}/${filename}`, buffer);

			//Проверка уникальности отображаемого имени файла
			const originalFileName = await prisma.userFile.findFirst({
				where: {
					name: cleanFilename,
					user: {
						email: session.user.email as string,
					},
				},
			});
			if (originalFileName !== null) {
				cleanFilename += `_${format(
					Date.now(),
					'yyyy_MM_dd_HH_mm_ss'
				)}`;
			}

			//Запись в бд и возврат
			const data: Prisma.UserFileCreateInput = {
				name: cleanFilename,
				file: filename,
				type: 'audio',
				format: file.type
			};
			const newUserFile = await prisma.userFile.create({
				data: {
					user: {
						connect: {
							email: session.user.email as string,
						},
					},
					...data,
				},
			});

			responseBody = {
				code: 200,
				error: false,
				message: `Файл ${newUserFile.name} успешно загружен.`,
				data: [newUserFile],
			};
			return NextResponse.json(responseBody);
		} catch (e) {
			console.error('Ошибка при загрузке файла на сервер.\n', e);
			responseBody = {
				code: 500,
				error: true,
				message: 'Что-то пошло не так.',
			};
			return NextResponse.json(responseBody);
		}
	}
}

export async function DELETE(req: NextRequest): Promise<NextResponse> {
	const session = await getServerSession(appAuthOptions);
	let responseBody: ApiResponseUploads;

	if (!session || !session.user) {
		responseBody = {
			code: 403,
			error: true,
			message: 'Вы не авторизованы.',
		};
		return NextResponse.json(responseBody);
	} else {
		const params = req.nextUrl.searchParams;
		const fileId = params.get('id');

		if (fileId == null) {
			responseBody = {
				error: true,
				message: 'Не передан id файла.',
			};
			return NextResponse.json(responseBody);
		}

		const fileRecord = await prisma.userFile.findFirst({
			where: {
				id: fileId,
			},
		});

		if (!fileRecord) {
			responseBody = {
				error: true,
				message: 'Не удалось удалить файл.',
			};
			return NextResponse.json(responseBody);
		}

		const fileName = fileRecord.name;
		const fileNameOnDisk = fileRecord.file;

		const relativeUploadDir = `/uploads/${session.user.email}`;
		const uploadDir = join(process.cwd(), 'public', relativeUploadDir);

		try {
			await stat(uploadDir);
		} catch (e: any) {
			responseBody = {
				error: true,
				message: 'Не удалось удалить файл.',
			};
			return NextResponse.json(responseBody);
		}

		try {
			await unlink(`${uploadDir}/${fileNameOnDisk}`);

			await prisma.userFile.delete({
				where: {
					id: fileId,
				},
			});

			responseBody = {
				code: 200,
				error: false,
				message: `Файл ${fileName} успешно удален.`,
			};
			return NextResponse.json(responseBody);
		} catch (e: any) {
			if (e.code === 'ENOENT') {
				await prisma.userFile.delete({
					where: {
						id: fileId,
					},
				});

				responseBody = {
					code: 200,
					error: false,
					message: `Файл ${fileName} успешно удален [база данных].`,
				};
			} else {
				console.error('Ошибка при Удалении файла.\n', e);
				responseBody = {
					code: 500,
					error: true,
					message: 'Что-то пошло не так.',
				};
			}
			return NextResponse.json(responseBody);
		}
	}
}
