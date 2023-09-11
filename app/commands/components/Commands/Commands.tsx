'use client';

import { ChatBotCommand } from '@prisma/client';
import { CommandsProps } from './Commands.props';
import Command from '../Command/Command';
import { useContext, useState } from 'react';
import { Button, NotAuthorized, HTag, ProgressBar } from '@/components';
import { CommandFormTypes } from '@/enums/Command.enum';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { ApiResponseCommands } from '@/interfaces';
import RefreshIcon from './Refresh.svg';
import { ButtonAppearances } from '@/components/Button/Button.props';
import { AlertsContext } from '@/app/components/AlertsProvider/AlertsProvider';
import { ChatBotContext } from '@/app/components/ChatBotProvider/ChatBotContextProvider';
import { CommandsActionTypesEnum } from '@/app/reducers/commands.reducer';
import cn from 'classnames';

const Commands = ({ className }: CommandsProps): JSX.Element => {
	const { commands, dispatchCommands } = useContext(ChatBotContext);
	const [openedCommandId, setOpenedCommandId] = useState<string | undefined>(
		undefined
	);
	const [isUpdating, setIsUpdating] = useState<boolean>(false);
	const { data, status } = useSession();
	const { addAlert } = useContext(AlertsContext);

	const updateCommandList = async (): Promise<void> => {
		try {
			setIsUpdating(true);
			const { data } = await axios.get<ApiResponseCommands>(
				process.env.NEXT_PUBLIC_DOMAIN + '/api/commands'
			);
			if (data.error === false) {
				dispatchCommands({
					type: CommandsActionTypesEnum.Refresh,
					commands: data.data ?? [],
				});
				addAlert({
					appearance: 'success',
					message: `${data.message}.`,
				});
			} else {
				addAlert({
					appearance: 'error',
					message: `${data.message}.`,
				});
			}
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : String(err);
			addAlert({
				appearance: 'error',
				message: `${errorMessage}.`,
			});
		} finally {
			setIsUpdating(false);
		}
	};

	const checkCommandNameAvailability = (
		name: string,
		changedCommand?: ChatBotCommand
	): boolean => {
		const existingCommand = commands.find(
			(command): boolean =>
				command.name === name &&
				(changedCommand ? changedCommand !== command : true)
		);
		return existingCommand === undefined;
	};

	if (status === 'loading') {
		return <ProgressBar appearance="circle" />;
	}

	return !data?.user ? (
		<NotAuthorized />
	) : (
		<section className={cn(className, 'relative h-full w-full')}>
			<div className="flex flex-row items-center gap-1.5">
				<HTag tag="h1">Список команд</HTag>
				<Button
					aria-label="Обновить список команд"
					appearance={ButtonAppearances.secondaryGhostBorderless}
					tabIndex={0}
					type="button"
					onClick={updateCommandList}
					className="mb-6"
					whileHover={{
						scale: 1.2,
					}}
				>
					<RefreshIcon height={24} width={24} />
				</Button>
			</div>
			{isUpdating ? (
				<ProgressBar appearance="circle" />
			) : (
				commands.map(
					(command: ChatBotCommand): JSX.Element => (
						<Command
							exit={{
								opacity: '0%',
								transition: {
									duration: 2,
								},
							}}
							layout
							key={command.id}
							formType={CommandFormTypes.edit}
							command={command}
							isOpened={openedCommandId == command.id}
							setOpenedCommandId={setOpenedCommandId}
							checkCommandNameAvailability={
								checkCommandNameAvailability
							}
						/>
					)
				)
			)}
		</section>
	);
};

export default Commands;
