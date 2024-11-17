import { IModes } from "@xterm/xterm";

declare global {

    interface services_compose {
        compose: string;
        description: string;
        status: type_activation_status;
        title: string;
    }

    interface services_dashboard {
        "activate": type_server_action;
        "add": type_server_action;
        "deactivate": type_server_action;
        "destroy": type_server_action;
        "modify": type_server_action;
    }

    interface services_dashboard_action {
        action: type_dashboard_action;
        configuration: services_server;
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

    interface services_dashboard_terminal {
        modes: IModes;
        text: string;
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

    interface services_server {
        activate: boolean;
        block_list?: {
            host: string[];
            ip: string[];
            referrer: string[];
        };
        domain_local: string[];
        encryption: type_encryption;
        http?: {
            delete?: string;
            post?: string;
            put?: string;
        };
        modification_name?: string;
        name: string;
        ports: server_ports;
        redirect_domain?: {
            [key:string]: [string, number];
        };
        redirect_internal?: {
            [key:string]: store_string;
        };
        temporary?: boolean;
    }

    interface services_terminal_request {
        secure: "open" | "secure";
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
}