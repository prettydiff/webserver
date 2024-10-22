
import file from "../utilities/file.js";
import log from "../utilities/log.js";
import node from "../utilities/node.js";
import server_create from "./server_create.js";
import vars from "../utilities/vars.js";

// 1. turn off active servers and delete their corresponding objects
// 2. kill all sockets on the server
// 3. delete vars.sockets[server]
// 4. delete server from vars.server
// 5. remove server's directory
// 6. modify the server
// 7. remove server from the config.json file
// 8. call the callback

const server_halt = function commands_serverHalt(config:server, action:type_halt_action, callback:() => void):void {
    const old:string = config.modification_name;
    if (vars.servers[old] === undefined) {
        log({
            action: action,
            config: config,
            message: `Server named ${old} does not exist.  Called on library server_halt.`,
            status: "error",
            type: "log"
        });
    } else {
        const path_config:string = `${vars.path.project}config.json`,
            path_name:string = `${vars.path.project}servers${vars.sep + old + vars.sep}`,
            flags:store_flag = {
                config: false,
                remove: (action === "destroy")
                    ? false
                    : true,
                restart: (action === "modify")
                    ? false
                    : true
            },
            complete = function commands_serverHalt_complete(flag:"config"|"remove"|"restart"):void {
                flags[flag] = true;
                if (flags.config === true && flags.remove === true && flags.restart === true) {
                    const actionText:string = (action.charAt(action.length - 1) === "e")
                        ? `${action}d`
                        : `${action}ed`;
                    if (callback !== null) {
                        // 8. call the callback
                        callback();
                    }
                    log({
                        action: action,
                        config: config,
                        message: `Server named ${config.name} ${actionText}.`,
                        status: "success",
                        type: "server"
                    });
                }
            },
            file_remove:file_remove = {
                callback: function commands_serverHalt_remove():void {
                    complete("remove");
                },
                error_terminate: config,
                exclusions: [],
                location: path_name
            },
            server_restart = function commands_serverHalt_serverRestart():void {
                node.fs.cp(path_name, `${vars.path.project}servers${vars.sep + config.name + vars.sep}`, {
                    recursive: true
                }, function server_restart_cp(erc:node_error):void {
                    if (erc === null) {
                        complete("restart");
                        file.remove(file_remove);
                    } else {
                        log({
                            action: "modify",
                            config: config,
                            message: "Error copying files from old server location to new server location.",
                            status: "error",
                            type: "server"
                        });
                    }
                });
            },
            sockets_open:websocket_client[] = vars.server_meta[old].sockets.open,
            sockets_secure:websocket_client[] = vars.server_meta[old].sockets.secure;
        let index:number = (sockets_open === undefined)
            ? 0
            : sockets_open.length;
        // 1. turn off active servers and delete their corresponding objects
        if (vars.server_meta[old].server.open !== undefined) {
            vars.server_meta[old].server.open.close();
        }
        if (vars.server_meta[old].server.secure !== undefined) {
            vars.server_meta[old].server.open.close();
        }
        // 2. kill all sockets on the server
        if (index > 0) {
            do {
                index = index - 1;
                sockets_open[index].destroy();
            } while (index > 0);
        }
        index = (sockets_secure === undefined)
            ? 0
            : sockets_open.length;
        if (index > 0) {
            do {
                index = index - 1;
                sockets_secure[index].destroy();
            } while (index > 0);
        }
        delete vars.server_meta[old];
        // 3. delete vars.sockets[name]
        if (action === "destroy") {
            // 4. delete server from vars.server
            delete vars.servers[old];
            // 5. remove server's directory
            file.remove(file_remove);
        } else if (action !== "modify") {
            complete("remove");
        }
        // 6. modify the server
        if (action === "modify") {
            delete config.modification_name;
            server_create(config, server_restart);
            if (config.name !== old) {
                delete vars.servers[old];
            }
            vars.servers[config.name] = config;
        } else {
            complete("restart");
        }
        if (action === "destroy" || action === "modify") {
            // 7. modify the config.json file
            file.write({
                callback: function commands_serverHalt_writeConfig():void {
                    complete("config");
                },
                contents: JSON.stringify(vars.servers),
                error_terminate: config,
                location: path_config
            });
        } else {
            complete("config");
        }
    }
};

export default server_halt;