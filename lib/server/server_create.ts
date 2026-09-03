
import file from "../utilities/file.ts";
import hash from "../core/hash.ts";
import log from "../core/log.ts";
import ports_application from "../services/ports_application.ts";
import save from "../utilities/save.ts";
import server_start from "./server_start.ts";
import vars from "../core/vars.ts";

// 1. add server to the vars.data.servers object
// 2. save server data
// 3. create server's directory structure
// 4. create server's certificates
// 5. launch servers
// 6. call the callback

const server_create = function services_serverCreate(data:services_server_action, callback:() => void, dashboard:boolean):void {
    hash({
        algorithm: "sha3-512",
        callback: function services_serverCreate_hashCallback(output:core_hash_output):void {
            let count:number = 0;
            const config:supplemental_server_config = data.server,
                path_name:string = vars.path.servers + output.hash + vars.path.sep,
                path_assets:string = `${path_name}assets${vars.path.sep}`,
                path_certs:string = `${path_name}certs${vars.path.sep}`,
                flags:store_flag = {
                    config: false,
                    dir: false
                },
                complete = function services_serverCreate_complete(input:"config"|"dir"):void {
                    flags[input] = true;
                    if (flags.config === true && flags.dir === true) {
                        let server_count:number = 0;
                        const serverCallback = function services_serverCreate_complete_serverCallback():void {
                                server_count = server_count + 1;
                                if ((server_count > 1 && config.encryption === "both") || config.encryption !== "both") {
                                    ports_application();
                                    // 6. call the callback
                                    if (callback !== null) {
                                        callback();
                                    }
                                }
                            };
                        log.application({
                            error: null,
                            message: "Server created.",
                            origin: output.hash,
                            section: "servers-web",
                            status: "informational",
                            time: Date.now()
                        });
                        // 4. launch servers
                        if (config.activate === true && vars.options.demo === false && config.id !== vars.id.dashboard_server) {
                            server_start(data.server.id, serverCallback);
                        } else if (callback !== null) {
                            callback();
                        }
            }
                },
                children = function services_serverCreate_children():void {
                    count = count + 1;
                    if (count > 1) {
                        complete("dir");
                    }
                },
                mkdir = function services_serverCreate_serverDir(location:string):void {
                    file.mkdir({
                        callback: children,
                        location: location,
                        section: "servers-web"
                    });
                };
            if (vars.data.server[output.hash] === undefined) {
                // 1. add server to the vars.data.servers object
                config.id = output.hash;
                if (vars.options.demo === true) {
                    config.encryption = "open";
                }
                if (vars.data.server[config.id] === undefined) {
                    if (dashboard === true) {
                        vars.id.dashboard_server = output.hash;
                    }
                    if (config.ports === undefined || config.ports === null) {
                        config.ports = {
                            open: 0,
                            secure: 0
                        };
                    } else {
                        if (typeof config.ports.open !== "number") {
                            config.ports.open = 0;
                        }
                        if (typeof config.ports.secure !== "number") {
                            config.ports.secure = 0;
                        }
                    }
                    vars.data.server[config.id] = {
                        certificates_client: {
                            crt: (config.encryption === "open")
                                ? "no certificates on open servers"
                                : "",
                            pfx: (config.encryption === "open")
                                ? "no certificates on open servers"
                                : ""
                        },
                        config: config,
                        ports: config.ports,
                        sockets: []
                    };
                    vars.data_store.server[config.id] = {
                        server_certs: null,
                        server_object: {
                            open: null,
                            secure: null
                        },
                        sockets_tcp: {
                            open: [],
                            secure: []
                        }
                    };
                    // 2. save server data
                    if (config.single_socket === true || config.temporary === true) {
                        complete("config");
                    } else {
                        save(function services_serverCreate_writeConfig():void {
                            complete("config");
                        }, "servers-web");
                    }
                } else {
                    log.application({
                        error: new Error(),
                        message: "Server already exists.  Called on library server_create.",
                        origin: output.hash,
                        section: "servers-web",
                        status: "error",
                        time: Date.now()
                    });
                    return;
                }
                // 3. create server's directory structure
                mkdir(path_assets);
                mkdir(path_certs);
            } else {
                services_serverCreate(data, callback, dashboard);
            }
        },
        digest: "hex",
        hash_input_type: "direct",
        section: "servers-web",
        source: String(Date.now()) + String(Math.random()) + vars.os.main.os.hostname
    });
};

export default server_create;
