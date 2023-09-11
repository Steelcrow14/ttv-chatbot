'use client';

import { NextAuthProviderProps } from './NextAuthProvider.props';
import { SessionProvider } from 'next-auth/react';

const NextAuthProvider = ({ children }: NextAuthProviderProps): JSX.Element => {
    return <SessionProvider>{children}</SessionProvider>;
};

export default NextAuthProvider;
