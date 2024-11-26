
import broadcast from "../transmit/broadcast.js";
import log from "../utilities/log.js";
import spawn from "../utilities/spawn.js";
import vars from "../utilities/vars.js";

const docker_ps = function services_dockerPS(callback:() => void):void {
    const parse = function services_dockerPS_parse(stdout:string):void {
            const lines:string[] = stdout.replace(/\s{3,}/g, "   ").split("\n"),
                payload:services_dashboard_status = {
                    action: "modify",
                    configuration: null,
                    message: "Container status refreshed.",
                    status: "success",
                    time: Date.now(),
                    type: "compose-containers"
                },
                keys:string[] = Object.keys(vars.compose.containers);
            let index:number = lines.length,
                pind:number = 0,
                portLen:number = 0,
                items:string[] = null,
                ports:string[] = null,
                listed:string[] = [];
            if (index > 1) {
                do {
                    index = index - 1;
                    items = lines[index].split("   ");
                    if (items.length === 6) {
                        items.splice(5, 0, "");
                    }
                    if (vars.compose.containers[items[6]] !== undefined) {
                        listed.push(items[6]);
                        if (items[4].indexOf("Up ") === 0) {
                            if (vars.compose.containers[items[6]].status[0] === "red") {
                                log({
                                    action: "activate",
                                    config: vars.compose.containers,
                                    message: `Docker container ${items[6]} came online.`,
                                    status: "informational",
                                    type: "compose-containers"
                                });
                            }
                            vars.compose.containers[items[6]].status = ["green", "online"];
                        } else {
                            if (vars.compose.containers[items[6]].status[0] = "green") {
                                log({
                                    action: "deactivate",
                                    config: vars.compose.containers,
                                    message: `Docker container ${items[6]} went offline.`,
                                    status: "informational",
                                    type: "compose-containers"
                                });
                            }
                            vars.compose.containers[items[6]].ports = [];
                            vars.compose.containers[items[6]].status = ["red", "offline"];
                        }
                        vars.compose.containers[items[6]].ports = [];
                        if (items[5] !== "") {
                            if ((/0\.0\.0\.0/).test(items[5]) === true && (/::\]?:/).test(items[5]) === true) {
                                items[5] = items[5].replace(/\[?::\]?:\d+->\d+\/((tcp)|(udp))(, )?/g, "").replace(/,\s+$/, "");
                            }
                            ports = items[5].split(", ");
                            pind = 0;
                            portLen = ports.length;
                            do {
                                if ((/^\d+\/\w+$/).test(ports[pind]) === true) {
                                    vars.compose.containers[items[6]].ports.push([
                                        Number(ports[pind].split("/")[0]),
                                        ports[pind].split("/")[1] as "tcp"
                                    ]);
                                } else {
                                    vars.compose.containers[items[6]].ports.push([
                                        Number(ports[pind].slice(ports[pind].lastIndexOf(":") + 1, ports[pind].indexOf("-"))),
                                        ports[pind].slice(ports[pind].indexOf("/") + 1) as "tcp"
                                    ]);
                                }
                                pind = pind + 1;
                            } while (pind < portLen);
                        }
                    }
                } while (index > 1);
            }
            index = keys.length;
            if (index > 0) {
                do {
                    index = index - 1;
                    if (listed.includes(keys[index]) === false) {
                        vars.compose.containers[keys[index]].ports = [];
                        vars.compose.containers[keys[index]].status = ["red", "offline"];
                    }
                } while (index > 0);
            }
            payload.configuration = vars.compose.containers;
            broadcast("dashboard", "dashboard", {
                data: payload,
                service: "dashboard-status"
            });
        },
        callbackFirst = function services_dockerPS_callbackFirst(stderr:string, stdout:string, error:node_childProcess_ExecException):void {
            if (stderr === "" && error === null) {
                parse(stdout);
                spawn({
                    args: ["ps"],
                    callback: callbackRecurse,
                    command: "docker",
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
                parse(stdout);
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
        args: ["ps"],
        callback: callbackFirst,
        command: "docker",
        recurse: -1
    });
};

export default docker_ps;