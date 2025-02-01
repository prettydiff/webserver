
import directory from "./directory.js";
import node from "./node.js";
import send from "../transmit/send.js";
import vars from "./vars.js";

import { detectAll } from "jschardet";

const dashboard_object = function utilities_dashboardObject(config:config_dashboardObject):void {
    let parent:type_directory_item = null,
        failures:string[] = [],
        file:string = null,
        list_local:directory_list = [];
    const windows_root:RegExp = (/^\w:(\\)?$/),
        complete = function utilities_dashboardObject_complete():void {
            if (config.fileSystem_only === true) {
                const service:services_fileSystem = {
                    address: config.path,
                    dirs: list_local,
                    failures: failures,
                    file: file,
                    parent: parent,
                    search: config.search,
                    sep: vars.sep
                };
                send({
                    data: service,
                    service: "dashboard-fileSystem"
                }, config.socket, 1);
            } else {
                const browser:transmit_dashboard = {
                    compose: vars.compose,
                    fileSystem: {
                        address: config.path,
                        dirs: list_local,
                        failures: failures,
                        file: file,
                        parent: parent,
                        search: config.search,
                        sep: vars.sep
                    },
                    hashes: vars.hashes,
                    http_headers: vars.http_headers,
                    logs: vars.logs,
                    os: vars.os,
                    path: vars.path,
                    ports: vars.system_ports,
                    servers: vars.servers,
                    terminal: vars.terminal
                };
                send({
                    data: browser,
                    service: "dashboard-payload"
                }, config.socket, 1);
            }
        },
        dirCallback = function utitiles_dashboardObject_dirCallback(dir:directory_list|string[]):void {
            const list:directory_list = dir as directory_list,
                len:number = list.length - 1,
                self:type_directory_item = list[0];
            let index:number = 0;
            list.splice(0, 1);
            if (config.search === null) {
                if (len > 1) {
                    do {
                        if (list[index][3] === 0) {
                            list_local.push(list[index]);
                        }
                        index = index + 1;
                    } while (index < len);
                }
            } else {
                list_local = list;
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
            if (config.search === null) {
                list_local.splice(0, 0, self);
            }
            failures = list.failures;
            complete();
        },
        readCallback = function utilities_dashboardObject_readCallback(err:node_error, fileContents:Buffer):void {
            if (err === null) {
                const detect:string_detect[] = detectAll(fileContents),
                    decoder:node_stringDecoder_StringDecoder = new node.stringDecoder.StringDecoder("utf8");
                detect.sort(function utilities_dashboardObject_readCallback_sort(a:string_detect, b:string_detect):-1|1 {
                    if (a.confidence > b.confidence) {
                        return -1;
                    }
                    return 1;
                });
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
            file = `Error, ${err.code}, reading file at ${config.path}. ${err.message}`;
            complete();
        },
        parentCallback = function utilities_dashboardObject_parentCallback(dir:directory_list|string[]):void {
            const list:directory_list = dir as directory_list,
                paths:string[] = config.path.split(vars.sep),
                config_dir:config_directory = {
                    callback: dirCallback,
                    depth: (config.search === null)
                        ? 2
                        : 0,
                    exclusions: [],
                    mode: (config.search === null)
                        ? "read"
                        : "search",
                    path: config.path,
                    relative: (config.search === null),
                    search: (config.search === null)
                        ? ""
                        : config.search,
                    symbolic: true
                };
            let index:number = (dir === null)
                    ? 0
                    : list.length,
                last_path:string = "";
            if (config.search === null && (config.path === "/" || config.path === "\\" || windows_root.test(config.path) === true)) {
                if (index > 0) {
                    parent = list[0];
                }
                dirCallback(list);
                return;
            }
            if (index > 0) {
                if (paths[paths.length - 1] === "") {
                    paths.pop();
                }
                last_path = paths[paths.length - 1];
                parent = list[0];
                do {
                    index = index - 1;
                    if (list[index][0] === last_path) {
                        if (list[index][1] === "directory") {
                            directory(config_dir);
                        } else {
                            list_local.push(list[index]);
                            node.fs.readFile(config.path, readCallback);
                        }
                        return;
                    }
                } while (index > 0);
            } else {
                directory(config_dir);
            }
        },
        parent_path:string = (function utilities_dashboardObject_parentPath():string {
            if (config.path === "/" || config.path === "\\" || (windows_root.test(config.path) === true && vars.sep === "\\")) {
                return config.path;
            }
            const paths:string[] = config.path.split(vars.sep);
            // smb
            // if ((/^\\\\\[?(\w+\.?)+\]?/).test(config.path) === true && paths.length < 4) {
            //     return config.path;
            // }
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
    if (config.search === null) {
        directory(config_parent);
    } else {
        parentCallback(null);
    }
};

export default dashboard_object;