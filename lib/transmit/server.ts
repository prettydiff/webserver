
import error from "../utilities/error.js";
import get_address from "../utilities/getAddress.js";
import hash from "../utilities/hash.js";
import http from "../http/index.js";
import message_handler from "./messageHandler.js";
import node from "../utilities/node.js";
import redirection from "./redirection.js";
import socket_extension from "./socketExtension.js";
import vars from "../utilities/vars.js";

const server = function transmit_server(config:config_websocket_server):node_net_Server {
    const connection = function transmit_server_connection(TLS_socket:node_tls_TLSSocket):void {
            // eslint-disable-next-line @typescript-eslint/no-this-alias, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, no-restricted-syntax
            const type_server:string = this.type,
                socket:websocket_client = TLS_socket as websocket_client,
                handshake = function transmit_server_connection_handshake(data:Buffer):void {
                    let nonceHeader:string = null,
                        domain:string = "",
                        key:string = "",
                        referer:boolean = null;
                    const dataString:string = data.toString(),
                        headerIndex:number = dataString.indexOf("\r\n\r\n"),
                        headerList:string[] = (headerIndex > 0)
                            ? dataString.slice(0, headerIndex).split("\r\n")
                            : dataString.split("\r\n"),
                        testNonce:RegExp = (/^Sec-WebSocket-Protocol:\s*\w+-/),
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
                            if (vars.domain_local.includes(domain) === false) {
                                arr[arrIndex] = (socket.encrypted === true)
                                    ? `Host: ${address.local.address}:${vars.ports.service.secure}`
                                    : `Host: ${address.local.address}:${vars.ports.service.open}`;
                            }
                        },
                        get_referer = function transmit_server_connection_handshake_getReferer(header:string):void {
                            const refererName:string = header.toLowerCase().replace(/referer:\s*/, "");
                            let index:number = vars.block_list.referer.length;
                            if (index > 0) {
                                do {
                                    index = index - 1;
                                    if (refererName.indexOf(vars.block_list.referer[index].toLowerCase()) === 0 || refererName.replace(/\w+:\/\//, "").indexOf(vars.block_list.referer[index].toLowerCase()) === 0) {
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
                            }
                        },
                        local_service = function transmit_server_connection_handshake_localService():void {
                            if (vars.redirect_internal[domain] !== undefined) {
                                data = redirection(domain, data) as Buffer;
                                headerList[0] = data.toString().split("\r\n")[0];
                            }
                            if (key === "") {
                                const http_action = function transmit_server_connection_handshake_httpAction():void {
                                    if (headerList[0].indexOf("GET") === 0 || headerList[0].indexOf("HEAD") === 0) {
                                        // local domain only uses GET method
                                        http.get(headerList, socket, type_server);
                                    } else if (headerList[0].indexOf("CONNECT") === 0) {
                                        http.connect(headerList, socket, type_server);
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
                                    server: wsServer.type,
                                    socket: socket
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
                                        server: wsServer.type,
                                        socket: socket
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
                                pair:[string, number] = ((socket.encrypted === true && vars.redirect_domain[`${domain}.secure`] !== undefined))
                                    ? vars.redirect_domain[`${domain}.secure`]
                                    : (vars.redirect_domain[domain] === undefined)
                                        ? (socket.encrypted === true)
                                            ? [address.local.address, vars.ports.service.secure]
                                            : [address.local.address, vars.ports.service.open]
                                        : vars.redirect_domain[domain],
                                host:string = (pair[0] === undefined || pair[0] === null || pair[0] === "")
                                    ? address.local.address
                                    : pair[0],
                                port:number = (typeof pair[1] === "number")
                                    ? pair[1]
                                    : (socket.encrypted === true)
                                        ? vars.ports.service.secure
                                        : vars.ports.service.open,
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
                                        if (vars.redirect_internal[domain] === undefined) {
                                            socket.pipe(proxy);
                                            proxy.write(data);
                                        } else {
                                            // HTTP redirection support
                                            socket.on("data", function transmit_server_connection_handshake_createProxy_redirect(message:Buffer):void {
                                                proxy.write(redirection(domain, message));
                                            });
                                            proxy.write(redirection(domain, data));
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
                                server: wsServer.type,
                                socket: socket
                            });
                            // proxy socket
                            socket_extension({
                                callback: callback,
                                handler: null,
                                identifier: `${domain}-${now}-proxy`,
                                proxy: socket,
                                role: "client",
                                server: "proxy",
                                socket: proxy
                            });
                        };
                    headerList.forEach(headerEach);

                    if (
                        referer === true ||
                        vars.block_list.host.includes(domain) === true ||
                        vars.block_list.ip.includes(address.remote.address) === true ||
                        (vars.redirect_domain[domain] === undefined && vars.domain_local.includes(domain) === false)
                    ) {
                        socket.destroy();
                    } else {
                        // do not proxy primary domain
                        if (vars.domain_local.includes(domain) === true) {
                            local_service();
                        } else {
                            create_proxy();
                        }
                    }
                };
            socket.on("error", function transmit_server_connection_handshake_socketError():void {
                // this worthless error trapping prevents an "unhandled error" escalation that breaks the process
                return null;
            });
            socket.once("data", handshake);
        },
        server_error = function transmit_server_serverError(ser:node_error):void {
            // eslint-disable-next-line @typescript-eslint/no-this-alias, @typescript-eslint/no-unsafe-assignment, no-restricted-syntax
            const server:server = this;
            if (ser.code === "EADDRINUSE") {
                port_conflict(server.type, server.secure, true);
            }
        },
        wsServer:server = (config.options === null)
            // options are of type TlsOptions
            ? node.net.createServer()
            : node.tls.createServer({
                ca: config.options.options.ca,
                cert: config.options.options.cert,
                key: config.options.options.key
            }, connection),
        listenerCallback = function transmit_server_listenerCallback():void {
            // eslint-disable-next-line @typescript-eslint/no-this-alias, @typescript-eslint/no-unsafe-assignment, no-restricted-syntax
            const server:server = this;
            port_conflict(server.type, server.secure, false);
            config.callback(server.type, wsServer.address() as node_net_AddressInfo);
        },
        // error messaging for port conflicts
        port_conflict = function transmit_server_portConflict(name:string, secure:boolean, input:boolean):void {
            vars.port_conflict.push([name, secure, input]);
            const total:number = vars.port_conflict.length;
            let index:number = 0,
                test:boolean = false;
            if (total === vars.server_count) {
                const errorText:string[] = ["Port conflict on the following ports:"];
                vars.port_conflict.sort(function transmit_server_portConflict_sort(a:type_port_conflict, b:type_port_conflict):-1|1 {
                    if (vars.ports[a[0]][(a[1] === true) ? "secure" : "open"] < vars.ports[b[0]][(b[1] === true) ? "secure" : "open"]) {
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
                        errorText.push(`${vars.text.angry}*${vars.text.none} Port ${vars.text.angry + vars.ports[vars.port_conflict[index][0]][(vars.port_conflict[index][1] === true) ? "secure" : "open"].toString() + vars.text.none} for server ${vars.text.cyan + vars.port_conflict[index][0]}, ${((vars.port_conflict[index][1]) === true ? "secure" : "open") + vars.text.none}.`);
                    }
                    index = index + 1;
                } while (index < total);
                error(errorText, null, true);
                process.exit(1);
            }
        },
        secureType:"open"|"secure" = (config.options === null)
            ? "open"
            : "secure";

    // type identification assignment
    wsServer.secure = (config.options === null)
        ? false
        : true;
    wsServer.type = config.type;
    wsServer.on("error", server_error);
    vars.servers[config.type] = wsServer;

    // insecure connection listener
    if (config.options === null) {
        wsServer.on("connection", connection);
    }

    // secure connection listener
    wsServer.listen({
        port: vars.ports[config.type][secureType]
    }, listenerCallback);
    return wsServer;
};

export default server;