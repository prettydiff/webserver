
import broadcast from "../transmit/broadcast.js";
import log from "./log.js";
import spawn from "./spawn.js";
import vars from "./vars.js";

// cspell: words nmap;

const port_map = function utilities_portMap(callback:() => void):void {
    const command = "nmap",
        args:string[] = ["--open", "-p-", "127.0.0.1"],
        callbackSpawn = function utilities_portMap_callbackSpawn(stderr:string, stdout:string, error:node_childProcess_ExecException):void {
            if (error === null) {
                const output:type_external_port[] = [],
                    lines:string[] = stdout.replace(/\r\n/g, "\n").split("\n"),
                    total:number = lines.length,
                    payload:services_dashboard_status = {
                        action: "modify",
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
            } else {
                log({
                    action: "activate",
                    config: error,
                    message: `When gathering port data command '${command} ${args.join(" ")}' failed with an error. Perhaps application NMap is not available or not in the system path.`,
                    status: "error",
                    type: "port"
                });
            }
            if (callback !== null && callback !== undefined) {
                callback();
                callback = null;
            }
        };
    spawn({
        args: args,
        callback: callbackSpawn,
        command: command,
        recurse: 60000
    });
};

export default port_map;