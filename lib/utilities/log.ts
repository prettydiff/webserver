
import broadcast from "../transmit/broadcast.js";
import vars from "./vars.js";

const log = function terminal_utilities_log(config:config_log):void {
    const data:services_dashboard_status = {
        action: config.action,
        configuration: config.config,
        message: config.message,
        status: config.status,
        time: Date.now(),
        type: config.type
    };
    vars.logs.push(data);
    broadcast("dashboard", "browser", {
        data: data,
        service: "dashboard-status"
    });
};

export default log;