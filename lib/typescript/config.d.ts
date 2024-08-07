
interface config_certificate {
    callback: () => void;
    days: number;
    domain_default: string;
    selfSign: boolean;
}

interface config_createProxy {
    buffer: Buffer;
    callback: (proxy:websocket_client, buffer:Buffer) => void;
    domain: string;
    socket: websocket_client;
}

interface config_directory {
    callback: (dir:directory_list | string[]) => void;
    depth: number;
    exclusions: string[];
    mode: directory_mode;
    path: string;
    relative: boolean;
    search: string;
    symbolic: boolean;
}

interface config_hash {
    algorithm: hash_algorithm_type;
    callback: (hashOutput:hash_output) => void;
    digest: "base64" | "hex";
    hash_input_type: hash_input_type;
    source: Buffer | string;
}

interface config_html {
    content: Buffer|string[];
    content_type: string;
    page_title: string;
    script: string;
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
    resource: string;
    secure: boolean;
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