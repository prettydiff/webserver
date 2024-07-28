
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
                        secureTest:boolean = (socket.tlsOptions !== undefined && vars.portMap[domain.replace(".x", ".secure")] !== undefined),
                        port:number = (domain === "" || vars.portMap[domain] === undefined)
                            ? (socket.tlsOptions === undefined)
                                ? vars.port.open
                                : vars.port.secure
                            : (secureTest === true)
                                ? vars.portMap[domain.replace(".x", ".secure")]
                                : vars.portMap[domain],
                        key:string = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
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
                        proxy_raw = function transmit_server_connection_handshake_proxyRaw(proxy:websocket_client, buf:Buffer):void {
                            socket.pipe(proxy);
                            proxy.pipe(socket);
                            proxy.write(buf);
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
                                if (domain === vars.domain || domain === address.local.address) {
                                    port = address.local.port;
                                } else {
                                    arr[arrIndex] = `Host: ${address.local.address}:${port}`;
                                    port = (socket.tlsOptions !== undefined && vars.portMap[domain.replace(".x", ".secure")] !== undefined)
                                        ? vars.portMap[domain.replace(".x", ".secure")]
                                        : vars.portMap[domain];
                                }
                            } else if (testNonce.test(header) === true) {
                                nonceHeader = header;
                            } else if (header.toLowerCase().indexOf("connection:") === 0) {
                                arr.splice(arrIndex, 1);
                            }
                        };
                    headerList.forEach(headerEach);
                    if (domain === vars.domain) {
                        if (headerList[0].indexOf("GET") === 0 && key === "258EAFA5-E914-47DA-95CA-C5AB0DC85B11") {
                            // local domain only uses GET method and local websocket for everything else
                            http(headerList, bodyString, socket);
                        } else {
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
                        }
                    } else {
                        create_proxy({
                            callback: proxy_raw,
                            buffer: data,
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