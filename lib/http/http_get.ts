
// this file supports HTTP methods GET and HEAD

import core from "../browser/core.ts";
import directory from "../utilities/directory.ts";
import file from "../utilities/file.ts";
import file_list from "../browser/file_list.ts";
import message_inspection from "../services/message_inspection.ts";
import node from "../core/node.ts";
import spawn from "../core/spawn.ts";
import vars from "../core/vars.ts";

/* cspell: words msvideo, nofollow, onnection, prettydiff */

const http_get:http_action = function http_get(headerList:string[], socket:websocket_client):void {
    const index0:string[] = headerList[0].replace(/^\s+/, "").replace(/\s+/, " ").split(" "),
        method:"GET"|"HEAD" = (index0.indexOf("HEAD") === 0)
            ? "HEAD"
            : "GET",
        server_id:string = socket.server_hash,
        path:string = `${vars.path.servers + server_id + vars.path.sep}assets${vars.path.sep}`,
        resource:string = index0[1],
        asset:string[] = resource.split("/"),
        fileFragment:string = asset.join(vars.path.sep).replace(/^(\\|\/)/, ""),
        payload = function http_get_payload(heading:string[], body:string):string {
            if (method === "HEAD") {
                return heading.join("\r\n");
            }
            return heading.join("\r\n") + body;
        },
        // a dynamically generated template for page HTML
        html = function http_get_html(config:config_html):string {
            const statusText:string = (function http_get_html_status():string {
                    if (config.status === 200) {
                        return "200 OK";
                    }
                    if (config.status === 404) {
                        return "404 NOT FOUND";
                    }
                    if (config.status === 500) {
                        return "500 INTERNAL SERVER ERROR";
                    }
                    return "400 BAD RESPONSE";
                }()),
                bodyText:string = config.content.join(""),
                headerText:string[] = [
                    `HTTP/1.1 ${statusText}`,
                    `content-type: ${config.content_type}`,
                    "",
                    `server: prettydiff/${vars.environment.name}`,
                    "accept-ranges: bytes",
                    "",
                    ""
                ];
            if (config.template === true) {
                const name:string = (server_id === vars.id.dashboard_server)
                        ? `${vars.environment.name.capitalize()} Dashboard`
                        : vars.data.server[server_id].config.name,
                    templateText:string[] = [
                        "<!doctype html>",
                        "<html lang=\"en\">",
                        "<head>",
                        "<meta charset=\"utf-8\"/>",
                        (config.page_title === null)
                            ? `<title>${name}</title>`
                            : `<title>${name} ${config.page_title}</title>`,
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
                        (config.template === true)
                            ? `<style type="text/css">${vars.environment.css_basic}</style>`
                            : "",
                        "<link rel=\"icon\" type=\"image/png\" href=\"data:image/png;base64,iVBORw0KGgo=\"/>",
                        "</head>",
                        "<body>",
                        `<h1>${name}</h1>`,
                        (config.status === 200)
                            ? ""
                            : `<h2>${config.status}</h2>`,
                        ""
                    ],
                    script:string = (config.script === null)
                        ? null
                        : (config.core === true)
                            ? `(${config.script.toString().replace(/\(\s*\)/, "(core)")}(${core.toString()}));`
                            : `(${config.script.toString()}());`,
                    templateEnd:string[] = (config.script === null)
                        ? [
                            "",
                            "</body></html>",
                            ""
                        ]
                        : [
                            "",
                            `<script type="application/javascript">${script}</script></body></html>`,
                            ""
                        ],
                    bodyText:string = templateText.join("\r\n") + config.content.join("\r\n") + templateEnd.join("\r\n");
                    headerText[2] = `content-length: ${Buffer.byteLength(bodyText)}`;
                return payload(headerText, bodyText);
            }
            headerText[2] = `content-length: ${Buffer.byteLength(bodyText)}`;
            return payload(headerText, bodyText);
        },
        write = function http_get_write(payload:Buffer|string, final:boolean):void {
            // this if condition and the following "else" block are critical for ensuring response messages are delivered completely and the sockets are closed appropriately.
            socket.write(payload);
            if (final === true) {
                socket.destroySoon();
            }
            message_inspection.send({
                count: 0,
                direction: "out",
                maximum_size: 0,
                message: payload.toString(),
                service: socket.server_hash,
                throttle_size: 0,
                throttle_time: 0,
                type: "web-server"
            });
        },
        notFound = function http_get_notFound():void {
            write(html({
                content: [`<p>Resource not found: <strong>${asset.join("/")}</strong></p>`],
                content_type: "text/html; utf8",
                core: false,
                page_title: "404",
                script: null,
                status: 404,
                template: true
            }), true);
        },
        stat = function http_get_stat(input:string):void {
            const statTest = function http_get_stat_statTest(stat:node_fs_BigIntStats):void {
                const directory_item = function http_get_stat_statTest_directoryItem():void {
                        const indexFile:string = `${input.replace(/\\|\/$/, "") + vars.path.sep}index.html`;
                        file.stat({
                            callback: function http_get_stat_statItem_directoryItem_callback():void {
                                input = indexFile;
                                fileItem();
                            },
                            location: indexFile,
                            no_file: function http_get_stat_statTest_directoryItem_noFile():void {
                                const callback = function http_get_stat_statTest_directoryItem_noFile_directory(list:core_directory_list):void {
                                    let index_item:number = 0,
                                        dtg:string[] = null,
                                        address:string = "";
                                    const content:string[] = [
                                            `<h2>Directory List - ${decodeURI(index0[1])}</h2>`,
                                            "<table class=\"file-list\"><thead><tr><th><button data-dir=\"1\">object</button></th><th><button data-dir=\"1\">type</button></th><th><button data-dir=\"1\">size</button></th><th><button data-dir=\"1\">modified date</button></th><th><button data-dir=\"1\">modified time</button></th><th><button data-dir=\"1\">permissions</button></th><th><button data-dir=\"1\">children</button></th></tr></thead><tbody>"
                                        ],
                                        total:number = list.length,
                                        icon:store_string = {
                                            "block_device": "\u2580",
                                            "character_device": "\u0258",
                                            "directory": "\ud83d\udcc1",
                                            "fifo_pipe": "\u275a",
                                            "file": "\ud83d\uddce",
                                            "socket": "\ud83d\udd0c",
                                            "symbolic_link": "\ud83d\udd17"
                                        },
                                        scheme:"http"|"https" = (socket.encrypted === true)
                                            ? "https"
                                            : "http",
                                        host:string = (function http_get_host():string {
                                            let index:number = headerList.length,
                                                value:string = "";
                                            do {
                                                index = index - 1;
                                                if (typeof headerList[index] === "string") {
                                                    if (headerList[index].toLowerCase().indexOf("host:") === 0) {
                                                        value = headerList[index].slice(headerList[index].indexOf(":") + 1).replace(/\s+/g, "");
                                                    } else if (headerList[index].toLowerCase().indexOf("connection:") === 0) {
                                                        headerList.splice(index, 1);
                                                        index = index + 1;
                                                    }
                                                }
                                            } while (index > 0);
                                            return value;
                                        }());
                                    list.sort(function http_get_stat_statTest_directoryItem_noFile_directory_sort(a:type_directory_item, b:type_directory_item):-1|1 {
                                        if (a[1] < b[1]) {
                                            return -1;
                                        }
                                        return 1;
                                    });
                                    do {
                                        if (list[index_item][2] === 0 && list[index_item][0].indexOf(input) !== list[index_item][0].length - input.length) {
                                            address = `${scheme}://${host + index0[1].replace(/\/$/, "") + vars.path.sep + list[index_item][5]}`;
                                            dtg = list[index_item][4].mtimeMs.dateTime(true, null).split(", ");
                                            content.push(`<tr class="${(index_item % 2 === 0) ? "even" : "odd"}"><td class="file-name"><span class="icon">${icon[list[index_item][1]]}</span> <a href="${address}">${list[index_item][5]}</a></td><td>${list[index_item][1]}</td><td data-raw="${list[index_item][4].size}">${list[index_item][4].size.commas()}</td><td data-raw="${list[index_item][4].mtimeMs}">${dtg[0]}</td><td>${dtg[1]}</td><td>${list[index_item][4].mode === null ? "" : (list[index_item][4].mode & parseInt("777", 8)).toString(8)}</td><td data-raw="${list[index_item][3]}">${list[index_item][3].commas()}</td></tr>`);
                                        }
                                        index_item = index_item + 1;
                                    } while (index_item < total);
                                    content.push("</tbody></table>");
                                    write(html({
                                        content: content,
                                        content_type: "text/html; utf8",
                                        core: true,
                                        page_title: index0[1],
                                        status: 200,
                                        template: true,
                                        script: file_list
                                    }), true);
                                };
                                directory({
                                    callback: callback,
                                    depth: 2,
                                    directory_size: false,
                                    exclusions: [],
                                    parent: false,
                                    path: input,
                                    relative: true,
                                    search: "",
                                    symbolic: false
                                });
                            },
                            section: "servers-web"
                        });
                    },
                    fileItem = function http_get_stat_statTest_fileItem():void {
                        const type_callback = function http_get_stat_statTest_fileItem_typeCallback(type:string):void {
                            const headerText:string[] = [
                                "",
                                `content-type: ${type}`,
                                "",
                                `server: prettydiff/${vars.environment.name}`,
                                "accept-ranges: bytes",
                                ""
                            ];
                            if (method === "HEAD") {
                                write(headerText.join("\r\n"), true);
                            } else {
                                let range:string = "";
                                const status:string = (function http_get_stat_statTest_fileItem_partial():string {
                                    let index:number = headerList.length;
                                    do {
                                        index = index - 1;
                                        if (headerList[index].toLowerCase().indexOf("range:") === 0) {
                                            range = headerList[index].toLowerCase().replace(/range:\s*bytes=/, "");
                                            return "HTTP/1.1 206";
                                        }
                                    } while (index > 0);
                                    return "HTTP/1.1 200";
                                }());
                                if (status === "HTTP/1.1 206") {
                                    const ranges:string[] = range.split("-"),
                                        size:number = Number(stat.size),
                                        start:number = (ranges[0] === "")
                                            ? 0
                                            : Number(ranges[0]),
                                        end:number = (ranges[1] === "" || ranges[1] === undefined)
                                            ? Math.min(start + (1024 * 1024), size)
                                            : Number(ranges[1].split("/")[0]),
                                        empty:boolean = (end - start === 0);
                                    if (empty === true) {
                                        headerText[0] = "HTTP/1.1 200";
                                        headerText[2] = "content-length: 0";
                                        write(headerText.join("\r\n"), true);
                                    } else {
                                        const stream:node_fs_ReadStream = node.fs.createReadStream(input, {
                                            end: end,
                                            start: start
                                        });
                                        headerText[0] = status;
                                        headerText[2] = `content-length: ${end - start}`;
                                        if (end === size) {
                                            headerText.splice(2, 0, `content-range: bytes ${start}-${end - 1}/${size}`);
                                        } else {
                                            headerText.splice(2, 0, `content-range: bytes ${start}-${end}/${size}`);
                                        }
                                        write(headerText.join("\r\n"), false);
                                        stream.pipe(socket);
                                        stream.on("close", function http_get_statTest_fileItem_close():void {
                                            socket.destroySoon();
                                        });
                                    }
                                } else {
                                    const stream:node_fs_ReadStream = node.fs.createReadStream(input);
                                    headerText[0] = status;
                                    headerText[2] = "transfer-encoding: chunked";
                                    stream.on("close", function http_get_stat_statTest_fileItem_close():void {
                                        write("\r\n0\r\n\r\n", true);
                                    });
                                    write(headerText.join("\r\n"), false);
                                    stream.on("data", function http_get_stat_statTest_fileItem_data(chunk:Buffer|string):void {
                                        write(`\r\n${Buffer.byteLength(chunk).toString(16)}\r\n`, false);
                                        write(chunk, false);
                                    });
                                }
                            }
                        };
                        if (vars.environment.file === true) {
                            spawn(vars.commands.file + input, function http_get_stat_statTest_fileItem_spawn(output:core_spawn_output):void {
                                const triples:string[] = output.stdout.split("; ");
                                type_callback(triples[1]);
                            }).execute();
                        } else {
                            type_callback((function http_get_stat_statTest_fileItem_contentType():string {
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
                                if (extension === "gif") {
                                    return "image/gif";
                                }
                                if (extension === "html") {
                                    return "text/html; utf8";
                                }
                                if (extension === "ico") {
                                    return "image/x-icon";
                                }
                                if (extension === "jpg" || extension === "jpeg") {
                                    return "image/jpeg";
                                }
                                if (extension === "js" || extension === "ts") {
                                    return "application/javascript; utf8";
                                }
                                if (extension === "json") {
                                    return "application/json; utf8";
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
                                return "text/plain; utf8";
                            }()));
                        }
                    };
                if (stat.isFile() === true) {
                    fileItem();
                } else if (stat.isDirectory() === true) {
                    directory_item();
                } else {
                    notFound();
                }
            };
            file.stat({
                callback: statTest,
                location: input,
                no_file: notFound,
                section: "servers-web"
            });
        },
        decode:string = decodeURI(fileFragment),
        decoded:string = (decode.includes("?") === true)
            ? decode.slice(0, decode.indexOf("?"))
            : decode;
    if (server_id === vars.id.dashboard_server) {
        if (decoded.indexOf("file-system-") > -1) {
            stat(decoded.slice(decoded.indexOf("file-system-") + 12));
            return;
        }
        if (decoded === "" || decoded.includes("/") === true || decoded.charAt(0) === "?" || decoded.charAt(0) === "#") {
            const list:string = headerList.join("\n"),
                dashboard:string = vars.environment.dashboard_page.replace("request: \"\"", `request: \`${list}\``),
                headers:string[] = [
                    "HTTP/1.1 200",
                    "content-type: text/html",
                    `content-length: ${Buffer.byteLength(dashboard)}`,
                    `server: prettydiff/${vars.environment.name}`,
                    "accept-ranges: bytes",
                    "",
                    ""
                ];
            if (method === "GET") {
                write(headers.join("\r\n") + dashboard, true);
            } else if (method === "HEAD") {
                write(headers.join("\r\n"), true);
            }
            return;
        }
        write([
            "HTTP/1.1 404",
            "content-type: text/html",
            "content-length: 0",
            `server: prettydiff/${vars.environment.name}`,
            "accept-ranges: bytes",
            "",
            ""
        ].join("\r\n"), true);
    } else if (fileFragment === "") {
        // server root html file takes the name of the server, not index.html
        stat(`${path}index.html`);
    } else {
        // all other HTTP requests
        stat(path + decoded);
    }
};

export default http_get;
