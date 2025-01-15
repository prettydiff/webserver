
import node from "../utilities/node.js";
import send from "../transmit/send.js";
import vars from "../utilities/vars.js";

const http_request = function http_request(socket_data:socket_data, transmit:transmit_socket):void {
    const data:services_http_test = socket_data.data as services_http_test,
        req:string = data.headers,
        headers:string[] = req.replace(/\s+$/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n"),
        path:string = headers[0].replace(/^[A-Z]+\s+/, ""),
        write = function http_request_write(body:string, headers:string, uri:boolean):void {
            const output:services_http_test = {
                body: body,
                encryption: data.encryption,
                headers: headers,
                uri: (uri === true)
                    ? urlOutput()
                    : ""
            };
            send({
                data: output,
                service: "dashboard-http"
            }, transmit.socket as websocket_client, 1);
            if (socket !== null) {
                socket.destroy();
            }
        },
        urlOutput = function http_request_urlOutput():string {
            const urls:string[] = [
                    "",
                    `"absolute": ${JSON.stringify(url)},`
                ],
                urlPush = function http_request_data_urlPush(input:"hash"|"host"|"hostname"|"origin"|"password"|"pathname"|"port"|"protocol"|"search"|"username"):void {
                    urls.push(`"${input}": "${url[input]}",`);
                };   
            urlPush("origin");
            urlPush("protocol");
            urlPush("username");
            urlPush("password");
            urlPush("host");
            urlPush("hostname");
            urlPush("port");
            urlPush("pathname");
            urlPush("search");
            urlPush("hash");
            return `{${urls.join("\n    ")}\n}`;
        },
        scheme:"http"|"https" = (data.encryption === true)
            ? "https"
            : "http";
    let index:number = headers.length,
        socket:node_net_Socket = null,
        url:URL = null,
        host:string = "",
        port:number = 0,
        address:string = "";
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
        write(`Error: Invalid address - ${address}`, "", false);
        return;
    }
    port = (url.port === "")
        ? (data.encryption === true)
            ? 443
            : 80
        : Number(url.port);

    host = url.hostname.replace("[", "").replace("]", "");
    if (isNaN(port) === true) {
        write(`Error: Port value is not a number, ${host.slice(host.indexOf(":") + 1)}`, "", false);
        return;
    }
    if (url.hostname === undefined) {
        write(`Error: Host value does not appear valid: ${host}`, "", true);
        return;
    };
    socket = (data.encryption === true)
        ? node.tls.connect({
            host: host,
            port: port,
            rejectUnauthorized: false
        })
        : node.net.connect({
            host: host,
            port: port
        });
    socket.setTimeout(5000);
    socket.once("error", function http_request_error(error:node_error):void {
        if (error.code === "EPROTO" && error.syscall === "write") {
            write("Remote server is likely using TLSv1.1 which is not supported by OpenSSL3 used by Node.js since version 17.", "", true);
        } else {
            write(JSON.stringify(error), "", true);
        }
    });
    socket.once("ready", function http_request_ready():void {
        const decoder:node_stringDecoder_StringDecoder = new node.stringDecoder.StringDecoder("utf8");
        let chunks:string = "",
            fragment:string = "",
            bodyIndex:number = -1,
            contentLength:number = -1;
        if (vars.servers.dashboard.config.domain_local.indexOf(host) > -1 || vars.interfaces.indexOf(host) > -1) {
            headers.push("dashboard-http: true");
        }
        headers.push("");
        headers.push("");
        socket.write(headers.join("\r\n"));
        socket.on("data", function http_request_data(responseData:Buffer):void {
            if (contentLength === 0 && ((responseData.length === 5 && responseData.toString() === "0\r\n\r\n") || responseData.length === 0)) {
                socket.end();
                return;
            }
            fragment = decoder.write(responseData);
            chunks = chunks + fragment;
            if (bodyIndex < 4) {
                const lower:string = chunks.toLowerCase(),
                    contentIndex:number = lower.indexOf("content-length");
                let content:string = "";
                bodyIndex = chunks.indexOf("\r\n\r\n") + 4;
                if (contentIndex > 0) {
                    content = chunks.slice(contentIndex);
                    contentLength = Number(content.slice(content.indexOf(":") + 1, content.indexOf("\r\n")).replace(/\s+/g, ""));
                } else if ((/transfer-encoding:\s*chunked/).test(lower) === true) {
                    contentLength = 0;
                }
            }
            if (Buffer.byteLength(chunks.slice(bodyIndex)) === contentLength) {
                socket.end();
            }
        });
        socket.once("end", function http_request_end():void {
            if (chunks.length < 1) {
                write("Error: message ended with no data, which indicates no web server or connection refused.", "", true);
            } else {
                write(chunks.slice(bodyIndex), chunks.slice(0, bodyIndex), true);
            }
        });
    });
};

export default http_request;


