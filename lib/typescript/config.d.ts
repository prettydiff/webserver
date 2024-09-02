
interface config_certificate {
    callback: () => void;
    days: number;
    domain_default: string;
    selfSign: boolean;
}

interface config_directory {
    callback: (dir:directory_list | string[]) => void;
    depth: number;
    exclusions: string[];
    mode: type_directory_mode;
    path: string;
    relative: boolean;
    search: string;
    symbolic: boolean;
}

interface config_hash {
    algorithm: type_hash_algorithm;
    callback: (hashOutput:hash_output) => void;
    digest: "base64" | "hex";
    hash_input_type: type_hash_input;
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
}

interface config_websocket_extensions {
    callback: (socket:websocket_client) => void;
    handler: websocket_message_handler;
    identifier: string;
    proxy: websocket_client;
    role: "client"|"server";
    server: type_socket_source;
    socket: websocket_client;
}

interface config_websocket_server {
    callback: (type:string, addressInfo:node_net_AddressInfo) => void;
    options: transmit_tlsOptions;
    type: string;
}