

interface services_dashboard_action {
    action: "server-destroy" | "server-save";
    configuration: server;
}

interface services_http {
    connect: http_action;
    delete: http_action;
    get: http_action;
    head: http_action;
    post: http_action;
    put: http_action;
}

interface services_processKill {
    process: number;
}

interface services_youtubeDownload {
    address: string;
    options: string;
    type: type_youtubeDownload;
}

interface services_youtubeStatus {
    pid: number;
    status: string;
    time: string;
}