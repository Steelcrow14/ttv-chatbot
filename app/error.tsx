'use client';

import { Button, HTag } from '@/components';
import { ButtonAppearances } from '@/components/Button/Button.props';
import ErrorIcon from '@/public/svg/Error.svg';

interface ErrorProps {
    error: Error;
    reset: () => void;
}

const Error = ({ error, reset }: ErrorProps): JSX.Element => {
    console.log(error);

    return (
        <div className="ml-auto mr-auto flex h-full flex-col items-center justify-center gap-2.5 text-center align-middle text-lg text-primary">
            <ErrorIcon height={50} width={50} />
            <HTag tag="h1" className="mb-0">
                Страница не загружена из-за ошибки.
            </HTag>
            <div>{`Вот что нам известно: ${error.message}`}</div>
            <Button
                appearance={ButtonAppearances.primary}
                rounded={true}
                onClick={(): void => reset()}
            >
                Попробовать еще раз
            </Button>
        </div>
    );
};

export default Error;
