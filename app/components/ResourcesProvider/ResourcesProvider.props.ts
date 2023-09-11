import { Locales } from '@/enums/ResourcesProvider.enum';
import { DetailedHTMLProps, HTMLAttributes } from 'react';

export interface ResourcesProviderProps
    extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
    locale: Locales;
}
