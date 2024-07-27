
import node from "../utilities/node.js";
import send from "../transmit/send.js";
import vars from "../utilities/vars.js";

// cspell: words taskkill

const process_kill = function services_processKill(socketData:socket_data, transmit:transmit_socket):void {
    const data:services_processKill = socketData.data as services_processKill,
        message:services_youtubeStatus = {
            pid: data.process,
            status: `Process ${data.process} killed.`,
            time: ""
        };
    if (vars.processes[data.process] === undefined) {
        message.status = `Process ${data.process} is undefined.`;
        send({
            data: message,
            service: "youtube-download-status"
        }, transmit.socket as websocket_client, 1);
    } else {
        vars.processes[data.process].kill("SIGKILL");
        if (process.platform === "win32") {
            node.child_process.spawn(`Stop-Process -ID ${data.process} -Force`, {
                shell: "powershell"
            });
        }
        send({
            data: message,
            service: "youtube-download-status"
        }, transmit.socket as websocket_client, 1);
    }
};

export default process_kill;