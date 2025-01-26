
import directory from "./directory.js";
import send from "../transmit/send.js";
import vars from "./vars.js";

const dashboard_object = function utilities_dashboardObject(socket:websocket_client, path_name:string, fileSystem:boolean):void {
    let parent:type_directory_item = null,
        failures:string[] = null;
    const list_local:directory_list = [],
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
            if (fileSystem === true) {
                const service:services_fileSystem = {
                    address: path_name,
                    dirs: list_local,
                    failures: failures,
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
        parentCallback = function utilities_dashboardObject_parentCallback(dir:directory_list|string[]):void {
            const list:directory_list = dir as directory_list,
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
            parent = list[0];
            directory(config);
        },
        parent_path:string = (function utilities_dashboardObject_parentPath():string {
            if (path_name === "/" || ((/^\w(:\/\/)?$/).test(path_name) === true && vars.sep === "\\")) {
                return path_name;
            }
            const paths:string[] = path_name.split(vars.sep);
            if (paths[paths.length - 1] === "" && paths.length > 2) {
                paths.pop();
                paths.pop();
            } else {
                paths.pop();
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