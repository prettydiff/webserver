
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
    const connection = function transmit_server_connection(TLS_socket:node_tls_TLSSocket):void {
            const socket:websocket_client = TLS_socket as websocket_client,
                handshake = function transmit_server_connection_handshake(data:Buffer):void {
                    let nonceHeader:string = null,
                        domain:string = "",
                        key:string = "";
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
                        getDomain = function transmit_server_connection_handshake_getDomain(header:string):void {
                            const hostName:string = header.toLowerCase().replace("host:", "").replace(/\s+/g, ""),
                                index:number = hostName.indexOf(":"),
                                host = (index > 0)
                                    ? hostName.slice(0, index)
                                    : hostName;
                            domain = host.replace(`:${address.local.port}`, "");
                        },
                        headerEach = function transmit_server_connection_handshake_headerEach(header:string, arrIndex:number, arr:string[]):void {
                            if (header.indexOf("Sec-WebSocket-Key") === 0) {
                                key = header.slice(header.indexOf("-Key:") + 5).replace(/\s/g, "") + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
                            } else if (header.toLowerCase().indexOf("host:") === 0) {
                                getDomain(header);
                                if (domain !== vars.domain && domain !== address.local.address) {
                                    arr[arrIndex] = (socket.tlsOptions === undefined)
                                        ? `Host: ${address.local.address}:${vars.port.open}`
                                        : `Host: ${address.local.address}:${vars.port.secure}`;
                                }
                            } else if (testNonce.test(header) === true) {
                                nonceHeader = header;
                            }
                        };
                    headerList.forEach(headerEach);

                    // do not proxy primary domain
                    if (domain === vars.domain || domain === address.local.address) {
                        if (headerList[0].indexOf("GET") === 0) {
                            // local domain only uses GET method
                            http(headerList, bodyString, socket);
                        } else if (key !== "") {
                            // local domain websocket support
                            hash({
                                algorithm: "sha1",
                                callback: function transmit_server_connection_handshake_hash(hashOutput:hash_output):void {
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
                                },
                                digest: "base64",
                                hash_input_type: "direct",
                                source: key
                            });
                        } else {
                            // at this time the local domain only supports HTTP GET method as everything else should use WebSockets
                            socket.destroy();
                        }
                    } else {
                        create_proxy({
                            callback: null,
                            buffer: data,
                            host: address.local.address,
                            port: (socket.tlsOptions !== undefined && vars.portMap[domain.replace(/\.\w+$/, ".secure")] !== undefined)
                                ? vars.portMap[domain.replace(/\.\w+$/, ".secure")]
                                : vars.portMap[domain],
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

    // insecure connection listener
    if (config.options === null) {
        wsServer.on("connection", connection);
    }

    // secure connection listener
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

    // port map to proxy vanity domains
    // if different ports for tls versus net socket then list the TLD as ".secure"
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