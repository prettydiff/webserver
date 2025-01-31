
import broadcast from "../transmit/broadcast.js";
import log from "../utilities/log.js";
import spawn from "../utilities/spawn.js";
import vars from "../utilities/vars.js";

// cspell: words nmap;

const port_map = function services_portMap(callback:() => void):void {
    const args:string[] = ["--open", (process.platform === "win32") ? "" : "-sTU", "-p-", "127.0.0.1"],
        callbackFirst = function services_portMap_callbackFirst(stderr:string, stdout:string, error:node_childProcess_ExecException):void {
            clearTimeout(delay);
            if (stderr !== "" || error !== null) {
                const message:string = (error === null)
                    ? `When gathering port data from command '${vars.commands.nmap} ${args.join(" ")}' failed with an error. Perhaps application NMap is not available or not in the system path.`
                    : "Exeucting command 'nmap' returned an error.";
                log({
                    action: "activate",
                    config: error,
                    message: message,
                    status: "error",
                    type: "port"
                });
                vars.system_ports = {
                    list: [null, [0, message, "", ""]],
                    time: Date.now()
                };
            } else {
                spawn({
                    args: args,
                    callback: callbackSpawn,
                    command: vars.commands.nmap,
                    recurse: vars.intervals.nmap
                });
            }
            callback();
        },
        callbackSpawn = function services_portMap_callbackSpawn(stderr:string, stdout:string, error:node_childProcess_ExecException):void {
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
                            output.push([Number(portItem[0].split("/")[0]), portItem[0].split("/")[1].toUpperCase(), "", portItem[2]]);
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
                    message: `When gathering port data command '${vars.commands.nmap} ${args.join(" ")}' failed with an error. Perhaps application NMap is not available or not in the system path.`,
                    status: "error",
                    type: "port"
                });
            }
        },
        delay:NodeJS.Timeout = setTimeout(function services_portMap_timeout():void {
            const message:string = `NMAP timed out when gathering port data from command '${vars.commands.nmap} ${args.join(" ")}'.`;
            child.kill("SIGINT");
            log({
                action: "activate",
                config: null,
                message: message,
                status: "error",
                type: "port"
            });
            vars.system_ports = {
                list: [null, [0, message, "", ""]],
                time: Date.now()
            };
            callback();
        }, vars.intervals.nmap),
        child:node_childProcess_ChildProcess = spawn({
            args: args,
            callback: callbackFirst,
            command: vars.commands.nmap,
            recurse: -1
        });
};

export default port_map;