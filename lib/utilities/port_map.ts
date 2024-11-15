
import broadcast from "../transmit/broadcast.js";
import log from "./log.js";
import node from "./node.js";
import vars from "./vars.js";

// cspell: words nmap;

const port_map = function utilities_portMap(config:socket_data, transmit:transmit_socket, callback?:() => void):void {
    let complete:boolean = false;
    const command:string = "nmap",
        args:string[] = ["--open", "-p-", "127.0.0.1"],
        finish = function utilities_portMap_finish(data:type_external_port[], message:string, error:node_childProcess_ExecException):void {
            if (complete === false && callback !== null && callback !== undefined) {
                const len:number = vars.system_ports.list.length;
                complete = true;
                vars.system_ports = {
                    list: data,
                    time: Date.now()
                };
                log({
                    action: "activate",
                    config: error,
                    message: message,
                    status: "error",
                    type: "port"
                });
                callback();
                // if there is an error it will occur before the end event
                if (error === null) {
                    const payload:services_dashboard_status = {
                        action: "modify",
                        configuration: null,
                        message: "External ports refreshed.",
                        status: "success",
                        time: Date.now(),
                        type: "port"
                    };
                    payload.configuration = vars.system_ports;
                    broadcast("dashboard", "dashboard", {
                        data: payload,
                        service: "dashboard-status"
                    });
                    if (len < 1) {
                        setTimeout(function utilities_portMap_finish_delay():void {
                            port_map(null, null, function utilities_portMap_finish_delay_recurse():void {
                                setTimeout(utilities_portMap, 60000);
                            });
                        }, 60000);
                    }
                }
            }
        },
        handler_error = function utilities_portMap_error(error:node_childProcess_ExecException):void {
            const message:string = `When gathering port data command '${command} ${args.join(" ")}' failed with an error.  Perhaps application NMap is not available.`;
            finish([null, [0, message, ""]], message, error);
        },
        handler_stdout = function utilities_portMap_stdout(data:Buffer):void {
            stdout.push(data);
        },
        handler_stdoutEnd = function utilities_portMap_endStdout():void {
            const data:string = Buffer.concat(stdout).toString(),
                output:type_external_port[] = [],
                lines:string[] = data.replace(/\r\n/g, "\n").split("\n"),
                total:number = lines.length;
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
            finish(output, "External ports refreshed.", null);
        },
        stdout:Buffer[] = [],
        spawn:node_childProcess_ChildProcess = node.child_process.spawn(command, args);
    spawn.stdout.on("data", handler_stdout);
    spawn.stdout.on("end", handler_stdoutEnd);
    spawn.on("error", handler_error);
};

export default port_map;