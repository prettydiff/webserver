
interface config_createProxy {
    body: Buffer | string;
    domain: string;
    headerList: string[];
    socket: websocket_client;
    socketAddress: transmit_addresses_socket;
}

interface config_hash {
    algorithm: hash_algorithm_type;
    callback: (hashOutput:hash_output) => void;
    digest: "base64" | "hex";
    hash_input_type: hash_input_type;
    source: Buffer | string;
}

interface config_html {
    binary: boolean;
    content: Buffer|string[];
    content_type: string;
    status: number;
    template: boolean;
}

interface config_websocket_create {
    callback: (socket:websocket_client) => void;
    handler: websocket_message_handler;
    hash: string;
    headers: string[];
    ip: string;
    port: number;
    proxy: boolean;
    socketType: socket_type;
}

interface config_websocket_extensions {
    callback: (socket:websocket_client) => void;
    handler: websocket_message_handler;
    identifier: string;
    role: "client"|"server";
    socket: websocket_client;
    type: socket_type;
}

interface config_websocket_server {
    callback: (addressInfo:node_net_AddressInfo) => void;
    options: transmit_tlsOptions;
}