
import dateString from "../utilities/dateString.js";
import getAddress from "../utilities/getAddress.js";
import node from "../utilities/node.js";
import vars from "../utilities/vars.js";

/* cspell: words nofollow, prettydiff */

const http = function transmit_http(headerList:string[], body:Buffer|string, socket:websocket_client):void {
    const index0:string[] = headerList[0].replace(/^\s+/, "").replace(/\s+/, " ").split(" "),
        method:string = index0[0],
        resource:string = index0[1],
        scheme:"http"|"https" = (vars.secure === true)
            ? "https"
            : "http",
        socketAddress:transmit_addresses_socket = getAddress({
            socket: socket,
            type: "ws"
        }),
        host:string = (function transmit_http_host():string {
            let index:number = headerList.length;
            do {
                index = index - 1;
                if (headerList[index].toLowerCase().indexOf("host:") === 0) {
                    return headerList[index].slice(headerList[index].indexOf(":") + 1).replace(/\s+/g, "");
                }
            } while (index > 0);
            return "";
        }()),
        domain:string = host.replace(`:${socketAddress.local.port}`, "");
    if (method === "GET") {
        if (domain === "www.x") {
            const asset:string[] = resource.split("/"),
                fileFragment:string = (index0[1] === "/")
                    ? `${vars.sep}index.html`
                    : asset.join(vars.sep),
                filePath:string = vars.path.webRoot + fileFragment.replace(/%\d{2}/g, function transmit_http_uriEscape(input:string):string {
                    return String.fromCharCode(parseInt(`00${input.slice(1)}`, 16));
                }),
                html = function transmit_http_html(config:config_html):string {
                    const statusText:string = (function transmit_http_html_status():string {
                            if (config.status === 200) {
                                return "200 OK";
                            }
                            if (config.status === 404) {
                                return "404 NOT FOUND";
                            }
                            if (config.status === 500) {
                                return "500 INTERNAL SERVER ERROR";
                            }
                        }()),
                        bodyText:string = config.content.join(""),
                        headerText:string[] = [
                            `HTTP/1.1 ${statusText}`,
                            `content-type: ${config.content_type}`,
                            "",
                            "server: prettydiff/webserver",
                            "",
                            ""
                        ];
                    if (config.template === true && config.binary === false) {
                        const templateText:string[] = [
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
                            "<link href=\"/styles.css\" media=\"all\" rel=\"stylesheet\" type=\"text/css\"/>",
                            "<link rel=\"icon\" type=\"image/png\" href=\"data:image/png;base64,iVBORw0KGgo=\"/>",
                            "</head>",
                            "<body>",
                            "<h1>Cheney</h1>",
                            (config.status === 200)
                                ? ""
                                : `<h2>${config.status}</h2>`
                        ],
                        templateEnd:string[] = [
                            "</body></html>"
                        ],
                        bodyText:string = templateText.join("\r\n") + config.content.join("\r\n") + templateEnd.join("\r\n");
                        headerText[2] = `content-length: ${Buffer.from(bodyText).length}`;
                        return headerText.join("\r\n") + bodyText;
                    }
                    if (config.binary === true) {
                        headerText[2] = `content-length: ${config.content.length}`;
                        return headerText.join("\r\n");
                    }
                    headerText[2] = `content-length: ${Buffer.from(bodyText).length}`;
                    return headerText.join("\r\n") + bodyText;
                };
            node.fs.stat(filePath, function transmit_http_stat(ers:node_error, stat:node_fs_Stats):void {
                const notFound = function transmit_http_stat_notFound():void {
                        write(html({
                            binary: false,
                            content: [`<p>Resource not found: <strong>${asset.join("/")}</strong></p>`],
                            content_type: "text/html; utf8",
                            status: 404,
                            template: true
                        }));
                    },
                    serverError = function transmit_http_stat_serverError(errorObject:node_error, errorText:string):void {
                        write(html({
                            binary: false,
                            content: [
                                errorText,
                                JSON.stringify(errorObject)
                            ],
                            content_type: "text/html; utf8",
                            status: 500,
                            template: true
                        }));
                    },
                    write = function transmit_http_stat_write(payload:Buffer|string):void {
                        socket.write(payload, function transmit_http_stat_write_callback():void {
                            socket.destroy();
                        });
                    };
                if (ers === null) {
                    if (stat.isFile() === true) {
                        node.fs.readFile(filePath, function transmit_http_stat_readFile(erf:node_error, fileContents:Buffer):void {
                            if (erf === null) {
                                const content_type:string = (function transmit_http_html_status():string {
                                    const extension:string = filePath.slice(filePath.lastIndexOf(".") + 1);
                                    if (extension === "html") {
                                        return "text/html; utf8";
                                    }
                                    if (extension === "xml") {
                                        return "application/xml; utf8";
                                    }
                                    if (extension === "xhtml") {
                                        return "application/xml+html; utf8";
                                    }
                                    if (extension === "css") {
                                        return "text/css; utf8";
                                    }
                                    if (extension === "js") {
                                        return "application/javascript; utf8";
                                    }
                                    if (extension === "png") {
                                        return "image/png";
                                    }
                                    if (extension === "jpg" || extension === "jpeg") {
                                        return "image/jpeg";
                                    }
                                    if (extension === "mp3") {
                                        return "audio/mpeg";
                                    }
                                    if (extension === "mp4" || extension === "mpeg4" || extension === "mkv") {
                                        return "video/mp4";
                                    }
                                }()),
                                binary:boolean = (content_type.indexOf("; utf8") < 0);
                                if (binary === true) {
                                    socket.write(html({
                                        binary: binary,
                                        content: fileContents,
                                        content_type: content_type,
                                        status: 200,
                                        template: false
                                    }));
                                    write(fileContents);
                                } else {
                                    write(html({
                                        binary: binary,
                                        content: [fileContents.toString()],
                                        content_type: content_type,
                                        status: 200,
                                        template: false
                                    }));
                                }
                            } else {
                                serverError(erf, `<p>Error attempting to read from requested file at: <strong>${filePath}</strong></p>`);
                            }
                        });
                    } else if (stat.isDirectory() === true) {
                        node.fs.readdir(filePath, function transmit_http_stat_readDir(erd:node_error, dirList:string[]):void {
                            if (erd === null) {
                                let index:number = 0;
                                const stat_list:statList = [],
                                    total:number = dirList.length,
                                    stat_complete = function transmit_http_stat_readDir_statComplete():void {
                                        let index_item:number = 0,
                                            item:stat_item = null,
                                            dtg:string[] = null,
                                            address:string = "";
                                        const content:string[] = [
                                                "<h2>Directory List</h2>",
                                                `<p>${index0[1]}</p>`,
                                                "<table><thead><tr><th>object</th><th>type</th><th>modified date</th><th>modified time</th></tr></thead><tbody>"
                                            ],
                                            total:number = stat_list.length,
                                            icon:store_string = {
                                                "block_device": "\u2580",
                                                "character_device": "\u0258",
                                                "directory": "\ud83d\udcc1",
                                                "fifo_pipe": "\u275a",
                                                "file": "\ud83d\uddce",
                                                "socket": "\ud83d\udd0c",
                                                "symbolic_link": "\ud83d\udd17"
                                            };
                                        stat_list.sort(function transmit_http_stat_readDir_statComplete_sort(a:stat_item, b:stat_item):-1|1 {
                                            if (a.type === "directory" && b.type !== "directory") {
                                                return -1;
                                            }
                                            if (a.type !== "directory" && b.type === "directory") {
                                                return 1;
                                            }
                                            if (a.type === "file" && b.type !== "directory" && b.type !== "file") {
                                                return -1;
                                            }
                                            if (a.type !== "directory" && a.type !== "file" && b.type === "directory") {
                                                return 1;
                                            }
                                            if (a.type < b.type) {
                                                return -1;
                                            }
                                            if (a.type > b.type) {
                                                return 1;
                                            }
                                            if (a.type === b.type) {
                                                if (a.path < b.path) {
                                                    return -1;
                                                }
                                            }
                                            return 1;
                                        });
                                        do {
                                            item = stat_list[index_item];
                                            address = `${scheme}://${host + index0[1] + vars.sep + item.path.replace(/\\/g, "/")}`;
                                            dtg = dateString(item.mtimeMs).split(", ");
                                            content.push(`<tr class="${(index_item % 2 === 0) ? "even" : "odd"}"><td>${icon[item.type]} <a href="${address}">${item.path}</a></td><td>${item.type}</td><td data-time="${item.mtimeMs}">${dtg[0]}</td><td>${dtg[1]}</td></tr>`);
                                            index_item = index_item + 1;
                                        } while (index_item < total);
                                        content.push("</tbody></table>");
                                        write(html({
                                            binary: false,
                                            content: content,
                                            content_type: "text/html; utf8",
                                            status: 200,
                                            template: true
                                        }));
                                    },
                                    stat_step = function transmit_http_stat_readDir_statStep():void {
                                        node.fs.lstat(filePath + vars.sep + dirList[index], function transmit_http_stat_readDir_stat(efs:node_error, stat:node_fs_Stats):void {
                                            if (stat.isFile() === true) {
                                                populate("file", stat);
                                                return;
                                            }
                                            if (stat.isDirectory() === true) {
                                                populate("directory", stat);
                                                return;
                                            }
                                            if (stat.isSymbolicLink() === true) {
                                                populate("symbolic_link", stat);
                                                return;
                                            }
                                            if (stat.isBlockDevice() === true) {
                                                populate("block_device", stat);
                                                return;
                                            }
                                            if (stat.isCharacterDevice() === true) {
                                                populate("character_device", stat);
                                                return;
                                            }
                                            if (stat.isFIFO() === true) {
                                                populate("fifo_pipe", stat);
                                                return;
                                            }
                                            if (stat.isSocket() === true) {
                                                populate("socket", stat);
                                                return;
                                            }
                                        });
                                    },
                                    populate = function transmit_http_stat_readDir_populate(type:file_type, stat:node_fs_Stats):void {
                                        const stat_item:stat_item = stat as stat_item;
                                        stat_item.type = type;
                                        stat_item.path = dirList[index];
                                        stat_list.push(stat_item);
                                        index = index + 1;
                                        if (index === total) {
                                            stat_complete();
                                        } else {
                                            stat_step();
                                        }
                                    };
                                stat_step();
                            } else {
                                serverError(erd, `<p>Error attempting to read directory list at: <strong>${filePath}</strong></p>`);
                            }
                        });
                    } else {
                        notFound();
                    }
                } else {
                    notFound();
                }
            });
        } else if (vars.portMap[domain] !== undefined) {
            const proxy:node_net_Socket = node.net.connect({
                host: socketAddress.local.address,
                port: vars.portMap[domain]
            });
            socket.pipe(proxy);
            proxy.pipe(socket);
            proxy.once("close", function transmit_http_proxyClose():void {
                proxy.destroy();
                socket.destroy();
            });
            proxy.on("error", function transmit_http_proxyError():void {
                // this worthless error trapping prevents an "unhandled error" escalation that breaks the process
                return null;
            });
            headerList.push("");
            headerList.push("");
            proxy.write(headerList.join("\r\n"));
            if (body !== null && body !== "") {
                proxy.write(body);
            }
        } else {
            socket.destroy();
        }
    }
};

export default http;
