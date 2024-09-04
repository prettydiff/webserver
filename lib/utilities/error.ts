
import node from "./node.js";
import vars from "./vars.js";

const error = function utilities_error(errText:string[], errObject:node_childProcess_ExecException|node_error, exit:boolean):void {
    // eslint-disable-next-line no-console
    const logger:(input:object|string) => void = console.log,
        stack:string|undefined = new Error().stack,
        stackTrace:string[] = (stack === undefined)
            ? null
            : stack.replace(/^Error/, "").replace(/\s+at\s/g, "splitMe").replace(/error\.js:\d+:\d+\)\r?\n/, "splitMe").split("splitMe").slice(3);
    if (errObject !== null && stackTrace !== null) {
        const stackMessage:string = `${vars.text.cyan}Stack trace${vars.text.none + node.os.EOL}-----------${node.os.EOL}`;
        logger(stackMessage);
        logger(stackTrace);
    }
    logger("");
    if (errObject !== null) {
        if (errObject.code !== undefined) {
            logger(`Code: ${errObject.code.toString()}`);
        }
        logger(errObject.message);
        logger("");
    }
    logger(`${vars.text.angry}Error Message${vars.text.none}`);
    logger("-------------");
    if (errText[0] === "" && errText.length < 2) {
        logger(`${vars.text.yellow}No error message supplied${vars.text.none}`);
    } else {
        errText.forEach(function utilities_error_each(value:string):void {
            logger(value);
        });
    }
    logger("\u0007"); // bell sound
    if (exit === true) {
        process.exit(1);
    }
};

export default error;