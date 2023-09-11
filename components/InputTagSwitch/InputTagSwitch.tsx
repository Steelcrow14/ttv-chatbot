import { InputTagSwitchProps } from './InputTagSwitch.props';
import cn from 'classnames';
import { ForwardedRef, forwardRef } from 'react';
import PowerIcon from './power.svg';

export enum InputTagSwitchSliderIconTypes {
    power,
}

export const InputTagSwitch = forwardRef(function InputTagSwitch(
    {
        className,
        formFieldValue,
        label,
        sliderIcon,
        error,
        ...props
    }: InputTagSwitchProps,
    ref: ForwardedRef<HTMLInputElement>
): JSX.Element {
    const getSliderIcon = (): JSX.Element => {
        switch (sliderIcon) {
            case InputTagSwitchSliderIconTypes.power:
                return (
                    <PowerIcon
                        height={20}
                        width={20}
                        className={cn(
                            'absolute bottom-1 left-1 rounded-full fill-white duration-500',
                            { ['translate-x-5']: formFieldValue === true }
                        )}
                    />
                );
            default:
                return <></>;
        }
    };

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
            <label className={cn('relative col-auto inline-block h-7 w-12')}>
                <input
                    ref={ref}
                    className="h-0 w-0 opacity-0"
                    type="checkbox"
                    tabIndex={0}
                    id={`input_${props.name}`}
                    {...props}
                />
                <span
                    className={cn(
                        'absolute bottom-0 left-0 right-0 top-0 cursor-pointer rounded-full disabled:bg-slate-400',
                        {
                            ['bg-success hover:bg-success-hover']:
                                formFieldValue === true,
                        },
                        {
                            ['bg-error hover:bg-error-hover']:
                                formFieldValue === false,
                        },
                        {
                            ['before:absolute before:bottom-1 before:left-1 before:h-5 before:w-5 before:rounded-full before:bg-white before:duration-500 before:content-[""]']:
                                sliderIcon == undefined,
                        },
                        {
                            ['before:translate-x-5']:
                                sliderIcon == undefined &&
                                formFieldValue === true,
                        }
                    )}
                >
                    {getSliderIcon()}
                </span>
            </label>
            {error && (
                <span role="alert" className="col-span-full text-xs text-error">
                    {error.message}
                </span>
            )}
        </div>
    );
});
