'use client';

import { AlertsContext } from '@/app/components/AlertsProvider/AlertsProvider';
import { ChatBotContext } from '@/app/components/ChatBotProvider/ChatBotContextProvider';
import {
    Button,
    ProgressBar,
    InputTag,
    NotAuthorized,
    HTag,
} from '@/components';
import { ButtonAppearances } from '@/components/Button/Button.props';
import { ApiResponseUploads, fileUpload } from '@/interfaces';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useContext } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import UserFileCard from './components/UserFileCard/UserFileCard';
import cn from 'classnames';
import React from 'react';

const UploadsPage = (): React.JSX.Element => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm<fileUpload>();
    const { addAlert } = useContext(AlertsContext);
    const { files: userFiles, updateFiles: updateUserFiles } =
        useContext(ChatBotContext);
    const { data, status } = useSession();

    const watchFiles = watch('files');

    const onSubmit: SubmitHandler<fileUpload> = async (
        formData: fileUpload
    ): Promise<void> => {
        try {
            const fileFormData = new FormData();
            const uploadedFile = formData.files[0];
            fileFormData.append('file', uploadedFile);

            const { data } = await axios.post<ApiResponseUploads>(
                process.env.NEXT_PUBLIC_DOMAIN + '/api/uploads',
                fileFormData
            );
            if (data.error === false) {
                updateUserFiles();
                reset();
                if (data.data) {
                    addAlert({
                        appearance: 'success',
                        message: data.message,
                    });
                } else {
                    addAlert({
                        appearance: 'error',
                        message: data.message,
                    });
                }
            } else {
                addAlert({
                    appearance: 'error',
                    message: data.message,
                });
            }
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : String(err);
            addAlert({
                appearance: 'error',
                message: errorMessage,
            });
        }
    };
    //--

    if (status === 'loading') {
        return <ProgressBar appearance="circle" />;
    }

    return !data?.user ? (
        <NotAuthorized />
    ) : (
        <section>
            <HTag tag="h2">Загрузка аудио файла</HTag>
            <form
                className={cn(
                    'rounded-md bg-slate-100 p-2.5 text-sm shadow-sm shadow-slate-300 dark:bg-inherit dark:shadow-none sm:text-base'
                )}
                onSubmit={handleSubmit(onSubmit)}
            >
                <InputTag
                    {...register('files', {
                        validate: {
                            required: (value): boolean | string => {
                                const isValid =
                                    value &&
                                    typeof value == 'object' &&
                                    value.length > 0;
                                return isValid || 'Выберите файл для загрузки.';
                            },
                            maxFilesize: (value): boolean | string => {
                                const isValid =
                                    value &&
                                    typeof value == 'object' &&
                                    value[0].size <= 5 * 1024 * 1024;
                                return (
                                    isValid ||
                                    'Размер файла не должен превышать 5 мегабайт.'
                                );
                            },
                        },
                    })}
                    placeholder="Аудио файл в формате MP3, MP4, WAV или FLAC."
                    error={errors.files}
                    tabIndex={0}
                    aria-invalid={errors.files ? true : false}
                    type="file"
                    multiple={false}
                    accept="audio/wav,audio/mpeg,audio/mp4,audio/flac"
                    fileList={watchFiles}
                    className="mx-1.5 rounded-full border border-primary px-5 hover:border-primary-hover sm:px-2"
                />
                <div className="col-span-12 mt-2.5 flex flex-row items-center justify-end gap-2.5">
                    <Button
                        appearance={ButtonAppearances.primary}
                        type="submit"
                        rounded={true}
                    >
                        Загрузить
                    </Button>
                </div>
            </form>
            <HTag tag="h2" className="mt-2.5">
                Загруженные файлы
            </HTag>
            <ul>
                {!userFiles && (
                    <li className="mb-2.5 p-1">
                        <strong>Не загружено ни одного файла.</strong>
                    </li>
                )}
                {userFiles &&
                    userFiles.map(
                        (userFile): JSX.Element => (
                            <UserFileCard
                                animate={{
                                    opacity: '100%',
                                    transition: {
                                        duration: 0.5,
                                    },
                                }}
                                initial={{
                                    opacity: '0%',
                                }}
                                exit={{
                                    opacity: '0%',
                                    transition: {
                                        duration: 0.5,
                                    },
                                }}
                                layout
                                key={userFile.id}
                                userFile={userFile}
                                className=" mb-2.5 p-1"
                            />
                        )
                    )}
            </ul>
        </section>
    );
};

export default UploadsPage;
