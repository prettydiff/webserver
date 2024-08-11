
import create_proxy from "./createProxy.js";
import get_address from "../utilities/getAddress.js";
import hash from "../utilities/hash.js";
import http from "./http.js";
import message_handler from "./messageHandler.js";
import node from "../utilities/node.js";
import redirection from "./redirection.js";
import socket_extension from "./socketExtension.js";
import vars from "../utilities/vars.js";

const server = function transmit_server(config:config_websocket_server):node_net_Server {
    const connection = function transmit_server_connection(TLS_socket:node_tls_TLSSocket):void {
            const socket:websocket_client = TLS_socket as websocket_client,
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
                                    ? `Host: ${address.local.address}:${vars.service_port.secure}`
                                    : `Host: ${address.local.address}:${vars.service_port.open}`;
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
                                if (headerList[0].indexOf("GET") === 0) {
                                    // local domain only uses GET method
                                    http(headerList, socket);
                                } else {
                                    // at this time the local domain only supports HTTP GET method as everything else should use WebSockets
                                    socket.destroy();
                                }
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
                                        identifier: `browser-${hashOutput.hash}`,
                                        role: "server",
                                        socket: socket,
                                        type: "browser-youtube-download"
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
                        };
                    headerList.forEach(headerEach);

                    if (referer === true || vars.block_list.host.includes(domain) === true || vars.block_list.ip.includes(address.remote.address) === true) {
                        socket.destroy();
                    } else {
                        // do not proxy primary domain or unlisted domains
                        if (vars.domain_local.includes(domain) === true) {
                            local_service();
                        } else if (vars.redirect_domain[domain] === undefined) {
                            socket.destroy();
                        } else {
                            create_proxy({
                                callback: null,
                                buffer: data,
                                domain: domain,
                                socket: socket
                            });
                        }
                    }
                };
            socket.on("error", function transmit_server_connection_handshake_socketError():void {
                // this worthless error trapping prevents an "unhandled error" escalation that breaks the process
                return null;
            });
            socket.once("data", handshake);
        },
        wsServer:node_net_Server = (config.options === null)
            // options are of type TlsOptions
            ? node.net.createServer()
            : node.tls.createServer({
                ca: config.options.options.ca,
                cert: config.options.options.cert,
                key: config.options.options.key
            }, connection),
        listenerCallback = function transmit_server_listenerCallback():void {
            config.callback(wsServer.address() as node_net_AddressInfo);
        };

    // insecure connection listener
    if (config.options === null) {
        wsServer.on("connection", connection);
    }

    // secure connection listener
    wsServer.listen({
        port: (config.options === null)
            ? vars.service_port.open
            : vars.service_port.secure
    }, listenerCallback);
    return wsServer;
};

export default server;