
import server from "../transmit/server.js";
import server_create from "./server_create.js";
import server_halt from "./server_halt.js";

const dashboard = function services_dashboard(socketData:socket_data):void {
    const data:services_dashboard_action = socketData.data as services_dashboard_action,
        action_map:services_dashboard = {
            "activate": server,
            "add": server_create,
            "deactivate": server_halt,
            "destroy": server_halt,
            "modify": server_halt
        };

    action_map[data.action](data, null, data.action as type_halt_action);
};

export default dashboard;