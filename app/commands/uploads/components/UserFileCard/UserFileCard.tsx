'use client';

import { AlertsContext } from '@/app/components/AlertsProvider/AlertsProvider';
import { UserFileCardProps } from './UserFileCard.props';
import cn from 'classnames';
import { motion } from 'framer-motion';
import { ForwardedRef, forwardRef, useContext } from 'react';
import { Button } from '@/components';
import { ButtonAppearances } from '@/components/Button/Button.props';
import DeleteIcon from '@/public/svg/Delete.svg';
import axios from 'axios';
import { ApiResponseUploads } from '@/interfaces';
import { ChatBotContext } from '@/app/components/ChatBotProvider/ChatBotContextProvider';

const UserFileCard = motion(
	forwardRef(function Alert(
		{ userFile, className, ...props }: UserFileCardProps,
		ref: ForwardedRef<HTMLLIElement>
	): JSX.Element {
		const { addAlert } = useContext(AlertsContext);
		const { updateFiles } = useContext(ChatBotContext);

		const handleOnDeleteFile = async (): Promise<void> => {
			try {
				if (!userFile) {
					addAlert({
						appearance: 'error',
						message:
							'Ошибка! Зарегистрирована попытка удалить файл, которого не существует.',
					});
				} else {
					const { data } = await axios.delete<ApiResponseUploads>(
						process.env.NEXT_PUBLIC_DOMAIN + '/api/uploads',
						{
							params: {
								id: userFile.id,
							},
						}
					);
					if (data.error === false) {
						updateFiles();
						addAlert({
							appearance: 'success',
							message: data.message,
						});
					} else {
						addAlert({
							appearance: 'error',
							message: data.message,
						});
					}
				}
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : String(err);
				addAlert({
					appearance: 'error',
					message: `Удаление файла "${userFile.name}": ${errorMessage}.`,
				});
			}
		};

		return (
			<li
				ref={ref}
				className={cn(
					className,
					'grid grid-cols-12 items-center gap-2.5 rounded-md border-0 dark:border dark:border-primary',
					'bg-slate-100 p-2.5 shadow-sm shadow-slate-300 dark:bg-inherit dark:shadow-none'
				)}
				{...props}
			>
				<div
					tabIndex={0}
					className="col-span-12 overflow-hidden text-ellipsis sm:col-span-8"
					title={userFile.name}
				>
					{userFile.name}
				</div>
				<div className="col-span-12 flex flex-row items-center justify-end gap-2.5 sm:col-span-4">
					<Button
						appearance={ButtonAppearances.error}
						rounded={true}
						type="button"
						onClick={handleOnDeleteFile}
						className="sm:hidden"
					>
						<DeleteIcon height={32} width={32} />
					</Button>
					<Button
						appearance={ButtonAppearances.error}
						rounded={true}
						type="button"
						onClick={handleOnDeleteFile}
						className="hidden sm:block"
					>
						Удалить
					</Button>
				</div>
			</li>
		);
	})
);

export default UserFileCard;
