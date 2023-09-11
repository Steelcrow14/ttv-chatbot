import CommandsIcon from '@/public/navigation/firstLevel/commands.svg';
import ChatIcon from '@/public/navigation/firstLevel/chat.svg';
import CommandsUploadsIcon from '@/public/navigation/secondLevel/commands/uploads.svg';
import CommandsAddIcon from '@/public/navigation/secondLevel/commands/add.svg';
import CommandsListIcon from '@/public/navigation/secondLevel/commands/list.svg';
import SettingsIcon from '@/public/navigation/firstLevel/settings.svg';

export interface NavMenuItem {
	id: string;
	icon?: React.FunctionComponent<React.SVGAttributes<SVGAElement>>;
	buttonTexts: Record<string, string>;
	submenu?: NavMenuItem[];
}

const NavMenuSecondLevelCommands: NavMenuItem[] = [
	{
		id: 'uploads',
		icon: CommandsUploadsIcon,
		buttonTexts: {
			ru: 'Загрузка файлов',
			en: 'File upload',
		},
	},
	{
		id: 'add',
		icon: CommandsAddIcon,
		buttonTexts: {
			ru: 'Добавить команду',
			en: 'Add command',
		},
	},
	{
		id: 'list',
		icon: CommandsListIcon,
		buttonTexts: {
			ru: 'Список команд',
			en: 'Command list',
		},
	},
];

export const NavMenuFirstLevel: NavMenuItem[] = [
	{
		id: 'commands',
		icon: CommandsIcon,
		buttonTexts: {
			ru: 'Команды',
			en: 'Commands',
		},
		submenu: NavMenuSecondLevelCommands,
	},
	{
		id: 'chat',
		icon: ChatIcon,
		buttonTexts: {
			ru: 'Чат',
			en: 'Chat',
		},
	},
	{
		id: 'settings',
		icon: SettingsIcon,
		buttonTexts: {
			ru: 'Настройки',
			en: 'Settings',
		},
	},
];
