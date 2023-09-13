import { UserFile } from '@prisma/client';
import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface UserFileCardProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLLIElement>, HTMLLIElement> {
	userFile: UserFile;
}
