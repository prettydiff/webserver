
import demo from "../services/demo.ts";
import log from "../core/log.ts";
import message_handler from "./messageHandler.ts";
import message_inspection from "../services/message_inspection.ts";
import receiver from "./receiver.ts";
import send from "./send.ts";
import server_halt from "../server/server_halt.ts";
import socket_list_build from "./socket_list_build.ts";
import vars from "../core/vars.ts";

const socket_extension = function transmit_socketExtension(config:config_websocket_extensions):void {
    const encryption:type_encryption = (config.socket.secure === true)
        ? "secure"
        : "open";
    // permit if the socket is not already created
    if (vars.data_store.server[config.server].sockets_tcp[encryption].includes(config.socket) === false) {
        const now:number = Date.now(),
            ping = function transmit_socketExtension_ping(ttl:number, callback:(err:node_error, roundtrip:bigint) => void):void {
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
            encryption:"open"|"secure" = (config.socket.secure === true)
                ? "secure"
                : "open",
            socket:supplemental_socket_application_tcp = {
                address: config.socket.addresses,
                encrypted: (config.socket.encrypted === true),
                hash: config.identifier,
                proxy: (config.proxy === undefined || config.proxy === null)
                    ? null
                    : config.proxy.hash,
                role: config.role,
                server_id: config.server,
                server_name: vars.data.server[config.server].config.name,
                time: now,
                type: config.type,
                userAgent: config.userAgent
            },
            log_config:config_log = {
                error: null,
                message: `Socket ${config.identifier} opened.`,
                origin: config.server,
                section: "sockets-application-tcp",
                status: "informational",
                time: now
            },
            end = function transmit_socketExtension_end(socket:websocket_client, error:node_error):void {
                const address_local:string = (socket.addresses.local.address.includes(":") === true)
                        ? `[${socket.addresses.local.address}]:${socket.addresses.local.port}`
                        : `${socket.addresses.local.address}:${socket.addresses.local.port}`,
                    address_remote:string = (socket.addresses.remote.address.includes(":") === true)
                        ? `[${socket.addresses.remote.address}]:${socket.addresses.remote.port}`
                        : `${socket.addresses.remote.address}:${socket.addresses.remote.port}`,
                    payload_log:config_log = {
                        error: error,
                        message: `Socket type ${socket.type} with id ${socket.hash} from ${address_local} to ${address_remote} ended.`,
                        origin: socket.server_hash,
                        section: "sockets-application-tcp",
                        status: "error",
                        time: Date.now()
                    },
                    encryption:"open"|"secure" = (socket.encrypted === true)
                        ? "secure"
                        : "open";
                let index:number = vars.data_store.server[socket.server_hash].sockets_tcp[encryption].length;

                // kill any associated demo instances
                demo.kill(socket.hash, null);

                // remove actual socket object from storage
                if (index > 0) {
                    do {
                        index = index - 1;
                        if (vars.data_store.server[socket.server_hash].sockets_tcp[encryption][index].hash === socket.hash) {
                            vars.data_store.server[socket.server_hash].sockets_tcp[encryption].splice(index, 1);
                        } else if (
                            socket.proxy !== null &&
                            vars.data_store.server[socket.server_hash].sockets_tcp[encryption][index].proxy !== null &&
                            vars.data_store.server[socket.server_hash].sockets_tcp[encryption][index].proxy.hash === socket.proxy.hash &&
                            socket.type !== "test-performance-socket"
                        ) {
                            vars.data_store.server[socket.server_hash].sockets_tcp[encryption].splice(index, 1);
                            socket.proxy.destroy();
                        }
                    } while (index > 0);
                }

                // remove socket data from socket storage
                index = vars.data.sockets_tcp.length;
                if (index > 0) {
                    do {
                        index = index - 1;
                        if (vars.data.sockets_tcp[index].hash === socket.hash) {
                            vars.data.sockets_tcp.splice(index, 1);
                            break;
                        }
                    } while (index > 0);
                }

                // remove socket data from server specific socket storage
                index = vars.data.server[socket.server_hash].sockets.length;
                if (index > 0) {
                    do {
                        index = index - 1;
                        if (socket.hash === vars.data.server[socket.server_hash].sockets[index].hash) {
                            vars.data.server[socket.server_hash].sockets.splice(index, 1);
                            break;
                        }
                    } while (index > 0);

                    // kill off an unused demo dashboard
                    if (vars.options.demo === true && vars.data.server[socket.server_hash].sockets.length < 1 && socket.type !== "http-get") {
                        setTimeout(function transmit_socketExtension_demoKill():void {
                            if (vars.data.server[socket.server_hash].sockets.length < 1) {
                                process.exit(0);
                            }
                        }, 5000);
                    } 
                }

                if (vars.data.server[socket.server_hash].config.id === vars.id.dashboard_server && socket.type === "dashboard") {
                    const payload:services_message_inspection = {
                        count: 0,
                        direction: "in",
                        maximum_size: 0,
                        message: "",
                        service: "",
                        throttle_size: 0,
                        throttle_time: 0,
                        type: "web-server"
                    };
                    message_inspection.set({
                        data: payload,
                        service: "services_message_inspection"
                    }, {
                        socket: socket,
                        type: "ws"
                    });
                }

                if (socket.type === "test-performance-socket" && error !== null && error !== undefined) {
                    const message:string = JSON.stringify(error),
                        output:services_test_performance_output = {
                            frame_body_size: 0,
                            memory: {
                                average: 0,
                                max: 0,
                                min: 0,
                                trials: [],
                                variance: 0
                            },
                            message_size: 0,
                            roundtrip: {
                                average: 0,
                                max: 0,
                                min: 0,
                                trials: [],
                                variance: 0
                            },
                            send: {
                                average: 0,
                                max: 0,
                                min: 0,
                                trials: [],
                                variance: 0
                            },
                            summary: (message === "{}")
                                ? error.message
                                : JSON.stringify(error),
                            quantity_tests: 0,
                            quantity_transmit: 0,
                            time: 0,
                            type: "websocket"
                        };
                    send({
                        data: output,
                        service: "services_test_performance_output"
                    }, socket.proxy, 3);
                }

                log.application(payload_log);
                socket.destroy();
                socket_list_build();
            },
            end_close = function transmit_socketExtension_endError(this:websocket_client):void {
                // eslint-disable-next-line @typescript-eslint/no-this-alias
                const socket:websocket_client = this;
                end(socket, null);
            },
            end_error = function transmit_socketExtension_endError(this:websocket_client, error:node_error):void {
                // eslint-disable-next-line @typescript-eslint/no-this-alias
                const socket:websocket_client = this;
                end(socket, error);
            };
        config.socket.server_hash = config.server; // identifies which local server the given socket is connected to
        config.socket.segmentation = vars.data.server[config.server].config.message_segmentation; // maximum size of a WebSocket message frame body
        config.socket.hash = config.identifier;    // assigns a unique identifier to the socket based upon the socket's credentials
        config.socket.proxy = config.proxy;        // assigns the relationship between a socket and its proxy, if any
        config.socket.role = config.role;          // assigns socket creation location
        config.socket.time = now;                  // socket creation time
        config.socket.type = config.type;          // a classification identifier to functionally identify a common utility of sockets on a given server
        config.socket.userAgent = config.userAgent;// Attempts to describe the socket by originating OS and browser name/version
        if (config.type === "test-websocket" || config.proxy === null) {
            config.socket.handler = (config.handler === message_handler.default)
                ? (message_handler[config.server] === undefined)
                    ? config.handler
                    : message_handler[config.server]
                : config.handler;   // assigns an event handler to process incoming messages
            if (config.type !== "http") {
                if (config.socket.handler !== null && config.socket.handler !== undefined) {
                    config.socket.on("data", receiver);
                }
                config.socket.buffer = Buffer.from([]);   // stores a growing payload
                config.socket.fragments = [];             // stores completed frame payloads, which may be fragments of a larger message
                config.socket.frame = null;               // stores last received data frame header
                config.socket.ping = ping;                // provides a means to insert a ping control frame and measure the round trip time of the returned pong frame
                config.socket.pong = {};                  // stores termination times and callbacks for pong handling
                config.socket.queue = [];                 // stores messages for transmit, because websocket protocol cannot intermix messages
                config.socket.queue_index = 0;            // indicates current position in message queue
            }
            config.socket.status = "open"; // sets the status flag for the socket
            if (config.single_socket === true) {
                const death = function transmit_socketExtension_death(this:websocket_client):void {
                    this.destroy();
                    server_halt({
                        action: "destroy",
                        server: vars.data.server[this.server_hash].config
                    }, null);
                };
                config.socket.on("close", death);
                config.socket.on("end", death);
                config.socket.on("error", death);
            } else {
                config.socket.on("close", end_close);
                config.socket.on("end", end_close);
                config.socket.on("error", end_error);
            }
        } else {
            config.socket.on("close", end_close);
            config.socket.on("end", end_close);
            config.socket.on("error", end_error);
        }
        if (config.callback !== null && config.callback !== undefined) {
            config.callback(config.socket, config.timeout);
        }
        if (config.proxy !== null && config.proxy !== undefined) {
            let index:number = vars.data.sockets_tcp.length;
            if (index > 0) {
                do {
                    index = index - 1;
                    if (vars.data.sockets_tcp[index].hash === socket.proxy) {
                        vars.data.sockets_tcp[index].proxy = config.identifier;
                        break;
                    }
                } while (index > 0);
            }
        }
        vars.data_store.server[config.server].sockets_tcp[encryption].push(config.socket);
        vars.data.sockets_tcp.push(socket);
        vars.data.server[config.server].sockets.push(socket);
        socket_list_build();
        log.application(log_config);
    }
};

export default socket_extension;