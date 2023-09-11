'use client';

import { Button } from '@/components';
import MenuIcon from './menu.svg';
import { usePathname, useRouter } from 'next/navigation';
import { ButtonAppearances } from '@/components/Button/Button.props';
import { motion } from 'framer-motion';
import { NavMenuFirstLevel, NavMenuItem } from '@/app/helpers/navMenuPlan';
import { useState } from 'react';
import cn from 'classnames';

const NavigationMobile = (): JSX.Element => {
    const [mobileNavIsOpen, setMobileNavIsOpen] = useState(false);
    const router = useRouter();
    const path = usePathname();

    const handleOnClick = (route: string): void => {
        router.push(route);
    };

    const handleOnMobileNavClick = (): void => {
        setMobileNavIsOpen(!mobileNavIsOpen);
    };

    const buildMenulevel = (
        menuItems: NavMenuItem[],
        basePath = '',
        level = 1
    ): JSX.Element => {
        return (
            <motion.div
                animate={{
                    height: path.startsWith(basePath) ? '100%' : '0px',
                    // paddingTop: path.startsWith(basePath) ? '10px' : '0px',
                    transition: {
                        duration: 0.5,
                    },
                }}
                className="col-span-12 grid h-0 grid-cols-1 items-center justify-center gap-2.5 overflow-hidden sm:hidden"
            >
                {menuItems.map(
                    (menuItem): JSX.Element => (
                        <div key={menuItem.id} className="first:mt-2.5">
                            <Button
                                appearance={
                                    ButtonAppearances.primaryGhostBorderless
                                }
                                onClick={(): void =>
                                    handleOnClick(`${basePath}/${menuItem.id}`)
                                }
                                className={cn(
                                    `flex items-center justify-start gap-1.5`,
                                    {
                                        ['border-b border-solid border-cyan-400']:
                                            path ==
                                            `${basePath}/${menuItem.id}`,
                                    },
                                    { ['ml-2.5']: level == 1 },
                                    { ['ml-5']: level == 2 },
                                    { ['ml-7.5']: level == 3 }
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
                            {menuItem.submenu &&
                                buildMenulevel(
                                    menuItem.submenu,
                                    `${basePath}/${menuItem.id}`,
                                    level + 1
                                )}
                        </div>
                    )
                )}
            </motion.div>
        );
    };

    return (
        <>
            <div className="col-span-6 row-start-1 row-end-1 flex flex-row items-center justify-start gap-2.5 sm:hidden md:col-span-8">
                <Button
                    appearance={ButtonAppearances.primaryGhostBorderless}
                    onClick={handleOnMobileNavClick}
                    className="flex items-center justify-center gap-1.5"
                >
                    <MenuIcon className="inline-block" height={32} width={32} />
                </Button>
            </div>
            <motion.div
                animate={{
                    height: mobileNavIsOpen ? '100%' : '0px',
                    // paddingTop: mobileNavIsOpen ? '10px' : '0px',
                    transition: {
                        duration: 0.5,
                    },
                }}
                className="col-span-12 row-start-2 row-end-2 grid h-0 grid-cols-1 items-center justify-center gap-2.5 overflow-hidden sm:hidden"
                key="navMenuMobile"
            >
                {NavMenuFirstLevel.map(
                    (menuItem): JSX.Element => (
                        <div key={menuItem.id} className="first:mt-2.5">
                            <Button
                                appearance={
                                    ButtonAppearances.primaryGhostBorderless
                                }
                                onClick={(): void =>
                                    handleOnClick(`/${menuItem.id}`)
                                }
                                className={cn(
                                    'ml-2.5 flex items-center justify-start gap-1.5',
                                    {
                                        ['border-b border-solid border-cyan-400']:
                                            path == `/${menuItem.id}`,
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
                            {menuItem.submenu &&
                                buildMenulevel(
                                    menuItem.submenu,
                                    `/${menuItem.id}`,
                                    2
                                )}
                        </div>
                    )
                )}
            </motion.div>
        </>
    );
};

export default NavigationMobile;
