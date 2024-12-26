
const dateTime =  function utilities_dateTime(date:boolean):string {
    // eslint-disable-next-line no-restricted-syntax
    const dateItem:Date = new Date(this),
        month:number = dateItem.getMonth(),
        output:string[] = [],
        pad = function utilities_dateTime_pad(input:number, milliseconds:boolean):string {
            const str:string = String(input);
            if (milliseconds === true) {
                if (str.length === 1) {
                    return `${str}00`;
                }
                if (str.length === 2) {
                    return `${str}0`;
                }
            } else if (str.length === 1) {
                return `0${str}`;
            }
            return str;
        },
        hours:string = pad(dateItem.getHours(), false),
        minutes:string = pad(dateItem.getMinutes(), false),
        seconds:string = pad(dateItem.getSeconds(), false),
        milliseconds:string = pad(dateItem.getMilliseconds(), true);
    output.push(pad(dateItem.getDate(), false));
    if (month === 0) {
        output.push("JAN");
    } else if (month === 1) {
        output.push("FEB");
    } else if (month === 2) {
        output.push("MAR");
    } else if (month === 3) {
        output.push("APR");
    } else if (month === 4) {
        output.push("MAY");
    } else if (month === 5) {
        output.push("JUN");
    } else if (month === 6) {
        output.push("JUL");
    } else if (month === 7) {
        output.push("AUG");
    } else if (month === 8) {
        output.push("SEP");
    } else if (month === 9) {
        output.push("OCT");
    } else if (month === 10) {
        output.push("NOV");
    } else if (month === 11) {
        output.push("DEC");
    }
    if (date === false) {
        return `${hours}:${minutes}:${seconds}.${milliseconds}`;
    }
    output.push(`${dateItem.getUTCFullYear()},`);
    output.push(`${hours}:${minutes}:${seconds}.${milliseconds}`);
    return output.join(" ");

};

export default dateTime;