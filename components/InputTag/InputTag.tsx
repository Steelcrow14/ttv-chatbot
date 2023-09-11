import { InputTagProps } from './InputTag.props';
import cn from 'classnames';
import { ForwardedRef, forwardRef } from 'react';

export const InputTag = forwardRef(function InputTag(
    { className, error, label, fileList, ...props }: InputTagProps,
    ref: ForwardedRef<HTMLInputElement>
): JSX.Element {
    return (
        <div
            className={cn(
                className,
                'grid gap-1',
                {
                    ['grid-cols-labeledInput justify-start justify-items-start']:
                        props.type !== 'file',
                },
                {
                    ['grid-cols-1 justify-center justify-items-center']:
                        props.type === 'file',
                }
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
            {props.type == 'file' && (
                <label
                    htmlFor={`input_${props.name}`}
                    className="col-span-full w-full cursor-pointer text-center text-primary hover:text-primary-hover"
                >
                    Щелкните здесь чтобы выбрать файл для загрузки. Выбранный
                    файл:
                    <strong className="text-slate-900 dark:text-white">
                        &nbsp;
                        {fileList && fileList.length > 0
                            ? fileList[0].name.toString()
                            : 'Файл не выбран'}
                    </strong>
                </label>
            )}
            <input
                ref={ref}
                className={cn(
                    'col-auto h-min w-full rounded-sm border border-slate-300 bg-slate-200 px-1.5 text-slate-900 dark:border-primary dark:bg-slate-700 dark:text-white',
                    { ['h-min w-full']: props.type !== 'checkbox' },
                    { ['col-auto']: label },
                    { ['col-span-full']: !label },
                    { ['hidden']: props.type == 'file' }
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
