

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
    host: string;
    path: store_string;
    port: {
        open: number;
        secure: number;
    };
    portMap: store_number;
    processes: {
        [key:string]: node_childProcess_ChildProcess;
    };
    secure: boolean;
    sep: string;
    text: store_string;
    verbose: boolean;
}