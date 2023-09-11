import { CircularProgress, LinearProgress } from '@mui/material';
import { ProgressBarProps } from './ProgressBar.props';

export const ProgressBar = ({ appearance }: ProgressBarProps): JSX.Element => {
    switch (appearance) {
        case 'circle':
            return (
                <div className="flex h-full w-full flex-col items-center justify-center">
                    <CircularProgress
                        sx={{
                            color: '#5c16c5',
                        }}
                    />
                </div>
            );
        case 'line':
            return (
                <LinearProgress
                    sx={{
                        backgroundColor: '#5c16c5',
                        top: 0,
                        marginBottom: '0.625rem',
                    }}
                />
            );
        default:
            return (
                <div className="flex h-full w-full flex-col items-center justify-center">
                    <CircularProgress
                        sx={{
                            color: '#5c16c5',
                        }}
                    />
                </div>
            );
    }
};
