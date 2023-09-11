import { InputHTMLAttributes } from 'react';
import { DetailedHTMLProps } from 'react';
import { InputTagSwitchSliderIconTypes } from './InputTagSwitch';
import { FieldError } from 'react-hook-form';

export interface InputTagSwitchProps
    extends DetailedHTMLProps<
        InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
    > {
    formFieldValue: boolean;
    sliderIcon?: InputTagSwitchSliderIconTypes;
    label?: string;
    error?: FieldError;
}
