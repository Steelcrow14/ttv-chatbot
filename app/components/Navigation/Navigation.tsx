'use client';

import { useEffect, useState } from 'react';
import NavigationDesktop from '../NavigationDesktop/NavigationDesktop';
import NavigationMobile from '../NavigationMobile/NavigationMobile';

const Navigation = (): JSX.Element => {
    const [isMobile, setIsMobile] = useState<boolean>(false);

    const handleOnResize = (): void => {
        setIsMobile(window.innerWidth <= 640);
    };

    //Both navigation menus are animated, animation relies on path and always makes display attribute 'block'
    //In order to stop layout from blowing up because of this, render only one navigation depending on window size
    useEffect((): (() => void) => {
        if (window) {
            window.addEventListener('resize', handleOnResize);
            handleOnResize();
        }
        return (): void => window.removeEventListener('resize', handleOnResize);
    }, []);

    return isMobile ? <NavigationMobile /> : <NavigationDesktop />;
};

export default Navigation;
