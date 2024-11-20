
import compose from "../services/compose.js";
import dashboard from "../services/dashboard.js";
import process_kill from "../services/processKill.js";
import send from "./send.js";
import vars from "../utilities/vars.js";
import youtube_download from "../services/youtubeDownload.js";

const router = function transmit_router(socketData:socket_data, transmit:transmit_socket):void {
    const services:type_service = socketData.service,
        actions:transmit_receiver = {
            "dashboard-compose-container": compose,
            "dashboard-compose-variables": compose,
            "dashboard_payload": function transmit_router_payload():void {
                const socket:websocket_client = transmit.socket as websocket_client,
                    browser:transmit_dashboard = {
                        compose: vars.compose,
                        logs: vars.logs,
                        ports: vars.system_ports,
                        servers: vars.servers,
                        terminal: vars.terminal
                    };
                send({
                    data: browser,
                    service: "dashboard-payload"
                }, socket, 1);
            },
            "dashboard-server": dashboard,
            "process-kill": process_kill,
            "youtube-download": youtube_download
        };
    if (actions[services] !== undefined) {
        actions[services](socketData, transmit);
    }
};

export default router;