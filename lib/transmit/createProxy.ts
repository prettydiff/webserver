
import get_address from "../utilities/getAddress.js";
import node from "../utilities/node.js";
import vars from "../utilities/vars.js";
import redirection from "./redirection.js";

const create_proxy = function transmit_createProxy(config:config_createProxy):void {
    const  address:transmit_addresses_socket = get_address({
            socket: config.socket,
            type: "ws"
        }),
        pair:[string, number] = ((config.socket.encrypted === true && vars.redirect_domain[`${config.domain}.secure`] !== undefined))
            ? vars.redirect_domain[`${config.domain}.secure`]
            : (vars.redirect_domain[config.domain] === undefined)
                ? (config.socket.encrypted === true)
                    ? [address.local.address, vars.service_port.secure]
                    : [address.local.address, vars.service_port.open]
                : vars.redirect_domain[config.domain],
        host:string = (pair[0] === undefined || pair[0] === null || pair[0] === "")
            ? address.local.address
            : pair[0],
        port:number = (typeof pair[1] === "number")
            ? pair[1]
            : (config.socket.encrypted === true)
                ? vars.service_port.secure
                : vars.service_port.open,
        proxy:websocket_client = (config.socket.encrypted === true)
            ?  node.tls.connect({
                host: host,
                port: port,
                rejectUnauthorized: false
            }) as websocket_client
            : node.net.connect({
                host: host,
                port: port
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

    if (vars.redirect_internal[config.domain] === undefined) {
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