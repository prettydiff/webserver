
import error from "../utilities/error.js";
import hash from "../utilities/hash.js";
import http from "./http.js";
import messageHandler from "./messageHandler.js";
import node from "../utilities/node.js";
import socket_extension from "./socketExtension.js";
import vars from "../utilities/vars.js";

const server = function transmit_server(config:config_websocket_server):node_net_Server {
    const connection = function transmit_server_connection(TLS_socket:node_tls_TLSSocket):void {
            const socket:websocket_client = TLS_socket as websocket_client,
                handshake = function transmit_server_connection_handshake(data:Buffer):void {
                    let browserType:string = null,
                        hashKey:string = null,
                        nonceHeader:string = null,
                        userAgent:string = null,
                        type:socket_type = null,
                        ws:boolean = false;
                    const dataString:string = data.toString(),
                        testNonce:RegExp = (/^Sec-WebSocket-Protocol:\s*\w+-/),
                        headerIndex:number = dataString.indexOf("\r\n\r\n"),
                        headerList:string[] = (headerIndex > 0)
                            ? dataString.slice(0, headerIndex).split("\r\n")
                            : dataString.split("\r\n"),
                        bodyString:string = dataString.slice(headerIndex + 4),
                        flags:store_flag = {
                            key: false,
                            type: true,
                            userAgent: false
                        },
                        headers = function transmit_server_connection_handshake_headers():void {
                            const clientRespond = function transmit_server_connection_handshake_headers_clientRespond():void {
                                    const headers:string[] = [
                                            "HTTP/1.1 101 Switching Protocols",
                                            "Upgrade: websocket",
                                            "Connection: Upgrade",
                                            `Sec-WebSocket-Accept: ${hashKey}`
                                        ];
                                    if (type === "browser") {
                                        headers.push(nonceHeader);
                                    }
                                    headers.push("");
                                    headers.push("");
                                    socket.write(headers.join("\r\n"));
                                };
                            // some complexity is present because browsers will not have a "hash" heading
                            if (flags.key === true && (flags.type === true || flags.userAgent === true)) {
                                const headerComplete = function transmit_server_connection_handshake_headers_headerComplete():void {
                                    /*
                                    const identifier:string = (type === "browser")
                                        ? `${userAgent}-${browserType}-${hashKey}`
                                        : hashName;
                                    if (getSocket(type, hashName) !== null) {
                                        socket.destroy();
                                        return;
                                    }
                                    */
                                    socket_extension({
                                        callback: clientRespond,
                                        handler: messageHandler,
                                        identifier: `${userAgent}-${browserType}-${hashKey}`,
                                        role: "server",
                                        socket: socket,
                                        type: type
                                    });
                                };
                                ws = true;
                                headerComplete();
                            }
                        },
                        headerEach = function transmit_server_connection_handshake_headerEach(header:string):void {
                            if (header.indexOf("Sec-WebSocket-Key") === 0) {
                                const key:string = header.slice(header.indexOf("-Key:") + 5).replace(/\s/g, "") + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
                                hash({
                                    algorithm: "sha1",
                                    callback: function transmit_server_connection_handshake_headerEach_callback(hashOutput:hash_output):void {
                                        flags.key = true;
                                        hashKey = hashOutput.hash;
                                        headers();
                                    },
                                    digest: "base64",
                                    hash_input_type: "direct",
                                    source: key
                                });
                            } else if (header.indexOf("User-Agent:") === 0) {
                                const subDec:RegExp = (/\s\w+\/\d+\.\d+\.\d+/g),
                                    browserName = function transmit_server_connection_handshake_headerEach_browserName():string {
                                        return "";
                                    },
                                    ua:string = (function transmit_server_connection_handshake_headerEach_ua():string {
                                        let matches:string[] = null;
                                        header = header.replace(/User-Agent:\s+/, "");
                                        header = header.slice(header.lastIndexOf(")"));
                                        matches = header.match(subDec);
                                        if (matches === null) {
                                            return null;
                                        }
                                        return matches[matches.length - 1];
                                    }());
                                if (ua === null) {
                                    userAgent = header.replace(/\s\w+\/\d+\.\d+/, browserName);
                                } else {
                                    userAgent = ua.replace(ua, browserName);
                                }
                                flags.type = true;
                                flags.userAgent = true;
                                headers();
                            } else if (header.indexOf("type:") === 0) {
                                type = header.replace(/type:\s+/, "") as "browser";
                                flags.type = true;
                                headers();
                            } else if (testNonce.test(header) === true) {
                                flags.type = true;
                                nonceHeader = header;
                                type = "browser";
                                header = header.slice(header.indexOf(":")).replace(/^:\s+/, "");
                                browserType = header.slice(0, header.indexOf("-"));
                                headers();
                            }
                        };
                    headerList.forEach(headerEach);
                    if (ws === false) {
                        http(headerList, bodyString, socket);
                    }
                };
            socket.on("error", function transmit_server_connection_handshake_socketError():void {
                // this worthless error trapping prevents an "unhandled error" escalation that breaks the process
                return null;
            });
            socket.on("data", handshake);
        },
        wsServer:node_net_Server = (vars.secure === true && config.options !== null)
            // options are of type TlsOptions
            ? node.tls.createServer({
                ca: config.options.options.ca,
                cert: config.options.options.cert,
                key: config.options.options.key
            }, connection)
            : node.net.createServer(),
        listenerCallback = function transmit_server_listenerCallback():void {
            config.callback(wsServer.address() as node_net_AddressInfo);
        };
    if (vars.secure === false) {
        wsServer.on("connection", connection);
    }
    if (vars.host === "") {
        wsServer.listen({
            port: vars.port
        }, listenerCallback);
    } else {
        wsServer.listen({
            host: vars.host,
            port: vars.port
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