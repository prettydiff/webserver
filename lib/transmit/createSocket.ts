
import hash from "../utilities/hash.js";
import log from "../utilities/log.js";
import node from "../utilities/node.js";
import socket_extension from "./socketExtension.js";

const create_socket = function transmit_createSocket(config:config_websocket_create):void {
    if (config.ip === "") {
        // an empty string defaults to loopback, which creates an endless feedback loop
        return;
    }
    hash({
        algorithm: "sha1",
        callback: function transmit_createSocket_hash(hashOutput:hash_output):void {
            let a:number = 0;
            const len:number = config.headers.length,
                client:websocket_client = (config.secure === true)
                    ? node.tls.connect({
                        host: config.ip,
                        port: config.port,
                        rejectUnauthorized: false
                    }) as websocket_client
                    : node.net.connect({
                        host: config.ip,
                        port: config.port
                    }) as websocket_client,
                resource:string = (config.resource === null || config.resource === "" || config.resource === "/")
                    ? "GET / HTTP/1.1"
                    : config.resource,
                header:string[] = [
                    resource,
                    (config.ip.indexOf(":") > -1)
                        ? `Host: [${config.ip}]:${config.port}`
                        : `Host: ${config.ip}:${config.port}`,
                    "Upgrade: websocket",
                    "Connection: Upgrade",
                    "Sec-WebSocket-Version: 13",
                    `Sec-WebSocket-Key: ${hashOutput.hash}`,
                    `Sec-WebSocket-Protocol: ${config.type}`
                ],
                callbackError = function transmit_createSocket_hash_error(errorMessage:node_error):void {
                    log({
                        action: "add",
                        config: errorMessage,
                        message: `Error attempting websocket connect from client side on server. ${(config.proxy === null)
                            ? "Socket is not a proxy."
                            : `Socket is a proxy to ${config.proxy.hash} on server ${config.proxy.server}.`}`,
                        status: "error",
                        type: "socket"
                    });
                },
                callbackReady = function transmit_createSocket_hash_ready():void {
                    header.push("");
                    header.push("");
                    client.write(header.join("\r\n"));
                    client.once("data", function transmit_createSocket_hash_ready_data():void {
                        socket_extension({
                            callback: config.callback,
                            handler: config.handler,
                            identifier: config.hash,
                            proxy: config.proxy,
                            role: "client",
                            server: config.server,
                            socket: client,
                            temporary: false,
                            type: config.type
                        });
                    });
                };
            if (len > 0) {
                do {
                    header.push(config.headers[a]);
                    a = a + 1;
                } while (a < len);
            }
            client.once("error", callbackError);
            client.once("ready", callbackReady);
        },
        digest: "base64",
        hash_input_type: "direct",
        source: Buffer.from(Math.random().toString(), "base64").toString()
    });
};

export default create_socket;