
import server from "../transmit/server.js";
import server_create from "../commands/server_create.js";
import server_halt from "../commands/server_halt.js";

const dashboard = function services_dashboard(socketData:socket_data):void {
    const data:services_dashboard_action = socketData.data as services_dashboard_action;
    if (data.action === "activate") {
        // turn existing server on
        server(data.configuration.name, null);
    } else if (data.action === "add") {
        // create new server
        server_create(data.configuration, null);
    } else if (data.action === "destroy") {
        // destroy existing server
        server_halt(data.configuration, "destroy", null);
    } else if (data.action === "deactivate") {
        // destroy existing server
        server_halt(data.configuration, "deactivate", null);
    } else if (data.action === "modify") {
        // modify existing server
        server_halt(data.configuration, "modify", null);
    }
};

export default dashboard;