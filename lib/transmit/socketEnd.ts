
import log from "../utilities/log.js";
import vars from "../utilities/vars.js";

const socket_end = function transmit_socketEnd(socket_input:websocket_client, errorMessage?:node_error):void {
    let index:number = 0;
    const socket:websocket_client = (typeof socket_input === "object")
            ? socket_input
            // eslint-disable-next-line no-restricted-syntax
            : this,
        encryption:"open"|"secure" = (socket.secure === true)
            ? "secure"
            : "open",
        list:string = socket.server,
        log_config:config_log = (errorMessage === null || errorMessage === undefined)
            ? {
                action: "destroy",
                config: vars.servers[socket.server],
                message: `Socket ${socket.hash} closed on ${encryption} server ${socket.server}.`,
                status: "success",
                type: "socket"
            }
            : {
                action: (socket.closed === true)
                    ? "destroy"
                    : null,
                config: errorMessage,
                message: `Error on socket ${socket.hash} at location ${socket.role} with server ${socket.server}.`,
                status: "error",
                type: "socket"
            },
        sockets:services_socket[] = vars.servers[socket.server].sockets;
    index = sockets.length;
    if (index > 0) {
        do {
            index = index - 1;
            if (sockets[index].hash === socket.hash) {
                log_config.config = sockets[index];
                sockets.splice(index, 1);
            }
        } while (index > 0);
    }
    index = list.length;
    socket.status = "end";
    do {
        index = index - 1;
        if (vars.server_meta[socket.server].sockets[encryption][index] === socket) {
            vars.server_meta[socket.server].sockets[encryption].splice(index, 1);
            break;
        }
    } while (index > 0);
    socket.destroy();
    if (socket.proxy !== null) {
        socket.proxy.destroy();
    }
    log(log_config);
};

export default socket_end;