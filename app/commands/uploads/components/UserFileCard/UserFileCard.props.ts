import { UserFileWithURLdata } from '@/interfaces';
import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface UserFileCardProps
    extends DetailedHTMLProps<HTMLAttributes<HTMLLIElement>, HTMLLIElement> {
    userFile: UserFileWithURLdata;
}
