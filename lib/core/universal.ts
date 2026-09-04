
const utilities:core_module_universal = {
    bytes: function core_universalBytes(this:string):number {
        const input:string = this.toLowerCase(),
            map:store_number = {
                kb: 1000,
                kib: 1024,
                mb: 1e6,
                mib: 1024**2,
                gb: 1e9,
                gib: 1024**3,
                tb: 1e12,
                tib: 1024**4,
                pb: 1e15,
                pib: 1024**5,
                eb: 1e18,
                eib: 1024**6
            },
            scale:string = input.match(/[a-z]+$/)[0],
            numb:number = Number(input.match(/^\d+(\.{1,2})?/)[0]);
        if (scale === null || isNaN(numb) === true || (/^\d+(\.\d{1,3})?[a-z]{2,3}$/).test(input) === false || map[scale] === undefined) {
            return null;
        }
        return numb * map[scale];
    },
    bytes_big: function core_universalBytes(this:string):bigint {
        const input:string = this.toLowerCase(),
            map:store_bigint = {
                kb: 1000n,
                kib: 1024n,
                mb: BigInt(1e6),
                mib: 1024n**2n,
                gb: BigInt(1e9),
                gib: 1024n**3n,
                tb: BigInt(1e6) * BigInt(1e6),
                tib: 1024n**4n,
                pb: BigInt(1e9) * BigInt(1e6),
                pib: 1024n**5n,
                eb: BigInt(1e9) * BigInt(1e9),
                eib: 1024n**6n
            },
            scale:string = input.match(/[a-z]+$/)[0],
            numb:number = Number(input.match(/^\d+(\.{1,2})?/)[0]);
        if (scale === null || isNaN(numb) === true || (/^\d+(\.\d{1,3})?[a-z]{2,3}$/).test(input) === false || map[scale] === undefined) {
            return null;
        }
        return BigInt(numb) * map[scale];
    },
    capitalize: function core_capitalize(this:string):string {
        const words:string[] = this.split(" "),
            output:string[] = [];
        words.forEach(function core_capitalize_each(value:string):void {
            output.push(value.charAt(0).toUpperCase() + value.slice(1));
        });
        return output.join(" ");
    },
    commas: function core_universalCommas(this:number):string {
        const negative:boolean = this < 0,
            str:string = String((negative === true)
                ? this * -1
                : this
            ),
            period:number = str.indexOf("."),
            arr:string[] = str.split("");
        let a:number   = (period > -1)
            ? period
            : str.length;
        if (a < 4) {
            return str;
        }
        do {
            a      = a - 3;
            arr[a] = "," + arr[a];
        } while (a > 3);
        return (negative === true)
            ? `-${arr.join("")}`
            : arr.join("");
    },
    dateTime: function core_universalDateTime(this:number, date:boolean, timeZone_offset:number):string {
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
            milliseconds:string = pad(dateItem.getMilliseconds(), true),
            zulu_test:boolean = (isNaN(timeZone_offset) === false && timeZone_offset > 0),
            lima:string = (zulu_test === true)
                ? "L"
                : "";
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
        output.push(`${hours}:${minutes}:${seconds}.${milliseconds + lima}`);
        if (zulu_test === true) {
            const zulu:number = this + timeZone_offset;
            output.push(`(${zulu.dateTime(false, null)}Z)`);
        }
        return output.join(" ");

    },
    file_sanitize: function core_fileSanitize(this:string):string {
        let input:string = this;
        if (process.platform === "win32") {
            input = input.replace(/\\|:/g, "")
                .replace(/[\u0001-\u001f]/g, "")
                .replace(/(CON)|(PRN)|(AUX)|(NUL)/gi, "")
                .replace(/(COM1)|(COM2)|(COM3)|(COM4)|(COM5)|(COM6)|(COM7)|(COM8)|(COM9)/gi, "")
                .replace(/(LPT1)|(LPT2)|(LPT3)|(LPT4)|(LPT5)|(LPT6)|(LPT7)|(LPT8)|(LPT9)/gi, "")
                .replace(/(\s+|\.)$/, "");
        }
        input = input.replace(/\u0000|\*|\?|\||<|>|"|\//g, "")
            .replace(/^-+/, "");
        return input;
    },
    time_elapsed: function core_universalTimeElapsed(this:number, start?:bigint):string {
        const elapsed:boolean = (typeof start === "bigint"),
            number:bigint = (elapsed === true)
                ? BigInt(this)
                : BigInt(Math.floor(this as number * 1e9)),
            numberString = function core_universalTime_numberString(numb:bigint):string {
                const str:string = numb.toString();
                return (str.length < 2)
                    ? `0${str}`
                    : str;
            },
            value:bigint       = (elapsed === true)
                ? number - start
                : number,
            factorSec:bigint   = BigInt(1e9),
            factorMin:bigint   = (60n * factorSec),
            factorHour:bigint  = (3600n * factorSec),
            factorDay:bigint   = (86400n * factorSec),
            days:bigint        = (value / factorDay),
            elapsedDay:bigint  = (days * factorDay),
            hours:bigint       = ((value - elapsedDay) / factorHour),
            elapsedHour:bigint = (hours * factorHour),
            minutes:bigint     = ((value - (elapsedDay + elapsedHour)) / factorMin),
            elapsedMin:bigint  = (minutes * factorMin),
            seconds:bigint     = ((value - (elapsedDay + elapsedHour + elapsedMin)) / factorSec),
            nanosecond:bigint  = (value - (elapsedDay + elapsedHour + elapsedMin + (seconds * factorSec))),
            nanoString:string  = (function core_universalTime_nanoString():string {
                let nano:string = nanosecond.toString(),
                    a:number = nano.length;
                if (a < 9) {
                    do {
                        nano = `0${nano}`;
                        a = a + 1;
                    } while (a < 9);
                }
                return nano;
            }()),
            secondString:string = (nanoString === "")
                ? numberString(seconds)
                : `${numberString(seconds)}.${nanoString}`,
            minuteString:string = numberString(minutes),
            hourString:string = numberString(hours),
            dayString:string = (days === 1n)
                ? "1 day, "
                : `${days.toString()} days, `;
        if (elapsed === true) {
            return `${hourString}:${minuteString}:${secondString}`;
        }
        return `${dayString}${hourString}:${minuteString}:${secondString}`;
    }
};

export default utilities;