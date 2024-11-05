
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
// 7. remove server from the servers.json file
// 8. call the callback

const server_halt = function services_serverHalt(data:services_dashboard_action, callback:() => void):void {
    const old:string = (data.configuration.modification_name === undefined)
        ? data.configuration.name
        : data.configuration.modification_name;
    if (vars.servers[old] === undefined) {
        log({
            action: data.action,
            config: data.configuration,
            message: `Server named ${old} does not exist.  Called on library server_halt.`,
            status: "error",
            type: "log"
        });
    } else {
        const path_config:string = `${vars.path.project}servers.json`,
            path_name:string = `${vars.path.project}servers${vars.sep + old + vars.sep}`,
            flags:store_flag = {
                config: false,
                remove: (data.action === "destroy")
                    ? false
                    : true,
                restart: (data.action === "modify")
                    ? false
                    : true
            },
            complete = function services_serverHalt_complete(flag:"config"|"remove"|"restart"):void {
                flags[flag] = true;
                if (flags.config === true && flags.remove === true && flags.restart === true) {
                    const actionText:string = (data.action.charAt(data.action.length - 1) === "e")
                        ? `${data.action}d`
                        : `${data.action}ed`;
                    if (callback !== null) {
                        // 8. call the callback
                        callback();
                    }
                    log({
                        action: (old.indexOf("dashboard-terminal-") === 0)
                            ? "destroy"
                            : data.action,
                        config: data.configuration,
                        message: `Server named ${data.configuration.name} ${actionText}.`,
                        status: "success",
                        type: "server"
                    });
                }
            },
            file_remove:file_remove = {
                callback: function services_serverHalt_remove():void {
                    complete("remove");
                },
                error_terminate: data.configuration,
                exclusions: [],
                location: path_name
            },
            server_restart = function services_serverHalt_serverRestart():void {
                node.fs.cp(path_name, `${vars.path.project}servers${vars.sep + data.configuration.name + vars.sep}`, {
                    recursive: true
                }, function server_restart_cp(erc:node_error):void {
                    if (erc === null) {
                        complete("restart");
                        file.remove(file_remove);
                    } else {
                        log({
                            action: "modify",
                            config: data.configuration,
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
        vars.servers[old].status = {
            open: 0,
            secure: 0
        };
        // 2. kill all sockets on the server
        if (index > 0) {
            do {
                index = index - 1;
                sockets_open[index].destroy();
            } while (index > 0);
        }
        index = (sockets_secure === undefined)
            ? 0
            : sockets_secure.length;
        if (index > 0) {
            do {
                index = index - 1;
                sockets_secure[index].destroy();
            } while (index > 0);
        }
        delete vars.server_meta[old];
        // 3. delete vars.sockets[name]
        if (data.action === "destroy") {
            // 4. delete server from vars.server
            delete vars.servers[old];
            // 5. remove server's directory
            file.remove(file_remove);
        } else if (data.action !== "modify") {
            complete("remove");
        }
        // 6. modify the server
        if (data.action === "modify") {
            delete data.configuration.modification_name;
            server_create({
                action: "add",
                configuration: data.configuration
            }, server_restart);
            if (data.configuration.name !== old) {
                delete vars.servers[old];
            }
            vars.servers[data.configuration.name].config = data.configuration;
        } else {
            complete("restart");
        }
        if (data.action === "destroy" || data.action === "modify") {
            // 7. modify the servers.json file
            const servers:store_server_config = {},
                keys:string[] = Object.keys(vars.servers),
                total:number = keys.length - 1;
            let index:number = 0;
            do {
                delete vars.servers[keys[index]].config.modification_name;
                servers[keys[index]] = vars.servers[keys[index]].config;
                index = index + 1;
            } while (index < total);
            file.write({
                callback: function services_serverHalt_writeConfig():void {
                    complete("config");
                },
                contents: JSON.stringify(servers),
                error_terminate: data.configuration,
                location: path_config
            });
        } else {
            complete("config");
        }
    }
};

export default server_halt;