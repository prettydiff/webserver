
// supports HTTP methods DELETE, POST, PUT
// cspell: words prettydiff

import node from "../utilities/node.js";
import vars from "../utilities/vars.js";

const http_post:http_action = function http_post(headerList:string[], socket:websocket_client, server_name:string):void {
    const method:type_http_method = headerList[0].slice(0, headerList[0].indexOf(" ")).toLowerCase() as type_http_method,
            missing = function http_post_missing(status:string, input:string, err:node_childProcess_ExecException):string {
                return [
                    `HTTP/1.1 ${status}`,
                    "content-type: text/plain",
                    "server: prettydiff/webserver",
                    "",
                    "",
                    "404 NOT FOUND",
                    input,
                    (err === null)
                        ? ""
                        : JSON.stringify(err)
                ].join("\r\n");
        };
    if (vars.servers[server_name].http !== null && vars.servers[server_name].http !== undefined) {
        if (typeof vars.servers[server_name].http[method as "delete"] === "string") {
            node.child_process.exec(vars.servers[server_name].http[method as "delete"], function http_post_child(err:node_childProcess_ExecException, stdout:string):void {
                if (err === null) {
                    socket.write([
                        "HTTP/1.1 200 OK",
                        "content-type: text/plain",
                        "server: prettydiff/webserver",
                        "",
                        "",
                        stdout
                    ].join("\r\n"));
                } else {
                    socket.write(missing("503 SERVICE UNAVAILABLE", `Server ${server_name} encountered an error executing method ${method}.`, err));
                }
                socket.destroy();
            });
        } else {
            socket.write(missing("501 NOT IMPLEMENTED", `Server configuration for server ${server_name} is missing property http.${method}.`, null));
            socket.destroy();
        }
    } else {
        socket.write(missing("501 NOT IMPLEMENTED", `Server configuration for server ${server_name} is missing property http.${method}.`, null));
        socket.destroy();
    }
};

export default http_post;