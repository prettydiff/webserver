
const router = function transmit_router(socketData:socket_data, transmit:transmit_type):void {
    const services:service_type = socketData.service,
        actions:transmit_receiver = {};
    if (actions[services] !== undefined) {
        actions[services](socketData, transmit);
    }
};

export default router;