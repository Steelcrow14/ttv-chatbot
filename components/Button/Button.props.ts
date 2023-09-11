import { TargetAndTransition, VariantLabels } from 'framer-motion';
import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from 'react';

export enum ButtonAppearances {
    'primary',
    'primaryGhost',
    'primaryGhostBorderless',
    'secondary',
    'secondaryGhost',
    'secondaryGhostBorderless',
    'success',
    'successGhost',
    'successGhostBorderless',
    'error',
    'errorGhost',
    'errorGhostBorderless',
}

export interface ButtonProps
    extends Omit<
        DetailedHTMLProps<
            ButtonHTMLAttributes<HTMLButtonElement>,
            HTMLButtonElement
        >,
        'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag' | 'ref'
    > {
    appearance: ButtonAppearances;
    children: ReactNode;
    rounded?: boolean;
    whileHover?: TargetAndTransition | VariantLabels;
}
