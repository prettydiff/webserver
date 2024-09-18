
import error from "../utilities/error.js";
import file from "../utilities/file.js";
import node from "../utilities/node.js";
import remove from "../utilities/remove.js";
import vars from "../utilities/vars.js";

// 1. remove server's directory
// 2. remove server from the config.json file
// 3. delete server from vars.server
// 4. turn off active servers

const delete_server = function commands_deleteServer(name:string, callback:() => void):void {
    const terminate:boolean = (vars.command === "delete_server");
    if (vars.servers[name] === undefined) {
        error([
            `Server with name ${name} does not exist.`,
            "No server deleted."
        ], null, terminate);
    } else {
        const config:string = `${vars.path.project}config.json`,
            callback_remove = function commands_deleteServer_callbackRemove():void {
                
            },
            file_config:file_read = {
                callback: null,
                error_terminate: terminate,
                location: config,
                no_error: null,
                no_file: null
            },
            callback_config = function commands_deleteServer_callbackConfig(erc:node_error, fileRaw:Buffer):void {
                if (erc === null) {
                    const file:string = fileRaw.toString(),
                        traverse = function commands_deleteServer_callbackConfig_traverse(increment:boolean):boolean {
                            if (quote === "") {
                                if (count === 0) {
                                    if (increment === false && (file.charAt(chars - 1) === "{" || file.charAt(chars) === ",")) {
                                        start = chars;
                                        return true;
                                    }
                                    if (increment === true && (file.charAt(chars) === "}" || file.charAt(chars - 1) === ",")) {
                                        end = chars;
                                        return true;
                                    }
                                }
                                if (file.charAt(chars) === "{") {
                                    count = count - 1;
                                } else if (file.charAt(chars) === "}") {
                                    count = count + 1;
                                } else if (file.charAt(chars) === "\"") {
                                    quote = "\"";
                                }
                            } else if (file.charAt(chars) === quote) {
                                quote = "";
                            }
                            return false;
                        };
                    let chars:number = file.indexOf(`"${name}"`),
                        start:number = chars,
                        end:number = chars,
                        quote:string = "",
                        count:number = 0;
                    do {
                        chars = chars - 1;
                        if (traverse(false) === true) {
                            break;
                        }
                    } while (chars > 0);
                    chars = end;
                    do {
                        if (traverse(true) === true) {
                            break;
                        }
                        chars = chars + 1;
                    } while (chars > 0);
                    node.fs.writeFile(config, file.slice(0, start) + file.slice(end), function commands_deleteServer_callbackConfig_traverse_writeFile(erw:node_error):void {

                    });
                } else if (erc.code === "ENOENT") {

                } else {
                    error([`Error reading ${vars.text.angry + config + vars.text.none}.`], erc, true);
                }
            };
        //remove(`${vars.path.project}servers${vars.sep + name}`, [], callback_remove);
        file.read(file_config);
    }
};

export default delete_server;