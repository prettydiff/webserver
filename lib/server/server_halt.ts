
import file from "../utilities/file.ts";
import log from "../core/log.ts";
import ports_application from "../services/ports_application.ts";
import save from "../utilities/save.ts";
import server_start from "./server_start.ts";
import vars from "../core/vars.ts";

// 1. turn off active servers and delete their corresponding objects
// 2. kill all sockets on the server
// 3. delete vars.sockets[server]
// 4. delete server from vars.server
// 5. remove server's directory
// 6. modify the server
// 7. remove server data from save file
// 8. call the callback

const server_halt = function services_serverHalt(data:services_server_action, callback:() => void):void {
    const id:string = data.server.id;
    if (id === "" || (data.action === "destroy" && id === vars.id.dashboard_server)) {
        return;
    } 
    if (vars.data.server[id] === undefined) {
        log.application({
            error: new Error(),
            message: "Server does not exist.  Called on library server_halt.",
            origin: id,
            section: "servers-web",
            status: "error",
            time: Date.now()
        });
    } else {
        const single_socket:boolean = vars.data.server[id].config.single_socket,
            temporary:boolean = vars.data.server[id].config.temporary,
            encryption:type_encryption = vars.data.server[id].config.encryption,
            complete = function services_serverHalt_complete():void {
                const actionText:string = (data.action.charAt(data.action.length - 1) === "e")
                    ? `${data.action}d`
                    : `${data.action}ed`;
                if (vars.environment.features["ports-application"] === true) {
                    ports_application();
                }
                if (callback !== null) {
                    // 4. call the callback
                    callback();
                }
                log.application({
                    error: null,
                    message: `Server ${actionText}.`,
                    origin: id,
                    section: "servers-web",
                    status: "informational",
                    time: Date.now()
                });
            },
            kill_sockets = function servers_serverHalt_killSockets(encryption_sockets:"open"|"secure"):void {
                const sockets:websocket_client[] = vars.data_store.server[id].sockets_tcp[encryption_sockets];
                let index:number = sockets.length;
                if (index > 0) {
                    do {
                        index = index - 1;
                        sockets[index].destroy();
                    } while (index > 0);
                }
                vars.data_store.server[id].server_object[encryption_sockets].close(closed);
            },
            closed = function servers_serverHalt_closed():void {
                // 2. write changes to the servers.json file
                count_server = count_server + 1;
                if (count_server > 1) {
                    vars.data.server[id].ports = {
                        open: 0,
                        secure: 0
                    };
                    if (data.action === "deactivate") {
                        complete();
                    } else if (data.action === "destroy") {
                        delete vars.data.server[id];
                        delete vars.data_store.server[id];
                        if (vars.options.demo === true) {
                            complete();
                        } else {
                            file.remove({
                                callback: function server_serverHalt_closed_delete():void {
                                    save(complete, "servers-web");
                                },
                                exclusions: null,
                                location: vars.path.servers + id,
                                section: "servers-web"
                            });
                        }
                    } else if (data.action === "modify") {
                        const activate = function servers_serverHalt_closed_activate():void {
                            if (vars.data.server[id].config.activate === true) {
                                // 3. Reactivate the server(s) if its given "activate" property has a true boolean value
                                server_start(data.server.id, function servers_serverHalt_closed_activate_serverStart():void {
                                    complete();
                                });
                            } else {
                                complete();
                            }
                        };
                        vars.data.server[id].config = data.server;
                        if (vars.options.demo === true) {
                            complete();
                        } else {
                            save(activate, "servers-web");
                        }
                    }
                }
            };
        let count_server:number = 0;
        
        if (single_socket === true || temporary === true) {
            data.action = "destroy";
        }
        // 1. Disable the servers and kill their sockets
        if (encryption === "both") {
            if (vars.data_store.server[id].server_object.open !== null) {
                kill_sockets("open");
            }
            if (vars.data_store.server[id].server_object.secure !== null) {
                kill_sockets("secure");
            }
        } else {
            count_server = 1;
            kill_sockets(encryption);
        }
    }
};

export default server_halt;