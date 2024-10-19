
// this file supports HTTP methods GET and HEAD

import commas from "../utilities/commas.js";
import core from "../browser/core.js";
import dateString from "../utilities/dateString.js";
import dashboard from "../dashboard/dashboard_script.js";
import directory from "../utilities/directory.js";
import file from "../utilities/file.js";
import file_list from "../browser/file_list.js";
import node from "../utilities/node.js";
import vars from "../utilities/vars.js";

/* cspell: words msvideo, nofollow, onnection, prettydiff */

const http_get:http_action = function http_get(headerList:string[], socket:websocket_client):void {
    let input:string = "";
    const index0:string[] = headerList[0].replace(/^\s+/, "").replace(/\s+/, " ").split(" "),
        method:"GET"|"HEAD" = (index0.indexOf("HEAD") === 0)
            ? "HEAD"
            : "GET",
        resource:string = index0[1],
        asset:string[] = resource.split("/"),
        server_name:string = socket.server,
        fileFragment:string = asset.join(vars.sep).replace(/^(\\|\/)/, ""),
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
                const name:string = (server_name === "dashboard")
                        ? "Server Management"
                        : server_name,
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
                        "<link href=\"/styles.css\" media=\"all\" rel=\"stylesheet\" type=\"text/css\"/>",
                        "<link rel=\"icon\" type=\"image/png\" href=\"data:image/png;base64,iVBORw0KGgo=\"/>",
                        "</head>",
                        `<body${(server_name === "dashboard")
                            ? " id=\"dashboard\">"
                            : ">"}`,
                        `<h1>${name}</h1>`,
                        (config.status === 200)
                            ? ""
                            : `<h2>${config.status}</h2>`
                    ],
                    script:string = (config.script === null)
                        ? null
                        : (config.core === true)
                            ? `(${config.script.toString().replace(/\(\s*\)/, "(core)")}(${core.toString()}));`
                            : `(${config.script.toString()}());`,
                    templateEnd:string[] = (config.script === null)
                        ? ["</body></html"]
                        : [
                            `<script type="application/javascript">${script}</script></body></html>`
                        ],
                    bodyText:string = templateText.join("\r\n") + config.content.join("\r\n") + templateEnd.join("\r\n");
                    headerText[2] = `content-length: ${Buffer.from(bodyText).length}`;
                return payload(headerText, bodyText);
            }
            headerText[2] = `content-length: ${Buffer.from(bodyText).length}`;
            return payload(headerText, bodyText);
        },
        write = function http_get_write(payload:Buffer|string):void {
            socket.write(payload, function http_get_write_callback():void {
                socket.destroy();
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
            }));
        },
        statTest = function http_get_statTest(stat:node_fs_BigIntStats):void {
            const serverError = function http_get_statTest_serverError(errorObject:node_error, errorText:string):void {
                    write(html({
                        content: [
                            errorText,
                            JSON.stringify(errorObject)
                        ],
                        content_type: "text/html; utf8",
                        core: false,
                        page_title: "500",
                        script: null,
                        status: 500,
                        template: true
                    }));
                },
                directory_item = function http_get_statTest_directoryItem():void {
                    const indexFile:string = `${input.replace(/\\|\/$/, "") + vars.sep}index.html`;
                    file.stat({
                        callback: function http_get_statItem_directoryItem_callback():void {
                            input = indexFile;
                            fileItem();
                        },
                        error_terminate: null,
                        location: indexFile,
                        no_file: function http_get_statTest_directoryItem_noFile():void {
                            const callback = function http_get_statTest_directoryItem_noFile_directory(dir:directory_list|string[]):void {
                                let index_item:number = 0,
                                    dtg:string[] = null,
                                    address:string = "";
                                const list:directory_list = dir as directory_list,
                                    content:string[] = [
                                        `<h2>Directory List - ${decodeURI(index0[1])}</h2>`,
                                        "<table><thead><tr><th>object <button>⇅</button></th><th>type <button>⇅</button></th><th>size <button>⇅</button></th><th>modified date <button>⇅</button></th><th>modified time <button>⇅</button></th><th>children <button>⇅</button></th></tr></thead><tbody>"
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
                                do {
                                    if (list[index_item][3] === 0 && list[index_item][0].indexOf(input) !== list[index_item][0].length - input.length) {
                                        address = `${scheme}://${host + index0[1].replace(/\/$/, "") + vars.sep + list[index_item][0]}`;
                                        dtg = dateString(list[index_item][5].mtimeMs).split(", ");
                                        content.push(`<tr class="${(index_item % 2 === 0) ? "even" : "odd"}"><td><span class="icon">${icon[list[index_item][1]]}</span> <a href="${address}">${list[index_item][0]}</a></td><td>${list[index_item][1]}</td><td data-raw="${list[index_item][5].size}">${commas(list[index_item][5].size)}</td><td data-raw="${list[index_item][5].mtimeMs}">${dtg[0]}</td><td>${dtg[1]}</td><td data-raw="${list[index_item][4]}">${commas(list[index_item][4])}</td></tr>`);
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
                                }));
                            };
                            directory({
                                callback: callback,
                                depth: 2,
                                exclusions: [],
                                mode: "read",
                                path: input,
                                relative: true,
                                search: "",
                                symbolic: false
                            });
                        }
                    });
                },
                fileItem = function http_get_statTest_fileItem():void {
                    const content_type:string = (function http_get_statTest_fileItem_contentType():string {
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
                            if (extension === "js") {
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
                        }()),
                        headerText:string[] = [
                            "HTTP/1.1 200",
                            `content-type: ${content_type}`,
                            `content-length: ${Number(stat.size)}`,
                            "server: prettydiff/webserver",
                            "",
                            ""
                        ];
                    // sometimes stat.size reports the wrong file size
                    if (stat.size < (stat.blksize + 1n) && content_type.includes("utf8") === true) {
                        node.fs.readFile(input, function http_get_statTest_fileItem_read(err:node_error, file:Buffer):void {
                            if (err === null) {
                                headerText[2] = `content-length: ${file.length}`;
                                write(payload(headerText, file.toString()));
                            } else {
                                serverError(err, `Error attempting to read file: ${index0[1]}`);
                            }
                        });
                    } else if (method === "HEAD") {
                        write(headerText.join("\r\n"));
                    } else {
                        const stream:node_fs_ReadStream = node.fs.createReadStream(input);
                        socket.write(headerText.join("\r\n"));
                        stream.pipe(socket);
                        stream.on("close", function http_get_statTest_fileItem_close():void {
                            socket.destroy();
                        });
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
    if (fileFragment === "") {
        if (server_name === "dashboard") {
            const payload:transmit_dashboard = {
                logs: vars.logs,
                servers: vars.servers,
                sockets: vars.sockets
            };
            write(html({
                content: [
                    `<input type="hidden" value='${JSON.stringify(payload).replace(/'/g, "&#39;")}'/>`,
                    "<nav><ul>",
                    "<li><button class=\"nav-focus\" data-section=\"servers\">Servers</button></li><li><button data-section=\"logs\">Logs</button></li><li><button data-section=\"ports\">Port Summary</button></li><li><button data-section=\"sockets\">Socket Summary</button></li><li><button data-section=\"compose\">Docker Compose</button></li>",
                    "</ul></nav>",
                    "<main>",
                    "<div id=\"servers\"><h2>Servers</h2>",
                    "<div class=\"server-definitions\"><h3>Definitions of Server Object Properties</h3><button class=\"expand\">Expand</button><dl>",
                    "<dt>block_list</dt><dd>The block list contains three optional string arrays of criteria to determine if matching sockets should be instantly destroyed. At this time wildcards, CIDR notation, and ranges are not supported.</dd>",
                    "<dt>domain_local</dt><dd>Sockets featuring HTTP request host names in this list will be served from this server.  Sockets featuring HTTP request host names not in this list or in the redirect_domain list will be destroyed.</dd>",
                    "<dt>encryption</dt><dd>Whether to create an encrypted server for HTTPS and WSS protocols, an unencrypted server for HTTP and WS protocols, or both. Accepted values are 'both, 'open', or 'secure'.</dd>",
                    "<dt>http</dt><dd>File system paths to external utilities for handling the supported HTTP methods: delete, post, and put.  HTTP request bodies are passed into an environmental variable on the respective child process named 'payload'.</dd>",
                    "<dt>name</dt><dd>The name of this server.</dd>",
                    "<dt>path</dt><dd>Stores absolute file system paths used by the server.  The storage path is for any dynamically written data, such as logs.  The web_root directory is where web pages and web page assets are sourced from. The certificates path is only used for secure servers to store their respective TLS certificates.</dd>",
                    "<dt>ports</dt><dd>The ports on which the server operates.</dd>",
                    "<dt>redirect_domain</dt><dd>Redirects traffic to a different location, such as vanity domains. Each value is an array of two indexes.  The first index, a string, identifies where to redirect the traffic to as in a IP address, hostname, or domain name.  An empty string or non-string value will redirect traffic onto a different port of the same local machine.  The second index is a number representing a port to redirect traffic to.</dd>",
                    "<dt>redirect_internal</dt><dd>Redirects resource paths within the given server based upon the hostname in the HTTP request header. This is useful for dynamic or vanity endpoints on a given server.</dd>",
                    "</dl></div>",
                    "<p><button class=\"server-new\">Create Server</button></p></div>",
                    "<div id=\"ports\"><h2>Port Summary</h2></div>",
                    "<div id=\"sockets\"><h2>Socket Summary</h2></div>",
                    "<div id=\"compose\"><h2>Docker Compose</h2></div>",
                    "<div id=\"logs\"><h2>Logs</h2><ul></ul></div>",
                    "</main>"
                ],
                content_type: "text/html; utf8",
                core: true,
                page_title: null,
                script: dashboard,
                status: 200,
                template: true
            }));
        } else {
            // server root html file takes the name of the server, not index.html
            input = `${vars.servers[server_name].path.web_root}index.html`;
        }
    } else if (fileFragment.indexOf(".js") === fileFragment.length - 3 && fileFragment.includes("/js/lib/assets/") === false && vars.servers[server_name].path.web_root === `${vars.path.project}lib${vars.sep}assets${vars.sep + server_name}/`) {
        // normalizes compiled JS path to web_root path
        input = vars.servers[server_name].path.web_root.replace(/(\/|\\)lib(\/|\\)assets(\/|\\)/, `${vars.sep}js${vars.sep}lib${vars.sep}assets${vars.sep}`) + decodeURI(fileFragment);
    } else {
        // all other HTTP requests
        input = vars.servers[server_name].path.web_root + decodeURI(fileFragment);
    }
    file.stat({
        callback: statTest,
        error_terminate: null,
        location: input,
        no_file: notFound
    });
};

export default http_get;
