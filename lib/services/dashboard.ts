
import send from "../transmit/send.js";
import server from "../transmit/server.js";
import server_create from "./server_create.js";
import server_halt from "./server_halt.js";
import vars from "../utilities/vars.js";

const dashboard = function services_dashboard(socketData:socket_data, transmit:transmit_socket):void {
    const data:services_dashboard_action = socketData.data as services_dashboard_action;

    if (socketData.service === "dashboard-server") {
        const action_map:services_dashboard = {
            "activate": server,
            "add": server_create,
            "deactivate": server_halt,
            "destroy": server_halt,
            "modify": server_halt
        };
        action_map[data.action](data, null, data.action as type_halt_action);
    } else if (socketData.service === "dashboard-payload") {
        const socket:websocket_client = transmit.socket as websocket_client,
            browser:transmit_dashboard = {
                compose: vars.compose,
                logs: vars.logs,
                path: vars.path,
                ports: vars.system_ports,
                servers: vars.servers,
                terminal: vars.terminal,
                user: vars.user
            };
        send({
            data: browser,
            service: "dashboard-payload"
        }, socket, 1);
    }
};

export default dashboard;