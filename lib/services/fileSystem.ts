
import directory from "../utilities/directory.ts";
import node from "../core/node.ts";
import send from "../transmit/send.ts";
import spawn from "../core/spawn.ts";
import vars from "../core/vars.ts";

import { detectAll } from "jschardet";

const fileSystem = function services_fileSystem(socket_data:socket_data, transmit:transmit_socket):void {
    if (vars.environment.features["file-system"] === false) {
        return;
    }
    const data:services_file_system = socket_data.data as services_file_system,
        service:services_file_system = {
            address: data.address,
            children: data.children,
            depth: data.depth,
            directory_size: data.directory_size,
            dirs: null,
            failures: [],
            file: null,
            mime: "",
            parent: null,
            path_style: data.path_style,
            search: data.search,
            sep: vars.path.sep
        },
        complete = function services_fileSystem_complete():void {
            send({
                data: service,
                service: "services_file_system"
            }, transmit.socket as websocket_client, 3);
        },
        dirCallback = function services_fileSystem_dirCallback(list:core_directory_list):void {
            const len:number = list.length;
            if (len === 0) {
                complete();
            } else if (data.search !== null || list[0][1] === "directory") {
                const children:type_directory_item[] = (data.search === null)
                    ? [list[0]]
                    : [];
                if (data.depth > 0) {
                    const token:string = (data.address.charAt(data.address.length - 1) === vars.path.sep)
                            ? data.address
                            : data.address + vars.path.sep,
                        end:number = (data.search === null)
                            ? 1
                            : 0;
                    let index:number = len,
                        paths:string[] = null;
                    do {
                        index = index - 1;
                        paths = list[index][0].replace(token, "").split(vars.path.sep);
                        if (paths.length <= data.depth) {
                            children.push(list[index]);
                        }
                    } while (index > end);
                    children.sort(function services_fileSystem_dirCallback_sort(a:type_directory_item,b:type_directory_item):-1|1 {
                        if (a[1] < b[1] || (a[1] === b[1] && a[0] < b[0])) {
                            return -1;
                        }
                        return 1;
                    });
                    service.dirs = children;
                } else {
                    service.dirs = list;
                }
                service.failures = list.failures;
                service.parent = list.parent;
                complete();
            } else {
                service.dirs = [list[0]];
                service.parent = list.parent;
                if (vars.commands.file === "") {
                    node.fs.readFile(data.address, readCallback);
                } else {
                    spawn(`${vars.commands.file}"${data.address}"`, fileCallback).execute();
                }
            }
        },
        fileCallback = function services_fileSystem_fileCallback(output:core_spawn_output):void {
            if (output.stdout.includes("cannot open") === true) {
                service.file = output.stdout.slice(output.stdout.indexOf("; ") + 2).replace("\r\n", "");
                service.failures[0] = "file not found";
                complete();
            } else {
                const data_file:string[] = output.stdout.split("; "),
                    category:string = data_file[0].slice(0, data_file[0].indexOf("/")),
                    accepted:string[] = ["message", "multipart", "text"],
                    charset:string = (data_file[1] === undefined)
                        ? output.stdout
                        : data_file[1].replace("charset=", ""),
                    binary:boolean = (charset.includes("binary") === true || charset.includes("octet") === true);
                service.failures[0] = charset;
                if (data_file.length > 1) {
                    service.mime = data_file[0];
                }
                if (accepted.includes(category) === true || binary === false) {
                    node.fs.readFile(data.address, function services_fileSystem_fileCallback_read(erf:node_error, fileData:Buffer):void {
                        if (erf === null) {
                            const decoder:node_stringDecoder_StringDecoder = new node.stringDecoder.StringDecoder("utf8");
                            service.file = (binary === true)
                                ? fileData.toString()
                                : decoder.write(fileData);
                        } else {
                            service.file = erf.message;
                            service.failures.push(erf.code);
                        }
                        complete();
                    });
                } else {
                    service.file = "File appears to be binary.";
                    complete();
                }
            }
        },
        readCallback = function services_fileSystem_readCallback(err:node_error, fileContents:Buffer):void {
            if (err === null) {
                const detect:core_string_detect[] = detectAll(fileContents),
                    decoder:node_stringDecoder_StringDecoder = new node.stringDecoder.StringDecoder("utf8");
                detect.sort(function services_fileSystem_readCallback_sort(a:core_string_detect, b:core_string_detect):-1|1 {
                    if (a.confidence > b.confidence) {
                        return -1;
                    }
                    return 1;
                });
                if (detect[0].confidence > 0.6) {
                    service.file = decoder.write(fileContents);
                    service.failures[0] = detect[0].encoding;
                    complete();
                    return;
                }
                service.failures[0] = "binary";
                service.file = "Text encoding cannot be determined with confidence. File is most likely binary.";
                complete();
                return;
            }
            service.failures[0] = "unknown";
            service.file = `Error, ${err.code}, reading file at ${data.address}. ${err.message}`;
            complete();
        },
        config_parent:config_directory = {
            callback: dirCallback,
            depth: (data.depth > 0)
                ? (data.children === true)
                    ? data.depth + 1
                    : data.depth
                : 0,
            directory_size: data.directory_size,
            exclusions: [],
            parent: true,
            path: data.address,
            relative: (data.path_style === "relative"),
            search: data.search,
            symbolic: true
        };
    if (vars.options.demo === true) {
        if (config_parent.path.includes(vars.path.project) === false) {
            config_parent.path = vars.path.project;
            data.address = vars.path.project;
            service.address = vars.path.project;
        }
    }
    node.fs.stat(data.address, function services_fileSystem_stat(ers:node_error):void {
        if (ers === null) {
            directory(config_parent);
        } else {
            service.failures.push(data.address);
            complete();
        }
    });
};

export default fileSystem;