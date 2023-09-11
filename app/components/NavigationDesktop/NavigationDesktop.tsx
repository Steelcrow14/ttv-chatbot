'use client';

import { Button } from '@/components';
import { usePathname, useRouter } from 'next/navigation';
import { ButtonAppearances } from '@/components/Button/Button.props';
import { AnimatePresence, motion } from 'framer-motion';
import cn from 'classnames';
import { NavMenuItem, NavMenuFirstLevel } from '@/app/helpers/navMenuPlan';

const NavigationDesktop = (): JSX.Element => {
    const router = useRouter();
    const path = usePathname();

    const pathArray = path.split('/').filter((val): boolean => val !== '');
    const firstLevelMenuItem = pathArray.length >= 0 ? pathArray[0] : '';

    const handleOnClick = (route: string): void => {
        if (!path.startsWith(route)) {
            router.push(route);
        }
    };

    const buildMenulevel = (
        menuItems: NavMenuItem[],
        basePath = ''
    ): JSX.Element[] => {
        return menuItems.map(
            (menuItem): JSX.Element => (
                <Button
                    key={menuItem.id}
                    appearance={ButtonAppearances.primaryGhostBorderless}
                    onClick={(): void =>
                        handleOnClick(`${basePath}/${menuItem.id}`)
                    }
                    className={cn(
                        'my-2 flex flex-wrap items-center justify-center gap-1.5',
                        {
                            ['border-b border-solid border-secondary hover:border-secondary-hover']:
                                path.startsWith(`${basePath}/${menuItem.id}`),
                        }
                    )}
                >
                    {menuItem.icon && (
                        <menuItem.icon
                            className="inline-block"
                            height={32}
                            width={32}
                        />
                    )}
                    <strong>{menuItem.buttonTexts.ru}</strong>
                </Button>
            )
        );
    };

    const firstLevelHasSubmenu = (): boolean => {
        const submenu = NavMenuFirstLevel.find(
            (val): boolean => val.id == firstLevelMenuItem
        )?.submenu;
        return submenu ? true : false;
    };

    return (
        <>
            <div className="col-span-6 row-start-1 row-end-1 md:col-span-8">
                <div className="hidden flex-row items-center justify-start gap-2.5 sm:flex">
                    {buildMenulevel(NavMenuFirstLevel)}
                </div>
            </div>
            <AnimatePresence>
                {firstLevelHasSubmenu() && (
                    <motion.div
                        initial={{
                            height: '0px',
                            opacity: '0%',
                        }}
                        animate={{
                            height: '100%',
                            opacity: '100%',
                            transition: {
                                duration: 0.5,
                            },
                        }}
                        exit={{
                            height: '0px',
                            opacity: '0%',
                            transition: {
                                duration: 0.5,
                            },
                        }}
                        className="col-span-12 row-start-2 row-end-2 hidden flex-row items-center justify-start gap-2.5 overflow-hidden sm:flex"
                        key="navMenuDesktop"
                    >
                        {buildMenulevel(
                            NavMenuFirstLevel.find(
                                (val): boolean => val.id == firstLevelMenuItem
                            )?.submenu ?? [],
                            `/${firstLevelMenuItem}`
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default NavigationDesktop;
