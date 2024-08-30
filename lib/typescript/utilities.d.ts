
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
    block_list: {
        host: string[];
        ip: string[];
        referer: string[];
    };
    domain_local: string[];
    path: {
        storage: string;
        web_root: string;
    };
    ports: {
        dashboard?: project_ports;
        service: project_ports;
    };
    redirect_domain: {
        [key:string]: [string, number];
    };
    redirect_internal: {
        [key:string]: store_string;
    };
    server_name: string;
}

interface vars extends project_config {
    path: {
        conf: string;
        project: string;
        storage: string;
        web_root: string;
    };
    port_conflict: type_port_conflict[];
    processes: {
        [key:string]: node_childProcess_ChildProcess;
    };
    sep: string;
    server_count: number;
    servers: {
        [key:string]: server;
    };
    sockets: {
        [key:string]: websocket_client[];
    };
    text: store_string;
    verbose: boolean;
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

interface store_string {
    [key:string]: string;
}