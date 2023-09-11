'use client';

import { ChatBotContext } from '@/app/components/ChatBotProvider/ChatBotContextProvider';
import {
    Button,
    InputTag,
    NotAuthorized,
    HTag,
    ProgressBar,
} from '@/components';
import { ButtonAppearances } from '@/components/Button/Button.props';
import { Settings } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useContext } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import SaveIcon from '@/public/svg/Save.svg';
import cn from 'classnames';
import React from 'react';

const SettingsPage = (): React.JSX.Element => {
    const { settings, updateSettings } = useContext(ChatBotContext);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Settings>({
        mode: 'onTouched',
        defaultValues: settings,
    });
    const { data, status } = useSession();

    const onSubmit: SubmitHandler<Settings> = async (
        formData: Settings
    ): Promise<void> => {
        updateSettings(formData);
    };

    if (status === 'loading') {
        return <ProgressBar appearance="circle" />;
    }

    return !data?.user ? (
        <NotAuthorized />
    ) : (
        <section>
            <HTag tag="h2">Настройки</HTag>
            <form
                className={cn(
                    'rounded-md bg-slate-100 p-2.5 text-sm shadow-sm shadow-slate-300 dark:bg-inherit dark:shadow-none sm:text-base',
                    'border-0 border-primary dark:border'
                )}
                onSubmit={handleSubmit(onSubmit)}
            >
                <InputTag
                    {...register('channel', {
                        required: {
                            value: true,
                            message:
                                'Не указан канал чата, к которому должен подключаться бот.',
                        },
                        maxLength: {
                            value: 255,
                            message:
                                'Название канала не должно превышать 255 символов.',
                        },
                        pattern: {
                            value: /^[a-z0-9_]*$/,
                            message:
                                'Название канала может состоять только из строчных букв английского алфавита, цифр и знака подчеркивания.',
                        },
                    })}
                    placeholder="somechannel_123"
                    error={errors.channel}
                    aria-invalid={errors.channel ? true : false}
                    label={'Название канала'}
                />
                <div className="mt-2.5 flex flex-row items-center justify-end gap-2.5 pb-1.5">
                    <Button
                        appearance={ButtonAppearances.primary}
                        rounded={true}
                        type="submit"
                        className="sm:hidden"
                    >
                        <SaveIcon height={32} width={32} />
                    </Button>
                    <Button
                        appearance={ButtonAppearances.primary}
                        rounded={true}
                        type="submit"
                        className="hidden sm:block"
                    >
                        Сохранить настройки
                    </Button>
                </div>
            </form>
        </section>
    );
};

export default SettingsPage;
