export const getBatches = <T>(oldArray: T[], batchSize: number): T[][] => {
    const batchArray = [];
    const arrayLength = oldArray.length;
    for (let index = 0; index < arrayLength; index = index + batchSize) {
        const batch = oldArray.slice(
            index,
            index + batchSize > arrayLength ? arrayLength : index + batchSize
        );
        batchArray.push(batch);
    }
    return batchArray;
};
