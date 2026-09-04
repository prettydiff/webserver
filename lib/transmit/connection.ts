
import get_address from "../core/get_address.ts";
import hash from "../core/hash.ts";
import http from "../http/index.ts";
import log from "../core/log.ts";
import node from "../core/node.ts";
import message_handler from "./messageHandler.ts";
import message_inspection from "../services/message_inspection.ts";
import send from "./send.ts";
import server_halt from "../server/server_halt.ts";
import socket_extension from "./socketExtension.ts";
import terminal from "../services/terminal.ts";
import vars from "../core/vars.ts";

//cspell: words prettydiff

const connection = function transmit_connection(this:core_server_instance, TLS_socket:node_tls_TLSSocket):void {
    const server_id:string = this.id,
        server:supplemental_server_config = vars.data.server[server_id].config,
        handshake = function transmit_connection_handshake(this:websocket_client, data:Buffer):void {
            const flags:store_flag = {
                    dashboard_http_test: false,
                    referer: false,
                    upgrade: false
                },
                store:store_string = {
                    // request's hostname
                    domain: "",
                    // websocket handshake key
                    key: "",
                    // websocket unique identifier
                    nonce: null,
                    // all parts of a URI after scheme and before path
                    origin: "",
                    // port value specified on origin
                    port: null,
                    // any alternate protocol identifier provided to the web handshake
                    type: "",
                    // user agent string if the originating request comes from a web browser
                    userAgent: ""
                },
                // eslint-disable-next-line @typescript-eslint/no-this-alias
                socket:websocket_client = this,
                dataString:string = data.toString("utf-8"),
                headerIndex:number = dataString.replace(/^\s+/, "").indexOf("\r\n\r\n"),
                headerString:string = (headerIndex > 0)
                    ? dataString.replace(/^\s+/, "").slice(0, headerIndex)
                    : dataString.replace(/^\s+/, ""),
                headerList:string[] = headerString.split("\r\n"),
                testNonce:RegExp = (/^sec-websocket-protocol:\s*/),
                single_socket:boolean = (server.single_socket === true),
                temporary:boolean = (server.temporary === true),
                address:transmit_addresses_socket = get_address(socket),
                get_domain = function transmit_connection_handshake_getDomain(header:string, arrIndex:number, arr:string[]):void {
                    const hostName:string = header.toLowerCase().replace("host:", "").replace(/\s+/g, ""),
                        sIndex:number = hostName.indexOf("]"),
                        index:number = hostName.indexOf(":"),
                        host:string = (index > 0)
                            ? hostName.slice(0, index)
                            : hostName;
                    if (hostName.indexOf("[") === 0 && sIndex > 0) {
                        store.domain = hostName.slice(1, sIndex);
                        if ((/\]:\d+$/).test(hostName) === true) {
                            store.port = hostName.slice(hostName.lastIndexOf(":") + 1);
                        }
                    } else if ((/:\d+$/).test(hostName) === true) {
                        store.domain = host;
                        store.port = hostName.slice(index + 1);
                    } else {
                        store.domain = host;
                    }
                    store.origin = hostName.replace(/:80$/, "").replace(/:443$/, ".secure");
                    // ensures HTTP requests pushed through the proxy are identified as originating from the proxy
                    if (domain_local.includes(store.domain) === false) {
                        arr[arrIndex] = (socket.encrypted === true)
                            ? `Host: ${address.local.address}:${server.ports.secure}`
                            : `Host: ${address.local.address}:${server.ports.open}`;
                    }
                },
                get_referer = function transmit_connection_handshake_getReferer(header:string):void {
                    const refererName:string = header.toLowerCase().replace(/referer:\s*/, "");
                    let index:number = (server.block_list === null || server.block_list === undefined)
                        ? 0
                        : server.block_list.referrer.length;
                    if (index > 0) {
                        do {
                            index = index - 1;
                            if (refererName.indexOf(server.block_list.referrer[index].toLowerCase()) === 0 || refererName.replace(/\w+:\/\//, "").indexOf(server.block_list.referrer[index].toLowerCase()) === 0) {
                                flags.referer = true;
                                return;
                            }
                        } while (index > 0);
                    }
                },
                headerEach = function transmit_connection_handshake_headerEach(header:string, arrIndex:number, arr:string[]):void {
                    const lower:string = header.toLowerCase();
                    if (lower.indexOf("sec-websocket-key") === 0) {
                        store.key = header.slice(lower.indexOf("-key:") + 5).replace(/\s/g, "") + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
                    } else if (lower.indexOf("host:") === 0) {
                        get_domain(header, arrIndex, arr);
                    } else if (lower.indexOf("referer:") === 0) {
                        get_referer(header);
                    } else if (testNonce.test(lower) === true) {
                        store.nonce = header;
                        store.type = lower.replace(testNonce, "");
                    } else if (lower.indexOf("user-agent:") === 0) {
                        let ua:string[] = [];
                        store.userAgent = header.slice(header.indexOf(":") + 1).replace(/^\s+/, "");
                        ua[0] = store.userAgent.slice(store.userAgent.indexOf("(") + 1, store.userAgent.indexOf(")"));
                        ua = ua[0].split(";");
                        store.userAgent = `${ua[0]}, ${ua[1]}, ${store.userAgent.slice(store.userAgent.lastIndexOf(")") + 2)}`;
                    } else if ((/^upgrade-insecure-requests:\s*1$/).test(lower) === true && socket.encrypted !== true && server.upgrade === true && vars.data.server[server_id].ports.secure > 0) {
                        flags.upgrade = true;
                    } else if (lower === "services_http_test: true") {
                        flags.dashboard_http_test = true;
                    }
                },
                redirection = function transmit_connection_handshake_redirection():Buffer {
                    const request_path:string = (headerList[0].includes("HTTP") === true)
                            ? headerList[0].replace(/ +/g, " ").replace(/ $/, "").slice(headerList[0].indexOf(" ") + 1, headerList[0].lastIndexOf(" "))
                            : null,
                        keys:string[] = (server.redirect_asset === null || server.redirect_asset === undefined || server.redirect_asset[store.origin] === undefined)
                            ? []
                            : Object.keys(server.redirect_asset[store.origin]),
                        proxy_existing = function transmit_connection_handshake_proxyExisting(hash:string):boolean {
                            const loop = function transmit_connection_handshake_proxyExisting_loop():boolean {
                                let index:number = vars.data.sockets_tcp.length;
                                if (index > 0) {
                                    do {
                                        index = index - 1;
                                        if (vars.data.sockets_tcp[index].hash === hash) {
                                            if (vars.data.sockets_tcp[index].proxy === null) {
                                                const servers:string[] = Object.keys(vars.data_store.server),
                                                    list = function transmit_connection_handshake_proxyExisting_loop_list(id:string, list_type:"open"|"secure"):boolean {
                                                        const sockets:websocket_client[] = vars.data_store.server[id].sockets_tcp[list_type];
                                                        let count:number = sockets.length;
                                                        do {
                                                            count = count - 1;
                                                            if (sockets[count].hash === hash) {
                                                                if (sockets[count].proxy === null) {
                                                                    proxy = sockets[count];
                                                                }
                                                                return true;
                                                            }
                                                        } while (count > 0);
                                                        return false;
                                                    };
                                                let proxy:websocket_client = null,
                                                    server_len:number = servers.length;
                                                if (server_len > 0) {
                                                    do {
                                                        server_len = server_len - 1;
                                                        if (list(servers[server_len], "secure") === true) {
                                                            break;
                                                        }
                                                    } while (server_len > 0);
                                                    if (proxy === null && socket.encrypted !== true) {
                                                        do {
                                                            server_len = server_len - 1;
                                                            if (list(servers[server_len], "open") === true) {
                                                                break;
                                                            }
                                                        } while (server_len > 0);
                                                    }
                                                }
                                                if (proxy === null) {
                                                    socket.destroy();
                                                } else {
                                                    socket.pipe(proxy);
                                                }
                                                proxy.proxy = socket;
                                                socket_extension({
                                                    callback: function transmit_connection_handshake_proxyExisting_loop_callback():void {
                                                        proxy.pipe(socket);
                                                        socket.pipe(proxy);
                                                        proxy.write(data);
                                                    },
                                                    handler: null,
                                                    identifier: `${store.origin}-${process.hrtime.bigint().toString()}`,
                                                    proxy: proxy,
                                                    role: "server",
                                                    server: server_id,
                                                    single_socket: false,
                                                    socket: socket,
                                                    temporary: false,
                                                    timeout: null,
                                                    type: "relay",
                                                    userAgent: store.userAgent
                                                });
                                            } else {
                                                socket.destroy();
                                            }
                                            return true;
                                        }
                                    } while (index > 0);
                                }
                                return false;
                            };
                            if ((/^[0-9a-f]{128}$/).test(hash) === true) {
                                loop();
                                return true;
                            }
                            return false;
                        },
                        compare = function transmit_connection_handshake_redirection_compare(path:string, wild:string):boolean {
                            const destination:string = server.redirect_asset[store.origin][path];
                            if (path === request_path) {
                                // literal match
                                if (wild === null && store.key.charAt(path.length - 1) !== "*") {
                                    if (proxy_existing(destination) === true) {
                                        proxy_test = true;
                                        return true;
                                    }
                                    headerList[0] = `${headerList[0].slice(0, headerList[0].indexOf(" "))} ${destination + headerList[0].replace(/ +$/, "").slice(headerList[0].lastIndexOf(" "))}`;
                                // wildcard match
                                } else if (wild !== null && path.charAt(store.key.length - 1) === "*" && request_path.indexOf(wild) === 0 && request_path.indexOf(destination) !== 0) {
                                    if (proxy_existing(destination) === true) {
                                        proxy_test = true;
                                        return true;
                                    }
                                    headerList[0] = `${headerList[0].slice(0, headerList[0].indexOf(" "))} ${request_path.replace(wild, destination) + headerList[0].replace(/ +$/, "").slice(headerList[0].lastIndexOf(" "))}`;
                                }
                                return true;
                            }
                            return false;
                        };
                    let proxy_test:boolean = false,
                        index:number = keys.length;

                    if (index > 0) {
                        let matched:boolean = false,
                            compared:boolean = false;
                        // look for exact matches first
                        do {
                            index = index - 1;
                            compared = compare(keys[index], null);
                            if (compared === null) {
                                return null;
                            }
                            if (compared === true) {
                                matched = true;
                                break;
                            }
                        } while (index > 0);

                        // look for wildcard matches second
                        index = keys.length;
                        compared = false;
                        if (matched === false) {
                            do {
                                index = index - 1;
                                compared = compare(keys[index], keys[index].replace(/\*$/, ""));
                                if (compared === null) {
                                    return null;
                                }
                                if (compared === true) {
                                    break;
                                }
                            } while (index > 0);
                        }
                        if (proxy_test === false) {
                            return Buffer.from(dataString.replace(headerString, headerList.join("\r\n")));
                        }
                    }
                    return null;

                },
                local_service = function transmit_connection_handshake_localService():void {
                    const redirect:Buffer = redirection();
                    if (socket.destroyed === true) {
                        return;
                    }
                    data = (redirect === null)
                        ? data
                        : redirect;
                    // http
                    if (store.key === "") {
                        const method:type_http_method = headerList[0].slice(0, headerList[0].indexOf(" ")).toLowerCase() as type_http_method,
                            http_action = function transmit_connection_handshake_localService_httpAction():void {
                                const keys:string[] = (server.method === null || server.method === undefined)
                                    ? []
                                    : Object.keys(server.method);
                                let index:number = keys.length;
                                if (index > 0) {
                                    do {
                                        index = index - 1;
                                        if (keys[index].toLowerCase() === method) {
                                            proxy_create(server.method[method as "delete"].address, server.method[method as "delete"].port, socket.encrypted);
                                            return;
                                        }
                                    } while (index > 0);
                                }
                                if (http[method] === undefined) {
                                    // unsupported HTTP methods result in socket destruction
                                    socket.destroy();
                                } else {
                                    if (method === "get" && server_id === vars.id.dashboard_server && (headerList[0].indexOf("GET / HTTP") === 0 || headerList[0].indexOf("GET /?test_browser HTTP") === 0)) {
                                        vars.environment.http_request = headerString;//.replace(/GET \/\?test_browser HTTP/, "GET / HTTP");
                                    }
                                    http[method](headerList, socket, headerIndex < 1
                                        ? null
                                        : data.subarray(Buffer.byteLength(headerString))
                                    );
                                    if (server.single_socket === true) {
                                        const terminate = function transmit_connection_handshake_localService_httpAction_terminate(this:websocket_client):void {
                                            this.destroy();
                                            server_halt({
                                                action: "destroy",
                                                server: vars.data.server[this.server_hash].config
                                            }, null);
                                        };
                                        socket.on("close", terminate);
                                        socket.on("end", terminate);
                                        socket.on("error", terminate);
                                    }
                                }
                            };
                        let resource:string = headerList[0].slice(headerList[0].indexOf(" ") + 1).trim();
                        resource = resource.slice(0, resource.indexOf(" "));
                        socket_extension({
                            callback: http_action,
                            handler: message_handler.default,
                            identifier: `http-${resource}-${Math.random()}`,
                            proxy: null,
                            role: "server",
                            server: server_id,
                            single_socket: single_socket,
                            socket: socket,
                            temporary: temporary,
                            timeout: null,
                            type: `http-${method}`,
                            userAgent: store.userAgent
                        });
                    // websocket
                    } else {
                        // local domain websocket support
                        const callback = function transmit_connection_handshake_hash(hashOutput:core_hash_output):void {
                            const client_respond = function transmit_connection_handshake_hash_clientRespond():void {
                                    const headers:string[] = [
                                            "HTTP/1.1 101 Switching Protocols",
                                            "Upgrade: websocket",
                                            "Connection: Upgrade",
                                            `Sec-WebSocket-Accept: ${hashOutput.hash}`,
                                            "Access-Control-Allow-Origin: *",
                                            `Server: prettydiff/${vars.environment.name}`
                                        ];
                                    if (store.nonce !== null) {
                                        headers.push(store.nonce);
                                    }
                                    headers.push("");
                                    headers.push("");
                                    socket.write(headers.join("\r\n"));
                                    if (single_socket === true || temporary === true) {
                                        const security:"open"|"secure" = (socket.secure === true)
                                            ? "secure"
                                            : "open";
                                        vars.data_store.server[server_id].server_object[security].removeAllListeners();
                                    }
                                    if (localFlag === true) {
                                        if (store.type === "dashboard-terminal" && headerList[0].includes("shell") === true) {
                                            const url:URL = new URL(decodeURIComponent(`http://www.x${headerList[0].split(" ")[1]}`)),
                                                params:string[] = url.search.slice(1).split("&"),
                                                cols:number = (params[1] === undefined)
                                                    ? null
                                                    : Number(params[1].split("=")[1]),
                                                rows:number = (params[2] === undefined)
                                                    ? null
                                                    : Number(params[2].split("=")[1]),
                                                term:config_terminal = {
                                                    cols: (Number.isNaN(cols) === true)
                                                        ? 199
                                                        : cols,
                                                    rows: (Number.isNaN(rows) === true)
                                                        ? 50
                                                        : rows,
                                                    shell: params[0].split("=")[1].replace(/%20/g, " ")
                                                };
                                            terminal.shell(socket as websocket_pty, term);
                                        } else if (store.type === "dashboard") {
                                            const payload:services_dashboard_open = {
                                                compose: (vars.environment.features["compose-containers"] === true)
                                                    ? {
                                                        containers: vars.data.containers,
                                                        status: vars.environment.compose_status,
                                                        time: vars.data_meta.compose_time,
                                                        variables: vars.data.compose_variables
                                                    }
                                                    : null,
                                                demo: vars.options.demo,
                                                hashes: (vars.environment.features["hash"] === true)
                                                    ? vars.environment.hashes
                                                    : null,
                                                http_request: (vars.environment.features["test-http"] === true)
                                                    ? vars.environment.http_request
                                                    : null,
                                                id: vars.id,
                                                logs: (vars.environment.features["application-logs"] === true)
                                                    ? {
                                                        entries: (vars.environment.logs.total > vars.environment.logs.max)
                                                            ? vars.data.logs.slice(vars.environment.logs.total - vars.environment.logs.max)
                                                            : vars.data.logs,
                                                        max: vars.environment.logs.max,
                                                        total: vars.environment.logs.total
                                                    }
                                                    : null,
                                                name: vars.environment.name,
                                                notes: vars.data.notes,
                                                os: vars.os,
                                                path: vars.path,
                                                "ports-application": {
                                                    data: vars.data.ports_application,
                                                    time: vars.data_meta.ports_application
                                                },
                                                repository: vars.environment.repository,
                                                server: (vars.environment.features["servers-web"] === true)
                                                    ? vars.data.server
                                                    : null,
                                                services_app: (vars.environment.features["services-app"] === true)
                                                    ? vars.environment.services_app
                                                    : null,
                                                sockets: (vars.environment.features["sockets-application-tcp"] === true || vars.environment.features["sockets-application-udp"] === true)
                                                    ? {
                                                        tcp: vars.data.sockets_tcp,
                                                        time: vars.data_meta.sockets,
                                                        udp: vars.data.sockets_udp
                                                    }
                                                    : null,
                                                start_date: vars.environment.start_date,
                                                stats: (vars.environment.features["statistics-resources"] === true)
                                                    ? {
                                                        containers: vars.stats.containers,
                                                        duration: vars.stats.duration,
                                                        frequency: vars.stats.frequency,
                                                        now: vars.stats.now,
                                                        records: vars.stats.records
                                                    }
                                                    : null,
                                                terminal: (vars.environment.features["terminal"] === true)
                                                    ? vars.environment.terminal
                                                    : null,
                                                timeZone_offset: vars.environment.timeZone_offset,
                                                version: vars.environment.version
                                            };
                                            send({
                                                data: payload,
                                                service: "services_dashboard_open"
                                            }, socket, 3);
                                        }
                                    }
                                },
                                localFlag:boolean = (server_id === vars.id.dashboard_server),
                                identifier:string = (localFlag === true && store.type === "dashboard-terminal")
                                    ? `dashboard-terminal-${hashOutput.hash}`
                                    : (store.type === "test-websocket")
                                        ? `websocketTest-browserSocket-${hashOutput.hash}`
                                        : `browserSocket-${hashOutput.hash}`;
                            socket_extension({
                                callback: client_respond,
                                handler: (store.type === "test-websocket")
                                    ? message_handler.test_websocket
                                    : (store.type === "test-performance-socket")
                                        ? message_handler.test_performance
                                        : message_handler.default,
                                identifier: identifier,
                                proxy: null,
                                role: "server",
                                server: server_id,
                                single_socket: single_socket,
                                socket: socket,
                                temporary: temporary,
                                timeout: null,
                                type: store.type,
                                userAgent: store.userAgent
                            });
                        };
                        hash({
                            algorithm: "sha1",
                            callback: callback,
                            digest: "base64",
                            hash_input_type: "direct",
                            section: "servers-web",
                            source: store.key
                        });
                    }
                },
                proxy_create = function transmit_connection_handshake_proxyCreate(host:string, port:number, encrypted:boolean):void {
                    let count:number = 0;
                    const proxy:websocket_client = (encrypted === true)
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
                        callback = function transmit_connection_handshake_proxyCreate_callback():void {
                            count = count + 1;
                            if (count > 1) {
                                const redirect:Buffer = redirection();
                                proxy.pipe(socket);

                                // redirection
                                if (redirect === null) {
                                    // no redirection
                                    socket.pipe(proxy);
                                    proxy.write(data);
                                } else {
                                    // redirect by domain
                                    if (
                                        server.redirect_domain !== undefined &&
                                        server.redirect_domain !== null &&
                                        (
                                            server.redirect_domain[store.origin] !== undefined ||
                                            (socket.encrypted === true && server.redirect_domain[`${store.origin}.secure`] !== undefined)
                                        )
                                    ) {
                                        socket.pipe(proxy);
                                    } else {
                                        // internal redirection
                                        socket.on("data", function transmit_connection_handshake_proxyCreate_redirect(message_data:Buffer):void {
                                            proxy.write(message_data);
                                        });
                                    }
                                    proxy.write(redirect);
                                }
                            }
                        };
                    proxy.once("ready", function transmit_connection_handshake_proxyCreate_ready():void {
                        // requested socket
                        socket_extension({
                            callback: callback,
                            handler: null,
                            identifier: `${store.origin}-${now}`,
                            proxy: proxy,
                            role: "server",
                            server: server_id,
                            single_socket: false,
                            socket: socket,
                            temporary: false,
                            timeout: null,
                            type: "relay",
                            userAgent: store.userAgent
                        });
                        proxy.addresses = get_address(proxy);
                        // proxy socket
                        socket_extension({
                            callback: callback,
                            handler: null,
                            identifier: `${store.origin}-${now}-proxy`,
                            proxy: socket,
                            role: "client",
                            server: server_id,
                            single_socket: false,
                            socket: proxy,
                            temporary: false,
                            timeout: null,
                            type: "proxy",
                            userAgent: store.userAgent
                        });
                    });
                },
                certificate_client:node_crypto_X509Certificate = (vars.data.server[server.id].config.mutual_tls === true && socket.encrypted === true)
                    ? socket.getPeerX509Certificate()
                    : null,
                blocked_host:boolean = (server.block_list !== null && server.block_list !== undefined && server.block_list.host.includes(store.origin) === true),
                blocked_ip:boolean = (server.block_list !== null && server.block_list !== undefined && server.block_list.ip.includes(address.remote.address) === true),
                blocked:boolean = (flags.referer === true || blocked_host === true || blocked_ip === true),
                domain_redirect:boolean = (server.redirect_domain !== undefined && server.redirect_domain !== null && server.redirect_domain[store.origin] !== undefined && server.redirect_domain[store.origin] !== null),
                domain_local:string[] = server.domain_local.concat(vars.environment.interfaces);
            // mutual TLS enforcement
            if (vars.data.server[server.id].config.mutual_tls === true) {
                if (socket.encrypted !== true || certificate_client === null || certificate_client === undefined) {
                    socket.destroy();
                    return;
                }
                const now:number = Date.now(),
                    parent_cert:node_crypto_X509Certificate = new node.crypto.X509Certificate(vars.data_store.server[server.id].server_certs.ca),
                    parent_key:node_crypto_KeyObject = parent_cert.publicKey,
                    from:number = Date.parse(certificate_client.validFrom),
                    until:number = Date.parse(certificate_client.validTo);
                if (parent_key === null || parent_key === undefined || from > now || until < now || certificate_client.verify(parent_key) !== true) {
                    socket.destroy();
                    return;
                }
            }
            headerList.forEach(headerEach);
            socket.addresses = address;
            message_inspection.send({
                count: 0,
                direction: "in",
                maximum_size: 0,
                message: dataString,
                service: socket.server_hash,
                throttle_size: 0,
                throttle_time: 0,
                type: "web-server"
            });

            // origin is in the socket's redirect_domain list
            if (blocked === true || (domain_local.includes(store.origin) === false && socket.proxy === null)) {
                socket.destroy();
            // TLS data sent to open server - proxy the socket to the server's TLS port
            } else if (data[0] === 22 && socket.addresses.local.port === server.ports.open && vars.data.server[server_id].ports.secure > 0) {
                store.domain = `open_socket_tunnel-${vars.data.server[server_id].config.name}`;
                proxy_create(address.local.address, vars.data.server[server_id].ports.secure, false);
            // origin in specified block list or requested origin is not in domain_local list
            } else if (domain_redirect === true) {
                const pair:[string, number] = (socket.encrypted === true)
                        ? server.redirect_domain[`${store.origin}.secure`]
                        : server.redirect_domain[store.origin],
                    host:string = (pair[0] === undefined || pair[0] === null || pair[0] === "")
                        ? address.local.address
                        : pair[0],
                    port:number = (typeof pair[1] === "number")
                        ? pair[1]
                        : (socket.encrypted === true)
                            ? server.ports.secure
                            : server.ports.open;
                if (store.domain === "") {
                    store.domain = (host === "127.0.0.1" || host === "::1" || host === "::" || host === "[::1]")
                        ? "localhost"
                        : host;
                }
                store.domain = `tls_socket_redirect-${vars.data.server[server_id].config.name}`;
                proxy_create(host, port, socket.encrypted);
            // redirect TLS connections sent to open servers instead to secure server peer if one is active
            } else if (flags.upgrade === true as boolean && flags.dashboard_http_test === false) {
                // * server option 'upgrade' must be true
                // * must be http request with header 'upgrade-insecure-requests: 1'
                // * requests from the dashboard http test tool are ignored
                const resource_first:string = headerList[0].slice(headerList[0].replace(/ +/, " ").indexOf(" ") + 1),
                    resource_second:string = resource_first.replace(/\s+HTTP\/\d(\.\d)?/, ""),
                    resource:string = resource_second.replace(/\/$/, ""),
                    domain:string = (node.net.isIPv6(store.domain) === true)
                        ? `[${store.domain}]`
                        : store.domain;
                socket.write([
                    "HTTP/1.1 308",
                    `location: https://${domain}:${vars.data.server[server_id].ports.secure + resource}`,
                    "content-length: 5",
                    "",
                    "moved",
                    "",
                    ""
                ].join("\r\n"));
            // regular local traffic
            } else {
                local_service();
            }
        };
    // unhandled errors on sockets are fatal and will crash the application
    // errors on sockets resulting from stream collisions internal to node must be trapped immediately
    // trapping the error event on a socket any later will still result in a fatal application crash, as of Node 23.1.0, if the error is the result of an internal Node stream collision
    TLS_socket.on("error", function transmit_connection_handshake_error(error:node_error):void{
        log.application({
            error: error,
            message: "Socket connection error.",
            origin: server.id,
            section: "servers-web",
            status: "error",
            time: Date.now()
        });
    });
    TLS_socket.once("data", handshake);
};

export default connection;