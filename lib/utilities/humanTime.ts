
const humanTime = function utilities_humanTime(startTime:bigint):string {
    const numberString = function utilities_humanTime_numberString(numb:bigint):string {
            const str:string = numb.toString();
            return (str.length < 2)
                ? `0${str}`
                : str;
        },
        elapsed:bigint     = process.hrtime.bigint() - startTime,
        factorSec:bigint   = BigInt(1e9),
        factorMin:bigint   = (60n * factorSec),
        factorHour:bigint  = (3600n * factorSec),
        hours:bigint       = (elapsed / factorHour),
        elapsedHour:bigint = (hours * factorHour),
        minutes:bigint     = ((elapsed - elapsedHour) / factorMin),
        elapsedMin:bigint  = (minutes * factorMin),
        seconds:bigint     = ((elapsed - (elapsedHour + elapsedMin)) / factorSec),
        nanosecond:bigint  = (elapsed - (elapsedHour + elapsedMin + (seconds * factorSec))),
        nanoString:string  = (function utilities_humanTime_nanoString():string {
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
        secondString:string = `${numberString(seconds)}.${nanoString}`,
        minuteString:string = numberString(minutes),
        hourString:string = numberString(hours);
    return `[${hourString}:${minuteString}:${secondString}] `;
};

export default humanTime;