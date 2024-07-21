
import node from "../utilities/node.js";
import vars from "../utilities/vars.js";

const create_proxy = function transmit_createProxy(config:config_createProxy):void {
    const secureDomain:string = config.domain.replace(".x", ".secure"),
        proxy:websocket_client = (config.socket.tlsOptions === undefined)
            ? node.net.connect({
                host: config.socketAddress.local.address,
                port: vars.portMap[config.domain]
            }) as websocket_client
            : node.tls.connect({
                host: config.socketAddress.local.address,
                port: (vars.portMap[secureDomain] === undefined)
                    ? vars.portMap[config.domain]
                    : vars.portMap[secureDomain],
                rejectUnauthorized: false
            }) as websocket_client;
    config.socket.pipe(proxy);
    proxy.pipe(config.socket);
    proxy.once("close", function transmit_http_proxyClose():void {
        proxy.destroy();
        config.socket.destroy();
    });
    proxy.on("error", function transmit_http_proxyError():void {
        // this worthless error trapping prevents an "unhandled error" escalation that breaks the process
        return null;
    });
    config.headerList.push("");
    config.headerList.push("");
    proxy.write(config.headerList.join("\r\n"));
    if (config.body !== null && config.body !== "") {
        proxy.write(config.body);
    }
};

export default create_proxy;