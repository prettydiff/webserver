
interface configuration_compose {
    containers: store_compose;
    variables: store_string;
}

interface directory_data {
    atimeMs: number;
    ctimeMs: number;
    linkPath: string;
    linkType: "" | "directory" | "file";
    mode: number;
    mtimeMs: number;
    size: number;
}

interface directory_list extends Array<type_directory_item> {
    [index:number]: type_directory_item;
    failures?: string[];
}

interface external_ports {
    list: type_external_port[];
    time: number;
}

interface file {
    mkdir: (config:file_mkdir) => void;
    read: (config:file_read) => void;
    remove: (config:file_remove) => void;
    stat: (config:file_stat) => void;
    write: (config:file_write) => void;
}

interface file_mkdir {
    callback: () => void;
    error_terminate: type_dashboard_config;
    location: string;
}

interface file_read {
    callback: (file:Buffer) => void;
    error_terminate: type_dashboard_config;
    location: string;
    no_file: () => void;
}

interface file_remove {
    callback: () => void;
    error_terminate: type_dashboard_config;
    exclusions: string[];
    location: string;
}

interface file_stat {
    callback: (stats:node_fs_BigIntStats) => void;
    error_terminate: type_dashboard_config;
    location: string;
    no_file: () => void;
}

interface file_write {
    callback: () => void;
    contents: Buffer | string;
    error_terminate: type_dashboard_config;
    location: string;
}

interface hash_output {
    filePath: string;
    hash: string;
}

interface server {
    config: services_server;
    sockets: services_socket[];
    status: server_ports;
}

interface server_content {
    [key:string]: (property:type_server_property, parent:HTMLElement) => void;
}

interface server_instance extends node_net_Server {
    name?: string;
    secure?: boolean;
}

interface server_meta {
    [key:string]: server_meta_item;
}

interface server_meta_item {
    server: {
        open: server_instance;
        secure: server_instance;
    };
    sockets: {
        open: websocket_client[];
        secure: websocket_client[];
    };
}

interface server_ports {
    open?: number;
    secure?: number;
}

interface store_compose {
    [key:string]: services_compose;
}

interface store_flag {
    [key:string]: boolean;
}

interface store_number {
    [key:string]: number;
}

interface store_ports {
    [key:string]: server_ports;
}

interface store_server_config {
    [key:string]: services_server;
}

interface store_servers {
    [key:string]: server;
}

interface store_sockets {
    [key:string]: websocket_client[];
}

interface store_string {
    [key:string]: string;
}

interface terminal_size {
    cols: number;
    rows: number;
}

interface vars {
    compose: configuration_compose;
    dashboard: string;
    interfaces: string[];
    intervals: store_number;
    logs: services_dashboard_status[];
    path: {
        compose: string;
        project: string;
        servers: string;
    };
    processes: {
        [key:string]: node_childProcess_ChildProcess;
    };
    sep: string;
    server_meta: server_meta;
    servers: store_servers;
    shell: string;
    start_time: bigint;
    system_ports: external_ports;
    terminal: terminal_size;
    text: store_string;
    user: {
        gid: number;
        uid: number;
    };
}