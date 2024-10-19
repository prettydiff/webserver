

interface services_dashboard_action {
    action: "server-create" | "server-destroy" | "server-save";
    configuration: server;
}

interface services_dashboard_activate {
    name: string;
    ports: server_ports;
}

interface services_dashboard_status {
    action: type_dashboard_action;
    configuration: type_dashboard_config;
    message: string;
    status: type_dashboard_status;
    time: number;
    type: type_dashboard_type;
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