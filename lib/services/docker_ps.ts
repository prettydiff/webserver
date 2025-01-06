
import log from "../utilities/log.js";
import spawn from "../utilities/spawn.js";
import vars from "../utilities/vars.js";

const docker_ps = function services_dockerPS(callback:() => void):void {
    const args:string[] = ["-f", `${vars.path.compose}empty.yml`, "ps", "--format=json"],
        logger = function services_dockerPS_logger(action:"activate"|"deactivate", config:services_docker_compose):void {
            log({
                action: action,
                config: config,
                message: (action === "activate")
                    ? `Docker container ${config.name} came online.`
                    : `Docker container ${config.name} went offline.`,
                status: "informational",
                type: "compose-containers"
            });
        },
        callbackFirst = function services_dockerPS_callbackFirst(stderr:string, stdout:string, error:node_childProcess_ExecException):void {
            if (stderr === "" && error === null) {
                const lns:string[] = stdout.replace(/\s+$/, "").split("\n"),
                    len:number = lns.length,
                    keys:string[] = Object.keys(vars.compose.containers);
                let index:number = keys.length,
                    compose:services_docker_compose = null,
                    item:store_string = null;
                do {
                    index = index - 1;
                    vars.compose.containers[keys[index]].state = "dead";
                } while (index > 0);
                do {
                    item = JSON.parse(lns[index]);
                    compose = {
                        command: item.Command,
                        compose: "",
                        createdAt: item.CreatedAt,
                        description: "",
                        exitCode: Number(item.ExitCode),
                        health: item.Health,
                        id: item.ID,
                        image: item.Image,
                        labels: item.Labels.split(","),
                        localVolumes: Number(item.LocalVolumes),
                        mounts: item.Mounts.split(","),
                        name: item.Name,
                        names: item.Names.split(","),
                        networks: item.Networks.split(","),
                        ports: item.Ports.replace(/,\s+/g, ",").split(","),
                        project: item.Project,
                        publishers: JSON.parse(lns[index]).Publishers as services_docker_compose_publishers[],
                        runningFor: item.RunningFor,
                        service: item.Service,
                        size: Number(item.Size),
                        state: item.State as type_docker_state,
                        status: item.Status
                    };
                    if (vars.compose.containers[compose.name] === undefined) {
                        compose.compose = "";
                        compose.description = "";
                    } else {
                        compose.compose = vars.compose.containers[compose.name].compose;
                        compose.description = vars.compose.containers[compose.name].description;
                        if (compose.state !== "running" && vars.compose.containers[compose.name].state === "running") {
                            logger("deactivate", compose);
                        } else if (compose.state === "running" && vars.compose.containers[compose.name].state === "running") {
                            logger("activate", compose);
                        }
                        vars.compose.containers[compose.name] = compose;
                    }
                    index = index + 1;
                } while (index < len);
                spawn({
                    args: ["-f", `${vars.path.compose}empty.yml`, "events", "--json"],
                    callback: callbackRecurse,
                    command: vars.commands.compose,
                    recurse: vars.intervals.compose
                });
            } else {
                log({
                    action: "activate",
                    config: error,
                    message: (error === null)
                        ? "When executing 'docker ps'. The command returned an empty string. Perhaps the command requires higher privlege."
                        : "Exeucting command 'docker ps' returned an error.",
                    status: "error",
                    type: "compose-containers"
                });
                vars.compose = null;
            }
            callback();
        },
        callbackRecurse = function services_dockerPS_callbackRecurse(stderr:string, stdout:string, error:node_childProcess_ExecException):void {
            if (stderr === "" && error === null) {
                const event:services_docker_event = JSON.parse(stdout);
                if (vars.compose.containers[event.service] !== undefined) {
                    if (vars.compose.containers[event.service].state === "running" && (event.action === "destroy" || event.action === "die" || event.action === "kill" || event.action === "stop")) {
                        vars.compose.containers[event.service].state = "dead";
                        logger("deactivate", vars.compose.containers[event.service]);
                    } else if (vars.compose.containers[event.service].state !== "running" && event.action === "start") {
                        vars.compose.containers[event.service].state = "running";
                        logger("activate", vars.compose.containers[event.service]);
                    }
                }
            } else {
                log({
                    action: "modify",
                    config: (stderr === "")
                        ? error
                        : {
                            message: stderr
                        },
                    message: "docker ps",
                    status: "error",
                    type: "compose-containers"
                });
            }
        };
    spawn({
        args: args,
        callback: callbackFirst,
        command: vars.commands.compose,
        recurse: -1
    });
};

export default docker_ps;