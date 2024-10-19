
import certificate from "./certificate.js";
import file from "../utilities/file.js";
import log from "../utilities/log.js";
import read_certs from "../utilities/read_certs.js";
import server from "../transmit/server.js";
import vars from "../utilities/vars.js";

// 1. add server to the vars.servers object
// 2. add server to config.json file
// 3. create server's directory structure
// 4. create server's certificates
// 5. launch servers
// 6. call the callback

const server_create = function commands_serverCreate(config:server, read_certificates:boolean, callback:() => void):void {
    let count:number = 0;
    const path_config:string = `${vars.path.project}config.json`,
        path_servers:string = `${vars.path.project}servers${vars.sep}`,
        path_name:string = path_servers + config.name + vars.sep,
        path_assets:string = `${path_name}assets${vars.sep}`,
        path_certs:string = `${path_name}certs${vars.sep}`,
        flags:store_flag = {
            config: false,
            dir: false
        },
        complete = function commands_serverCreate_complete(input:"config"|"dir"):void {
            flags[input] = true;
            if (flags.config === true && flags.dir === true) {
                // 4. create server's certificates
                let server_count:number = 0;
                const config_server:config_websocket_server = {
                    callback: function commands_serverCreate_complete_certificate_callbackBoth():void {
                        server_count = server_count + 1;
                        if ((server_count > 1 && config.encryption === "both") || config.encryption !== "both") {
                            // 6. call the callback
                            if (callback !== null) {
                                callback();
                            }
                        }
                    },
                    name: config.name,
                    options: null
                };
                log({
                    action: "add",
                    config: config,
                    message: `Server named ${config.name} created.`,
                    status: "success",
                    type: "server"
                });
                if (config.encryption === "open") {
                    server(config_server);
                } else {
                    certificate({
                        callback: function commands_serverCreate_complete_certificate():void {
                            if (read_certificates === true) {
                                read_certs(config.name, function index_readCerts(name:string, tlsOptions:transmit_tlsOptions):void {
                                    // 5. launch servers
                                    if (vars.servers[name].encryption === "both") {
                                        server(config_server);
                                    }
                                    config_server.options = tlsOptions;
                                    server(config_server);
                                });
                            } else {
                                // 6. call the callback
                                if (callback !== null) {
                                    callback();
                                }
                            }
                        },
                        days: 65535,
                        domain_default: null,
                        name: config.name,
                        selfSign: false
                    });
                }
            }
        },
        children = function commands_serverCreate_children():void {
            count = count + 1;
            if (count > 1) {
                complete("dir");
            }
        },
        mkdir = function commands_serverCreate_serverDir(location:string):void {
            file.mkdir({
                callback: children,
                error_terminate: config,
                location: location
            });
        };
    // 1. add server to the vars.servers object
    if (vars.servers[config.name] === undefined) {
        if (config.ports === undefined || config.ports === null) {
            config.ports = {};
        }
        if (config.encryption === "both") {
            if (typeof config.ports.open !== "number") {
                config.ports.open = 0;
            }
            if (typeof config.ports.secure !== "number") {
                config.ports.secure = 0;
            }
        } else if (config.encryption === "open") {
            if (typeof config.ports.open !== "number") {
                config.ports = {
                    open: 0
                };
            } else {
                config.ports = {
                    open: config.ports.open
                };
            }
        } else {
            if (typeof config.ports.secure !== "number") {
                config.ports = {
                    secure: 0
                };
            } else {
                config.ports = {
                    secure: config.ports.secure
                };
            }
        }
        vars.servers[config.name] = config;
        vars.server_status[config.name] = (config.encryption === "both")
            ? {
                open: 0,
                secure: 0
            }
            : (config.encryption === "open")
                ? {
                    open: 0
                }
                : {
                    secure: 0
                };
        // 2. add server to config.json file
        file.write({
            callback: function commands_serverCreate_writeConfig_callback():void {
                complete("config");
            },
            contents: JSON.stringify(vars.servers),
            error_terminate: config,
            location: path_config
        });
    } else {
        log({
            action: "add",
            config: config,
            message: `Server named ${config.name} already exists.  Called on library server_create.`,
            status: "error",
            type: "log"
        });
        return;
    }
    // 3. create server's directory structure
    mkdir(path_assets);
    mkdir(path_certs);
};

export default server_create;