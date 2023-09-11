import { TextareaHTMLAttributes } from 'react';
import { DetailedHTMLProps } from 'react';
import { FieldError } from 'react-hook-form';

export interface TextAreaTagProps
    extends DetailedHTMLProps<
        TextareaHTMLAttributes<HTMLTextAreaElement>,
        HTMLTextAreaElement
    > {
    error?: FieldError;
    label?: string;
}
