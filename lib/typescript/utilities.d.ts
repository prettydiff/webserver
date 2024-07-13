

interface hash_output {
    filePath: string;
    hash: string;
}

interface store_string {
    [key:string]: string;
}

interface store_flag {
    [key:string]: boolean;
}

interface vars {
    host: string;
    port: number;
    projectPath: string;
    secure: boolean;
    sep: string;
    text: store_string;
    verbose: boolean;
}