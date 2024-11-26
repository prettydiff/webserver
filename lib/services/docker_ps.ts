
import docker_parse from "../utilities/docker_parse.js";
import log from "../utilities/log.js";
import spawn from "../utilities/spawn.js";
import vars from "../utilities/vars.js";

const docker_ps = function services_dockerPS(callback:() => void):void {
    const callbackFirst = function services_dockerPS_callbackFirst(stderr:string, stdout:string, error:node_childProcess_ExecException):void {
            if (stderr === "" && error === null) {
                docker_parse(stdout);
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
                docker_parse(stdout);
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