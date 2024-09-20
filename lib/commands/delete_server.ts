
import error from "../utilities/error.js";
import file from "../utilities/file.js";
import log from "../utilities/log.js";
import vars from "../utilities/vars.js";

// 1. remove server's directory
// 2. remove server from the config.json file
// 3. turn off active servers
// 4. kill all sockets on the server
// 5. delete server from vars.server
// 6. delete server objects
// 7. delete vars.sockets[server]
// 8. call the callback

const delete_server = function commands_deleteServer(name:string, callback:() => void):void {
    const terminate:boolean = (vars.command === "delete_server");
    if (vars.servers[name] === undefined) {
        error([
            `Server with name ${name} does not exist.`,
            "No server deleted."
        ], null, terminate);
    } else {
        const path_config:string = `${vars.path.project}config.json`,
            path_name:string = `${vars.path.project}servers${vars.sep + name + vars.sep}`,
            flags:store_flag = {
                config: false,
                destroy: false,
                remove: false
            },
            complete = function commands_deleteServer_complete(flag:"config"|"destroy"|"remove"):void {
                flags[flag] = true;
                if (flags.config === true && flags.destroy === true && flags.remove === true) {
                    if (vars.command === "delete_server") {
                        log([
                            `Server ${vars.text.cyan + name + vars.text.none} ${vars.text.angry}deleted${vars.text.none}.`,
                            `${vars.text.angry}*${vars.text.none} config.json file updated.`,
                            `${vars.text.angry}*${vars.text.none} Directory structure at ${vars.text.cyan + path_name + vars.text.none} deleted.`,
                            `${vars.text.angry}*${vars.text.none} Active sockets destroyed.`,
                            `${vars.text.angry}*${vars.text.none} Server objected deleted from application.`,
                            "",
                            ""
                        ], true);
                    } else {
                        callback();
                    }
                }
            },
            destroy = function commands_deleteServer_destroy():void {
                if (vars.command !== "delete_server") {
                    const sockets:websocket_client[] = vars.sockets[name];
                    let index:number = (sockets === undefined)
                        ? 0
                        : sockets.length;
                    // 3. turn off active servers
                    vars.store_server.open[name].close();
                    vars.store_server.secure[name].close();
                    // 4. kill all sockets on the server
                    if (index > 0) {
                        do {
                            index = index - 1;
                            sockets[index].destroy();
                        } while (index > 0);
                    }
                    // 5. delete server from vars.server
                    delete vars.servers[name];
                    // 6. delete server objects
                    delete vars.store_server.open[name];
                    delete vars.store_server.secure[name];
                    // 7. turn off active servers
                    delete vars.sockets[name];
                }
                complete("destroy");
            },
            file_config:file_read = {
                callback: function commands_deleteServer_readConfig(fileRaw:Buffer):void {
                    const fileString:string = fileRaw.toString(),
                        traverse = function commands_deleteServer_readConfig_traverse(increment:boolean):boolean {
                            if (quote === "") {
                                if (count === 0) {
                                    if (increment === false && (fileString.charAt(chars - 1) === "{" || fileString.charAt(chars) === ",")) {
                                        start = chars;
                                        return true;
                                    }
                                    if (increment === true && (fileString.charAt(chars) === "}" || fileString.charAt(chars - 1) === ",")) {
                                        end = chars;
                                        return true;
                                    }
                                }
                                if (fileString.charAt(chars) === "{") {
                                    count = count - 1;
                                } else if (fileString.charAt(chars) === "}") {
                                    count = count + 1;
                                } else if (fileString.charAt(chars) === "\"") {
                                    quote = "\"";
                                }
                            } else if (fileString.charAt(chars) === quote) {
                                quote = "";
                            }
                            return false;
                        };
                    let chars:number = fileString.indexOf(`"${name}"`),
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
                    file.write({
                        callback: function commands_deleteServer_readConfig_callback():void {
                            complete("config");
                        },
                        contents: fileString.slice(0, start) + fileString.slice(end),
                        error_terminate: terminate,
                        location: path_config
                    });
                },
                error_terminate: terminate,
                location: path_config,
                no_file: function commands_deleteServer_noFile():void {
                    complete("config");
                }
            },
            file_remove:file_remove = {
                callback: function commands_deleteServer_remove():void {
                    complete("remove");
                },
                error_terminate: terminate,
                exclusions: [],
                location: path_name
            };
        // 1. remove server's directory
        file.remove(file_remove);
        // 2. remove server from the config.json file
        file.read(file_config);
        destroy();
    }
};

export default delete_server;