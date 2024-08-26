
import vars from "../utilities/vars.js";

const socket_end = function transmit_socketEnd(socket_input:websocket_client):void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const socket:websocket_client = (typeof socket_input === "object")
            ? socket_input
            // eslint-disable-next-line @typescript-eslint/no-this-alias, no-restricted-syntax
            : this,
        list:type_socket_source = socket.server;
    let index:number = list.length;
    socket.status = "end";
    do {
        index = index - 1;
        if (vars.sockets[list][index] === socket) {
            vars.sockets[list].splice(index, 1);
            break;
        }
    } while (index > 0);
    socket.destroy();
    if (socket.proxy !== null) {
        socket.proxy.destroy();
    }
};

export default socket_end;