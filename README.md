This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

1) Install Docker desktop application.

2) Install VS Code or equivalent code editing software with access to terminal, or just straight up use terminal if it works for you.

3) Register new Twitch.tv account for use as a chat bot. Make sure you do all the preparations as per 
	[`Twitch.tv app registration guidelines`](https://dev.twitch.tv/docs/authentication/register-app/).
	Also don't forget to give bot account moderator rights for your channel.

4) Fill missing info in .env.production file that resides at the root of the project:
	- NEXT_PUBLIC_DOMAIN: whatever domain name your are going to use for bot application. http://localhost:3000 should do if you're going to run it for your own use.
	- NEXT_PUBLIC_TWITCH_CLIENT_ID: your TTV app Client ID goes here
	- NEXT_TWITCH_CLIENT_SECRET: your TTV app App Secret goes here
	- NEXTAUTH_SECRET: just make up some sort of a password for Next Auth to use, otherwise it will not work.
	- NEXTAUTH_URL: basically the same as NEXT_PUBLIC_DOMAIN, because Next Auth requires a personal environment variable.

5) Built-in password for PostgreSQL database is of '12345' strength, so unless you are going to run this app locally, you
	shoud probably edit files 'prisma/.env' and docker-compose.yml.	

6) Launch Docker desktop, otherwise terminal will not run Docker console commands.

7) Open terminal, switch path to the root of the project and type in 'docker-compose up -d' in order to launch containers
	with app and database. First launch will take some time because Docker has to assemble containers first.
	In order to stop containers, type in 'docker-compose down' (unless you want to run them perpetually and/or are not afraid of Docker eating up your PC's RAM).
8) Open [http://localhost:3000](http://localhost:3000) with your browser.
9) Log in through Twitch with your bot account.
10) Go to Settings page and set your actual channel's name.
11) Go set up your chat bot's commands.  

## Functionality

At the time of typing this document (2023-09-11), functionality of the bot is as follows:

1) You can make bot respond to commands with text messages in chat.
	NOTE: use '{{username}}' constraction in command's message text to mention (i.e. @username) user who triggered the command.

2) You can make bot play audio files in response to commands. Audio files are either uploaded on file upload page and 
	then selected from the list of available files when editing command (Or you could provide a URL to the file, but that method won't work with most public file sharing services because of browser's CORB policy right now. Also due to the same reason that method is totally untested). When user triggers such a command, it is added to a playback queue. You can use an 'ignore queue' checkbox
	in order to play that audio in parallel with any other audio playback, but usually that's a bad idea (i warned you).

3) You can set up a timed version of the previous two command types. Basically it will run command on its own every so much time.
	Audio playback queueing rules apply.

## Bigger issues and shortcomings

1) Bot runs solely from the client (client = your browser's tab), so nothing will work until you open up your 
	browser's tab with the app. 
	It's possibly also true that if you open several tabs with the application simultaneously, you will either end up with several instances of the bot, or everything will just crash.

2) All the uploaded audio files	are downloaded in bulk each time you open up application. This takes lots of time, 
	additional RAM usage, and - maybe - bandwidth. I'll eventually see if there's a way to rectify that issue, but no promises.

3) All the text is in Russian; there's no English version atm.

4) There are no tooltips.

5) There's no proper documentation.

6) Dark/Light theme depends only on your operating system's setting (I don't know if that's true for Mac or Linux, though).

7) Hardly any ARIA support (which means little to no accessibility).