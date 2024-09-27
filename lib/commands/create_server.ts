
import certificate from "./certificate.js";
import error from "../utilities/error.js";
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

const create_server = function commands_createServer(config:server, read_certificates:boolean, callback:() => void):void {
    let count:number = 0;
    const path_config:string = `${vars.path.project}config.json`,
        path_servers:string = `${vars.path.project}servers${vars.sep}`,
        path_name:string = path_servers + config.name + vars.sep,
        terminate:boolean = (vars.command === "create_server"),
        path_assets:string = `${path_name}assets${vars.sep}`,
        path_certs:string = `${path_name}certs${vars.sep}`,
        flags:store_flag = {
            config: false,
            dir: false
        },
        complete = function commands_createServer_complete(input:"config"|"dir"):void {
            flags[input] = true;
            if (flags.config === true && flags.dir === true) {
                // 4. create server's certificates
                let server_count:number = 0;
                const config_server:config_websocket_server = {
                    callback: (vars.servers[config.name].encryption === "both")
                        ? function commands_createServer_complete_certificate_callbackBoth():void {
                            server_count = server_count + 1;
                            if (server_count > 1 && callback !== null) {
                                // 6. call the callback
                                callback();
                            }
                        }
                        : callback,
                    name: config.name,
                    options: null
                };
                if (config.encryption === "open") {
                    server(config_server);
                } else {
                    certificate({
                        callback: function commands_createServer_complete_certificate():void {
                            if (vars.command === "create_server") {
                                log([
                                    `Server ${vars.text.cyan + config.name + vars.text.none} ${vars.text.green}created${vars.text.none}.`,
                                    `${vars.text.angry}*${vars.text.none} config.json file updated.`,
                                    `${vars.text.angry}*${vars.text.none} Directory structure at ${vars.text.cyan + path_name + vars.text.none} created.`,
                                    `${vars.text.angry}*${vars.text.none} Certificates created.`,
                                    "",
                                    "1. Update the config.json file to customize the new server.",
                                    "",
                                    ""
                                ], true);
                            } else if (read_certificates === true) {
                                read_certs(config.name, function index_readCerts(name:string, tlsOptions:transmit_tlsOptions):void {
                                    // 5. launch servers
                                    if (vars.servers[name].encryption === "both") {
                                        server(config_server);
                                    }
                                    config_server.options = tlsOptions;
                                    server(config_server);
                                });
                            } else {
                                callback();
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
        children = function commands_createServer_children():void {
            count = count + 1;
            if (count > 1) {
                complete("dir");
            }
        },
        mkdir = function commands_createServer_serverDir(location:string):void {
            file.mkdir({
                callback: children,
                error_terminate: terminate,
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
                }
            } else {
                config.ports = {
                    open: config.ports.open
                };
            }
        } else {
            if (typeof config.ports.secure !== "number") {
                config.ports = {
                    secure: 0
                }
            } else {
                config.ports = {
                    secure: config.ports.secure
                };
            }
        }
        vars.servers[config.name] = config;
        // 2. add server to config.json file
        file.write({
            callback: function commands_createServer_writeConfig_callback():void {
                complete("config");
            },
            contents: JSON.stringify(vars.servers),
            error_terminate: terminate,
            location: path_config
        });
    } else {
        error([
            `A server with name ${config.name} already exists.`,
            "Either delete the existing server with that name or choose a different name."
        ], null, terminate);
        return;
    }
    // 3. create server's directory structure
    mkdir(path_assets);
    mkdir(path_certs);
};

export default create_server;