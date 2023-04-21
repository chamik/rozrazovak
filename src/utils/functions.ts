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