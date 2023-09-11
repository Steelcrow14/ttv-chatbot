'use client';

import { createContext } from 'react';
import { ResourcesProviderProps } from './ResourcesProvider.props';
import { ResourcesRU } from '@/resources/ru_RU';
import { Locales } from '@/enums/ResourcesProvider.enum';
import { ResourcesENUS } from '@/resources/en_US';
import { Resources } from '@/interfaces/resources';

export interface ResourcesContext {
    resources: Resources;
}

export const ResourcesContext = createContext<ResourcesContext>({
    resources: ResourcesRU,
});

export const ResourcesProvider = ({
    locale,
    children,
}: ResourcesProviderProps): JSX.Element => {
    return (
        <ResourcesContext.Provider
            value={{
                resources:
                    locale == Locales.ru_RU ? ResourcesRU : ResourcesENUS,
            }}
        >
            {children}
        </ResourcesContext.Provider>
    );
};
