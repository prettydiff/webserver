
interface project_config {
    domain_default: string;
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
    path: {
        conf: string;
        project: string;
        storage: string;
        web_root: string;
    };
    processes: {
        [key:string]: node_childProcess_ChildProcess;
    };
    redirect_domain: {
        [key:string]: [string, number];
    };
    redirect_internal: {
        [key:string]: store_string;
    };
    sep: string;
    service_port: {
        open: number;
        secure: number;
    };
    text: store_string;
    verbose: boolean;
}