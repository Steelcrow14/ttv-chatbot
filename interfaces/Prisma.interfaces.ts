import { ChatBotCommand, Settings, UserFile } from '@prisma/client';

export interface ApiResponse {
	code?: number;
	error: boolean;
	message: string;
}

export interface ApiResponseCommands extends ApiResponse {
	data?: ChatBotCommand[];
}

export interface ApiResponseUploads extends ApiResponse {
	data?: UserFile[];
}

export interface ApiResponseSettings extends ApiResponse {
	data?: Settings;
}
