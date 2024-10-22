
import vars from "../utilities/vars.js";

const socket_end = function transmit_socketEnd(socket_input:websocket_client):void {
    const socket:websocket_client = (typeof socket_input === "object")
            ? socket_input
            // eslint-disable-next-line no-restricted-syntax
            : this,
        encryption:"open"|"secure" = (socket.secure === true)
            ? "secure"
            : "open",
        list:string = socket.server;
    let index:number = list.length;
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
};

export default socket_end;