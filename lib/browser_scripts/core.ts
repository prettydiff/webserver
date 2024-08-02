
import dom from "./dom.js";

const core = function core(socket_type:socket_type, open:() => void, message:(event:websocket_event) => void):WebSocket {
    const port:string = (location.protocol === "http:")
            ? "80"
            : "443",
        address:string = (location.host.includes(":") === true)
            ? location.origin
            : `${location.origin}:${port}`,
        socket:WebSocket = new WebSocket(address, [socket_type]);
    dom();
    socket.onmessage = message;
    socket.onopen = open;
    return socket;
};

export default core;