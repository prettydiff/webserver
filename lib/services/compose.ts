
import docker_parse from "../utilities/docker_parse.js";
import file from "../utilities/file.js";
import log from "../utilities/log.js";
import spawn from "../utilities/spawn.js";
import vars from "../utilities/vars.js";

const compose = function services_compose(socket_data:socket_data):void {
    const data:services_compose = socket_data.data as services_compose,
        name:string = data.title;
    if (socket_data.service === "dashboard-compose-variables" || data.action === "modify") {
        const flags:store_flag = {
                compose: false,
                file: false
            },
            complete = function services_compose_complete(flag:"compose"|"file", type:"containers"|"variables", name:string):void {
                flags[flag] = true;
                if (flags.compose === true && flags.file === true) {
                    const dataContainer:services_compose = socket_data.data as services_compose,
                        service:"dashboard-compose-container"|"dashboard-compose-variables" = socket_data.service as "dashboard-compose-container"|"dashboard-compose-variables",
                        message:string = (service === "dashboard-compose-container")
                            ? `Compose container ${dataContainer.title} updated.`
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
                            complete("compose", type, name);
                        },
                        contents: JSON.stringify(vars.compose),
                        error_terminate: (type === "containers")
                            ? vars.compose.containers[name]
                            : vars.compose.variables,
                        location: `${vars.path.project}compose.json`
                    });
                    file.write({
                        callback: function services_compose_variables_writeContents_file():void {
                            complete("file", type, name);
                        },
                        contents: contents,
                        error_terminate: (type === "containers")
                            ? vars.compose.containers[name]
                            : vars.compose.variables,
                        location: location
                    });
                };
                file.stat({
                    callback: writeContents,
                    error_terminate: (type === "containers")
                        ? vars.compose.containers[name]
                        : vars.compose.variables,
                    location: vars.path.compose,
                    no_file: function services_compose_createDirectory():void {
                        file.mkdir({
                            callback: writeContents,
                            error_terminate: (type === "containers")
                                ? vars.compose.containers[name]
                                : vars.compose.variables,
                            location: vars.path.compose
                        });
                    }
                });
            };
        if (socket_data.service === "dashboard-compose-container") {
            vars.compose.containers[data.title] = data;
            stat(data.compose, `${vars.path.compose + data.title}.yml`, "containers");
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
    } else if (data.action === "activate" || data.action === "deactivate") {
        const direction:string = (data.action === "activate")
            ? "up"
            : "down";
        spawn({
            args: ["compose", "-f", `${vars.path.compose + data.title}.yml`, direction],
            callback: function services_compose(stderr:string, stdout:string, error:node_childProcess_ExecException):void {
                if (stderr === "" && error === null) {
                    docker_parse(stdout);
                } else {
                    log({
                        action: data.action,
                        config: (error === null)
                            ? {
                                message: stderr
                            }
                            : error,
                        message: `Error on ${data.action} of container ${data.title}.`,
                        status: "error",
                        type: "compose-containers"
                    });
                }
            },
            command: "docker",
            recurse: 0
        });
    }
};

export default compose;