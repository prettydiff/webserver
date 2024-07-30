
interface project_config {
    domain_default: string;
    map_port: store_number;
    map_redirect: {
        [key:string]: store_string;
    };
    path: {
        storage: string;
        web_root: string;
    };
    service_port: {
        open: number;
        secure: number;
    };
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

interface vars {
    domain: string;
    map_port: store_number;
    map_redirect: {
        [key:string]: store_string;
    };
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
    service_port: {
        open: number;
        secure: number;
    };
    text: store_string;
    verbose: boolean;
}