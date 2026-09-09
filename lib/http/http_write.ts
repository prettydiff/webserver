
import message_inspection from "../services/message_inspection.ts";

const http_write = function http_write(socket:websocket_client, payload:Buffer|string, final:boolean):void {
    socket.write(payload);
    if (final === true) {
        setTimeout(function http_get_write_destroy():void {
            socket.destroy();
        }, 500);
    }
    message_inspection.send({
        count: 0,
        direction: "out",
        maximum_size: 0,
        message: payload.toString(),
        service: socket.server_hash,
        throttle_size: 0,
        throttle_time: 0,
        type: "web-server"
    });
};

export default http_write;