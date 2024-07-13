
import error from "../utilities/error.js";
import node from "../utilities/node.js";
import vars from "../utilities/vars.js";

const http = function transmit_http(headerList:string[], body:Buffer|string, socket:websocket_client):void {
    const buf:boolean = Buffer.isBuffer(body),
        index0:string[] = headerList[0].replace(/^\s+/, "").replace(/\s+/, " ").split(" "),
        method:string = index0[0],
        uri:string[] = index0[1].split("/"),
        host:string = (function transmit_http_host():string {
            let index:number = headerList.length;
            do {
                index = index - 1;
                if (headerList[index].toLowerCase().indexOf("host:") === 0) {
                    return headerList[index].slice(headerList[index].indexOf(":") + 1).replace(/\s+/g, "");
                }
            } while (index > 0);
            return "";
        }());
    if (method === "GET") {
        if (host.indexOf("www.x") === 0) {
            const fileFragment:string = (index0[1] === "/")
                    ? `${vars.sep}index.html`
                    : uri.join(vars.sep),
                filePath:string = vars.projectPath.replace(`${vars.sep}webserver${vars.sep}`, "") + fileFragment,
                html = function transmit_http_html(status:string, content:Buffer|string[], template:boolean):string {
                    const statusText:string = (function transmit_http_html_status():string {
                            if (status === "200") {
                                return "200 OK";
                            }
                            if (status === "404") {
                                return "404 NOT FOUND";
                            }
                        }()),
                        contentType:string = (function transmit_http_html_status():string {
                            if (status === "200") {
                                const extension:string = filePath.slice(filePath.lastIndexOf(".") + 1);
                                if (extension === "html") {
                                    return "text/html";
                                }
                                if (extension === "xml") {
                                    return "application/xml";
                                }
                                if (extension === "xhtml") {
                                    return "application/xml+html";
                                }
                                if (extension === "css") {
                                    return "text/css";
                                }
                                if (extension === "js") {
                                    return "application/javascript";
                                }
                                if (extension === "png") {
                                    return "image/png";
                                }
                                if (extension === "jpg" || extension === "jpeg") {
                                    return "image/jpeg";
                                }
                            }
                            return "text/html";
                        }()),
                        headerText:string[] = [
                            `HTTP/1.1 ${statusText}`,
                            `content-type: ${contentType}; utf8`,
                            "",
                            "server: prettydiff/webserver",
                            "",
                            ""
                        ],
                        templateText:string[] = [
                            "<!doctype html>",
                            "<html lang=\"en\">",
                            "<head>",
                            "<meta charset=\"utf-8\"/>",
                            "<title>Cheney</title>",
                            "<meta content=\"text/html;charset=UTF-8\" http-equiv=\"Content-Type\"/>",
                            "<meta content=\"width=device-width, initial-scale=1\" name=\"viewport\"/>",
                            "<meta content=\"noindex, nofollow\" name=\"robots\"/>",
                            "<meta content=\"#fff\" name=\"theme-color\"/>",
                            "<meta content=\"Global\" name=\"distribution\"/>",
                            "<meta content=\"en\" http-equiv=\"Content-Language\"/>",
                            "<meta content=\"blendTrans(Duration=0)\" http-equiv=\"Page-Enter\"/>",
                            "<meta content=\"blendTrans(Duration=0)\" http-equiv=\"Page-Exit\"/>",
                            "<meta content=\"text/css\" http-equiv=\"content-style-type\"/>",
                            "<meta content=\"application/javascript\" http-equiv=\"content-script-type\"/>",
                            "<meta content=\"#bbbbff\" name=\"msapplication-TileColor\"/>",
                            "<link href=\"styles.css\" media=\"all\" rel=\"stylesheet\" type=\"text/css\"/>", 
                            "</head>",
                            "<body>",
                            "<h1>Cheney</h1>"
                        ],
                        templateEnd:string[] = [
                            "</body></html>"
                        ];
                    if (template === true) {
                        const bodyText:string = templateText.join("\r\n") + content.join("\r\n") + templateEnd;
                        headerText[2] = `content-length: ${Buffer.from(bodyText).length}`;
                        return headerText.join("\r\n") + bodyText;
                    } else {
                        if (Buffer.isBuffer(content) === true) {
                            headerText[2] = `content-length: ${content.length}`;
                            return headerText.join("\r\n") + content.toString();
                        }
                        const bodyText:string = content.join("");
                        headerText[2] = `content-length: ${Buffer.from(bodyText).length}`;
                        return headerText.join("\r\n") + bodyText;
                    }
                };console.log(filePath);
            node.fs.stat(filePath, function transmit_http_stat(ers:node_error, stat:node_fs_Stats):void {
                if (ers === null) {
                    if (stat.isFile() === true) {
                        node.fs.readFile(filePath, function transmit_http_stat_readFile(erf:node_error, fileContents:Buffer):void {
                            if (erf === null) {
                                const response:string = html("200", [fileContents.toString()], false);
                                socket.write(response);
                                socket.destroy();
                            }
                        });
                    }
                } else {
                    const response:string = html("404", [
                        "<p>HTTP: 404</p>",
                        `<p>Resource not found: <strong>${uri.join("/")}</strong></p>`
                    ], true);
                    socket.write(response);
                    socket.destroy();
                }
            });
        }
    }
};

export default http;