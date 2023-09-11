'use client';

import { useContext } from 'react';
import { AlertsProps } from './Alerts.props';
import { AlertsContext } from '@/app/components/AlertsProvider/AlertsProvider';
import cn from 'classnames';
import { Alert } from '..';

export const Alerts = ({ className }: AlertsProps): JSX.Element => {
    const { alerts, deleteAlert } = useContext(AlertsContext);

    return (
        <div className={cn(className, 'absolute bottom-5 left-5 right-5 z-50')}>
            {alerts.map((alert): JSX.Element => {
                return (
                    <Alert
                        animate={{
                            opacity: '100%',
                            transition: {
                                duration: 0.5,
                            },
                        }}
                        initial={{
                            opacity: '0%',
                        }}
                        exit={{
                            opacity: '0%',
                            transition: {
                                duration: 0.5,
                            },
                        }}
                        layout
                        key={alerts.indexOf(alert)}
                        alertContent={alert}
                        onClick={(): void => deleteAlert(alert?.id ?? '')}
                    />
                );
            })}
        </div>
    );
};
