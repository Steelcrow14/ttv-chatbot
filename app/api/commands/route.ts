import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { appAuthOptions } from '../auth/[...nextauth]/route';
import { Prisma } from '@prisma/client';
import { ApiResponseCommands } from '@/interfaces';

export async function GET(req: Request): Promise<NextResponse> {
    const session = await getServerSession(appAuthOptions);
    let responseBody: ApiResponseCommands;

    if (!session || !session.user) {
        responseBody = {
            error: true,
            message: 'Вы не авторизованы.',
        };
    } else {
        const commands = await prisma.chatBotCommand.findMany({
            where: {
                user: {
                    email: session.user.email,
                },
            },
        });

        responseBody = {
            error: false,
            message: 'Список команд обновлен',
            data: commands,
        };
    }
    return NextResponse.json(responseBody);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    const session = await getServerSession(appAuthOptions);
    let responseBody: ApiResponseCommands;

    if (!session || !session.user) {
        responseBody = {
            error: true,
            message: 'Вы не авторизованы.',
        };
    } else {
        const data = (await req.json()) as Prisma.ChatBotCommandCreateInput;

        const newCommand = await prisma.chatBotCommand.create({
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
            error: false,
            message: `"!${newCommand.name}": Команда успешно создана.`,
            data: [newCommand],
        };
    }
    return NextResponse.json(responseBody);
}

export async function PUT(req: NextRequest): Promise<NextResponse> {
    const session = await getServerSession(appAuthOptions);
    let responseBody: ApiResponseCommands;

    if (!session || !session.user) {
        responseBody = {
            error: true,
            message: 'Вы не авторизованы.',
        };
    } else {
        const data = (await req.json()) as Prisma.ChatBotCommandCreateInput;

        const newCommand = await prisma.chatBotCommand.update({
            where: {
                id: data.id,
            },
            data: {
                ...data,
            },
        });
        responseBody = {
            error: false,
            message: `"!${newCommand.name}": команда обновлена.`,
            data: [newCommand],
        };
    }
    return NextResponse.json(responseBody);
}

export async function DELETE(req: NextRequest): Promise<NextResponse> {
    const session = await getServerSession(appAuthOptions);
    let responseBody: ApiResponseCommands;

    if (!session || !session.user) {
        responseBody = {
            error: true,
            message: 'Вы не авторизованы.',
        };
    } else {
        const params = req.nextUrl.searchParams;
        const commandId = params.get('id');

        if (commandId == null) {
            responseBody = {
                error: true,
                message: 'Не передан id команды.',
            };
        } else {
            const deletedCommand = await prisma.chatBotCommand.delete({
                where: {
                    id: commandId,
                },
            });
            responseBody = {
                error: false,
                message: `"!${deletedCommand.name}": команда удалена.`,
            };
        }
    }
    return NextResponse.json(responseBody);
}
