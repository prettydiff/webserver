
import process_kill from "../services/processKill.js";
import youtube_download from "../services/youtubeDownload.js";

const router = function transmit_router(socketData:socket_data, transmit:transmit_socket):void {
    const services:service_type = socketData.service,
        actions:transmit_receiver = {
            "process-kill": process_kill,
            "youtube-download": youtube_download
        };
    if (actions[services] !== undefined) {
        actions[services](socketData, transmit);
    }
};

export default router;