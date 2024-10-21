
import file from "../utilities/file.js";
import log from "../utilities/log.js";
import server from "../transmit/server.js";
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
    const name:string = (typeof config.modification_name === "string")
            ? config.modification_name
            : config.name;
    if (vars.servers[name] === undefined) {
        log({
            action: action,
            config: config,
            message: `Server named ${name} does not exist.  Called on library server_halt.`,
            status: "error",
            type: "log"
        });
    } else {
        const path_config:string = `${vars.path.project}config.json`,
            path_name:string = `${vars.path.project}servers${vars.sep + name + vars.sep}`,
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
                complete("restart");
            },
            sockets:websocket_client[] = vars.sockets[name];
        let index:number = (sockets === undefined)
            ? 0
            : sockets.length;
        // 1. turn off active servers and delete their corresponding objects
        if (vars.store_server.open[name] !== undefined) {
            vars.store_server.open[name].close();
            delete vars.store_server.open[name];
        }
        if (vars.store_server.secure[name] !== undefined) {
            vars.store_server.secure[name].close();
            delete vars.store_server.secure[name];
        }
        vars.server_status[name] = {
            open: 0,
            secure: 0
        };
        // 2. kill all sockets on the server
        if (index > 0) {
            do {
                index = index - 1;
                sockets[index].destroy();
            } while (index > 0);
        }
        // 3. delete vars.sockets[name]
        delete vars.sockets[name];
        if (action === "destroy") {
            // 4. delete server from vars.server
            delete vars.servers[name];
            // 5. remove server's directory
            file.remove(file_remove);
        } else {
            complete("remove");
        }
        // 6. modify the server
        if (action === "modify" && config.activate === true) {
            server(config.name, server_restart);
        } else {
            complete("restart");
        }
        if (action === "destroy" || action === "modify") {
            // 7. modify the config.json file
            file.write({
                callback: function commands_serverHalt_readConfig_callback():void {
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