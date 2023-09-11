import cn from 'classnames';
import { FooterProps } from './Footer.props';
import Link from 'next/link';
import { format } from 'date-fns';

const Footer = ({ className, ...props }: FooterProps): JSX.Element => {
    return (
        <section
            className={cn(
                className,
                'flex-end relative bottom-0 flex flex-row items-center justify-end p-1.5 text-sm',
                'bg-gradient-to-t from-slate-50 from-90% to-primary dark:from-slate-900 dark:to-primary',
                'text-primary'
            )}
            {...props}
        >
            <Link
                href={'mailto:msteelcrow@gmail.com'}
                className="hover:text-primary-hover"
            >
                Steelcrow
            </Link>
            <span>{`, ${format(Date.now(), 'yyyy')}`}</span>
        </section>
    );
};

export default Footer;
