import { AlertContent } from '@/app/components/AlertsProvider/AlertsProvider';
import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface AlertProps
    extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    alertContent: AlertContent;
}
