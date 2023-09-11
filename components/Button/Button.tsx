'use client';

import { ButtonAppearances, ButtonProps } from './Button.props';
import cn from 'classnames';
import { motion } from 'framer-motion';

export const Button = ({
    appearance,
    children,
    className,
    rounded,
    whileHover,
    ...props
}: ButtonProps): JSX.Element => {
    return (
        <motion.button
            whileHover={
                whileHover ? whileHover : { scale: props.disabled ? 1 : 1.05 }
            }
            className={cn(
                className,
                'mx-1.5 p-1 disabled:bg-slate-400 disabled:text-white',
                { ['rounded-md']: rounded === true },
                {
                    ['bg-primary text-slate-900 hover:bg-primary-hover']:
                        appearance == ButtonAppearances.primary,
                },
                {
                    ['bg-transparent, border border-primary text-primary hover:border-primary-hover hover:text-primary-hover']:
                        appearance == ButtonAppearances.primaryGhost,
                },
                {
                    ['bg-transparent, text-primary hover:text-primary-hover']:
                        appearance == ButtonAppearances.primaryGhostBorderless,
                },
                {
                    ['bg-secondary text-white hover:bg-secondary-hover']:
                        appearance == ButtonAppearances.secondary,
                },
                {
                    ['bg-transparent, border border-secondary text-secondary hover:border-secondary-hover hover:text-secondary-hover']:
                        appearance == ButtonAppearances.secondaryGhost,
                },
                {
                    ['bg-transparent, text-secondary hover:text-secondary-hover']:
                        appearance ==
                        ButtonAppearances.secondaryGhostBorderless,
                },
                {
                    ['bg-success text-white hover:bg-success-hover']:
                        appearance == ButtonAppearances.success,
                },
                {
                    ['bg-transparent, border border-success text-success hover:border-success-hover hover:text-success-hover']:
                        appearance == ButtonAppearances.successGhost,
                },
                {
                    ['bg-transparent, text-success hover:text-success-hover']:
                        appearance == ButtonAppearances.successGhostBorderless,
                },
                {
                    ['bg-error text-white hover:bg-error-hover']:
                        appearance == ButtonAppearances.error,
                },
                {
                    ['bg-transparent, border border-error text-error hover:border-error-hover hover:text-error-hover']:
                        appearance == ButtonAppearances.errorGhost,
                },
                {
                    ['bg-transparent, text-error hover:text-error-hover']:
                        appearance == ButtonAppearances.errorGhostBorderless,
                }
            )}
            {...props}
        >
            {children}
        </motion.button>
    );
};
