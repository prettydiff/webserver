
import node from "../utilities/node.js";
import vars from "../utilities/vars.js";
import redirection from "./redirection.js";

const create_proxy = function transmit_createProxy(config:config_createProxy):void {
    const proxy:websocket_client = (config.socket.tlsOptions === undefined)
        ? node.net.connect({
            host: config.host,
            port: config.port
        }) as websocket_client
        : node.tls.connect({
            host: config.host,
            port: config.port,
            rejectUnauthorized: false
        }) as websocket_client;
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
    proxy.pipe(config.socket);

    if (vars.map_redirect[config.domain] === undefined) {
        config.socket.pipe(proxy);
        proxy.write(config.buffer);
    } else {
        // HTTP redirection support
        config.socket.on("data", function transmit_createProxy_redirect(data:Buffer):void {
            proxy.write(redirection(config.domain, data));
        });
        proxy.write(redirection(config.domain, config.buffer));
    }
    if (config.callback !== null) {
        config.callback(proxy, config.buffer);
    }
};

export default create_proxy;