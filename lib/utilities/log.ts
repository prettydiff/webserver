
import humanTime from "./humanTime.js";
import vars from "./vars.js";

const log = function terminal_utilities_log(output:string[], end?:boolean):void {
    const logger:(input:string) => void = function terminal_utilities_log_logger(input:string):void {
            // eslint-disable-next-line no-console
            console.log(input);
        };
    if (vars.verbose === true && (output.length > 1 || output[0] !== "")) {
        logger("");
    }
    if (output[output.length - 1] === "") {
        output.pop();
    }
    output.forEach(function terminal_utilities_log_each(value:string) {
        logger(value);
    });
    if (end === true) {
        humanTime(vars.start_time);
    }
};

export default log;