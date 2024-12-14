
import docker_parse from "../utilities/docker_parse.js";
import file from "../utilities/file.js";
import log from "../utilities/log.js";
import spawn from "../utilities/spawn.js";
import vars from "../utilities/vars.js";

const compose = function services_compose(socket_data:socket_data):void {
    const service:services_dashboard_status = socket_data.data as services_dashboard_status,
        data:services_docker_compose = service.configuration as services_docker_compose;
    if (socket_data.service === "dashboard-compose-variables" || service.action === "add" || service.action === "modify") {
        const flags:store_flag = {
                compose: false,
                file: false
            },
            complete = function services_compose_complete(flag:"compose"|"file", type:"containers"|"variables", name:string):void {
                flags[flag] = true;
                if (flags.compose === true && flags.file === true) {
                    const service:"dashboard-compose-container"|"dashboard-compose-variables" = socket_data.service as "dashboard-compose-container"|"dashboard-compose-variables",
                        message:string = (service === "dashboard-compose-container")
                            ? `Compose container ${data.names} updated.`
                            : "Compose environmental variables updated.";
                    log({
                        action: "modify",
                        config: (type === "containers")
                            ? vars.compose.containers[name]
                            : vars.compose.variables,
                        message: message,
                        status: "success",
                        type: `compose-${type}`
                    });
                }
            },
            stat = function services_compose_stat(contents:string, location:string, type:"containers"|"variables"):void {
                const writeContents = function services_compose_stat_writeContents():void {
                    file.write({
                        callback: function services_compose_stat_wwriteContents_compose():void {
                            complete("compose", type, data.names);
                        },
                        contents: JSON.stringify(vars.compose),
                        error_terminate: (type === "containers")
                            ? vars.compose.containers[data.names]
                            : vars.compose.variables,
                        location: `${vars.path.project}compose.json`
                    });
                    file.write({
                        callback: function services_compose_variables_writeContents_file():void {
                            complete("file", type, data.names);
                        },
                        contents: contents,
                        error_terminate: (type === "containers")
                            ? vars.compose.containers[data.names]
                            : vars.compose.variables,
                        location: location
                    });
                };
                file.stat({
                    callback: writeContents,
                    error_terminate: (type === "containers")
                        ? vars.compose.containers[data.names]
                        : vars.compose.variables,
                    location: vars.path.compose,
                    no_file: function services_compose_createDirectory():void {
                        file.mkdir({
                            callback: writeContents,
                            error_terminate: (type === "containers")
                                ? vars.compose.containers[data.names]
                                : vars.compose.variables,
                            location: vars.path.compose
                        });
                    }
                });
            };
        if (socket_data.service === "dashboard-compose-container") {
            vars.compose.containers[data.names] = data;
            stat(data.compose, `${vars.path.compose + data.names}.yml`, "containers");
        } else if (socket_data.service === "dashboard-compose-variables") {
            const data:store_string = socket_data.data as store_string,
                output:string = (function services_compose_variables():string {
                    const keys:string[] = Object.keys(data),
                        outputString:string[] = [],
                        len:number = keys.length;
                    let index:number = 0;
                    if (len > 0) {
                        do {
                            outputString.push(`${keys[index]}='${vars.compose.variables[keys[index]]}'`);
                            index = index + 1;
                        } while (index < len);
                    }
                    return outputString.join("\n");
                }());
            vars.compose.variables = data;
            stat(output, `${vars.path.compose}.env`, "variables");
        }
    } else if (service.action === "activate" || service.action === "deactivate") {
        const direction:string = (service.action === "activate")
            ? "up"
            : "down";
        spawn({
            args: ["compose", "-f", `${vars.path.compose + name}.yml`, direction, "--no-healthcheck"],
            callback: function services_compose_activate(stderr:string, stdout:string, error:node_childProcess_ExecException):void {
                if (stderr === "" && error === null) {
                    docker_parse(stdout);
                } else {
                    log({
                        action: service.action,
                        config: (error === null)
                            ? {
                                message: stderr
                            }
                            : error,
                        message: `Error on ${service.action} of container ${data.names}.`,
                        status: "error",
                        type: "compose-containers"
                    });
                }
            },
            command: "docker",
            recurse: 0
        });
    } else if (service.action === "destroy") {
        spawn({
            args: ["kill", data.names],
            callback: function services_compose_kill():void {
                spawn({
                    args: ["rm", data.names],
                    callback: function services_compose_kill_container():void {
                        const lines:string[] = vars.compose.containers[data.names].compose.split("\n"),
                            write = function services_compose_kill_container_write():void {
                                delete vars.compose.containers[data.names];
                                file.write({
                                    callback: function services_compose_stat_wwriteContents_compose():void {
                                        log({
                                            action: "destroy",
                                            config: data,
                                            message: `Destroyed container ${data.names}`,
                                            status: "success",
                                            type: "compose-containers"
                                        });
                                    },
                                    contents: JSON.stringify(vars.compose),
                                    error_terminate: vars.compose.containers[data.names],
                                    location: `${vars.path.project}compose.json`
                                });
                            };
                        let index:number = lines.length;
                        if (index > 0) {
                            do {
                                index = index - 1;
                                if ((/\s+image:/).test(lines[index]) === true) {
                                    spawn({
                                        args: ["image", "rm", lines[index].replace(/\s*image:\s*/, "")],
                                        callback: write,
                                        command: "docker",
                                        recurse: 0
                                    });
                                    return;
                                }
                            } while (index > 0);
                        }
                        write();
                    },
                    command: "docker",
                    recurse: 0
                });
            },
            command: "docker",
            recurse: 0
        });
    }
};

export default compose;