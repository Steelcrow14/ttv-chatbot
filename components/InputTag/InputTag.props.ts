import { InputHTMLAttributes } from 'react';
import { DetailedHTMLProps } from 'react';
import { FieldError } from 'react-hook-form';

export interface InputTagProps
    extends DetailedHTMLProps<
        InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
    > {
    error?: FieldError;
    label?: string;
    fileList?: FileList;
}
