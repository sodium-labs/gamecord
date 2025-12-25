/**
 * Get a random integer in [min;max]
 */
export const getRandomInt = (max: number, min = 0): number => {
    if (min >= max) throw new RangeError("`min` should be less than `max`");
    return Math.floor(Math.random() * (min ? max + 1 - min : max + 1)) + min;
};

export const getRandomElement = <T>(array: T[]): T => {
    if (!array.length) throw new RangeError("The array should not be empty");
    return array[Math.floor(Math.random() * array.length)]!;
};

export const shuffleArray = <T>(array: T[]): T[] => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};
