import { Metadata } from 'next';
import './globals.css';
import { Noto_Sans } from 'next/font/google';
import NextAuthProvider from './components/NextAuthProvider/NextAuthProvider';
import BasicLayout from './components/BasicLayout/BasicLayout';
import { ChatBotProvider } from './components/ChatBotProvider/ChatBotProvider';
import { ResourcesProvider } from './components/ResourcesProvider/ResourcesProvider';
import { Locales } from '@/enums/ResourcesProvider.enum';
import { AlertsProvider } from './components/AlertsProvider/AlertsProvider';
import cn from 'classnames';
import React from 'react';

const notoSans = Noto_Sans({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin', 'cyrillic'],
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'TTV exercise app',
    description: 'This is an exercise app that runs a Twitch.tv chatbot.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}): React.JSX.Element {
    return (
        <html lang="ru">
            <body
                className={cn(
                    notoSans.className,
                    'bg-slate-50 text-base font-medium text-slate-900 dark:bg-slate-900 dark:text-white'
                )}
            >
                <NextAuthProvider>
                    <ResourcesProvider locale={Locales['ru_RU']}>
                        <AlertsProvider>
                            <ChatBotProvider>
                                <BasicLayout>{children}</BasicLayout>
                            </ChatBotProvider>
                        </AlertsProvider>
                    </ResourcesProvider>
                </NextAuthProvider>
            </body>
        </html>
    );
}
