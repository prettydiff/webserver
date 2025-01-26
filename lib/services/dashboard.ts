
import dashboard_object from "../utilities/dashboard_object.js";
import server from "../transmit/server.js";
import server_create from "./server_create.js";
import server_halt from "./server_halt.js";
import vars from "../utilities/vars.js";

const dashboard = function services_dashboard(socketData:socket_data, transmit:transmit_socket):void {
    const data:services_action_server = socketData.data as services_action_server;
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
        dashboard_object(transmit.socket as websocket_client, vars.path.project, false);
    }
};

export default dashboard;