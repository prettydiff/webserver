
import compose from "../services/compose.js";
import dashboard from "../services/dashboard.js";
import process_kill from "../services/processKill.js";
import http_request from "../http/http_requestTest.js";
import youtube_download from "../services/youtubeDownload.js";

const router = function transmit_router(socketData:socket_data, transmit:transmit_socket):void {
    const services:type_service = socketData.service,
        actions:transmit_receiver = {
            "dashboard-compose-container": compose,
            "dashboard-compose-variables": compose,
            "dashboard-http": http_request,
            "dashboard_payload": dashboard,
            "dashboard-server": dashboard,
            "process-kill": process_kill,
            "youtube-download": youtube_download
        };
    if (actions[services] !== undefined) {
        actions[services](socketData, transmit);
    }
};

export default router;