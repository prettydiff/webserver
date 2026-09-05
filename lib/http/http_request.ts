
import node from "../core/node.ts";
import vars from "../core/vars.ts";

// cspell: words prettydiff

// processes HTTP tests from the dashboard UI
const http_request = function http_request(config:services_test_http, callback:(output:config_http_request_output) => void, address_input?:[string, number]):void {
    const req:string = config.headers,
        header:string = req.split("\r\n\r\n")[0].replace(/\s+$/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n"),
        headers:string[] = header.split("\n"),
        bodyRaw:string = req.split("\r\n\r\n")[1],
        body:string = (bodyRaw === undefined)
            ? ""
            : bodyRaw,
        path:string = headers[0].replace(/^[A-Z]+\s+/, ""),
        scheme:"http"|"https" = (vars.options.demo === false && config.encryption === true)
            ? "https"
            : "http";
    let index:number = headers.length,
        socket:node_net_Socket = null,
        url:URL = null,
        host:string = "",
        port:number = 0,
        address:string = "",
        chunked:boolean = false,
        chunkCount:number = 0;
    if (vars.options.demo === true) {
        host = "127.0.0.1";
        port = vars.data.server[vars.id.dashboard_server].ports.open;
        config.encryption = false;
    } else if (address_input === null || address_input === undefined) {
        do {
            index = index - 1;
            if ((/^host\s*:\s*/).test(headers[index].toLowerCase()) === true) {
                address = `${scheme}://${headers[index].toLowerCase().replace(/host\s*:\s*/, "").replace(/\s+$/, "") + path.slice(0, path.indexOf(" "))}`;
            }
            if ((/^connection:\s*keep-alive$/).test(headers[index].toLowerCase()) === true || headers[index].toLowerCase().indexOf("keep-alive:") === 0) {
                headers.splice(index, 1);
            }
            if ((/^accept-encoding\s*:/).test(headers[index].toLowerCase()) === true) {
                headers.splice(index, 1);
            }
        } while (index > 0);
        // eslint-disable-next-line no-restricted-syntax
        try {
            url = new URL(address);
        } catch {
            callback({
                error: new Error(`Error: Invalid address - ${address}`),
                chunked: null,
                chunks: 0,
                response_body_raw: "",
                response_headers: "",
                url: null
            });
            return;
        }
        port = (url.port === "")
            ? (config.encryption === true)
                ? 443
                : 80
            : Number(url.port);

        host = url.hostname.replace("[", "").replace("]", "");
        if (isNaN(port) === true) {
            callback({
                error: new Error(`Error: Port value is not a number, ${host.slice(host.indexOf(":") + 1)}`),
                chunked: null,
                chunks: 0,
                response_body_raw: "",
                response_headers: "",
                url: null
            });
            return;
        }
        if (url.hostname === undefined) {
            callback({
                error: new Error(`Error: Host value does not appear valid: ${host}`),
                chunked: null,
                chunks: 0,
                response_body_raw: "",
                response_headers: "",
                url: null
            });
            return;
        }
    } else {
        host = address_input[0];
        port = address_input[1];
    }
    if (typeof host !== "string" || host === "") {
        callback({
            error: new Error(`Error: Host value does not appear valid: ${host}`),
            chunked: null,
            chunks: 0,
            response_body_raw: "",
            response_headers: "",
            url: null
        });
        return;
    }
    if (config.encryption === true && vars.environment.interfaces.includes(host) === true) {
        let index:number = vars.data.ports_application.length;
        do {
            index = index - 1;
            if (vars.data.ports_application[index].port === port && vars.data.ports_application[index].type === "tcp" && vars.data.server[vars.data.ports_application[index].hash].ports.open === port) {
                callback({
                    error: new Error("Error: Encrypted connections not allowed to unencrypted servers."),
                    chunked: null,
                    chunks: 0,
                    response_body_raw: "",
                    response_headers: "",
                    url: null
                });
                return;
            }
        } while (index > 0);
    }
    socket = (config.encryption === true)
        ? node.tls.connect({
            host: host,
            port: port,
            rejectUnauthorized: false
        })
        : node.net.connect({
            host: host,
            port: port
        });
    socket.once("error", function http_request_error(error:node_error):void {
        if (error.code === "EPROTO" && error.syscall === "write") {
            callback({
                error: new Error(`The EPROTO error is a protocol negotiation error that occurs for one of three reasons:\n1. Remote server is using outdated TLSv1.1 which is not supported by OpenSSL3 used by Node.js since version 17.\n2. There is a defect in this application.\n3. The most likely cause is a defect in Node.js.\n\nKnown domains causing this error:\n* prettydiff.com\n* www.army.mil\n* www.treasury.gov\n\n${JSON.stringify(error)}\n\nscheme: ${(config.encryption === true) ? "https (tls)" : "http"}\nhost: ${host}\nport: ${port}`),
                chunked: null,
                chunks: 0,
                response_body_raw: "",
                response_headers: "",
                url: null
            });
        } else {
            callback({
                error: new Error(JSON.stringify(error)),
                chunked: null,
                chunks: 0,
                response_body_raw: "",
                response_headers: "",
                url: null
            });
        }
    });
    if (config.timeout > 0) {
        socket.setTimeout(config.timeout, function http_request_timeout():void {
            if (socket.writable === true) {
                callback({
                    error: new Error(`Error: request exceeded a ${config.timeout / 1000} second timeout.`),
                    chunked: null,
                    chunks: 0,
                    response_body_raw: "",
                    response_headers: "",
                    url: null
                });
                socket.end();
            }
        });
    }
    socket.once("ready", function http_request_ready():void {
        const decoder:node_stringDecoder_StringDecoder = new node.stringDecoder.StringDecoder("utf8");
        let chunks:string = "",
            fragment:string = "",
            bodyIndex:number = -1,
            contentLength:number = -1;
        if (vars.data.server[vars.id.dashboard_server].config.domain_local.indexOf(host) > -1 || vars.environment.interfaces.indexOf(host) > -1) {
            headers.push("services_http_test: true");
        }
        headers.push("");
        headers.push("");
        if (body.length > 0) {
            headers.push(body);
        }
        socket.write(headers.join("\r\n"));
        socket.on("data", function http_request_data(responseData:Buffer):void {
            if (contentLength === 0 && ((responseData.length === 5 && responseData.toString() === "0\r\n\r\n") || responseData.length === 0)) {
                socket.end();
                return;
            }
            fragment = decoder.write(responseData);
            chunkCount = chunkCount + 1;
            if (chunked === true) {
                chunks = chunks + fragment.replace(/^[0-9a-f]+\r\n/, "");
            } else {
                chunks = chunks + fragment;
            }
            if (chunkCount === 1) {
                const lower:string = chunks.toLowerCase(),
                    contentIndex:number = lower.indexOf("content-length");
                let content:string = "";
                if (contentIndex > 0) {
                    content = chunks.slice(contentIndex);
                    contentLength = Number(content.slice(content.indexOf(":") + 1, content.indexOf("\r\n")).replace(/\s+/g, ""));
                } else if ((/transfer-encoding:\s*chunked/).test(lower) === true) {
                    contentLength = 0;
                    chunked = true;
                }
            }
            if (bodyIndex < 4) {
                bodyIndex = chunks.indexOf("\r\n\r\n") + 4;
                chunks = chunks.slice(0, bodyIndex) + chunks.slice(bodyIndex).replace(/^[0-9a-f]+\r\n/, "");
            }
            if (Buffer.byteLength(chunks.slice(bodyIndex)) === contentLength) {
                socket.end();
            }
        });
        socket.once("end", function http_request_end():void {
            if (chunks.length < 1) {
                callback({
                    error: new Error("Error: message ended with no data, which indicates no web server or connection refused."),
                    chunked: null,
                    chunks: 0,
                    response_body_raw: "",
                    response_headers: "",
                    url: null
                });
            } else {
                callback({
                    error: null,
                    chunked: chunked,
                    chunks: chunkCount,
                    response_body_raw: chunks.slice(bodyIndex),
                    response_headers: chunks.slice(0, bodyIndex),
                    url: url
                });
            }
        });
    });
};

export default http_request;


