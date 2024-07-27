
interface services_processKill {
    process: number;
}

interface services_youtubeDownload {
    address: string;
    options: string;
    type: youtubeDownload_type;
}

interface services_youtubeStatus {
    pid: number;
    status: string;
    time: string;
}