
import create_socket from "../transmit/createSocket.js";

const http_connect:http_action = function http_connect(headerList:string[], socket:websocket_client, type_server:string):void {
    const destination:string = headerList[0].replace(/\s+/g, " ").split(" ")[1],
        index_colon:number = destination.lastIndexOf(":"),
        index_brace:number = destination.lastIndexOf("]"),
        portString:string = (index_colon > 0 && (index_brace < 0 || (index_brace > 0 && index_brace < index_colon)))
            ? destination.slice(index_colon + 1)
            : "",
        ip:string = (portString === "")
            ? destination
            : destination.split(`:${portString}`)[0],
        callback = function http_connect_callback(proxy:websocket_client):void {
            const close = function http_connect_callback_close():void {
                proxy.destroy();
                socket.destroy();
            };
            proxy.pipe(socket);
            socket.pipe(proxy);
            proxy.on("close", close);
            socket.on("close", close);
        };
    create_socket({
        callback: callback,
        handler: null,
        hash: `${type_server}-connect-${process.hrtime.bigint().toString()}`,
        ip: ip,
        port: (isNaN(Number(portString)) === true)
            ? (socket.encrypted === true)
                ? 443
                : 80
            : Number(portString),
        headers: [],
        proxy: socket,
        resource: null,
        secure: (socket.encrypted === true)
    });
};

export default http_connect;