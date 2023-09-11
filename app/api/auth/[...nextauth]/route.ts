import { prisma } from '@/lib/prisma';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import axios from 'axios';
import NextAuth, { AuthOptions } from 'next-auth';
import TwitchProvider from 'next-auth/providers/twitch';

interface RefreshAccessTokenResponse {
	access_token?: string;
	refresh_token?: string;
	expires_in?: number;
	scope?: string[];
	token_type?: string;
	error?: string;
	status?: number;
	message?: string;
}

export const appAuthOptions: AuthOptions = {
	//Prisma Adapter
	adapter: PrismaAdapter(prisma),
	//Authentication providers
	providers: [
		TwitchProvider({
			clientId: process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID || '',
			clientSecret: process.env.NEXT_TWITCH_CLIENT_SECRET || '',
			authorization: {
				params: {
					scope: 'openid user:read:email chat:read chat:edit whispers:edit channel:moderate',
				},
			},
		}),
	],
	pages: {
		signIn: '/',
	},
	callbacks: {
		async session({ session, user }) {
			const data = await prisma.account.findFirst({
				where: {
					userId: user.id,
					provider: 'twitch',
				},
			});

			const tokenExpiryDate = (data?.expires_at ?? 0) * 1000;

			if (tokenExpiryDate < Date.now()) {
				try {
					const response =
						await axios.post<RefreshAccessTokenResponse>(
							'https://id.twitch.tv/oauth2/token',
							{
								client_id:
									process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID,
								client_secret:
									process.env.NEXT_TWITCH_CLIENT_SECRET,
								grant_type: 'refresh_token',
								refresh_token: data?.refresh_token,
							}
						);
					if (response.data.error) {
						throw `${response.data.error}; ${response.data.message}`;
					}
					if (!response.data.access_token) {
						throw 'Сервер TTV вернул пустой токен';
					}
					await prisma.account.update({
						where: {
							id: data?.id,
							provider: data?.provider,
						},
						data: {
							access_token: response.data.access_token,
							refresh_token:
								response.data.refresh_token ??
								data?.refresh_token,
							expires_at: Math.floor(
								Date.now() / 1000 +
								(response.data.expires_in ?? 60 * 60 * 24)
							),
						},
					});

					session.user.accessToken = response.data.access_token;
				} catch (error) {
					session.error = `Ошибка при обновлении токена: ${error}.`;
				}
			} else {
				session.user.accessToken = data?.access_token
					? data.access_token
					: undefined;
			}
			return session;
		},
	},
};

const handler = NextAuth(appAuthOptions);

export { handler as GET, handler as POST };
