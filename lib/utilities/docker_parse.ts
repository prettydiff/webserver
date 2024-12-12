
import log from "./log.js";
import vars from "./vars.js";

const docker_parse = function utilities_dockerParse(stdout:string):void {
    const lns:string[] = stdout.replace(/\s+$/, "").split("\n"),
        len:number = lns.length,
        logger = function utilities_dockerParse_logger(action:"activate"|"deactivate", config:services_compose):void {
            log({
                action: action,
                config: config,
                message: (action === "activate")
                    ? `Docker container ${config.names} came online.`
                    : `Docker container ${config.names} went offline.`,
                status: "informational",
                type: "compose-containers"
            });
        };
    let index:number = 0,
        compose:services_compose = null,
        item:store_string = null,
        action:"activate"|"deactivate" = null;
    do {
        item = JSON.parse(lns[index]);
        compose = {
            command: item.command,
            compose: "",
            createdAt: item.CreatedAt,
            description: "",
            id: item.ID,
            image: item.Image,
            labels: item.Labels.split(","),
            localVolumes: Number(item.LocalVolumes),
            mounts: item.Mounts.split(","),
            names: item.Names,
            networks: item.Networks,
            ports: (function utilities_dockerParse_ports():[number, "tcp"|"udp"][] {
                if ((/0\.0\.0\.0/).test(item.Ports) === true && (/::\]?:/).test(item.Ports) === true) {
                    item.Ports = item.Ports.replace(/\[?::\]?:\d+->\d+\/((tcp)|(udp))(, )?/g, "").replace(/,\s+$/, "");
                }
                const ports:string[] = item.Ports.split(", "),
                    output:[number, "tcp"|"udp"][] = [],
                    portLen:number = output.length;
                let pind:number = 0;
                do {
                    if ((/^\d+\/\w+$/).test(ports[pind]) === true) {
                        output.push([
                            Number(ports[pind].split("/")[0]),
                            ports[pind].split("/")[1] as "tcp"|"udp"
                        ]);
                    } else {
                        output.push([
                            Number(ports[pind].slice(ports[pind].lastIndexOf(":") + 1, ports[pind].indexOf("-"))),
                            ports[pind].slice(ports[pind].indexOf("/") + 1) as "tcp"|"udp"
                        ]);
                    }
                    pind = pind + 1;
                } while (pind < portLen);
                output.sort(function services_dockerParse_ports_sort(a:[number, "tcp"|"udp"], b:[number, "tcp"|"udp"]):-1|1 {
                    if (a[0] < b[0]) {
                        return -1;
                    }
                    if (a[0] === b[0] && a[1] < b[1]) {
                        return -1;
                    }
                    return 1;
                });
                return output;
            }()),
            runningFor: item.RunningFor,
            size: item.Size,
            state: item.State,
            status: item.Status,
            status_type: [
                (item.Status.indexOf("Up") === 0)
                    ? "green"
                    : "red",
                (item.Status.indexOf("Up") === 0)
                    ? "online"
                    : "offline",
            ]
        };
        if (vars.compose.containers[item.Names] !== undefined) {
            compose.compose = vars.compose.containers[item.Names].compose;
            compose.description = vars.compose.containers[item.Names].description;
            if (compose.status_type[1] === "offline" && vars.compose.containers[item.Names].status_type[1] === "online") {
                action = "deactivate";
            } else {
                action = "activate";
            }
            vars.compose.containers[item.Names] = compose;
            logger(action, compose);
        }
        index = index + 1;
    } while (index < len);
};

export default docker_parse;