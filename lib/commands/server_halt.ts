
import file from "../utilities/file.js";
import log from "../utilities/log.js";
import vars from "../utilities/vars.js";

// 1. turn off active servers
// 2. kill all sockets on the server
// 3. delete server objects
// 4. delete vars.sockets[server]
// 5. delete server from vars.server
// 6. remove server's directory
// 7. modify the server
// 8. remove server from the config.json file
// 9. call the callback

const server_halt = function commands_serverHalt(server:server, action:type_halt_action, callback:() => void):void {
    const name:string = (typeof server.modification_name === "string")
            ? server.modification_name
            : server.name;
    if (vars.servers[name] === undefined) {
        log({
            action: action,
            config: server,
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
                    if (callback !== null) {
                        // 9. call the callback
                        callback();
                    }
                    log({
                        action: action,
                        config: server,
                        message: `Server named ${server.name} ${action}ed.`,
                        status: "success",
                        type: "server"
                    });
                }
            },
            file_remove:file_remove = {
                callback: function commands_serverHalt_remove():void {
                    complete("remove");
                },
                error_terminate: server,
                exclusions: [],
                location: path_name
            },
            sockets:websocket_client[] = vars.sockets[name];
        let index:number = (sockets === undefined)
            ? 0
            : sockets.length;
        // 1. turn off active servers
        if (vars.store_server.open[name] !== undefined) {
            vars.store_server.open[name].close();
        }
        if (vars.store_server.secure[name] !== undefined) {
            vars.store_server.secure[name].close();
        }
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
        if (action === "destroy") {
            // 5. delete server from vars.server
            delete vars.servers[name];
            // 6. remove server's directory
            file.remove(file_remove);
        }
        // 7. restart the server
        if (action === "modify") {
            const modName:string = server.modification_name;
            if (modName !== server.name && vars.servers[modName] !== undefined) {
                delete server.modification_name;
                vars.servers[server.name] = vars.servers[modName];
                delete vars.servers[modName];
            }
        }
        // 8. modify the config.json file
        file.write({
            callback: function commands_serverHalt_readConfig_callback():void {
                complete("config");
            },
            contents: JSON.stringify(vars.servers),
            error_terminate: server,
            location: path_config
        });
    }
};

export default server_halt;