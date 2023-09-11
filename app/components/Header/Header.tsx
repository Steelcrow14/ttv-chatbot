'use client';

import Navigation from '../Navigation/Navigation';
import UserProfile from '../UserProfile/UserProfile';
import { HeaderProps } from './Header.props';
import cn from 'classnames';

const Header = ({ className, ...props }: HeaderProps): JSX.Element => {
    return (
        <section
            className={cn(
                className,
                'bg-gradient-to-t from-slate-50 from-90% to-primary dark:from-slate-900 dark:to-primary',
                'grid grid-cols-12 gap-x-2.5 p-1.5 text-lg shadow-slate-700 drop-shadow-md'
            )}
            {...props}
        >
            <Navigation />
            <UserProfile />
        </section>
    );
};

export default Header;
