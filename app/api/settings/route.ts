import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { appAuthOptions } from '../auth/[...nextauth]/route';
import { Prisma } from '@prisma/client';
import { ApiResponseSettings } from '@/interfaces';

export async function POST(req: NextRequest): Promise<NextResponse> {
    const session = await getServerSession(appAuthOptions);
    let responseBody: ApiResponseSettings;

    if (!session || !session.user) {
        responseBody = {
            error: true,
            message: 'Вы не авторизованы.',
        };
    } else {
        const data = (await req.json()) as Prisma.SettingsCreateInput;

        const userId = await prisma.user.findFirst({
            where: {
                email: session.user.email,
            },
            select: {
                id: true,
            },
        });

        const newSettings = await prisma.settings.upsert({
            where: {
                userId: userId?.id,
            },
            update: {
                channel: data.channel,
            },
            create: {
                channel: data.channel,
                user: {
                    connect: {
                        email: session.user.email as string,
                    },
                },
            },
        });

        responseBody = {
            error: false,
            message: 'Изменения сохранены.',
            data: newSettings,
        };
    }
    return NextResponse.json(responseBody);
}
