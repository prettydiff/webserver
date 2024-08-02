
import dateString from "../utilities/dateString.js";
import node from "../utilities/node.js";
import redirection from "./redirection.js";
import vars from "../utilities/vars.js";

/* cspell: words msvideo, nofollow, onnection, prettydiff */

const http = function transmit_http(headerList:string[], socket:websocket_client):void {
    const index0:string[] = (vars.redirect_internal[vars.domain] === undefined)
            ? headerList[0].replace(/^\s+/, "").replace(/\s+/, " ").split(" ")
            : redirection(vars.domain, headerList[0].replace(/^\s+/, "").replace(/\s+/, " ")).toString().split(" "),
        resource:string = index0[1],
        asset:string[] = resource.split("/"),
        fileFragment:string = asset.join(vars.sep),
        // a dynamically generated template for page HTML
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
            if (config.template === true) {
                const templateText:string[] = [
                    "<!doctype html>",
                    "<html lang=\"en\">",
                    "<head>",
                    "<meta charset=\"utf-8\"/>",
                    (config.page_title === null)
                        ? "<title>Cheney</title>"
                        : `<title>Cheney ${config.page_title}</title>`,
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
                templateEnd:string[] = (config.script === null)
                    ? ["</body></html"]
                    : [
                        `<script type="application/javascript" src="${config.script}"></script></body></html>`
                    ],
                bodyText:string = templateText.join("\r\n") + config.content.join("\r\n") + templateEnd.join("\r\n");
                headerText[2] = `content-length: ${Buffer.from(bodyText).length}`;
                return headerText.join("\r\n") + bodyText;
            }
            headerText[2] = `content-length: ${Buffer.from(bodyText).length}`;
            return headerText.join("\r\n") + bodyText;
        },
        statTest = function transmit_http_statTest(input:string):void {
            input = vars.path.web_root + fileFragment.replace(/%\d{2}/g, function transmit_http_statTest_uriEscape(input:string):string {
                return String.fromCharCode(parseInt(`00${input.slice(1)}`, 16));
            }).replace(/^\\|\//, "");
            node.fs.stat(input, {
                bigint: true
            }, function transmit_http_statTest_stat(ers:node_error, stat:node_fs_BigIntStats):void {
                const notFound = function transmit_http_statTest_stat_notFound():void {
                        write(html({
                            content: [`<p>Resource not found: <strong>${asset.join("/")}</strong></p>`],
                            content_type: "text/html; utf8",
                            page_title: "404",
                            script: null,
                            status: 404,
                            template: true
                        }));
                    },
                    serverError = function transmit_http_statTest_stat_serverError(errorObject:node_error, errorText:string):void {
                        write(html({
                            content: [
                                errorText,
                                JSON.stringify(errorObject)
                            ],
                            content_type: "text/html; utf8",
                            page_title: "500",
                            script: null,
                            status: 500,
                            template: true
                        }));
                    },
                    write = function transmit_http_statTest_stat_write(payload:Buffer|string):void {
                        socket.write(payload, function transmit_http_statTest_stat_write_callback():void {
                            socket.destroy();
                        });
                    },
                    directory = function transmit_http_statTest_stat_directory():void {
                        const indexFile:string = `${input.replace(/\\|\/$/, "") + vars.sep}index.html`;
                        node.fs.stat(indexFile, function transmit_http_statTest_stat_directory_index(eri:node_error):void {
                            if (eri === null) {
                                input = indexFile;
                                file();
                            } else if (eri.code === "ENOENT") {
                                node.fs.readdir(input, function transmit_http_statTest_stat_directory_index_readDir(erd:node_error, dirList:string[]):void {
                                    if (erd === null) {
                                        let index:number = 0;
                                        const stat_list:statList = [],
                                            total:number = dirList.length,
                                            stat_complete = function transmit_http_statTest_stat_directory_index_readDir_statComplete():void {
                                                let index_item:number = 0,
                                                    item:stat_item = null,
                                                    dtg:string[] = null,
                                                    address:string = "";
                                                const content:string[] = [
                                                        `<h2>Directory List - ${index0[1]}</h2>`,
                                                        "<table><thead><tr><th>object <button>⇅</button></th><th>type <button>⇅</button></th><th>modified date <button>⇅</button></th><th>modified time <button>⇅</button></th></tr></thead><tbody>"
                                                    ],
                                                    scheme:"http"|"https" = (socket.encrypted === true)
                                                        ? "https"
                                                        : "http",
                                                    total:number = stat_list.length,
                                                    icon:store_string = {
                                                        "block_device": "\u2580",
                                                        "character_device": "\u0258",
                                                        "directory": "\ud83d\udcc1",
                                                        "fifo_pipe": "\u275a",
                                                        "file": "\ud83d\uddce",
                                                        "socket": "\ud83d\udd0c",
                                                        "symbolic_link": "\ud83d\udd17"
                                                    },
                                                    host:string = (function transmit_http_host():string {
                                                        let index:number = headerList.length,
                                                            colon:number = -1,
                                                            value:string = "";
                                                        do {
                                                            index = index - 1;
                                                            if (headerList[index].toLowerCase().indexOf("host:") === 0) {
                                                                value = headerList[index].slice(headerList[index].indexOf(":") + 1).replace(/\s+/g, "");
                                                                colon = value.indexOf(":");
                                                                value = (colon > 0)
                                                                    ? value.slice(0, colon)
                                                                    : value;
                                                            } else if (headerList[index].toLowerCase().indexOf("connection:") === 0) {
                                                                headerList.splice(index, 1);
                                                                index = index + 1;
                                                            }
                                                        } while (index > 0);
                                                        return value;
                                                    }());
                                                stat_list.sort(function transmit_http_statTest_stat_directory_index_readDir_statComplete_sort(a:stat_item, b:stat_item):-1|1 {
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
                                                    content: content,
                                                    content_type: "text/html; utf8",
                                                    page_title: index0[1],
                                                    status: 200,
                                                    template: true,
                                                    script: "/browser_scripts/fileList.js"
                                                }));
                                            },
                                            stat_step = function transmit_http_statTest_stat_directory_readDir_statStep():void {
                                                node.fs.lstat(input + vars.sep + dirList[index], function transmit_http_statTest_stat_directory_index_readDir_statStep_lstat(efs:node_error, stat:node_fs_Stats):void {
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
                                            populate = function transmit_http_statTest_stat_directory_index_readDir_populate(type:file_type, stat:node_fs_Stats):void {
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
                                        serverError(erd, `<p>Error attempting to read directory list at: <strong>${input}</strong></p>`);
                                    }
                                });
                            } else {
                                serverError(eri, `Error accessing file path: ${indexFile}`);
                            }
                        });
                    },
                    file = function transmit_http_statTest_stat_file():void {
                        const content_type:string = (function transmit_http_statTest_stat_file_contentType():string {
                                const extension:string = input.slice(input.lastIndexOf(".") + 1);
                                if (extension === "avi") {
                                    return "video/x-msvideo";
                                }
                                if (extension === "css") {
                                    return "text/css; utf8";
                                }
                                if (extension === "flv") {
                                    return "video/x-flv";
                                }
                                if (extension === "html") {
                                    return "text/html; utf8";
                                }
                                if (extension === "jpg" || extension === "jpeg") {
                                    return "image/jpeg";
                                }
                                if (extension === "js") {
                                    return "application/javascript; utf8";
                                }
                                if (extension === "mp3") {
                                    return "audio/mpeg";
                                }
                                if (extension === "mp4" || extension === "mpeg4" || extension === "mkv") {
                                    return "video/mp4";
                                }
                                if (extension === "png") {
                                    return "image/png";
                                }
                                if (extension === "wmv") {
                                    return "video/x-ms-wmv";
                                }
                                if (extension === "xhtml") {
                                    return "application/xml+html; utf8";
                                }
                                if (extension === "xml") {
                                    return "application/xml; utf8";
                                }
                            }()),
                            headerText:string[] = [
                                `HTTP/1.1 200`,
                                `content-type: ${content_type}`,
                                `content-length: ${Number(stat.size)}`,
                                "server: prettydiff/webserver",
                                "",
                                ""
                            ];
                        // sometimes stat.size reports the wrong file size
                        if (stat.size === stat.blksize && content_type.includes("utf8") === true) {
                            node.fs.readFile(input, function transmit_http_statTest_stat_file_read(err:node_error, file:Buffer):void {
                                if (err === null) {
                                    headerText[2] = `content-length: ${file.length}`;
                                    write(headerText.join("\r\n") + file.toString());
                                } else {
                                    serverError(err, `Error attempting to read file: ${index0[1]}`);
                                }
                            });
                        } else {
                            const stream:node_fs_ReadStream = node.fs.createReadStream(input);
                            socket.write(headerText.join("\r\n"));
                            stream.pipe(socket);
                            stream.on("close", function transmit_http_statTest_stat_file_close():void {
                                socket.destroy();
                            });
                        }
                    };
                if (ers === null) {
                    if (stat.isFile() === true) {
                        file();
                    } else if (stat.isDirectory() === true) {
                        directory();
                    } else {
                        notFound();
                    }
                } else {
                    if ((/index\.html$/).test(input) === true) {
                        transmit_http_statTest(asset.join(vars.sep));
                    } else {
                        notFound();
                    }
                }
            });
        };
    statTest(fileFragment);
};

export default http;
