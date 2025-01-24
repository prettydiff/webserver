
import node from "./node.js";
import vars from "./vars.js";

const spawn = function utilities_spawn(config:config_spawn):node_childProcess_ChildProcess {
    let err:boolean = false;
    const flags:store_flag = {
            stderr: false,
            stdout: false
        },
        finish = function utilities_spawn_finish(flag:"stderr"|"stdout", error:node_childProcess_ExecException):void {
            flags[flag] = true;
            if ((flags.stderr === true && flags.stdout === true) || error !== null) {
                if (config.callback !== null && config.callback !== undefined) {
                    config.callback(Buffer.concat(stderr).toString(), Buffer.concat(stdout).toString(), error);
                    if (config.recurse > 0) {
                        setTimeout(function utilities_spawn_finish_recurse():void {
                            utilities_spawn(config);
                        }, config.recurse);
                    }
                }
            }
        },
        handler_error = function utilities_spawn_error(error:node_childProcess_ExecException):void {
            err = true;
            finish(null, error);
        },
        handler_stderr = function utilities_spawn_stderr(data:Buffer):void {
            stderr.push(data);
        },
        handler_stderrEnd = function utilities_spawn_endStderr():void {
            if (err === false) {
                finish("stderr", null);
            }
        },
        handler_stdout = function utilities_spawn_stdout(data:Buffer):void {
            stdout.push(data);
        },
        handler_stdoutEnd = function utilities_spawn_endStdout():void {
            if (err === false) {
                finish("stdout", null);
            }
        },
        stderr:Buffer[] = [],
        stdout:Buffer[] = [],
        spawn:node_childProcess_ChildProcess = node.child_process.spawn(config.command, config.args, {
            cwd: vars.path.project,
            shell: true,
            timeout: (typeof config.timeout === "number")
                ? config.timeout
                : undefined
        });
    spawn.stderr.on("data", handler_stderr);
    spawn.stderr.on("end", handler_stderrEnd);
    spawn.stdout.on("data", handler_stdout);
    spawn.stdout.on("end", handler_stdoutEnd);
    spawn.on("error", handler_error);
    return spawn;
};

export default spawn;