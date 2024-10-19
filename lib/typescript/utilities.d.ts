
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

interface project_config {
    [key:string]: server;
}

interface project_ports {
    open?: number;
    secure?: number;
}

interface store_action {
    [key:string]: (event?:type_user_event) => void;
}

interface store_flag {
    [key:string]: boolean;
}

interface store_number {
    [key:string]: number;
}

interface store_ports {
    [key:string]: project_ports;
}

interface store_sockets {
    [key:string]: websocket_client[];
}

interface store_string {
    [key:string]: string;
}

interface server {
    block_list?: {
        host: string[];
        ip: string[];
        referrer: string[];
    };
    domain_local?: string[];
    encryption: type_encryption;
    http?: {
        delete?: string;
        post?: string;
        put?: string;
    };
    modification_name?: string;
    name: string;
    path: {
        certificates: string;
        storage: string;
        web_root: string;
    };
    ports: project_ports;
    redirect_domain?: {
        [key:string]: [string, number];
    };
    redirect_internal?: {
        [key:string]: store_string;
    };
}

interface server_content {
    [key:string]: (property:type_server_property, parent:HTMLElement) => void;
}

interface vars {
    logs: services_dashboard_status[];
    path: {
        project: string;
    };
    port_conflict: type_port_conflict[];
    processes: {
        [key:string]: node_childProcess_ChildProcess;
    };
    sep: string;
    servers: project_config;
    sockets: store_sockets;
    start_time: bigint;
    store_server: {
        open: {
            [key:string]: server_instance;
        };
        secure: {
            [key:string]: server_instance;
        };
    };
    text: store_string;
}