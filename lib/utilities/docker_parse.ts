
import log from "./log.js";
import vars from "./vars.js";

const docker_parse = function utilities_dockerParse(stdout:string):void {
    const lines:string[] = stdout.replace(/\s{3,}/g, "   ").split("\n"),
        logger = function utilities_dockerParse_logger(action:"activate"|"deactivate", config:services_compose, message:string):void {
            log({
                action: action,
                config: config,
                message: message,
                status: "informational",
                type: "compose-containers"
            });
        },
        listed:string[] = [],
        keys:string[] = Object.keys(vars.compose.containers);
    let index:number = lines.length,
        message:string = "",
        pind:number = 0,
        portLen:number = 0,
        items:string[] = null,
        portItems:string[] = null,
        ports:[number, "tcp"|"udp"][] = null;
    if (index > 1) {
        do {
            index = index - 1;
            items = lines[index].split("   ");
            if (items.length === 6) {
                items.splice(5, 0, "");
            }
            if (vars.compose.containers[items[6]] !== undefined) {
                listed.push(items[6]);
                if (items[4].indexOf("Up ") === 0) {
                    if (vars.compose.containers[items[6]].status[0] === "red") {
                        message = `Docker container ${items[6]} came online.`;
                    }
                    vars.compose.containers[items[6]].status = ["green", "online"];
                } else {
                    if (vars.compose.containers[items[6]].status[0] === "green") {
                        message = `Docker container ${items[6]} went offline.`;
                    }
                    vars.compose.containers[items[6]].ports = [];
                    vars.compose.containers[items[6]].status = ["red", "offline"];
                }
                if (items[5] !== "" && vars.compose.containers[items[6]].status[0] === "green") {
                    if ((/0\.0\.0\.0/).test(items[5]) === true && (/::\]?:/).test(items[5]) === true) {
                        items[5] = items[5].replace(/\[?::\]?:\d+->\d+\/((tcp)|(udp))(, )?/g, "").replace(/,\s+$/, "");
                    }
                    ports = [];
                    portItems = items[5].split(", ");
                    pind = 0;
                    portLen = portItems.length;
                    do {
                        if ((/^\d+\/\w+$/).test(portItems[pind]) === true) {
                            ports.push([
                                Number(portItems[pind].split("/")[0]),
                                portItems[pind].split("/")[1] as "tcp"
                            ]);
                        } else {
                            ports.push([
                                Number(portItems[pind].slice(portItems[pind].lastIndexOf(":") + 1, portItems[pind].indexOf("-"))),
                                portItems[pind].slice(portItems[pind].indexOf("/") + 1) as "tcp"
                            ]);
                        }
                        pind = pind + 1;
                    } while (pind < portLen);
                    ports.sort(function services_dockerPS_parse_sort(a:[number, "tcp"|"udp"], b:[number, "tcp"|"udp"]):-1|1 {
                        if (a[0] < b[0]) {
                            return -1;
                        }
                        if (a[0] === b[0] && a[1] < b[1]) {
                            return -1;
                        }
                        return 1;
                    });
                }
                if (message !== "" || ports.length !== vars.compose.containers[items[6]].ports.length) {
                    vars.compose.containers[items[6]].ports = ports;
                    logger((vars.compose.containers[items[6]].status[0] === "green")
                            ? "activate"
                            : "deactivate",
                            vars.compose.containers[items[6]],
                        message
                    );
                } else {
                    pind = ports.length;
                    do {
                        pind = pind - 1;
                        if (vars.compose.containers[items[6]].ports[pind][0] !== ports[pind][0] || vars.compose.containers[items[6]].ports[pind][1] !== ports[pind][1]) {
                            vars.compose.containers[items[6]].ports = ports;
                            logger((vars.compose.containers[items[6]].status[0] === "green")
                                    ? "activate"
                                    : "deactivate",
                                    vars.compose.containers[items[6]],
                                `Ports changed for container ${items[6]}`
                            );
                            break;
                        }
                    } while (pind > 0);
                }
            }
        } while (index > 1);
    }
    index = keys.length;
    if (index > 0) {
        do {
            index = index - 1;
            if (listed.includes(keys[index]) === false && vars.compose.containers[keys[index]].status[0] === "green") {
                vars.compose.containers[keys[index]].ports = [];
                vars.compose.containers[keys[index]].status = ["red", "offline"];
                logger("deactivate", vars.compose.containers[items[6]], `Docker container ${items[6]} went offline.`);
            }
        } while (index > 0);
    }
};

export default docker_parse;