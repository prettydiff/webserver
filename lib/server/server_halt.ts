
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
            path_name:string = vars.path.servers + id + vars.path.sep,
            encryption:type_encryption = vars.data.server[id].config.encryption,
            complete = function services_serverHalt_complete():void {
                const actionText:string = (data.action.charAt(data.action.length - 1) === "e")
                    ? `${data.action}d`
                    : `${data.action}ed`;
                if (vars.environment.features["ports-application"] === true) {
                    ports_application();
                }
                if (callback !== null) {
                    // 5. call the callback
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
            write_callback = function services_serverHalt_writeCallback():void {
                const activate = function servers_serverHalt_activate():void {
                        if (vars.data.server[id].config.activate === true) {
                            // 4. Reactivate the server(s) if its given "activate" property has a true boolean value
                            server_start(data.server.id, function servers_serverHalt_complete_serverStart():void {
                                complete();
                            });
                        } else {
                            complete();
                        }
                    };
                if (data.action === "deactivate") {
                    complete();
                } else if (data.action === "destroy") {
                    const  file_remove:config_file_remove = {
                        callback: function services_serverHalt_remove():void {
                            complete();
                        },
                        exclusions: [],
                        location: path_name,
                        section: "servers-web"
                    };
                    delete vars.data.server[id];
                    // 3. Remove the web server's assets from the file system
                    file.remove(file_remove);
                } else if (data.action === "modify" && (encryption === "both" || encryption === "secure")) {
                    vars.data.server[id].config = data.server;
                    server_start(data.server.id, function services_serverHalt_certificate_serverStart():void {
                        activate();
                    });
                } else {
                    activate();
                }
            },
            kill_sockets = function servers_serverHalt_killSockets(sockets:websocket_client[]):void {
                let index:number = sockets.length;
                if (index > 0) {
                    do {
                        index = index - 1;
                        sockets[index].destroy();
                    } while (index > 0);
                }
            },
            close_server = function servers_serverHalt_closeServer():void {
                count_server = count_server + 1;
                if (count_server > 1) {
                    if (data.action === "destroy" || data.action === "modify") {
                        if (data.action === "modify") {
                            vars.data.server[id].config = data.server;
                            vars.data.server[id].ports = {
                                open: 0,
                                secure: 0
                            };
                            save(write_callback, "servers-web");
                        } else {
                            delete vars.data.server[id];
                            delete vars.data_store.server[id];
                            if (vars.options.demo === true) {
                                complete();
                            } else {
                                file.remove({
                                    callback: function server_serverHalt_delete():void {
                                        save(write_callback, "servers-web");
                                    },
                                    exclusions: null,
                                    location: vars.path.servers + id,
                                    section: "servers-web"
                                });
                            }
                        }
                    } else {
                        write_callback();
                    }
                }
            };
        let count_server:number = 0;
        
        if (single_socket === true || temporary === true) {
            data.action = "destroy";
        }

        // 1. Disable the servers and kill their sockets
        if (vars.options.demo === true) {
            count_server = 1;
            close_server();
        } else {
            if (encryption === "both") {
                if (vars.data_store.server[id].server_object.open !== null) {
                    vars.data.server[id].ports.open = 0;
                    kill_sockets(vars.data_store.server[id].sockets_tcp.open);
                    vars.data_store.server[id].server_object.open.close(close_server);
                }
                if (vars.data_store.server[id].server_object.secure !== null) {
                    vars.data.server[id].ports.secure = 0;
                    kill_sockets(vars.data_store.server[id].sockets_tcp.secure);
                    vars.data_store.server[id].server_object.secure.close(close_server);
                }
            } else {
                count_server = 1;
                vars.data.server[id].ports[encryption] = 0;
                kill_sockets(vars.data_store.server[id].sockets_tcp[encryption]);
                vars.data_store.server[id].server_object[encryption].close(close_server);
            }
        }
    }
};

export default server_halt;