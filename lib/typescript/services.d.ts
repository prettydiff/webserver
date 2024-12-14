import { IModes } from "@xterm/xterm";

declare global {

    interface services_docker_compose {
        command: string;
        compose: string;
        createdAt: string;
        description: string;
        id: string;
        image: string;
        labels: string[];
        localVolumes: number;
        mounts: string[];
        names: string;
        networks: string;
        ports: [number, "tcp"|"udp"][];
        runningFor: string;
        size: string;
        state: string;
        status: string;
        status_type: type_activation_status;
    }

    interface services_docker_event {
        Action: string;
        Actor: {
            Attributes: {
                "com.docker.compose.config-hash": string;
                "com.docker.compose.container-number": string;
                "com.docker.compose.depends_on": string;
                "com.docker.compose.image": string;
                "com.docker.compose.oneoff": string;
                "com.docker.compose.project": string;
                "com.docker.compose.project.config_files": string;
                "com.docker.compose.project.working_dir": string;
                "com.docker.compose.service": string;
                "com.docker.compose.version": string;
                "execID": string;
                "image": string;
                "name": string;
                "org.opencontainers.image.source": string;
            };
            ID: string;
        };
        from: string;
        id: string;
        scope: string;
        status: string;
        time: number;
        timeNano: bigint;
        Type: string;
    }

    interface services_docker_psItem {
        Command: string;
        CreatedAt: string;
        ExitCode: number;
        Health: string;
        ID: string;
        Image: string;
        Labels: string;
        LocalVolumes: string;
        Mounts: string;
        Name: string;
        Names: string;
        Networks: string;
        Ports: string;
        Project: string;
        Publishers: {
            URL: string;
            TargetPort: number;
            PublishedPort: number;
            Protocol: "tcp"|"udp";
        }[];
        RunningFor: string;
        Service: string;
        Size: number;
        State: string;
        Status: string;
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
        redirect_asset?: {
            [key:string]: store_string;
        };
        redirect_domain?: {
            [key:string]: [string, number];
        };
        temporary?: boolean;
    }

    interface services_socket {
        address: transmit_addresses_socket;
        encrypted: boolean;
        hash: string;
        proxy: string;
        role: "client" | "server";
        server: string;
        type: string;
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