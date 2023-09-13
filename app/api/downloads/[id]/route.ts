import { ApiResponseUploads } from '@/interfaces';
import { prisma } from '@/lib/prisma';
import { statSync, readFileSync } from 'fs';
import mime from 'mime';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import { appAuthOptions } from '../../auth/[...nextauth]/route';

interface DownloadParams {
	params: {
		id: string;
	}
}

export async function GET(req: NextRequest, { params }: DownloadParams): Promise<NextResponse> {
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
		const fileId = params.id;
		const relativeUploadDir = `/uploads/${session.user.email}`;
		const uploadDir = join(process.cwd(), 'public', relativeUploadDir);

		const userFile = await prisma.userFile.findFirst({
			where: {
				id: fileId,
				user: {
					email: session.user.email,
				},
			},
		});

		if (userFile == null) {
			const res = new NextResponse(undefined, { status: 404 });
			return res;
		}

		const { file } = userFile;
		const pathToFile = `${uploadDir}/${file}`;
		try {
			const stats = statSync(pathToFile);
			const fileBuffer = readFileSync(pathToFile);
			const res = new NextResponse(fileBuffer);
			const contentType = mime.getType(pathToFile);

			if (contentType == null) {
				const res = new NextResponse(undefined, { status: 500 });
				return res;
			}

			res.headers.set('content-type', contentType);
			return res;

		} catch (e: any) {
			const res = new NextResponse(undefined, { status: 500 });
			return res;
		}
	}
}