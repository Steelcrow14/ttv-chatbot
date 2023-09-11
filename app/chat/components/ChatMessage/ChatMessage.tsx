import { ChatMessageProps } from './ChatMessage.props';
import cn from 'classnames';

const parseMessageForMentions = (message: string): JSX.Element[] => {
    const regex = /(\s|^)@[a-zA-Z0-9]+(\s|$)/gi;
    const stringWithSeparatedMentions = message.replaceAll(
        regex,
        (matchedString): string => {
            let replacementString =
                '${sep}$' + matchedString.trim() + '${sep}$';
            if (matchedString.startsWith(' ')) {
                replacementString = ' ' + replacementString;
            }
            if (matchedString.endsWith(' ')) {
                replacementString = replacementString + ' ';
            }
            return replacementString;
        }
    );
    const substringArray = stringWithSeparatedMentions.split('${sep}$');
    const spanArray = substringArray.map((substring): JSX.Element => {
        return (
            <span
                key={substringArray.indexOf(substring)}
                className={cn({
                    ['bg-slate-700 dark:bg-secondary']: regex.test(substring),
                })}
            >
                {substring}
            </span>
        );
    });

    return spanArray;
};

const ChatMessage = ({ message, className }: ChatMessageProps): JSX.Element => {
    const parsedMessagePartsArray = parseMessageForMentions(message);

    return <span className={cn(className)}>{parsedMessagePartsArray}</span>;
};

export default ChatMessage;
