
const commas = function utilities_commas(input:number):string {
    const str:string = String(input),
        period:number = str.indexOf(".");
    let arr:string[] = [],
        a:number   = (period > -1)
            ? period
            : str.length;
    if (a < 4) {
        return str;
    }
    arr = String(input).split("");
    do {
        a      = a - 3;
        arr[a] = "," + arr[a];
    } while (a > 3);
    return arr.join("");
};

export default commas;