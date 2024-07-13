
import store from "./store.js";

const getSocket = function transmit_getSocket(type:string, name:string):websocket_client {
    if (store[type] === undefined || store[type] === null || store[type][name] === undefined || store[type][name] === null) {
        return null;
    }
    return store[type][name];
};

export default getSocket;