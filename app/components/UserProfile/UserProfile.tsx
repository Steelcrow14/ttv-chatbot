'use client';

import { Button } from '@/components';
import { SignInResponse, signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import TwitchIcon from './twitchIcon.svg';
import LoginIcon from './login.svg';
import LogoutIcon from './logout.svg';
import { ButtonAppearances } from '@/components/Button/Button.props';
import { useContext, useEffect } from 'react';
import { AlertsContext } from '../AlertsProvider/AlertsProvider';
import { Skeleton } from '@mui/material';

const UserProfile = (): JSX.Element => {
    const { data: session, status: sessionStatus } = useSession();
    const { alerts, addAlert } = useContext(AlertsContext);

    useEffect((): void => {
        if (session?.error) {
            const matchingSessionAlert = alerts.find(
                (alert): boolean =>
                    alert.appearance == 'error' &&
                    alert.message == session.error
            );
            if (!matchingSessionAlert) {
                addAlert({
                    appearance: 'error',
                    message: session.error,
                });
            }
        }
    }, [alerts, addAlert, session?.error]);

    if (sessionStatus !== 'loading') {
        return (
            <div className="col-span-6 row-start-1 row-end-1 md:col-span-4">
                <div className="flex h-full flex-row items-center justify-end gap-1.5">
                    {session?.user?.email ? (
                        <>
                            <Image
                                src={session.user.image as string}
                                alt={`Текущий пользователь: ${session?.user?.name}`}
                                width={32}
                                height={32}
                                className="rounded-full"
                            />
                            <strong className="hidden max-w-full overflow-hidden text-ellipsis whitespace-nowrap md:inline-block">
                                {session?.user?.name}
                            </strong>
                            <Button
                                aria-label="Выйти из профиля"
                                appearance={ButtonAppearances.secondaryGhost}
                                onClick={(): Promise<undefined> => signOut()}
                                className="rounded-md"
                            >
                                <LogoutIcon width={32} height={32} />
                            </Button>
                        </>
                    ) : (
                        <Button
                            appearance={ButtonAppearances.primary}
                            onClick={(): Promise<SignInResponse | undefined> =>
                                signIn('twitch')
                            }
                            className="flex items-center justify-center gap-1.5 rounded-md px-1.5 py-1.5 text-base md:px-2.5"
                        >
                            <TwitchIcon
                                className="hidden fill-white md:inline-block"
                                width={20}
                                height={20}
                            />
                            <strong className="hidden md:inline-block">
                                Авторизоваться
                            </strong>
                            <LoginIcon
                                className="inline-block fill-white md:hidden"
                                width={20}
                                height={20}
                            />
                        </Button>
                    )}
                </div>
            </div>
        );
    } else {
        return (
            <div className="col-span-6 row-start-1 row-end-1 md:col-span-4">
                <div className="flex h-full flex-row items-center justify-end gap-1.5">
                    <Skeleton
                        sx={{
                            bgcolor: 'grey.700',
                            width: '32px',
                            height: '32px',
                        }}
                        variant="circular"
                    />
                    <Skeleton sx={{ bgcolor: 'grey.700' }}>
                        <strong className="hidden max-w-full overflow-hidden text-ellipsis whitespace-nowrap md:inline-block">
                            Пользователь
                        </strong>
                    </Skeleton>
                    <Skeleton
                        sx={{
                            bgcolor: 'grey.700',
                            width: '42px',
                            height: '42px',
                        }}
                        variant="rounded"
                    />
                </div>
            </div>
        );
    }
};

export default UserProfile;
