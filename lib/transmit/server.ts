
import get_address from "../utilities/getAddress.js";
import hash from "../utilities/hash.js";
import http from "../http/index.js";
import log from "../utilities/log.js";
import message_handler from "./messageHandler.js";
import node from "../utilities/node.js";
import read_certs from "../utilities/read_certs.js";
import redirection from "./redirection.js";
import socket_extension from "./socketExtension.js";
import vars from "../utilities/vars.js";

const server = function transmit_server(name:string, callback:(name:string, secure:"open"|"secure") => void):void {
    const connection = function transmit_server_connection(TLS_socket:node_tls_TLSSocket):void {
            // eslint-disable-next-line no-restricted-syntax
            const server_name:string = this.name,
                server:server = vars.servers[server_name],
                socket:websocket_client = TLS_socket as websocket_client,
                handshake = function transmit_server_connection_handshake(data:Buffer):void {
                    let nonceHeader:string = null,
                        domain:string = "",
                        key:string = "",
                        referer:boolean = null,
                        type:string = "";
                    const dataString:string = data.toString("utf-8"),
                        headerIndex:number = dataString.indexOf("\r\n\r\n"),
                        headerString:string = (headerIndex > 0)
                            ? dataString.slice(0, headerIndex)
                            : dataString,
                        headerList:string[] = headerString.split("\r\n"),
                        testNonce:RegExp = (/^Sec-WebSocket-Protocol:\s*/),
                        address:transmit_addresses_socket = get_address({
                            socket: socket,
                            type: "ws"
                        }),
                        get_domain = function transmit_server_connection_handshake_getDomain(header:string, arrIndex:number, arr:string[]):void {
                            const hostName:string = header.toLowerCase().replace("host:", "").replace(/\s+/g, ""),
                                sIndex:number = hostName.indexOf("]"),
                                index:number = hostName.indexOf(":"),
                                host:string = (index > 0)
                                    ? hostName.slice(0, index)
                                    : hostName;
                            if (hostName.indexOf("[") === 0 && ((index > 4 && sIndex > 5) || hostName.indexOf("::") > -1)) {
                                domain = hostName.slice(1, sIndex);
                            } else {
                                domain = host.replace(`:${address.local.port}`, "");
                            }
                            // ensures HTTP requests pushed through the proxy are identified as originating from the proxy
                            if (server.domain_local.includes(domain) === false) {
                                arr[arrIndex] = (socket.encrypted === true)
                                    ? `Host: ${address.local.address}:${server.ports.secure}`
                                    : `Host: ${address.local.address}:${server.ports.open}`;
                            }
                        },
                        get_referer = function transmit_server_connection_handshake_getReferer(header:string):void {
                            const refererName:string = header.toLowerCase().replace(/referer:\s*/, "");
                            let index:number = server.block_list.referrer.length;
                            if (index > 0) {
                                do {
                                    index = index - 1;
                                    if (refererName.indexOf(server.block_list.referrer[index].toLowerCase()) === 0 || refererName.replace(/\w+:\/\//, "").indexOf(server.block_list.referrer[index].toLowerCase()) === 0) {
                                        referer = true;
                                        return;
                                    }
                                } while (index > 0);
                            }
                        },
                        headerEach = function transmit_server_connection_handshake_headerEach(header:string, arrIndex:number, arr:string[]):void {
                            if (header.indexOf("Sec-WebSocket-Key") === 0) {
                                key = header.slice(header.indexOf("-Key:") + 5).replace(/\s/g, "") + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
                            } else if (header.toLowerCase().indexOf("host:") === 0) {
                                get_domain(header, arrIndex, arr);
                            } else if (header.toLowerCase().indexOf("referer:") === 0) {
                                get_referer(header);
                            } else if (testNonce.test(header) === true) {
                                nonceHeader = header;
                                type = header.replace(testNonce, "");
                            }
                        },
                        local_service = function transmit_server_connection_handshake_localService():void {
                            if (server.redirect_internal[domain] !== undefined) {
                                data = redirection(domain, data, server_name) as Buffer;
                                headerList[0] = data.toString().split("\r\n")[0];
                            }
                            if (key === "") {
                                const http_action = function transmit_server_connection_handshake_httpAction():void {
                                    const method:type_http_method = headerList[0].slice(0, headerList[0].indexOf(" ")).toLowerCase() as type_http_method;
                                    if (http[method] !== undefined) {
                                        http[method](headerList, socket, headerIndex < 1
                                            ? null
                                            : data.slice(Buffer.byteLength(headerString))
                                        );
                                    } else {
                                        // at this time the local domain only supports HTTP GET method as everything else should use WebSockets
                                        socket.destroy();
                                    }
                                };
                                socket_extension({
                                    callback: http_action,
                                    handler: message_handler,
                                    identifier: `http-${process.hrtime.bigint().toString()}`,
                                    proxy: null,
                                    role: "server",
                                    server: server_name,
                                    socket: socket,
                                    type: type
                                });
                            } else {
                                // local domain websocket support
                                const callback = function transmit_server_connection_handshake_hash(hashOutput:hash_output):void {
                                    const client_respond = function transmit_server_connection_handshake_hash_clientRespond():void {
                                        const headers:string[] = [
                                                "HTTP/1.1 101 Switching Protocols",
                                                "Upgrade: websocket",
                                                "Connection: Upgrade",
                                                `Sec-WebSocket-Accept: ${hashOutput.hash}`,
                                                "Access-Control-Allow-Origin: *",
                                                "Server: webserver"
                                            ];
                                        if (nonceHeader !== null) {
                                            headers.push(nonceHeader);
                                        }
                                        headers.push("");
                                        headers.push("");
                                        socket.write(headers.join("\r\n"));
                                    };
                                    socket_extension({
                                        callback: client_respond,
                                        handler: message_handler,
                                        identifier: `browserSocket-${hashOutput.hash}`,
                                        proxy: null,
                                        role: "server",
                                        server: server_name,
                                        socket: socket,
                                        type: type
                                    });
                                };
                                hash({
                                    algorithm: "sha1",
                                    callback: callback,
                                    digest: "base64",
                                    hash_input_type: "direct",
                                    source: key
                                });
                            }
                        },
                        create_proxy = function transmit_server_connection_handshake_createProxy():void {
                            let count:number = 0;
                            const  address:transmit_addresses_socket = get_address({
                                    socket: socket,
                                    type: "ws"
                                }),
                                pair:[string, number] = ((socket.encrypted === true && server.redirect_domain[`${domain}.secure`] !== undefined))
                                    ? server.redirect_domain[`${domain}.secure`]
                                    : (server.redirect_domain[domain] === undefined)
                                        ? (socket.encrypted === true)
                                            ? [address.local.address, server.ports.secure]
                                            : [address.local.address, server.ports.open]
                                        : server.redirect_domain[domain],
                                host:string = (pair[0] === undefined || pair[0] === null || pair[0] === "")
                                    ? address.local.address
                                    : pair[0],
                                port:number = (typeof pair[1] === "number")
                                    ? pair[1]
                                    : (socket.encrypted === true)
                                        ? server.ports.secure
                                        : server.ports.open,
                                proxy:websocket_client = (socket.encrypted === true)
                                    ?  node.tls.connect({
                                        host: host,
                                        port: port,
                                        rejectUnauthorized: false
                                    }) as websocket_client
                                    : node.net.connect({
                                        host: host,
                                        port: port
                                    }) as websocket_client,
                                now:string = process.hrtime.bigint().toString(),
                                callback = function transmit_server_connection_handshake_createProxy_callback():void {
                                    count = count + 1;
                                    if (count > 1) {
                                        proxy.pipe(socket);
                                        if (server.redirect_internal[domain] === undefined) {
                                            socket.pipe(proxy);
                                            proxy.write(data);
                                        } else {
                                            // HTTP redirection support
                                            socket.on("data", function transmit_server_connection_handshake_createProxy_redirect(message:Buffer):void {
                                                proxy.write(redirection(domain, message, server_name));
                                            });
                                            proxy.write(redirection(domain, data, server_name));
                                        }
                                    }
                                };
                            // requested socket
                            socket_extension({
                                callback: callback,
                                handler: null,
                                identifier: `${domain}-${now}`,
                                proxy: proxy,
                                role: "server",
                                server: server_name,
                                socket: socket,
                                type: type
                            });
                            // proxy socket
                            socket_extension({
                                callback: callback,
                                handler: null,
                                identifier: `${domain}-${now}-proxy`,
                                proxy: socket,
                                role: "client",
                                server: server_name,
                                socket: proxy,
                                type: type
                            });
                        };
                    headerList.forEach(headerEach);

                    if (
                        referer === true ||
                        server.block_list.host.includes(domain) === true ||
                        server.block_list.ip.includes(address.remote.address) === true ||
                        (server.redirect_domain[domain] === undefined && server.domain_local.includes(domain) === false)
                    ) {
                        socket.destroy();
                    } else {
                        // do not proxy primary domain
                        if (server.domain_local.includes(domain) === true) {
                            local_service();
                        } else {
                            create_proxy();
                        }
                    }
                };
            socket.on("error", function transmit_server_connection_handshake_socketError(ers:node_error):void {
                // eslint-disable-next-line @typescript-eslint/no-this-alias, no-restricted-syntax
                const socket:websocket_client = this;
                log({
                    action: null,
                    config: ers,
                    message: `Error on socket ${socket.hash} of server ${socket.server}`,
                    status: "error",
                    type: "log"
                });
            });
            socket.once("data", handshake);
        },
        start = function transmit_server_start(options:transmit_tlsOptions):void {
            const wsServer:server_instance = (options === null)
                    // options are of type TlsOptions
                    ? node.net.createServer()
                    : node.tls.createServer({
                        ca: options.options.ca,
                        cert: options.options.cert,
                        key: options.options.key
                    }, connection),
                secureType:"open"|"secure" = (options === null)
                    ? "open"
                    : "secure",
                listenerCallback = function transmit_server_start_listenerCallback():void {
                    // eslint-disable-next-line @typescript-eslint/no-this-alias, no-restricted-syntax
                    const server:server_instance = this,
                        address:node_net_AddressInfo = server.address() as node_net_AddressInfo,
                        secure:"open"|"secure" = (server.secure === true)
                            ? "secure"
                            : "open";
                    port_conflict(server.name, server.secure, false);
                    vars.store_server[secure][name] = server;
                    vars.server_status[name][secure] = address.port;
                    log({
                        action: "activate",
                        config: {
                            name: name,
                            ports: vars.server_status[name]
                        },
                        message: `${secure.capitalize()} server ${server.name} came online.`,
                        status: "informational",
                        type: "server"
                    });
                    if (callback !== null) {
                        callback(server.name, secure);
                    }
                },
                server_error = function transmit_server_start_serverError(ser:node_error):void {
                    // eslint-disable-next-line @typescript-eslint/no-this-alias, no-restricted-syntax
                    const server:server_instance = this;
                    if (ser.code === "EADDRINUSE") {
                        port_conflict(server.name, server.secure, true);
                    }
                },
                // error messaging for port conflicts
                port_conflict = function transmit_server_start_portConflict(name:string, secure:boolean, input:boolean):void {
                    vars.port_conflict.push([name, secure, input]);
                    const total:number = vars.port_conflict.length;
                    let index:number = 0,
                        test:boolean = false;
                    if (total === Object.keys(vars.servers).length * 2) {
                        const errorText:string[] = [`Port conflict on server ${name} with the following ports:`];
                        vars.port_conflict.sort(function transmit_server_portConflict_sort(a:type_port_conflict, b:type_port_conflict):-1|1 {
                            if (vars.servers[a[0]].ports[(a[1] === true) ? "secure" : "open"] < vars.servers[b[0]].ports[(b[1] === true) ? "secure" : "open"]) {
                                return -1;
                            }
                            return 1;
                        });

                        // validate there are port conflicts
                        do {
                            if (vars.port_conflict[index][2] === true) {
                                test = true;
                                break;
                            }
                            index = index + 1;
                        } while (index < total);
                        if (test === false) {
                            return;
                        }

                        // write the messaging
                        index = 0;
                        do {
                            if (vars.port_conflict[index][2] === true) {
                                errorText.push(`* Port ${vars.servers[vars.port_conflict[index][0]].ports[(vars.port_conflict[index][1] === true) ? "secure" : "open"].toString()} for server ${vars.port_conflict[index][0]}, ${((vars.port_conflict[index][1]) === true ? "secure" : "open")}.`);
                            }
                            index = index + 1;
                        } while (index < total);
                        log({
                            action: "activate",
                            config: vars.servers[name],
                            message: errorText.join("\n"),
                            status: "error",
                            type: "server"
                        });
                    }
                };
            // type identification assignment
            wsServer.secure = (options === null)
                ? false
                : true;
            wsServer.name = name;
            wsServer.on("error", server_error);

            // insecure connection listener
            if (options === null) {
                wsServer.on("connection", connection);
            }

            // secure connection listener
            wsServer.listen({
                port: vars.servers[name].ports[secureType]
            }, listenerCallback);
        };
    if (vars.sockets[name] === undefined) {
        vars.sockets[name] = [];
    }
    if (vars.servers[name].encryption === "open") {
        start(null);
    } else {
        read_certs(name, function transmit_server_readCerts(name:string, options:transmit_tlsOptions):void {
            if (vars.servers[name].encryption === "both") {
                start(null);
            }
            start(options);
        });
    }
};

export default server;