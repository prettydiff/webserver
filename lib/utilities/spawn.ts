
import node from "./node.js";

const spawn = function utilities_spawn(config:config_spawn):void {
    let err:boolean = false;
    const finish = function utilities_spawn_finish(data:string, error:node_childProcess_ExecException):void {
            if (config.callback !== null && config.callback !== undefined) {
                config.callback(data, error);
                if (config.recurse > 0) {
                    setTimeout(function utilities_spawn_finish_recurse():void {
                        utilities_spawn(config);
                    }, config.recurse);
                }
            }
        },
        handler_error = function utilities_spawn_error(error:node_childProcess_ExecException):void {
            err = true;
            finish(null, error);
        },
        handler_stdout = function utilities_spawn_stdout(data:Buffer):void {
            stdout.push(data);
        },
        handler_stdoutEnd = function utilities_spawn_endStdout():void {
            if (err === false) {
                finish(Buffer.concat(stdout).toString(), null);
            }
        },
        stdout:Buffer[] = [],
        spawn:node_childProcess_ChildProcess = node.child_process.spawn(config.command, config.args);
    spawn.stdout.on("data", handler_stdout);
    spawn.stdout.on("end", handler_stdoutEnd);
    spawn.on("error", handler_error);
};

export default spawn;