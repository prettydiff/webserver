

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
    port: number;
    portMap: store_number;
    secure: boolean;
    sep: string;
    text: store_string;
    verbose: boolean;
}