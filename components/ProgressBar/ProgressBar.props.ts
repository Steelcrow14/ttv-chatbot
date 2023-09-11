import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface ProgressBarProps
    extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    appearance: 'line' | 'circle';
}
