import { ChatBotCommand, Settings, UserFile } from '@prisma/client';

export interface ApiResponse {
    code?: number;
    error: boolean;
    message: string;
}

export interface ApiResponseCommands extends ApiResponse {
    data?: ChatBotCommand[];
}

export interface UserFileWithURLdata extends UserFile {
    urlData: string;
}

export interface ApiResponseUploads extends ApiResponse {
    data?: UserFileWithURLdata[];
}

export interface ApiResponseSettings extends ApiResponse {
    data?: Settings;
}
