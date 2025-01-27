
import directory from "./directory.js";
import node from "./node.js";
import send from "../transmit/send.js";
import vars from "./vars.js";

import { detectAll } from "jschardet";

const dashboard_object = function utilities_dashboardObject(socket:websocket_client, path_name:string, fileSystem:boolean):void {
    let parent:type_directory_item = null,
        failures:string[] = [],
        file:string = null;
    const list_local:directory_list = [],
        windows_root:RegExp = (/^\w:(\\)?$/),
        complete = function utilities_dashboardObject_complete():void {
            if (fileSystem === true) {
                const service:services_fileSystem = {
                    address: path_name,
                    dirs: list_local,
                    failures: failures,
                    file: file,
                    parent: parent,
                    sep: vars.sep
                };
                send({
                    data: service,
                    service: "dashboard-fileSystem"
                }, socket, 1);
            } else {
                const browser:transmit_dashboard = {
                    compose: vars.compose,
                    fileSystem: {
                        address: path_name,
                        dirs: list_local,
                        failures: failures,
                        file: file,
                        parent: parent,
                        sep: vars.sep
                    },
                    http_headers: vars.http_headers,
                    logs: vars.logs,
                    path: vars.path,
                    ports: vars.system_ports,
                    servers: vars.servers,
                    terminal: vars.terminal,
                    user: vars.user
                };
                send({
                    data: browser,
                    service: "dashboard-payload"
                }, socket, 1);
            }
        },
        dirCallback = function utitiles_dashboardObject_dirCallback(dir:directory_list|string[]):void {
            const list:directory_list = dir as directory_list,
                len:number = list.length - 1,
                self:type_directory_item = list[0];
            let index:number = 0;
            list.splice(0, 1);
            if (len > 1) {
                do {
                    if (list[index][3] === 0) {
                        list_local.push(list[index]);
                    }
                    index = index + 1;
                } while (index < len);
            }
            list_local.sort(function utilities_dashboardObject_dirCallback_sort(a:type_directory_item, b:type_directory_item):-1|0|1 {
                if (a[1] < b[1]) {
                    return -1;
                }
                if (a[1] > b[1]) {
                    return 1;
                }
                if (a[1] === b[1]) {
                    if (a[0] < b[0]) {
                        return -1;
                    }
                    if (a[0] > b[0]) {
                        return 1;
                    }
                }
                return 0;
            });
            list_local.splice(0, 0, self);
            failures = list.failures;
            complete();
        },
        readCallback = function utilities_dashboardObject_readCallback(err:node_error, fileContents:Buffer):void {
            const detect:string_detect[] = detectAll(fileContents),
                decoder:node_stringDecoder_StringDecoder = new node.stringDecoder.StringDecoder("utf8");
            let index:number = detect.length;
            detect.sort(function utilities_dashboardObject_readCallback_sort(a:string_detect, b:string_detect):-1|1 {
                if (a.confidence > b.confidence) {
                    return -1;
                }
                return 1;
            });
            if (err === null) {
                if (detect[0].confidence > 0.6) {
                    file = decoder.write(fileContents);
                    failures[0] = detect[0].encoding;
                    complete();
                    return;
                }
                failures[0] = "binary";
                file = "Text encoding cannot be determined with confidence. File is most likely binary.";
                complete();
                return;
            }
            failures[0] = "unknown";
            file = `Error, ${err.code}, reading file at ${path_name}. ${err.message}`;
            complete();
        },
        parentCallback = function utilities_dashboardObject_parentCallback(dir:directory_list|string[]):void {
            const list:directory_list = dir as directory_list,
                paths:string[] = path_name.split(vars.sep),
                config:config_directory = {
                    callback: dirCallback,
                    depth: 2,
                    exclusions: [],
                    mode: "read",
                    path: path_name,
                    relative: true,
                    search: "",
                    symbolic: true
                };
            let index:number = list.length,
                last_path:string = "";
            parent = list[0];
            if (path_name === "/" || path_name === "\\" || windows_root.test(path_name) === true) {
                dirCallback(list);
                return;
            }
            if (paths[paths.length - 1] === "") {
                paths.pop();
            }
            last_path = paths[paths.length - 1];
            do {
                index = index - 1;
                if (list[index][0] === last_path) {
                    if (list[index][1] === "directory") {
                        directory(config);
                    } else {
                        list_local.push(list[index]);
                        node.fs.readFile(path_name, readCallback);
                    }
                    return;
                }
            } while (index > 0);
        },
        parent_path:string = (function utilities_dashboardObject_parentPath():string {
            if (path_name === "/" || path_name === "\\" || (windows_root.test(path_name) === true && vars.sep === "\\")) {
                return path_name;
            }
            const paths:string[] = path_name.split(vars.sep);
            if (paths[paths.length - 1] === "" && paths.length > 2) {
                paths.pop();
            }
            paths.pop();
            if (paths[0] === "" && paths[1] === "" && paths.length === 2 && vars.sep === "/") {
                return "/";
            }
            return paths.join(vars.sep) + vars.sep;
        }()),
        config_parent:config_directory = {
            callback: parentCallback,
            depth: 2,
            exclusions: [],
            mode: "read",
            path: parent_path,
            relative: true,
            search: "",
            symbolic: true
        };
    directory(config_parent);
};

export default dashboard_object;