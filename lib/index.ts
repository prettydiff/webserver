
import port_map from "./utilities/port_map.js";
import server from "./transmit/server.js";
import server_create from "./services/server_create.js";
import startup from "./utilities/startup.js";
import vars from "./utilities/vars.js";

startup(function index():void {
    const default_server = function index_defaultServer(name:string):configuration_server {
        return {
            activate: true,
            domain_local: [
                "localhost",
                "127.0.0.1",
                "::1"
            ],
            encryption: "both",
            name: name,
            ports: {
                open: 0,
                secure: 0
            },
            redirect_internal: {
                "localhost": {
                    "/lib/assets/*": "/lib/dashboard/*"
                }
            }
        };
    },
    start = function index_start():void {
        const servers:string[] = Object.keys(vars.servers),
            total:number = servers.length,
            callback = function index_start_serverCallback():void {
                count = count + 1;
                if (count === total) {
                    const logs:string[] = [
                            "Web Servers started.",
                            "",
                            "Ports:",
                        ],
                        logItem = function index_start_serverCallback_logItem(name:string, encryption:"open"|"secure"):void {
                            const conflict:boolean = (vars.servers[name].status[encryption] === 0),
                                portNumber:number = (conflict === true)
                                    ? vars.servers[name].config.ports[encryption]
                                    : vars.servers[name].status[encryption],
                                portDisplay:string = (conflict === true)
                                    ? vars.text.angry + portNumber + vars.text.none
                                    : portNumber.toString(),
                                str:string = `${vars.text.angry}*${vars.text.none} ${name} - ${portDisplay}, ${encryption}`;
                            if (conflict === true) {
                                if (portNumber < 1025) {
                                    logs.push(`${str} (Server offline, typically due to insufficient access for reserved port or port conflict.)`);
                                } else {
                                    logs.push(`${str} (Server offline, typically due to port conflict.)`);
                                }
                            } else {
                                logs.push(str);
                            }
                        };
                    servers.sort();
                    let items:number = 0;
                    do {
                        if (vars.servers[servers[items]].config.encryption === "both") {
                            logItem(servers[items], "open");
                            logItem(servers[items], "secure");
                        } else if (vars.servers[servers[items]].config.encryption === "open") {
                            logItem(servers[items], "open");
                        } else if (vars.servers[servers[items]].config.encryption === "secure") {
                            logItem(servers[items], "secure");
                        }
                        items = items + 1;
                    } while (items < servers.length);
                    // eslint-disable-next-line no-console
                    console.log(logs.join("\n"));
                    setTimeout(function index_start_serverCallback_portMap():void {
                        port_map(null, null, function index_start_serverCallback_portMap_recurse():void {
                            setTimeout(index_start_serverCallback_portMap, 10000);
                        });
                    }, 10000);
                }
            };
        let count:number = 0,
            index:number = 0;
        do {
            server({
                action: "activate",
                configuration: vars.servers[servers[index]].config
            }, callback);
            index = index + 1;
        } while (index < total);
    };
    if (vars.servers.dashboard === undefined) {
        server_create({
            action: "add",
            configuration: default_server("dashboard")
        }, function index_startDashboard():void {
            start();
        });
    } else {
        start();
    }
});
