export const generateAlertId = (): string => {
    const abc = '0123456789abcdfghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const timestamp = Date.now().toString();
    const numStringArray = timestamp
        .slice(
            timestamp.length >= 20 ? timestamp.length - 20 : 0,
            timestamp.length
        )
        .split('');

    const hashpairs = numStringArray.map((num): string => {
        const pos = Math.floor(Math.random() * abc.length);
        const symbol = abc.charAt(pos);
        return num + symbol;
    });

    const id = hashpairs.join('');

    return id;
};
