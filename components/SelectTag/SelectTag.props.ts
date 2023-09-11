import { SelectHTMLAttributes } from 'react';
import { DetailedHTMLProps } from 'react';
import { FieldError } from 'react-hook-form';

export interface SelectTagProps
    extends DetailedHTMLProps<
        SelectHTMLAttributes<HTMLSelectElement>,
        HTMLSelectElement
    > {
    error?: FieldError;
    options: Record<string, string | number>;
    label?: string;
}
