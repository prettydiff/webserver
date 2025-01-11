
import node from "../utilities/node.js";
import send from "../transmit/send.js";
import vars from "../utilities/vars.js";

const http_request = function http_request(socket_data:socket_data, transmit:transmit_socket):void {
    const data:services_http_test = socket_data.data as services_http_test,
        req:string = data.request,
        headers:string[] = req.replace(/\s+$/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n"),
        path:string = headers[0].replace(/^[A-Z]+\s+/, ""),
        write = function http_request_write(message:string):void {
            send({
                data: {
                    encryption: data.encryption,
                    request: message
                },
                service: "dashboard-http"
            }, transmit.socket as websocket_client, 1);
            if (socket !== null) {
                socket.destroy();
            }
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
            break;
        }
    } while (index > 0);
    // eslint-disable-next-line no-restricted-syntax
    try {
        url = new URL(address);
    } catch {
        write(`Error: Invalid address - ${address}`);
        return;
    }
    port = (url.port === "")
        ? (data.encryption === true)
            ? 443
            : 80
        : Number(url.port);

    host = url.hostname.replace("[", "").replace("]", "");
    if (isNaN(port) === true) {
        write(`Error: Port value is not a number, ${host.slice(host.indexOf(":") + 1)}`);
        return;
    }
    if (url.hostname === undefined) {
        write(`Error: Host value does not appear valid: ${host}`);
        return;
    }
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
    socket.once("error", function http_request_error(error:node_error):void {
        if (error.code === "EPROTO" && error.syscall === "write") {
            write("Remote server is likely using TLSv1.1 which is not supported by OpenSSL3 used by Node.js since version 17.");
        } else {
            write(JSON.stringify(error));
        }
    });
    socket.once("ready", function http_request_ready():void {
        const chunks:Buffer[] = [];
        if (vars.servers.dashboard.config.domain_local.indexOf(host) > -1 || vars.interfaces.indexOf(host) > -1) {
            headers.push("dashboard-http: true");
        }
        headers.push("");
        headers.push("");
        socket.write(headers.join("\r\n"));
        socket.on("data", function http_request_data(responseData:Buffer):void {
            chunks.push(responseData);
        });
        socket.once("end", function http_request_end():void {
            const urls:string[] = [
                ""
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
            write(`${JSON.stringify(url)}\n{${urls.join("\n    ").replace(/,$/, "")}\n}\n\n${chunks.join("").toString()}`);
        });
    });
};

export default http_request;


