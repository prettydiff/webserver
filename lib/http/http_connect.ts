
import create_socket from "../transmit/create_socket.ts";
import http_write from "./http_write.ts";
import vars from "../core/vars.ts";

// cspell: words prettydiff

const http_connect:http_action = function http_connect(headerList:string[], socket:websocket_client):void {
    const destination:string = headerList[0].replace(/\s+/g, " ").split(" ")[1],
        index_colon:number = destination.lastIndexOf(":"),
        index_brace:number = destination.lastIndexOf("]"),
        portString:string = (index_colon > 0 && (index_brace < 0 || (index_brace > 0 && index_brace < index_colon)))
            ? destination.slice(index_colon + 1)
            : "",
        ip:string = (portString === "")
            ? destination
            : destination.split(`:${portString}`)[0],
        port:number = Number(portString);
    if (isNaN(port) === true) {
        const headers:string[] = [
            "HTTP/1.1 400",
            `server: prettydiff/${vars.environment.name}`,
            "content-type: application/json",
            "content-length: ",
            "",
            "",
            "{",
            "    \"error\": \"Bad request\",",
            "    \"message\": \"CONNECT request method did not specify a port.\"",
            "}"
        ];
        headers[3] = headers[3] + Buffer.from([headers[6], headers[7], headers[8], headers[9]].join("\r\n")).byteLength;
        http_write(socket, headers.join("\r\n"), true);
        socket.write(headers.join("\r\n"));
    } else {
        create_socket({
            callback: null,
            handler: null,
            hash: `${socket.server_hash}-connect-${process.hrtime.bigint().toString()}`,
            ip: ip,
            port: port,
            headers: [],
            proxy: socket,
            resource: null,
            secure: (socket.encrypted === true),
            server: socket.server_hash,
            timeout: null,
            type: "http-proxy"
        });
    }
};

export default http_connect;