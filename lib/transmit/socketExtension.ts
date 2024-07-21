
import error from "../utilities/error.js";
import getAddress from "../utilities/getAddress.js";
import getSocket from "./getSocket.js";
import receiver from "./receiver.js";
import send from "./send.js";
import store from "./store.js";
import vars from "../utilities/vars.js";

const socket_extension = function transmit_socketExtension(config:config_websocket_extensions):void {
    // permit if the socket is not already created
    if (getSocket(config.type, config.identifier) === null) {
        const ping = function transmit_socketExtension_ping(ttl:number, callback:(err:node_error, roundtrip:bigint) => void):void {
                const errorObject = function transmit_socketExtension_ping_errorObject(code:string, message:string):node_error {
                        const err:node_error = new Error();
                        err.code = code;
                        err.message = `${message} Socket type ${config.socket.type} and name ${config.socket.hash}.`;
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
            socketEnd = function transmit_socketExtension_socketEnd():void {
                config.socket.status = "end";
            },
            socketError = function transmit_socketExtension_socketError(errorMessage:node_error):void {
                if (vars.verbose === true) {
                    error([
                        `Error on socket of type ${config.socket.type} at location ${config.socket.role} with identifier ${config.socket.hash}.`,
                        JSON.stringify(errorMessage),
                        JSON.stringify(getAddress({
                            socket: config.socket,
                            type: "ws"
                        }))
                    ], null);
                }
            };
        config.socket.fragment = Buffer.from([]); // storehouse of complete data frames, which will comprise a frame header and payload body that may be fragmented
        config.socket.frame = Buffer.from([]);    // stores pieces of frames, which can be divided due to TLS decoding or header separation from some browsers
        config.socket.frameExtended = 0;          // stores the payload size of a given message payload as derived from the extended size bytes of a frame header
        config.socket.hash = config.identifier;   // assigns a unique identifier to the socket based upon the socket's credentials
        config.socket.handler = config.handler;   // assigns an event handler to process incoming messages
        config.socket.ping = ping;                // provides a means to insert a ping control frame and measure the round trip time of the returned pong frame
        config.socket.pong = {};                  // stores termination times and callbacks for pong handling
        config.socket.queue = [];                 // stores messages for transmit, because websocket protocol cannot intermix messages
        config.socket.role = config.role;         // assigns socket creation location
        config.socket.setKeepAlive(true, 0);      // standard method to retain socket against timeouts from inactivity until a close frame comes in
        config.socket.status = "open";            // sets the status flag for the socket
        config.socket.type = config.type;         // assigns the type name on the socket
        config.socket.on("close", socketEnd);
        config.socket.on("data", receiver);
        config.socket.on("end", socketEnd);
        config.socket.on("error", socketError);
        if (store[config.type] === undefined) {
            store[config.type] = {};
        }
        store[config.type][config.identifier] = config.socket;
        if (config.callback !== null && config.callback !== undefined) {
            config.callback(config.socket);
        }
    }
};

export default socket_extension;