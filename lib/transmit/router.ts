
import dashboard from "../services/dashboard.js";
import process_kill from "../services/processKill.js";
import terminal from "../services/terminal.js";
import youtube_download from "../services/youtubeDownload.js";

const router = function transmit_router(socketData:socket_data, transmit:transmit_socket):void {
    const services:type_service = socketData.service,
        actions:transmit_receiver = {
            "dashboard-action": dashboard,
            "dashboard-terminal": terminal.server,
            "process-kill": process_kill,
            "youtube-download": youtube_download
        };
    if (actions[services] !== undefined) {
        actions[services](socketData, transmit);
    }
};

export default router;