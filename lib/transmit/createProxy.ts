
import node from "../utilities/node.js";

const create_proxy = function transmit_createProxy(config:config_createProxy):void {
    const complete = function transmit_createProxy_complete(proxy:websocket_client):void {
            config.socket.once("close", function transmit_createProxy_complete_socketClose():void {
                proxy.destroy();
                config.socket.destroy();
            });
            proxy.once("close", function transmit_createProxy_complete_proxyClose():void {
                proxy.destroy();
                config.socket.destroy();
            });
            proxy.on("error", function transmit_createProxy_complete_proxyError():void {
                // this worthless error trapping prevents an "unhandled error" escalation that breaks the process
                return null;
            });
            config.socket.pipe(proxy);
            proxy.pipe(config.socket);
            proxy.write(config.buffer);
            if (config.callback !== null) {
                config.callback(proxy, config.buffer);
            }
        },
        opts:node_net_NetConnectOpts = {
            host: config.host,
            port: config.port
        },
        proxy:websocket_client = node.net.connect(opts) as websocket_client;
    complete(proxy);
};

export default create_proxy;