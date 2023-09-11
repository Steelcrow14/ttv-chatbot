'use client';

import { createContext, useState } from 'react';
import { ResourcesProviderProps as AlertsProviderProps } from './AlertsProvider.props';
import { generateAlertId } from '@/helpers/helpers';

export interface AlertContent {
    appearance: 'error' | 'success' | 'info';
    id?: string;
    message: string;
}

export interface AlertsContext {
    alerts: AlertContent[];
    addAlert: (content: AlertContent) => void;
    deleteAlert: (id: string) => void;
}

export const AlertsContext = createContext<AlertsContext>({
    alerts: [],
    addAlert: (): void => {
        return;
    },
    deleteAlert: (): void => {
        return;
    },
});

export const AlertsProvider = ({
    children,
}: AlertsProviderProps): JSX.Element => {
    const [alerts, setAlerts] = useState<AlertContent[]>([]);

    const addAlert = (content: AlertContent): void => {
        content.id = generateAlertId();
        const newAlerts = [content, ...alerts];
        setAlerts(newAlerts);
    };

    const deleteAlert = (id: string): void => {
        const newAlerts = alerts.filter((alert): boolean => alert.id !== id);
        setAlerts(newAlerts);
    };

    return (
        <AlertsContext.Provider
            value={{
                alerts: alerts,
                addAlert: addAlert,
                deleteAlert: deleteAlert,
            }}
        >
            {children}
        </AlertsContext.Provider>
    );
};
