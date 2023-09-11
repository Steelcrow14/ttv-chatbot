'use client';

import { HTag, NotAuthorized, ProgressBar } from '@/components';
import { CommandFormTypes } from '@/enums/Command.enum';
import { useSession } from 'next-auth/react';
import Command from '../components/Command/Command';
import { ChatBotContext } from '@/app/components/ChatBotProvider/ChatBotContextProvider';
import { useContext } from 'react';
import React from 'react';

const AddPage = (): React.JSX.Element => {
    const { data, status } = useSession();
    const { commands } = useContext(ChatBotContext);

    const checkCommandNameAvailability = (name: string): boolean => {
        const existingCommand = commands.find(
            (command): boolean => command.name === name
        );
        return existingCommand === undefined;
    };

    if (status === 'loading') {
        return <ProgressBar appearance="circle" />;
    }

    return !data?.user ? (
        <NotAuthorized />
    ) : (
        <section>
            <HTag tag="h2">Добавление команды</HTag>
            <Command
                key={'newCommand'}
                formType={CommandFormTypes.create}
                isOpened={true}
                checkCommandNameAvailability={checkCommandNameAvailability}
            />
        </section>
    );
};

export default AddPage;
