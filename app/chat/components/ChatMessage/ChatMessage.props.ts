import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface ChatMessageProps
    extends DetailedHTMLProps<
        HTMLAttributes<HTMLSpanElement>,
        HTMLSpanElement
    > {
    message: string;
}
