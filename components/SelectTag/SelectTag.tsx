import { SelectTagProps } from './SelectTag.props';
import cn from 'classnames';
import { ForwardedRef, forwardRef } from 'react';

export const SelectTag = forwardRef(function SelectTag(
    { className, error, options, label, ...props }: SelectTagProps,
    ref: ForwardedRef<HTMLSelectElement>
): JSX.Element {
    return (
        <div
            className={cn(
                className,
                'grid grid-cols-labeledInput justify-start justify-items-start gap-1'
            )}
        >
            <label
                htmlFor={`input_${props.name}`}
                className="col-auto whitespace-nowrap text-primary"
            >
                {label && `${label}: `}
            </label>
            <select
                ref={ref}
                className={cn(
                    'col-auto h-min w-full rounded-sm border border-slate-300 bg-slate-200 text-slate-900 dark:border-primary dark:bg-slate-700 dark:text-white'
                )}
                {...props}
                id={`input_${props.name}`}
            >
                {Object.keys(options).map(
                    (key, index): JSX.Element => (
                        <option key={index} value={key}>
                            {options[key]}
                        </option>
                    )
                )}
            </select>
            {error && (
                <span role="alert" className="col-span-full text-xs text-error">
                    {error.message}
                </span>
            )}
        </div>
    );
});
