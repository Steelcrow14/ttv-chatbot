import { HTagProps } from './HTag.props';
import cn from 'classnames';

export const HTag = ({ tag, className, children }: HTagProps): JSX.Element => {
    switch (tag) {
        case 'h1':
            return (
                <h1
                    className={cn(
                        className,
                        'm-0 mb-6 text-2xl font-medium text-primary'
                    )}
                >
                    {children}
                </h1>
            );
        case 'h2':
            return (
                <h2
                    className={cn(
                        className,
                        'm-0 mb-6 text-xl font-medium text-primary'
                    )}
                >
                    {children}
                </h2>
            );
        case 'h3':
            return (
                <h3
                    className={cn(
                        className,
                        'm-0 mb-6 text-lg font-bold text-primary'
                    )}
                >
                    {children}
                </h3>
            );
        default:
            return <></>;
    }
};
