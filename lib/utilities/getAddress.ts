

const getAddress = function utilities_getAddress(transmit:transmit_socket):transmit_addresses_socket {
    const response:node_http_ServerResponse = transmit.socket as node_http_ServerResponse,
        socket:node_net_Socket = (transmit.type === "ws")
            ? transmit.socket as websocket_client
            : response.socket,
        parse = function utilities_getAddress_parse(input:string):string {
            if (input === undefined) {
                return "undefined, possibly due to socket closing";
            }
            if (input.indexOf("::ffff:") === 0) {
                return input.replace("::ffff:", "");
            }
            if (input.indexOf(":") > 0 && input.indexOf(".") > 0) {
                return input.slice(0, input.lastIndexOf(":"));
            }
            return input;
        };
    return {
        local: {
            address: parse(socket.localAddress),
            port: socket.localPort
        },
        remote: {
            address: parse(socket.remoteAddress),
            port: socket.remotePort
        }
    };
};

export default getAddress;