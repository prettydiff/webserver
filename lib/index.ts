
import server from "./transmit/server.js";
import server_create from "./commands/server_create.js";
import startup from "./utilities/startup.js";
import vars from "./utilities/vars.js";

startup(function index():void {
    const default_server = function index_defaultServer(name:string):server {
        const path_servers:string = `${vars.path.project}servers${vars.sep}`,
            path_name:string = path_servers + name + vars.sep;
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
            callback = function index_start_serverCallback():void {
                count = count + 1;
                if (count === total) {
                    const logs:string[] = [
                            "Web Servers started.",
                            "",
                            "Ports:",
                        ],
                        logItem = function index_start_serverCallback_logItem(name:string, encryption:"open"|"secure"):void {
                            const conflict:boolean = (vars.server_meta[name].status[encryption] === 0),
                                portNumber:number = (conflict === true)
                                    ? vars.servers[name].ports[encryption]
                                    : vars.server_meta[name].status[encryption],
                                portDisplay:string = (conflict === true)
                                    ? vars.text.angry + portNumber + vars.text.none
                                    : portNumber.toString(),
                                str:string = `${vars.text.angry}*${vars.text.none} ${name} - ${portDisplay}, ${encryption}`;
                            if (conflict === true) {
                                logs.push(`${str} (server offline due to port conflict or other server error)`);
                            } else {
                                logs.push(str);
                            }
                        };
                    servers.sort();
                    let items:number = 0;
                    do {
                        if (vars.servers[servers[items]].encryption === "both") {
                            logItem(servers[items], "open");
                            logItem(servers[items], "secure");
                        } else if (vars.servers[servers[items]].encryption === "open") {
                            logItem(servers[items], "open");
                        } else if (vars.servers[servers[items]].encryption === "secure") {
                            logItem(servers[items], "secure");
                        }
                        items = items + 1;
                    } while (items < servers.length);
                    // eslint-disable-next-line no-console
                    console.log(logs.join("\n"));
                }
            };
        let count:number = 0,
            index:number = 0;
        do {
            server(servers[index], callback);
            index = index + 1;
        } while (index < total);
    };
    if (vars.servers.dashboard === undefined) {
        server_create(default_server("dashboard"), function index_startDashboard():void {
            start();
        });
    } else {
        start();
    }
});