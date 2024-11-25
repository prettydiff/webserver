
import log from "../utilities/log.js";
import spawn from "../utilities/spawn.js";
import vars from "../utilities/vars.js";

const docker_ps = function services_dockerPS(callback:() => void):void {
    const callbackFirst = function services_dockerPS_callbackFirst(stderr:string, stdout:string, error:node_childProcess_ExecException):void {
            if (stderr !== "" || error !== null) {
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
            } else {
                spawn({
                    args: ["ps"],
                    callback: callbackRecurse,
                    command: "docker",
                    recurse: vars.intervals.compose
                });
            }
            callback();
        },
        callbackRecurse = function services_dockerPS_callbackRecurse(stderr:string, stdout:string, error:node_childProcess_ExecException):void {
            if (stderr === "" && error === null) {
                const lines:string[] = stdout.replace(/\s{3,}/g, "   ").split("\n");
                let index:number = lines.length,
                    pind:number = 0,
                    items:string[] = null,
                    ports:string[] = null;
                do {
                    index = index - 1;
                    items = lines[index].split("   ");
                    if (vars.compose.containers[items[6]] !== undefined) {
                        if (items[4].indexOf("Up ") === 0) {
                            vars.compose.containers[items[6]].status = ["green", "online"];
                        } else {
                            vars.compose.containers[items[6]].status = ["red", "offline"];
                        }
                        if ((/0\.0\.0\.0/).test(items[5]) === true && (/::\[?:/).test(items[5]) === true) {
                            items[5] = items[5].replace(/\[::\]:\d+->\d+\/((tcp)|(udp))(, )?/g, "");
                            ports = items[5].split(", ");
                            pind = ports.length;
                            vars.compose.containers[items[6]].ports = [];
                            do {
                                pind = pind - 1;
                                vars.compose.containers[items[6]].ports.push([
                                    Number(ports[pind].slice(ports[pind].lastIndexOf(":"), ports[pind].indexOf("-"))),
                                    ports[pind].slice(ports[pind].indexOf("/") + 1) as "tcp"|"udp"
                                ]);
                            } while (pind > 0);
                        }
                    }
                } while (index > 0);

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