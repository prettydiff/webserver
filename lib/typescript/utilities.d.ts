
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

interface store_flag {
    [key:string]: boolean;
}

interface store_number {
    [key:string]: number;
}

interface store_string {
    [key:string]: string;
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
    redirect_domain: {
        [key:string]: [string, number];
    };
    redirect_internal: {
        [key:string]: store_string;
    };
    server_name: string;
    service_port: {
        dashboard?: number;
        open: number;
        secure: number;
    };
}

interface vars extends project_config {
    path: {
        conf: string;
        project: string;
        storage: string;
        web_root: string;
    };
    processes: {
        [key:string]: node_childProcess_ChildProcess;
    };
    sep: string;
    servers: {
        [key:string]: server;
    };
    sockets: {
        [key:string]: websocket_client[];
    };
    text: store_string;
    verbose: boolean;
}