'use client';

import ArrowIcon from './arrow.svg';

export const NotAuthorized = (): JSX.Element => {
    return (
        <div className="ml-auto mr-auto flex h-full flex-col items-center justify-center gap-2.5 text-center align-middle text-lg text-primary md:flex-row">
            <strong>Здравствуйте! Пожалуйста, авторизуйтесь.</strong>
            <ArrowIcon height={50} width={50} />
        </div>
    );
};
