
import broadcast from "../transmit/broadcast.js";
import log from "./log.js";
import node from "./node.js";
import vars from "./vars.js";

// cspell: words nmap;

const port_map = function utilities_portMap(data:services_dashboard_action, callback:() => void):void {
    const command:string = "nmap",
        handler_error = function utilities_portMap_error(error:node_childProcess_ExecException):void {
            const message:string = `When gathering port data command '${command}' failed with an error.  Perhaps application NMap is not available.`;
            vars.system_ports = {
                list: [null, [0, message, ""]],
                time: Date.now()
            };
            log({
                action: "activate",
                config: error,
                message: message,
                status: "error",
                type: "port"
            });
            if (callback !== null) {
                callback();
            }
        },
        handler_stdout = function utilities_portMap_stdout(data:Buffer):void {
            stdout.push(data);
        },
        handler_stdoutEnd = function utilities_portMap_endStdout():void {
            const data:string = Buffer.concat(stdout).toString(),
                output:type_external_port[] = [],
                lines:string[] = data.replace(/\r\n/g, "\n").split("\n"),
                total:number = lines.length,
                payload:services_dashboard_status = {
                    action: "ports-refresh",
                    configuration: null,
                    message: "External ports refreshed.",
                    status: "success",
                    time: Date.now(),
                    type: "port"
                };
            let index:number = 0,
                portItem:string[] = null,
                start:boolean = false;
            do {
                if ((/STATE\s+SERVICE/).test(lines[index]) === true) {
                    start = true;
                } else if (start === true) {
                    if (lines[index] === "") {
                        break;
                    }
                    if ((/\/((tcp)|(udp))/).test(lines[index]) === true) {
                        portItem = lines[index].replace(/\s+/g, " ").split(" ");
                        output.push([Number(portItem[0].split("/")[0]), portItem[0].split("/")[1], portItem[2]]);
                    }
                }
                index = index + 1;
            } while (index < total);
            vars.system_ports = {
                list: output,
                time: Date.now()
            };
            payload.configuration = vars.system_ports;
            broadcast("dashboard", "dashboard", {
                data: payload,
                service: "dashboard-status"
            });
            if (callback !== null) {
                callback();
            }
        },
        stdout:Buffer[] = [],
        spawn:node_childProcess_ChildProcess = node.child_process.spawn(command, ["--open", "127.0.0.1"]);
    spawn.stdout.on("data", handler_stdout);
    spawn.stdout.on("end", handler_stdoutEnd);
    spawn.on("error", handler_error);
};

export default port_map;