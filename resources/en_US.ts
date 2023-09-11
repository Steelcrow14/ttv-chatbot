import { Resources } from '@/interfaces/resources';

export const CommandTypeOptions = {
    audio: 'Play audio file',
    say: 'Send a chat message',
};

export const AudioSourceOptions = {
    file: 'Uploaded file',
    url: 'File URL',
};

const CommandFormFieldTooltips = {
    type: 'Specify what will happen when command is triggered. Variants: \
			- "Play audio file": When command is triggered, an audio file is played. \
			You can specify one of the following sources of audio file: \
			a) Previously uploaded audio file (via "Commands" -> "Uploads"). \
			b) External URL poiting at audio file. \
			- "Send a chat message": When command is triggered, a specifiend \
			text message is sent in chat. \
			- "Execute custom function": When command is triggered, it calls a custom function that \
			has been added by you to the chat bot project files in accordance with documentation.',
    isInterval:
        'If this option is enabled: \
					- Command will launch automatically. \
					- Bot will not respond to this command in chat. \
					- Launch will happen every X milliseconds, where X is the value specified in \
					"Interval time, ms" field.',
};

const CommandFormFieldLabels = {
    name: 'Command name',
    type: 'Command type',
    audioSrc: 'Audio file source',
    content: 'Content',
    file: 'File',
    isInterval: 'Launch automatically',
    intervalMs: 'Interval time, ms',
    active: 'Command is active',
    ignoreAudioQueue: 'Ignore queue',
    intervalStart: 'Count interval from',
};

export const ResourcesENUS: Resources = {
    CommandTypeOptions,
    CommandFormFieldTooltips,
    CommandFormFieldLabels,
    AudioSourceOptions,
};
