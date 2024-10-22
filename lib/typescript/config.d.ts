
interface config_certificate {
    callback: () => void;
    days: number;
    domain_default: string;
    name: string;
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
    core: boolean;
    page_title: string;
    script: () => void;
    status: number;
    template: boolean;
}

interface config_log {
    action: type_dashboard_action;
    config: type_dashboard_config;
    message: string;
    status: type_dashboard_status;
    type: type_dashboard_type;
}

interface config_validate_serverKeys {
    name: "block_list" | "http" | "ports" | "redirect_domain" | "redirect_internal";
    required_name: boolean;
    required_property: boolean;
    supported: string[];
    type: "array" | "number" | "path" | "store" | "string";
}

interface config_websocket_create {
    callback: (socket:websocket_client) => void;
    handler: websocket_message_handler;
    hash: string;
    headers: string[];
    ip: string;
    port: number;
    proxy: websocket_client;
    resource: string;
    secure: boolean;
    type: string;
}

interface config_websocket_extensions {
    callback: (socket:websocket_client) => void;
    handler: websocket_message_handler;
    identifier: string;
    proxy: websocket_client;
    role: "client"|"server";
    server: string;
    socket: websocket_client;
    type: string;
}

interface config_websocket_server {
    callback: (name:string, secure:"open"|"secure") => void;
    name: string;
    options: transmit_tlsOptions;
}