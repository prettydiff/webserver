
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

interface hash_output {
    filePath: string;
    hash: string;
}

interface project_config {
    [key:string]: server;
}

interface project_ports {
    open: number;
    secure: number;
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
    http?: {
        delete?: string;
        post?: string;
        put?: string;
    };
    path: {
        storage: string;
        web_root?: string;
    };
    ports: project_ports;
    redirect_domain?: {
        [key:string]: [string, number];
    };
    redirect_internal?: {
        [key:string]: store_string;
    };
    server_name: string;
}

interface vars {
    path: {
        conf: string;
        project: string;
    };
    port_conflict: type_port_conflict[];
    processes: {
        [key:string]: node_childProcess_ChildProcess;
    };
    sep: string;
    servers: project_config;
    sockets: {
        [key:string]: websocket_client[];
    };
    store_server: {
        [key:string]: server_instance;
    };
    text: store_string;
    verbose: boolean;
}