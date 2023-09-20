export function toRoman(num: number | null): string {
    if (num == null) return "učitel";
    if (num >= 5) return "V" + toRoman(num - 5);
    if (num >= 4) return "IV" + toRoman(num - 4);
    if (num >= 1) return "I" + toRoman(num - 1);
    return "";
}

export function numToLevel(num: number): string {
    if      (num == 0) return "A1";
    else if (num == 1) return "A2";
    else if (num == 2) return "B1";
    else if (num == 3) return "B2";
    else if (num == 4) return "C1";
    else if (num == 5) return "C2";
    else return "";
}

export const languageLevels = [
    { id:0, name: "A1" },
    { id:1, name: "A2" },
    { id:2, name: "B1" },
    { id:3, name: "B2" },
    { id:4, name: "C1" },
    { id:5, name: "C2" },
]

export const otazka = (n: number) => {
    if (n == 1) return "gramatickou otázku"
    else if (n > 1 && n < 5) return "gramatické otázky"
    else return "gramatických otázek";
}

export const minuta = (n: number) => {
    if (n == 1) return "minuta";
    if (n < 5) return "minuty"
    else return "minut";
}

/**
 * Put `separator` between all elements of `array`.
 * @author Marian Šámal
 * @example
 * intersperse([1, 2, 3], 0)
 *   ==> [ 1, 0, 2, 0, 3 ]
 * intersperse([1, 2, 3].map(n => <span>{n}</span>), ', ')
 *   ==> shows JSX elements (created by mapping an array) separated by a string / another JSX element
 * @see https://gist.github.com/thomasjonas/f99f48e278fd2dfe82edb2c6f7d6c365
 * @see https://stackoverflow.com/questions/23618744/rendering-comma-separated-list-of-links
 */
export function intersperse<T, E>(array: T[], separator: E): (T|E)[] {
    if (array.length === 0)
        return [];

    //@ts-ignore
    return array.slice(1).reduce((ans: Type[], element) => ans.concat([ separator, element ]), [ array[0] ]);
}