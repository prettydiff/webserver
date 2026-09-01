
import broadcast from "../transmit/broadcast.ts";
import directory from "../utilities/directory.ts";
import file from "../utilities/file.ts";
import log from "../core/log.ts";
import ports_application from "./ports_application.ts";
import send from "../transmit/send.ts";
import spawn from "../core/spawn.ts";
import vars from "../core/vars.ts";

import { spawn as spawn_shell } from "@lydell/node-pty";

// cspell: words opencontainers

const docker:core_module_docker = {
    commands: {
        activate: " up --detach",
        add: " up --detach",
        deactivate: " down",
        destroy: " down",
        list: " ps --format json --no-trunc",
        modify: " down",
        update: ""
    },
    list: function services_docker_list(callback:() => void):void {
        const complete = function services_docker_list_complete(message:string):void {
                vars.environment.compose_status = message;
                vars.data_meta.compose_time = now;
                ports_application();
                callback();
            },
            now:number = Date.now();
        if (vars.os.main.process.admin === true || process.platform === "win32") {
            const child = function services_docker_list_child(output:core_spawn_output):void {
                const stdout:string = output.stdout.trim();
                if (stdout !== "" && (stdout.charAt(0) !== "{" || stdout.charAt(stdout.length - 1) !== "}")) {
                    const str:string = `${output.stderr.replace("error during connect: ", "")}`;
                    log.application({
                        error: null,
                        message: vars.environment.compose_status,
                        origin: "services/docker.ts",
                        section: "compose-containers",
                        status: "error",
                        time: now
                    });
                    complete(str);
                } else {
                    const counts:store_number = {},
                        addresses:string[] = [],
                        list:core_compose_properties[] = JSON.parse(`[${output.stdout.replace(/\}\n\{/g, "},{")}]`),
                        len:number = list.length,
                        file_path = function services_docker_list_child_filePath(out:core_spawn_output):void {
                            if (out.stdout !== "") {
                                file.read({
                                    callback: file_callback,
                                    identifier: out.type,
                                    location: out.stdout.trim(),
                                    no_file: null,
                                    section: "compose-containers"
                                });
                            }
                        },
                        file_callback = function services_docker_list_child_fileCallback(file:Buffer, location:string, identifier:string):void {
                            const ind:number = Number(identifier),
                                id:string = list[ind].ID;
                            total = total + 1;
                            if (file === null) {
                                delete vars.data.containers[id];
                                delete vars.data.containers[location];
                                complete_meta(id, false);
                            } else {
                                if (vars.data.containers[location] !== undefined) {
                                    delete vars.data.containers[location];
                                }
                                vars.data.containers[id] = {
                                    compose: (file === null)
                                        ? null
                                        : file.toString(),
                                    created: new Date(list[ind].CreatedAt).valueOf(),
                                    description: "",
                                    id: id,
                                    image: list[ind].Image,
                                    license: "",
                                    name: list[ind].Names,
                                    location: location,
                                    ports: (file === null || list[ind].Ports === "")
                                        ? null
                                        : ports(list[ind]),
                                    state: list[ind].State,
                                    status: list[ind].Status,
                                    version: ""
                                };
                                addresses.push(location);
                                spawn(`docker inspect ${list[ind].ID} -f '{{index .Config.Labels "org.opencontainers.image.description"}}'`, description, {type: identifier}).execute();
                                spawn(`docker inspect ${list[ind].ID} -f '{{index .Config.Labels "org.opencontainers.image.licenses"}}'`, license, {type: identifier}).execute();
                                spawn(`docker inspect ${list[ind].ID} -f '{{index .Config.Labels "org.opencontainers.image.version"}}'`, version, {type: identifier}).execute();
                            }
                        },
                        ports = function services_docker_list_child_ports(properties:core_compose_properties):type_docker_ports {
                            const items:string[] = properties.Ports.replace(/, /g, ",").split(","),
                                output:type_docker_ports = [],
                                len:number = items.length;
                            if (len > 0) {
                                let index_ports:number = 0,
                                    value:string[] = null,
                                    port:number = 0,
                                    type:"tcp"|"udp" = "tcp",
                                    end:number = 0,
                                    add:boolean = true;
                                do {
                                    if (items[index_ports].includes("->") === true) {
                                        value = items[index_ports].split("->");
                                        port = Number(value[0].slice(value[0].lastIndexOf(":") + 1));
                                        type = value[1].split("/")[1] as "tcp";
                                    } else {
                                        value = items[index_ports].split("/");
                                        port = Number(value[0]);
                                        type = value[1] as "tcp";
                                    }
                                    end = output.length;
                                    add = true;
                                    if (end > 0) {
                                        do {
                                            end = end - 1;
                                            if (output[end][0] === port && output[end][1] === type) {
                                                add = false;
                                                break;
                                            }
                                        } while (end > 0);
                                    }
                                    if (add === true) {
                                        output.push([port, type]);
                                    }
                                    index_ports = index_ports + 1;
                                } while (index_ports < len);
                            }
                            return output.sort(function services_docker_list_child_ports_sort(a:[number, string], b:[number, string]):-1|1 {
                                if (a[1] < b[1] || (a[1] === b[1] && a[0] < b[0])) {
                                    return -1;
                                }
                                return 1;
                            });
                        },
                        complete_ps = function services_docker_list_child_completePS():void {
                            const read = function services_docker_list_child_completePS_read(file:Buffer, location:string):void {
                                    vars.data.containers[location] = {
                                        compose: file.toString(),
                                        created: 0,
                                        description: "",
                                        id: location,
                                        image: "",
                                        location: location,
                                        license: "",
                                        name: location.split(vars.path.sep).pop().replace(/\.ya?ml$/, ""),
                                        ports: [],
                                        state: "dead",
                                        status: "",
                                        version: ""
                                    };
                                    count = count - 1;
                                    if (count === 0) {
                                        complete("");
                                    }
                                },
                                list_callback = function services_docker_list_child_completePS_listCallback(files:core_directory_list):void {
                                    let index:number = files.length;
                                    if (index > 0) {
                                        count = 0;
                                        do {
                                            index = index - 1;
                                            if (addresses.includes(files[index][0]) === false && (/\.ya?ml$/).test(files[index][0]) === true && files[index][0].includes("empty.yml") === false) {
                                                count = count + 1;
                                                file.read({
                                                    callback: read,
                                                    location: files[index][0],
                                                    no_file: null,
                                                    section: "compose-containers"
                                                });
                                            } else if (count === 0 && index === 0) {
                                                complete("");
                                            }
                                        } while (index > 0);
                                    }
                                };
                            directory({
                                callback: list_callback,
                                depth: 1,
                                directory_size: false,
                                exclusions: [".env"],
                                parent: false,
                                path: vars.path.compose,
                                relative: false,
                                search: "",
                                symbolic: false
                            });
                        },
                        complete_meta = function services_docker_listCallback_child_completeMeta(id:string, available:boolean):void {
                            if (available === true) {
                                counts[id] = counts[id] + 1;
                            }
                            if (counts[id] === 3 || counts[id] === 0) {
                                count = count + 1;
                                if (count === total) {
                                    complete_ps();
                                }
                            }
                        },
                        description = function services_docker_listCallback_child_description(out:core_spawn_output):void {
                            const id:string = list[Number(out.type)].ID;
                            if (vars.data.containers[id] !== undefined) {
                                vars.data.containers[id].description = out.stdout.trim();
                            }
                            complete_meta(id, true);
                        },
                        license = function services_docker_listCallback_child_license(out:core_spawn_output):void {
                            const id:string = list[Number(out.type)].ID;
                            if (vars.data.containers[id] !== undefined) {
                                vars.data.containers[id].license = out.stdout.trim();
                            }
                            complete_meta(id, true);
                        },
                        version = function services_docker_listCallback_child_version(out:core_spawn_output):void {
                            const id:string = list[Number(out.type)].ID;
                            if (vars.data.containers[id] !== undefined) {
                                vars.data.containers[id].version = out.stdout.trim();
                            }
                            complete_meta(id, true);
                        },
                        shell:string = (process.platform === "win32" && vars.environment.terminal[0].includes("pwsh") === true)
                            ? vars.environment.terminal[0]
                            : null;
                    let count:number = 0,
                        total:number = 0;
                    if (process.platform === "win32" && shell === null) {
                        complete("This application requires use of PowerShell 7, or greater, to execute Docker support.");
                    } else {
                        let index:number = 0;
                        if (len > 0) {
                            do {
                                counts[list[index].ID] = 0;
                                if (process.platform === "win32") {
                                    spawn(`docker inspect ${list[index].ID} -f '{{index .Config.Labels "com.docker.compose.project.config_files"}}'`, file_path, {shell: shell, type: index.toString()}).execute();
                                } else {
                                    spawn(`docker inspect ${list[index].ID} -f '{{index .Config.Labels "com.docker.compose.project.config_files"}}'`, file_path, {type: index.toString()}).execute();
                                }
                                index = index + 1;
                            } while (index < len);
                        } else {
                            complete_ps();
                        }
                    }
                }
            };
            vars.data.containers = {};
            spawn(`docker ${docker.commands.list}`, child, {type: "docker"}).execute();
        } else {
            complete("Application must be executed with administrative privilege for Docker support.");
        }
    },
    receive: function services_docker_receive(socket_data:socket_data, transmit:transmit_socket):void {
        const socket:websocket_client = transmit.socket as websocket_client;
        if (socket_data.service === "services_compose_variables") {
            docker.variables(socket_data.data as store_string, socket);
        } else if (socket_data.service === "services_compose_container") {
            const data:services_compose_container = socket_data.data as services_compose_container,
                segment:string = data.compose.split("container_name")[1],
                name:string = (segment === undefined)
                    ? null
                    : segment.split("\n")[0].trim().replace(/^\s*:\s*/, ""),
                location:string = (data.action === "add" && name !== null)
                    ? `${vars.path.compose + name}.yml`
                    : data.location,
                compose_location:string = `${vars.commands.compose} --ansi never --env-file "${vars.path.compose}.env" -f ${location}`,
                command:string = compose_location + docker.commands[data.action],
                running:boolean = (vars.data.containers[data.id] === null || vars.data.containers[data.id] === undefined)
                    ? false
                    : (vars.data.containers[data.id].state === "running"),
                lister = function services_docker_receive_lister():void {
                    docker.list(function services_docker_receive_lister_list():void {
                        send({
                            data: {
                                containers: vars.data.containers,
                                status: vars.environment.compose_status,
                                time: vars.data_meta.compose_time,
                                variables: vars.data.compose_variables
                            },
                            service: "services_compose"
                        }, socket, 3);
                    });
                },
                execute = function services_docker_receive_execute():void {
                    docker.shell.write(`${command}\r\n`);
                    docker.shell.write("command complete");
                    if (data.action === "destroy") {
                        file.remove({
                            callback: null,
                            exclusions: [],
                            location: data.location,
                            section: "compose-containers"
                        });
                    } else if (data.action === "modify") {
                        file.write({
                            callback: function services_docker_receive_spawn_write():void {
                                if (running === true) {
                                    spawn(compose_location + docker.commands.activate, lister).execute();
                                }
                            },
                            contents: data.compose,
                            location: data.location,
                            section: "compose-containers"
                        });
                    }
                };
            if (data.action === "activate" || data.action === "deactivate" || data.action === "destroy" || data.action === "modify") {
                execute();
            } else if (data.action === "add") {
                if (name === null || name === "") {
                    log.application({
                        error: null,
                        message: "Attempted to add a docker container without a 'container_name' field.",
                        origin: data.id,
                        section: "compose-containers",
                        status: "error",
                        time: Date.now()
                    });
                } else {
                    file.write({
                        callback: function services_docker_receive_add():void {
                            execute();
                        },
                        contents: data.compose,
                        location: location,
                        section: "compose-containers"
                    });
                }
            } else if (data.action === "update") {
                lister();
            }
        }
    },
    resize: function services_docker_resize(socket_data:socket_data):void {
        const data:services_terminal_resize = socket_data.data as services_terminal_resize;
        if (docker.shell !== null && Number.isNaN(data.cols) === false && Number.isNaN(data.rows) === false && data.cols > 0 && data.rows > 0) {
            docker.shell.resize(Math.floor(data.cols), Math.floor(data.rows));
        }
    },
    shell: null,
    shell_start: function services_docker_shell():void {
        if (vars.os.main.process.admin === true || process.platform === "win32") {
            const shell:string = (process.env.SHELL === undefined)
                    ? vars.environment.terminal[0]
                    : process.env.SHELL,
                close = function services_docker_shell_close():void {
                    docker.shell.kill();
                },
                out = function services_docker_shell_out(output:string):void {
                    if ((/command complete$/).test(output) === true) {
                        docker.shell.write("\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008\u0008");
                        docker.list(function services_docker_shell_out_list():void {
                            broadcast(vars.id.dashboard_server, "dashboard", {
                                data: {
                                    containers: vars.data.containers,
                                    status: vars.environment.compose_status,
                                    time: vars.data_meta.compose_time,
                                    variables: vars.data.compose_variables
                                },
                                service: "services_compose"
                            });
                        });
                    }
                    broadcast(vars.id.dashboard_server, "dashboard", {
                        data: {
                            status: output
                        },
                        service: "services_compose_out"
                    });
                };
            docker.shell = spawn_shell(shell, [], {
                cols: 80,
                cwd: vars.path.project,
                env: process.env,
                name: "compose-containers",
                rows: 10
            });
            docker.shell.onData(out);
            docker.shell.onExit(close);
        }
    },
    variables: function services_docker_variables(variables:store_string, socket:websocket_client):void {
        const list:string[] = Object.keys(variables),
            len:number = list.length,
            output:string[] = [];
        if (len > 0) {
            let index:number = 0;
            do {
                output.push(`${list[index]}=${variables[list[index]]}`);
                index = index + 1;
            } while (index < len);
        }
        file.write({
            callback: function services_docker_variables_callback():void {
                vars.data.compose_variables = variables;
                docker.list(function services_docker_variables_callback_list():void {
                    send({
                        data: {
                            containers: vars.data.containers,
                            status: vars.environment.compose_status,
                            time: vars.data_meta.compose_time,
                            variables: vars.data.compose_variables
                        },
                        service: "services_compose"
                    }, socket, 3);
                });
            },
            contents: output.join("\n"),
            location: `${vars.path.project}compose${vars.path.sep}.env`,
            section: "compose-containers"
        });
    }
};

export default docker;