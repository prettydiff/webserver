
import dashboard_object from "../utilities/dashboard_object.js";

const fileSystem = function services_fileSystem(socket_data:socket_data, transmit:transmit_socket):void {
    const data:services_fileSystem = socket_data.data as services_fileSystem;
    dashboard_object(transmit.socket as websocket_client, data.address, true);
};

export default fileSystem;