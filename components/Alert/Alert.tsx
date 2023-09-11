'use client';

import { AlertProps } from './Alert.props';
import cn from 'classnames';
import { motion } from 'framer-motion';
import { ForwardedRef, forwardRef } from 'react';

export const Alert = motion(
    forwardRef(function Alert(
        { alertContent, ...props }: AlertProps,
        ref: ForwardedRef<HTMLDivElement>
    ): JSX.Element {
        const { message, appearance } = alertContent;
        return (
            <div
                ref={ref}
                tabIndex={0}
                className={cn(
                    'mt-1.5 rounded-md p-2.5 text-white',
                    {
                        ['bg-error hover:bg-error-hover']:
                            appearance == 'error',
                    },
                    {
                        ['bg-success hover:bg-success-hover']:
                            appearance == 'success',
                    },
                    { ['bg-blue-700 hover:bg-blue-600']: appearance == 'info' }
                )}
                {...props}
            >
                {message}
            </div>
        );
    })
);
