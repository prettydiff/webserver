
import dashboard_object from "../utilities/dashboard_object.js";

const fileSystem = function services_fileSystem(socket_data:socket_data, transmit:transmit_socket):void {
    const data:services_fileSystem = socket_data.data as services_fileSystem;
    dashboard_object({
        fileSystem_only: true,
        path: data.address,
        search: data.search,
        socket: transmit.socket as websocket_client
    });
};

export default fileSystem;