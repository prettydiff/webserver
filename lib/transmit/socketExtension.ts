
import get_address from "../utilities/getAddress.js";
import log from "../utilities/log.js";
import message_handler from "./messageHandler.js";
import receiver from "./receiver.js";
import send from "./send.js";
import server_halt from "../services/server_halt.js";
import socket_end from "./socketEnd.js";
import vars from "../utilities/vars.js";

const socket_extension = function transmit_socketExtension(config:config_websocket_extensions):void {
    const encryption:type_encryption = (config.socket.secure === true)
        ? "secure"
        : "open";
    // permit if the socket is not already created
    if (vars.server_meta[config.server].sockets[encryption].includes(config.socket) === false) {
        const ping = function transmit_socketExtension_ping(ttl:number, callback:(err:node_error, roundtrip:bigint) => void):void {
                const errorObject = function transmit_socketExtension_ping_errorObject(code:string, message:string):node_error {
                        const err:node_error = new Error();
                        err.code = code;
                        err.message = `${message} Socket ${config.socket.hash} and name ${config.socket.hash}.`;
                        return err;
                    };
                if (config.socket.status !== "open") {
                    callback(errorObject("ECONNABORTED", "Ping error on websocket without 'open' status."), null);
                } else {
                    const nameSlice:string = config.socket.hash.slice(0, 125);
                    // send ping
                    send(Buffer.from(nameSlice), config.socket, 9);
                    config.socket.pong[nameSlice] = {
                        callback: callback,
                        start: process.hrtime.bigint(),
                        timeOut: setTimeout(function transmit_socketExtension_ping_delay():void {
                            callback(config.socket.pong[nameSlice].timeOutMessage, null);
                            delete config.socket.pong[nameSlice];
                        }, ttl),
                        timeOutMessage: errorObject("ETIMEDOUT", "Ping timeout on websocket."),
                        ttl: BigInt(ttl * 1e6)
                    };
                }
            },
            socketError = function transmit_socketExtension_socketError(errorMessage:node_error):void {
                // eslint-disable-next-line @typescript-eslint/no-this-alias, no-restricted-syntax
                const socket:websocket_client = this;
                socket_end(socket, errorMessage);
            },
            encryption:"open"|"secure" = (config.socket.secure === true)
                ? "secure"
                : "open",
            socket:services_socket = {
                address: get_address({
                    socket: config.socket,
                    type: "ws"
                }),
                encrypted: (config.socket.encrypted === true),
                hash: config.identifier,
                proxy: (config.socket.proxy === undefined || config.socket.proxy === null)
                    ? null
                    : config.socket.proxy.hash,
                role: config.role,
                server: config.server,
                type: config.type
            },
            log_config:config_log = {
                action: "add",
                config: socket,
                message: `Socket ${config.identifier} opened on ${encryption} server ${config.server}.`,
                status: "success",
                type: "socket"
            };
        vars.server_meta[config.server].sockets[encryption].push(config.socket);
        vars.servers[config.server].sockets.push(socket);
        if (config.proxy === null) {
            config.socket.handler = (config.handler === message_handler.default)
                ? (message_handler[config.server] === undefined)
                    ? config.handler
                    : message_handler[config.server]
                : config.handler;   // assigns an event handler to process incoming messages
            config.socket.on("data", receiver);
            config.socket.fragment = Buffer.from([]); // storehouse of complete data frames, which will comprise a frame header and payload body that may be fragmented
            config.socket.frame = Buffer.from([]);    // stores pieces of frames, which can be divided due to TLS decoding or header separation from some browsers
            config.socket.frameExtended = 0;          // stores the payload size of a given message payload as derived from the extended size bytes of a frame header
            config.socket.ping = ping;                // provides a means to insert a ping control frame and measure the round trip time of the returned pong frame
            config.socket.pong = {};                  // stores termination times and callbacks for pong handling
            config.socket.queue = [];                 // stores messages for transmit, because websocket protocol cannot intermix messages
            config.socket.status = "open";            // sets the status flag for the socket
            if (config.type.indexOf("dashboard-terminal-") !== 0) {
                if (config.temporary === true) {
                    const temporary = function transmit_socketExtension_temporary():void {
                        // eslint-disable-next-line @typescript-eslint/no-this-alias, no-restricted-syntax
                        const socket:websocket_client = this;
                        server_halt({
                            action: "destroy",
                            configuration: vars.servers[socket.server].config
                        }, null);
                    };
                    config.socket.on("close", temporary);
                    config.socket.on("end", temporary);
                    config.socket.on("error", temporary);
                } else {
                    config.socket.on("close", socket_end);
                    config.socket.on("end", socket_end);
                    config.socket.on("error", socketError);
                }
            }
        } else {
            config.socket.on("close", socket_end);
            config.socket.on("end", socket_end);
            config.socket.on("error", socketError);
        }
        config.socket.setKeepAlive(true, 0);      // standard method to retain socket against timeouts from inactivity until a close frame comes in
        config.socket.server = config.server;     // identifies which local server the given socket is connected to
        config.socket.hash = config.identifier;   // assigns a unique identifier to the socket based upon the socket's credentials
        config.socket.proxy = config.proxy;       // stores the relationship between two sockets when they are piped as a proxy
        config.socket.role = config.role;         // assigns socket creation location
        config.socket.type = config.type;         // a classification identifier to functionally identify a common utility of sockets on a given server
        if (config.callback !== null && config.callback !== undefined) {
            config.callback(config.socket);
        }
        log(log_config);
    }
};

export default socket_extension;