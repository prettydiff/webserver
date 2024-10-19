
import send from "./send.js";
import vars from "../utilities/vars.js";

const broadcast = function transmit_broadcast(server:string, type:string, message:socket_data):void {
    const list:websocket_client[] = vars.sockets[server];
    let index:number = list.length;
    if (index > 0) {
        do {
            index = index - 1;
            if (list[index].type === type || type === "") {
                send(message, list[index], 1);
            }
        } while (index > 0);
    }
};

export default broadcast;