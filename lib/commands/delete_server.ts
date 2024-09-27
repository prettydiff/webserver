
import error from "../utilities/error.js";
import file from "../utilities/file.js";
import log from "../utilities/log.js";
import vars from "../utilities/vars.js";

// 1. turn off active servers
// 2. kill all sockets on the server
// 3. delete server objects
// 4. delete vars.sockets[server]
// 5. delete server from vars.server
// 6. remove server's directory
// 7. remove server from the config.json file
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
                remove: false
            },
            complete = function commands_deleteServer_complete(flag:"config"|"destroy"|"remove"):void {
                flags[flag] = true;
                if (flags.config === true && flags.remove === true) {
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
            file_remove:file_remove = {
                callback: function commands_deleteServer_remove():void {
                    complete("remove");
                },
                error_terminate: terminate,
                exclusions: [],
                location: path_name
            };
        if (vars.command !== "delete_server") {
            const sockets:websocket_client[] = vars.sockets[name];
            let index:number = (sockets === undefined)
                ? 0
                : sockets.length;
            // 1. turn off active servers
            vars.store_server.open[name].close();
            vars.store_server.secure[name].close();
            // 2. kill all sockets on the server
            if (index > 0) {
                do {
                    index = index - 1;
                    sockets[index].destroy();
                } while (index > 0);
            }
            // 3. delete server objects
            delete vars.store_server.open[name];
            delete vars.store_server.secure[name];
            // 4. delete vars.sockets[server]
            delete vars.sockets[name];
        }
        // 5. delete server from vars.server
        delete vars.servers[name];
        // 6. remove server's directory
        file.remove(file_remove);
        // 7. remove server from the config.json file
        file.write({
            callback: function commands_deleteServer_readConfig_callback():void {
                complete("config");
            },
            contents: JSON.stringify(vars.servers),
            error_terminate: terminate,
            location: path_config
        });
    }
};

export default delete_server;