
import create_proxy from "./createProxy.js";
import error from "../utilities/error.js";
import getAddress from "../utilities/getAddress.js";
import hash from "../utilities/hash.js";
import http from "./http.js";
import message_handler from "./messageHandler.js";
import node from "../utilities/node.js";
import vars from "../utilities/vars.js";
import socket_extension from "./socketExtension.js";

const server = function transmit_server(config:config_websocket_server):node_net_Server {
    let domain:string = "";
    const connection = function transmit_server_connection(TLS_socket:node_tls_TLSSocket):void {
            const socket:websocket_client = TLS_socket as websocket_client,
                handshake = function transmit_server_connection_handshake(data:Buffer):void {
                    let hashKey:string = null,
                        nonceHeader:string = null,
                        port:number = 80,
                        key:string = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11",
                        self:boolean = null;
                    const dataString:string = data.toString(),
                        headerIndex:number = dataString.indexOf("\r\n\r\n"),
                        headerList:string[] = (headerIndex > 0)
                            ? dataString.slice(0, headerIndex).split("\r\n")
                            : dataString.split("\r\n"),
                        bodyString:string = dataString.slice(headerIndex + 4),
                        testNonce:RegExp = (/^Sec-WebSocket-Protocol:\s*\w+-/),
                        address:transmit_addresses_socket = getAddress({
                            socket: socket,
                            type: "ws"
                        }),
                        client_respond = function transmit_server_connection_handshake_headers_clientRespond():void {
                            const headers:string[] = [
                                    "HTTP/1.1 101 Switching Protocols",
                                    "Upgrade: websocket",
                                    "Connection: Upgrade",
                                    `Sec-WebSocket-Accept: ${hashKey}`,
                                    "Access-Control-Allow-Origin: *",
                                    "Server: webserver"
                                ];
                            if (nonceHeader !== null) {
                                headers.push(nonceHeader);
                            }
                            headers.push("");
                            headers.push("");
                            socket.write(headers.join("\r\n"));
                        },
                        proxy_http = function transmit_server_connection_handshake_proxyHTTP(proxy:websocket_client, headers:string[]):void {
                            headers.push("");
                            headers.push("");
                            proxy.write(headers.join("\r\n"));
                            if (bodyString !== null && bodyString !== "") {
                                proxy.write(bodyString);
                            }
                            socket.pipe(proxy);
                            proxy.pipe(socket);
                        },
                        proxy_handshake = function transmit_server_connection_handshake_proxyHandshake(proxy:websocket_client):void {
                            proxy.once("data", function transmit_server_connection_handshake_proxyHandshake_data(data:Buffer):void {
                                socket.write(data);
                                socket.pipe(proxy);
                                proxy.pipe(socket);
                            });
                            headerList.push("");
                            headerList.push("");
                            proxy.write(headerList.join("\r\n"));
                        },
                        proxy_socket = function transmit_server_connection_handshake_proxySocket(proxy:websocket_client):void {
                            socket.pipe(proxy);
                            proxy.pipe(socket);
                        },
                        headerEach = function transmit_server_connection_handshake_headerEach(header:string, arrIndex:number, arr:string[]):void {
                            if (header.indexOf("Sec-WebSocket-Key") === 0) {
                                key = header.slice(header.indexOf("-Key:") + 5).replace(/\s/g, "") + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
                            } else if (header.toLowerCase().indexOf("host:") === 0) {
                                const hostName:string = header.toLowerCase().replace("host:", "").replace(/\s+/g, ""),
                                    index:number = domain.indexOf(":"),
                                    host = (index > 0)
                                        ? hostName.slice(0, index)
                                        : hostName;
                                domain = host.replace(`:${address.local.port}`, "");
                                if (domain === "www.x" || domain === address.local.address) {
                                    self = true;
                                    port = address.local.port;
                                } else {
                                    arr[arrIndex] = `Host: ${address.local.address}:${port}`;
                                    port = vars.portMap[domain];
                                }
                            } else if (testNonce.test(header) === true) {
                                nonceHeader = header;
                            } else if (header.toLowerCase().indexOf("connection:") === 0) {
                                arr.splice(arrIndex, 1);
                            }
                        };
                    headerList.forEach(headerEach);
                    if (headerList.length < 2 && headerList.indexOf("HTTP") < 0) {
                        // proxy actual websocket
                        if (vars.portMap[domain] === undefined) {
                            socket.destroy();
                        } else {
                            create_proxy({
                                callback: proxy_socket,
                                headerList: [],
                                host: address.local.address,
                                port: vars.portMap[domain],
                                socket: socket
                            });
                        }
                    } else if (key === "258EAFA5-E914-47DA-95CA-C5AB0DC85B11") {
                        // http response
                        if (headerList[0].indexOf("GET") === 0 && domain === "www.x") {
                            // local domain only uses GET method and local websocket for everything else
                            http(headerList, bodyString, socket);
                        } else {
                            // http proxy
                            headerList.push("Connection: close");
                            create_proxy({
                                callback: proxy_http,
                                headerList: headerList,
                                host: address.local.address,
                                port: port,
                                socket: socket
                            });
                        }
                    } else if (self === true) {
                        // local domain websocket support
                        hash({
                            algorithm: "sha1",
                            callback: function transmit_server_connection_handshake_headerEach_callback(hashOutput:hash_output):void {
                                hashKey = hashOutput.hash;
                                socket_extension({
                                    callback: client_respond,
                                    handler: message_handler,
                                    identifier: `browser-${hashKey}`,
                                    role: "server",
                                    socket: socket,
                                    type: "browser-youtube-download"
                                });
                            },
                            digest: "base64",
                            hash_input_type: "direct",
                            source: key
                        });
                    } else {
                        // proxy websocket handshake
                        create_proxy({
                            callback: proxy_handshake,
                            headerList: headerList,
                            host: address.local.address,
                            port: port,
                            socket: socket
                        });
                    }
                };
            socket.on("error", function transmit_server_connection_handshake_socketError():void {
                // this worthless error trapping prevents an "unhandled error" escalation that breaks the process
                return null;
            });
            socket.on("data", handshake);
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
    if (config.options === null) {
        wsServer.on("connection", connection);
    }
    if (vars.host === "") {
        wsServer.listen({
            port: (config.options === null)
                ? vars.port.open
                : vars.port.secure
        }, listenerCallback);
    } else {
        wsServer.listen({
            host: vars.host,
            port: (config.options === null)
                ? vars.port.open
                : vars.port.secure
        }, listenerCallback);
    }
    node.fs.readFile(`${vars.path.project}portMap.json`, function transmit_server_portMap(erp:node_error, fileContents:Buffer):void {
        if (erp === null) {
            vars.portMap = JSON.parse(fileContents.toString()) as store_number;
            return;
        }
        error(["Error reading project file portMap.json, which maps vanity domains to port numbers for the HTTP proxy."], erp);
    });
    return wsServer;
};

export default server;