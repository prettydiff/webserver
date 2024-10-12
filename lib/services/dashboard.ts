
import server_create from "../commands/server_create.js";
import server_halt from "../commands/server_halt.js";
import vars from "../utilities/vars.js";

const dashboard = function services_dashboard(socketData:socket_data):void {
    const data:services_dashboard_action = socketData.data as services_dashboard_action;
    if (data.action === "server-destroy") {
        // destroy existing server
        server_halt(data.configuration, "destroy", null);
    } else if (data.action === "server-save") {
        if (vars.servers[data.configuration.name] === undefined && typeof data.configuration.modification_name !== "string") {
            // create new server
            server_create(data.configuration, true, null);
        } else {
            // modify existing server
            server_halt(data.configuration, "modify", null);
        }
    }
};

export default dashboard;