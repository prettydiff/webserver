
import broadcast from "../transmit/broadcast.js";
import log from "./log.js";
import node from "./node.js";
import vars from "./vars.js";

// cspell: words nmap;

const port_map = function utilities_portMap(data:services_dashboard_action, callback:() => void):void {
    const command:string = "nmap --open 127.0.0.1";
    node.child_process.exec(command, function utilities_portMap_child(error:node_childProcess_ExecException, stdout:string):void {
        if (error === null) {
            const output:type_external_port[] = [],
                lines:string[] = stdout.replace(/\r\n/g, "\n").split("\n"),
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
        } else {
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
        }
        if (callback !== null) {
            callback();
        }
    });
};

export default port_map;