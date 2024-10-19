
import read_certs from "./utilities/read_certs.js";
import server from "./transmit/server.js";
import server_create from "./commands/server_create.js";
import startup from "./utilities/startup.js";
import vars from "./utilities/vars.js";

startup(function index():void {
    const default_server = function index_defaultServer(name:string):server {
        const path_servers:string = `${vars.path.project}servers${vars.sep}`,
            path_name:string = path_servers + name + vars.sep,
            path_assets:string = `${path_name}assets${vars.sep}`,
            path_certs:string = `${path_name}certs${vars.sep}`;
        return {
            activate: true,
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
    },
    start = function index_start():void {
        const servers:string[] = Object.keys(vars.servers),
            total:number = servers.length,
            portList:store_ports = {},
            config:config_websocket_server = {
                callback: function index_start_serverCallback(name:string, secure:"open"|"secure"):void {
                    const encryption:type_encryption = vars.servers[name].encryption;
                    count = count + 1;
                    if (portList[name] === undefined) {
                        if (encryption === "both") {
                            portList[name] = {
                                open: 0,
                                secure: 0
                            };
                        } else if (encryption === "open") {
                            portList[name] = {
                                open: 0
                            };
                        } else if (encryption === "secure") {
                            portList[name] = {
                                secure: 0
                            };
                        }
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
                            if (vars.servers[keys[ports]].encryption === "both") {
                                logs.push(`${vars.text.angry}*${vars.text.none} ${portList[keys[ports]].open} - ${keys[ports]}, open`);
                                logs.push(`${vars.text.angry}*${vars.text.none} ${portList[keys[ports]].secure} - ${keys[ports]}, secure`);
                            } else if (vars.servers[keys[ports]].encryption === "open") {
                                logs.push(`${vars.text.angry}*${vars.text.none} ${portList[keys[ports]].open} - ${keys[ports]}, open`);
                            } else if (vars.servers[keys[ports]].encryption === "secure") {
                                logs.push(`${vars.text.angry}*${vars.text.none} ${portList[keys[ports]].secure} - ${keys[ports]}, secure`);
                            }
                            ports = ports + 1;
                        } while (ports < keys.length);
                        
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
});