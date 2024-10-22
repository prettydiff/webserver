
import send from "./send.js";
import vars from "../utilities/vars.js";

const broadcast = function transmit_broadcast(server:string, type:string, message:socket_data):void {
    const perServer = function transmit_broadcast_perServer(encryption:"open"|"secure"):void {
            const list:websocket_client[] = vars.server_meta[server].sockets[encryption];
            let index:number = list.length;
            if (index > 0) {
                do {
                    index = index - 1;
                    if (list[index].type === type || type === "") {
                        send(message, list[index], 1);
                    }
                } while (index > 0);
            }
        },
        encryptionType:type_encryption = vars.servers[server].encryption;
    if (encryptionType === "both") {
        perServer("open");
        perServer("secure");
    } else {
        perServer(encryptionType);
    }
};

export default broadcast;