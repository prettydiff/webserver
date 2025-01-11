
import file from "../utilities/file.js";
import log from "../utilities/log.js";
import spawn from "../utilities/spawn.js";
import vars from "../utilities/vars.js";

const compose = function services_compose(socket_data:socket_data):void {
    const data:services_action_compose = socket_data.data as services_action_compose;
    if (socket_data.service === "dashboard-compose-variables" || data.action === "add" || data.action === "modify") {
        const flags:store_flag = {
                compose: false,
                file: false
            },
            complete = function services_compose_complete(flag:"compose"|"file", type:"containers"|"variables", name:string):void {
                flags[flag] = true;
                if (flags.compose === true && flags.file === true) {
                    const service:"dashboard-compose-container"|"dashboard-compose-variables" = socket_data.service as "dashboard-compose-container"|"dashboard-compose-variables",
                        message:string = (service === "dashboard-compose-container")
                            ? `Compose container ${data.compose.name} updated.`
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
            write = function services_compose_write(contents:string, location:string, type:"containers"|"variables"):void {
                // compose.json - for this application
                file.write({
                    callback: function services_compose_write_compose():void {
                        complete("compose", type, data.compose.name);
                    },
                    contents: JSON.stringify(vars.compose),
                    error_terminate: (type === "containers")
                        ? vars.compose.containers[data.compose.name]
                        : vars.compose.variables,
                    location: `${vars.path.project}compose.json`
                });
                // container file
                file.write({
                    callback: function services_compose_write_file():void {
                        complete("file", type, data.compose.name);
                    },
                    contents: contents,
                    error_terminate: (type === "containers")
                        ? vars.compose.containers[data.compose.name]
                        : vars.compose.variables,
                    location: location
                });
            };
        if (socket_data.service === "dashboard-compose-container") {
            vars.compose.containers[data.compose.name] = data.compose;
            write(data.compose.compose, `${vars.path.compose + data.compose.name}.yml`, "containers");
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

            // check to see if container already exists and is running
            spawn({
                args: ["compose", "-f", `${vars.path.compose}empty.yml`, "ps", "--format=json"],
                callback: function services_compose_complete_ps(stderr:string, stdout:string, error:node_childProcess_ExecException):void {
                    if (stderr === "" && error === null) {
                        const lns:string[] = stdout.replace(/\s+$/, "").split("\n"),
                            keys:string[] = Object.keys(vars.compose.containers);
                        let index:number = keys.length,
                            compose:services_docker_compose = null;
                        do {
                            index = index - 1;
                            compose = JSON.parse(lns[index]);
                            if (compose.name === data.name) {
                                if (compose.state === "running") {
                                    compose.compose = vars.compose.containers[data.name].compose;
                                    compose.description = vars.compose.containers[data.name].description;
                                    vars.compose.containers[data.name] = compose;
                                    log({
                                        action: "activate",
                                        config: compose,
                                        message: `Docker container ${data.name} is online.`,
                                        status: "informational",
                                        type: "compose-containers"
                                    });
                                }
                                break;
                            }
                        } while (index > 0);
                    }
                    write(output, `${vars.path.compose}.env`, "variables");
                },
                command: "docker",
                recurse: 0
            });
        }
    } else if (data.action === "destroy") {
        spawn({
            args: ["kill", data.compose.name],
            callback: function services_compose_kill():void {
                spawn({
                    args: ["rm", data.compose.name],
                    callback: function services_compose_kill_container():void {
                        const lines:string[] = vars.compose.containers[data.compose.name].compose.split("\n"),
                            write = function services_compose_kill_container_write():void {
                                delete vars.compose.containers[data.compose.name];
                                file.write({
                                    callback: function services_compose_stat_wwriteContents_compose():void {
                                        log({
                                            action: "destroy",
                                            config: data.compose,
                                            message: `Destroyed container ${data.compose.name}`,
                                            status: "success",
                                            type: "compose-containers"
                                        });
                                    },
                                    contents: JSON.stringify(vars.compose),
                                    error_terminate: vars.compose.containers[data.compose.name],
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