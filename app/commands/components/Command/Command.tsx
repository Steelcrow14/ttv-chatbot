'use client';

import { CommandProps } from './Command.props';
import ArrowIcon from './Arrow.svg';
import SaveIcon from '@/public/svg/Save.svg';
import RevertIcon from '@/public/svg/Revert.svg';
import DeleteIcon from '@/public/svg/Delete.svg';
import { useForm, SubmitHandler } from 'react-hook-form';
import React, { ForwardedRef, forwardRef, useContext, useEffect } from 'react';
import {
	AudioSource,
	ChatBotCommand,
	CommandType,
	FileType,
} from '@prisma/client';
import { Button, InputTag, SelectTag, TextAreaTag } from '@/components';
import cn from 'classnames';
import { CommandFormTypes } from '@/enums/Command.enum';
import { ButtonAppearances } from '@/components/Button/Button.props';
import axios from 'axios';
import { ApiResponseCommands } from '@/interfaces';
import { ResourcesContext } from '@/app/components/ResourcesProvider/ResourcesProvider';
import { ChatBotContext } from '@/app/components/ChatBotProvider/ChatBotContextProvider';
import { motion } from 'framer-motion';
import {
	InputTagSwitch,
	InputTagSwitchSliderIconTypes,
} from '@/components/InputTagSwitch/InputTagSwitch';
import { useRouter } from 'next/navigation';
import { AlertsContext } from '@/app/components/AlertsProvider/AlertsProvider';
import { CommandsActionTypesEnum } from '@/app/reducers/commands.reducer';

const Command = motion(
	forwardRef(function Command(
		{
			className,
			formType,
			command,
			isOpened,
			setOpenedCommandId,
			checkCommandNameAvailability,
		}: CommandProps,
		ref: ForwardedRef<HTMLDivElement>
	): JSX.Element {
		const {
			register,
			handleSubmit,
			formState: { errors, isSubmitting, defaultValues },
			reset,
			clearErrors,
			watch,
			setValue,
		} = useForm<ChatBotCommand>({
			mode: 'onTouched',
			defaultValues: {
				type: command ? command.type : CommandType.say,
				audiosrc: command ? command.audiosrc : AudioSource.file,
				active: command ? command.active : true,
				isInterval: command ? command.isInterval : false,
				ignoreAudioQueue: command ? command.ignoreAudioQueue : false,
				...command,
			},
		});
		const { resources } = useContext(ResourcesContext);
		const { files: userFiles, dispatchCommands } =
			useContext(ChatBotContext);
		const { addAlert } = useContext(AlertsContext);
		const router = useRouter();

		//+FormField watchlist
		const watchType = watch('type');
		const watchAudioSrc = watch('audiosrc');
		const watchIsInterval = watch('isInterval');
		const watchActive = watch('active');
		const watchIgnoreAudioQueue = watch('ignoreAudioQueue');
		//-FormField watchlist

		useEffect((): void => {
			if (!isOpened && !isSubmitting) {
				reset();
			}
		}, [isOpened, isSubmitting, reset]);

		const audioFiles = userFiles.filter(
			(userFile): boolean => userFile.type === FileType.audio
		);
		const getAudioFileSelectOptions = (): Record<string, string> => {
			const entries = audioFiles.map((userFile): [string, string] => {
				const optionValueAsKey = userFile.name;
				const optionName = userFile.name.concat(
					userFile.urlData !== '' ? '' : `[файл не найден]`
				);
				return [optionValueAsKey, optionName];
			});
			const options = Object.fromEntries(entries);
			return options;
		};
		const tabIndex = isOpened ? 0 : -1;

		const onSubmit: SubmitHandler<ChatBotCommand> = async (
			formData: ChatBotCommand
		): Promise<void> => {
			let httpMethod: string;
			switch (formType) {
				case CommandFormTypes.edit: {
					httpMethod = 'put';
					break;
				}
				case CommandFormTypes.create: {
					httpMethod = 'post';
					break;
				}
				default: {
					const newError = new Error(
						'Неизвестный тип формы редактирования команды.'
					);
					throw newError;
				}
			}

			try {
				const { data } = await axios.request<ApiResponseCommands>({
					method: httpMethod,
					url: process.env.NEXT_PUBLIC_DOMAIN + '/api/commands',
					data: {
						...formData,
					},
				});
				if (data.error === false) {
					if (data.data && formType == CommandFormTypes.edit) {
						dispatchCommands({
							type: CommandsActionTypesEnum.Update,
							commands: data.data,
						});
						reset(data.data[0]);
						addAlert({
							appearance: 'success',
							message: data.message ?? '',
						});
					} else if (
						data.data &&
						formType == CommandFormTypes.create
					) {
						dispatchCommands({
							type: CommandsActionTypesEnum.Create,
							commands: data.data,
						});
						reset();
						addAlert({
							appearance: 'success',
							message: data.message ?? '',
						});
					} else {
						addAlert({
							appearance: 'error',
							message: `"!${formData.name}": ${data.message}.`,
						});
					}
				} else {
					addAlert({
						appearance: 'error',
						message: `"!${formData.name}": ${data.message}.`,
					});
				}
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : String(err);
				addAlert({
					appearance: 'error',
					message: `"!${formData.name}": ${errorMessage}.`,
				});
			}
		};

		const handleOpenCommand = (): void => {
			if (command && setOpenedCommandId) {
				setOpenedCommandId(command.id);
			}
		};

		const handleOnActiveSwitchClick = (): void => {
			handleSubmit(onSubmit)();
		};

		const handleOnDeleteCommand = async (): Promise<void> => {
			try {
				if (!command) {
					addAlert({
						appearance: 'error',
						message:
							'Ошибка! Зарегистрирована попытка удалить команду, которой не существует.',
					});
				} else {
					const { data } = await axios.delete<ApiResponseCommands>(
						process.env.NEXT_PUBLIC_DOMAIN + '/api/commands',
						{
							params: {
								id: command.id,
							},
						}
					);
					if (data.error === false) {
						dispatchCommands({
							type: CommandsActionTypesEnum.Delete,
							commands: [command],
						});
						addAlert({
							appearance: 'success',
							message: data.message ?? '',
						});
					} else {
						addAlert({
							appearance: 'error',
							message: `"!${defaultValues?.name}": ${data.message}.`,
						});
					}
				}
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : String(err);
				addAlert({
					appearance: 'error',
					message: `"!${defaultValues?.name}": ${errorMessage}.`,
				});
			}
		};

		const handleOnUploadsClick = (): void => {
			router.push('uploads');
		};

		return (
			<motion.div
				className={cn(
					className,
					'mt-2.5 rounded-md bg-slate-100 p-2.5 text-sm shadow-sm shadow-slate-300 dark:bg-inherit dark:shadow-none sm:text-base',
					'dark:border dark:border-primary'
				)}
				ref={ref}
			>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="grid grid-cols-12 items-center justify-center gap-2.5"
				>
					{formType == CommandFormTypes.edit && (
						<>
							<div
								className={cn(
									'flex flex-row items-center justify-start gap-2.5',
									{ ['col-span-11']: !isOpened },
									{ ['col-span-12']: isOpened }
								)}
							>
								<button
									type="button"
									onClick={handleOpenCommand}
									aria-label={`${command?.name ?? 'Неизвестная команда'
										}: открыть для редактирования`}
								>
									<ArrowIcon
										height={28}
										width={28}
										className={cn(
											'col-span-1 fill-primary hover:fill-primary-hover',
											{
												['rotate-90 duration-300']:
													isOpened === true,
											},
											{
												['rotate-0 duration-300']:
													isOpened === false,
											}
										)}
									/>
								</button>
								<strong>
									{command && command.name != ''
										? `!${command.name}`
										: 'Неизвестная команда'}
								</strong>
							</div>
							{!isOpened && (
								<InputTagSwitch
									{...register('active', {
										onChange: handleOnActiveSwitchClick,
									})}
									formFieldValue={watchActive}
									disabled={isSubmitting}
									aria-label={`${command?.name ?? 'Неизвестная команда'
										}: отключить команду`}
									sliderIcon={
										InputTagSwitchSliderIconTypes.power
									}
									className="col-span-1 justify-self-end"
								/>
							)}
						</>
					)}
					<motion.div
						animate={{
							height: isOpened ? '100%' : '0px',
							opacity: isOpened ? '100%' : '0%',
							transition: {
								duration: 0.5,
							},
						}}
						initial={{
							height:
								formType == CommandFormTypes.edit
									? '0px'
									: '100%',
							opacity:
								formType == CommandFormTypes.edit
									? '0%'
									: '100%',
						}}
						className={cn(
							'col-span-12 grid grid-cols-12 justify-items-stretch gap-2.5 overflow-hidden'
						)}
					>
						<InputTag
							{...register('name', {
								required: {
									value: true,
									message: 'Не указано название команды.',
								},
								maxLength: {
									value: 255,
									message:
										'Название команды не должно превышать 255 символов.',
								},
								pattern: {
									value: /^[a-zа-я]*$/,
									message:
										'Название должно состоять только из строчных букв английского или русского алфавита.',
								},
								validate: {
									noDuplicateNames: (
										value
									): boolean | string => {
										const isAvailable =
											checkCommandNameAvailability(
												value,
												command
											);
										return (
											isAvailable ||
											'Команда с таким именем уже существует.'
										);
									},
								},
							})}
							placeholder='Напр. "roll" или "Привет"'
							error={errors.name}
							tabIndex={tabIndex}
							aria-invalid={errors.name ? true : false}
							className="col-span-12 pt-1.5 md:col-span-6"
							label={resources.CommandFormFieldLabels['name']}
						/>
						<SelectTag
							{...register('type', {
								required: {
									value: true,
									message: 'Не указан тип команды',
								},
								validate: (value): boolean | string =>
									value !== undefined ||
									'Не указан тип команды',
								onChange: (): void => {
									setValue('content', '');
									clearErrors('content');
								},
							})}
							error={errors.type}
							tabIndex={tabIndex}
							aria-invalid={errors.type ? true : false}
							className="col-span-12 pt-1.5 md:col-span-6"
							options={resources.CommandTypeOptions}
							label={resources.CommandFormFieldLabels['type']}
						/>
						{isOpened && (
							<InputTagSwitch
								{...register('active', {
									onChange: undefined,
								})}
								formFieldValue={watchActive}
								className="col-span-12"
								error={errors.isInterval}
								tabIndex={tabIndex}
								aria-invalid={errors.isInterval ? true : false}
								label={
									resources.CommandFormFieldLabels['active']
								}
							/>
						)}
						{watchType == CommandType.say && (
							<TextAreaTag
								{...register('content', {
									required: {
										value: true,
										message:
											'Укажите текст сообщения, которое должен отправлять чат-бот.',
									},
									pattern: undefined,
								})}
								placeholder="Текст сообщения"
								error={errors.content}
								tabIndex={tabIndex}
								aria-invalid={errors.content ? true : false}
								className="col-span-12"
								label={
									resources.CommandFormFieldLabels['content']
								}
							/>
						)}
						{watchType == CommandType.audio && (
							<SelectTag
								{...register('audiosrc', {
									required: {
										value: watchType == CommandType.audio,
										message:
											'Не указан источник звукового файла',
									},
									validate: (value): boolean | string =>
										value !== undefined ||
										'Не указан источник звукового файла',
									onChange: (): void => {
										setValue('content', '');
										clearErrors('content');
									},
								})}
								error={errors.audiosrc}
								tabIndex={tabIndex}
								aria-invalid={errors.audiosrc ? true : false}
								className="col-span-12 md:col-span-6"
								options={resources.AudioSourceOptions}
								label={
									resources.CommandFormFieldLabels['audioSrc']
								}
							/>
						)}
						{watchType == CommandType.audio &&
							watchAudioSrc == AudioSource.url && (
								<InputTag
									{...register('content', {
										required: {
											value: true,
											message: 'Укажите URL ресурса.',
										},
										pattern: {
											value: /^[(http(s)?)://(www.)?a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/,
											message: 'Указан не валидный URL.',
										},
									})}
									placeholder="URL ресурса."
									error={errors.content}
									tabIndex={tabIndex}
									aria-invalid={errors.content ? true : false}
									className="col-span-12 md:col-span-6"
									label={
										resources.CommandFormFieldLabels[
										'content'
										]
									}
								/>
							)}
						{watchType == CommandType.audio &&
							watchAudioSrc == AudioSource.file &&
							(userFiles.length > 0 ? (
								<SelectTag
									{...register('file', {
										required: {
											value: true,
											message: 'Не выбран аудио файл',
										},
										validate: (value): boolean | string =>
											value !== undefined ||
											'Не выбран аудио файл',
									})}
									error={errors.file}
									tabIndex={tabIndex}
									aria-invalid={errors.file ? true : false}
									className="col-span-12 md:col-span-6"
									options={getAudioFileSelectOptions()}
									label={
										resources.CommandFormFieldLabels['file']
									}
								/>
							) : (
								<strong
									tabIndex={0}
									className="col-span-12 text-error md:col-span-6"
									role="alert"
								>
									Нет загруженных файлов.
									<Button
										appearance={
											ButtonAppearances.secondaryGhostBorderless
										}
										onClick={handleOnUploadsClick}
										whileHover={{
											scale: 1,
										}}
									>
										Загрузить?
									</Button>
								</strong>
							))}
						{watchType == CommandType.audio && (
							<InputTagSwitch
								{...register('ignoreAudioQueue')}
								formFieldValue={watchIgnoreAudioQueue}
								className="col-span-12"
								error={errors.ignoreAudioQueue}
								tabIndex={tabIndex}
								aria-invalid={
									errors.ignoreAudioQueue ? true : false
								}
								label={
									resources.CommandFormFieldLabels[
									'ignoreAudioQueue'
									]
								}
							/>
						)}
						<InputTagSwitch
							{...register('isInterval')}
							formFieldValue={watchIsInterval ?? false}
							error={errors.isInterval}
							tabIndex={tabIndex}
							aria-invalid={errors.isInterval ? true : false}
							className="col-span-12 md:col-span-6"
							label={
								resources.CommandFormFieldLabels['isInterval']
							}
						/>
						{watchIsInterval && (
							<InputTag
								{...register('intervalMs', {
									valueAsNumber: true,
									min: {
										value: 1,
										message:
											'Значение не может быть нулевым.',
									},
								})}
								error={errors.intervalMs}
								tabIndex={tabIndex}
								type="number"
								aria-invalid={errors.intervalMs ? true : false}
								className="col-span-12 md:col-span-6"
								label={
									resources.CommandFormFieldLabels[
									'intervalMs'
									]
								}
							/>
						)}
						<div className="col-span-12 flex flex-row items-center justify-end gap-2.5 pb-1.5">
							{formType == CommandFormTypes.edit && (
								<>
									<Button
										appearance={ButtonAppearances.error}
										rounded={true}
										tabIndex={tabIndex}
										type="button"
										onClick={handleOnDeleteCommand}
										className="sm:hidden"
									>
										<DeleteIcon height={32} width={32} />
									</Button>
									<Button
										appearance={ButtonAppearances.error}
										rounded={true}
										tabIndex={tabIndex}
										type="button"
										onClick={handleOnDeleteCommand}
										className="hidden sm:block"
									>
										Удалить команду
									</Button>
								</>
							)}
							<Button
								appearance={ButtonAppearances.secondary}
								rounded={true}
								tabIndex={tabIndex}
								type="button"
								onClick={(): void => reset()}
								className="sm:hidden"
							>
								<RevertIcon height={32} width={32} />
							</Button>
							<Button
								appearance={ButtonAppearances.secondary}
								rounded={true}
								tabIndex={tabIndex}
								type="button"
								onClick={(): void => reset()}
								className="hidden sm:block"
							>
								Сбросить изменения
							</Button>
							<Button
								appearance={ButtonAppearances.primary}
								rounded={true}
								tabIndex={tabIndex}
								type="submit"
								disabled={isSubmitting}
								className="sm:hidden"
							>
								<SaveIcon height={32} width={32} />
							</Button>
							<Button
								appearance={ButtonAppearances.primary}
								rounded={true}
								tabIndex={tabIndex}
								type="submit"
								disabled={isSubmitting}
								className="hidden sm:block"
							>
								Сохранить команду
							</Button>
						</div>
					</motion.div>
				</form>
			</motion.div>
		);
	})
);

export default Command;
