import { TextAreaTagProps } from './TextAreaTag.props';
import cn from 'classnames';
import { ForwardedRef, forwardRef } from 'react';

export const TextAreaTag = forwardRef(function TextAreaTag(
    { className, error, label, ...props }: TextAreaTagProps,
    ref: ForwardedRef<HTMLTextAreaElement>
): JSX.Element {
    return (
        <div
            className={cn(
                className,
                'grid grid-cols-labeledInput justify-start justify-items-start gap-1'
            )}
        >
            {label && (
                <label
                    htmlFor={`input_${props.name}`}
                    className="col-auto whitespace-nowrap text-primary"
                >
                    {`${label}: `}
                </label>
            )}
            <textarea
                ref={ref}
                className={cn(
                    'col-auto h-min w-full rounded-sm border border-slate-300 bg-slate-200 px-1.5 text-slate-900 dark:border-primary dark:bg-slate-700 dark:text-white'
                )}
                {...props}
                id={`input_${props.name}`}
            />
            {error && (
                <span role="alert" className="col-span-full text-xs text-error">
                    {error.message}
                </span>
            )}
        </div>
    );
});
