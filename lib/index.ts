
import certificate from "./commands/certificate.js";
import error from "./utilities/error.js";
import log from "./utilities/log.js";
import read_certs from "./utilities/read_certs.js";
import server from "./transmit/server.js";
import server_create from "./commands/server_create.js";
import server_halt from "./commands/server_halt.js";
import startup from "./utilities/startup.js";
import vars from "./utilities/vars.js";
import yt_config from "./commands/yt_config.js";

startup(function index():void {
    const default_server = function index_defaultServer(name:string):server {
        const path_servers:string = `${vars.path.project}servers${vars.sep}`,
            path_name:string = path_servers + name + vars.sep,
            path_assets:string = `${path_name}assets${vars.sep}`,
            path_certs:string = `${path_name}certs${vars.sep}`;
        return {
            block_list: {
                host: [],
                ip: [],
                referrer: []
            },
            domain_local: [
                "localhost",
                "127.0.0.1",
                "::1"
            ],
            encryption: "both",
            http: {
                delete: "",
                post: "",
                put: ""
            },
            name: name,
            path: {
                certificates: path_certs,
                storage: path_assets,
                web_root: (name === "dashboard")
                    ? `${vars.path.project}lib${vars.sep}dashboard${vars.sep}`
                    : path_assets
            },
            ports: {
                open: 0,
                secure: 0
            },
            redirect_domain: {
                "": ["", 0]
            },
            redirect_internal: {
                "": {
                    "": ""
                }
            }
        };
    };
    if  (vars.command === "create_server" || vars.command === "delete_server" || vars.command === "certificate" || vars.command === "yt_config") {
        // create_server command
        const name:string = process.argv[3];
        if (name === undefined) {
            error([
                "Server name not specified.",
                `Example: ${vars.text.cyan}npm run create_server my_server${vars.text.none}`
            ], null, true);
            return;
        }
        if (vars.command === "create_server") {
            server_create(default_server(name), false, function index_serverCreateCallback():void {
                log([`
                    Server ${name} created with default values.`,
                    "Edit the config.json file to customize."
                ], true);
            });
        } else {
            if (vars.servers[name] === undefined) {
                error([
                    `Server ${name} does not exist in the config.json file.`
                ], null, true);
                return;
            }
            if (vars.command === "delete_server") {
                server_halt(vars.servers[name], "destroy", function index_serverHaltCallback():void {
                    log([`Server ${name} deleted.`], true);
                });
            } else if (vars.command === "certificate") {
                certificate({
                    callback: function index_certificate():void {
                        log(["Certificates created."], true);
                    },
                    days: 65535,
                    domain_default: vars.servers[name].domain_local[0],
                    name: name,
                    selfSign: false
                });
            } else if (vars.command === "yt_config") {
                yt_config(name, function index_ytConfig():void {
                    log(["yt-dlp scripts written."], true);
                });
            }
        }
    } else {
        const start = function index_start():void {
            const servers:string[] = Object.keys(vars.servers),
                total:number = servers.length,
                portList:store_ports = {},
                config:config_websocket_server = {
                    callback: function index_serverCallback(name:string, secure:"open"|"secure"):void {
                        count = count + 1;
                        if (portList[name] === undefined) {
                            portList[name] = {
                                open: 0,
                                secure: 0
                            };
                        }
                        portList[name][secure] = vars.servers[name].ports[secure];
                        if (count === callback_total) {
                            const logs:string[] = [
                                    "Web Servers started.",
                                    "",
                                    "Ports:",
                                ],
                                keys:string[] = Object.keys(portList);
                            keys.sort();
                            let ports:number = 0;
                            do {
                                logs.push(`${vars.text.angry}*${vars.text.none} ${portList[keys[ports]].open} - ${keys[ports]}, open`);
                                logs.push(`${vars.text.angry}*${vars.text.none} ${portList[keys[ports]].secure} - ${keys[ports]}, secure`);
                                ports = ports + 1;
                            } while (ports < keys.length);
                            log(logs, false);
                        }
                    },
                    name: "",
                    options: null
                };
            let count:number = 0,
                index:number = 0,
                callback_total:number = total;
            do {
                if (vars.servers[servers[index]].encryption === "open") {
                    config.options = null;
                    config.name = servers[index];
                    server(config);
                } else {
                    read_certs(servers[index], function index_readCerts(name:string, tlsOptions:transmit_tlsOptions):void {
                        config.options = tlsOptions;
                        config.name = name;
                        server(config);
                        if (vars.servers[name].encryption === "both") {
                            callback_total = callback_total + 1;
                            config.options = null;
                            config.name = name;
                            server(config);
                        }
                        index = index + 1;
                    });
                }
                index = index + 1;
            } while (index < total);
        };
        if (vars.servers.dashboard === undefined) {
            server_create(default_server("dashboard"), false, function index_startDashboard():void {
                start();
            });
        } else {
            start();
        }
    }
});