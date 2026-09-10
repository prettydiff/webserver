
// cspell: words opencontainers, serv, TLSA

interface supplemental_action_compose {
    action: type_dashboard_action;
    compose: string;
}

interface supplemental_certificate_client {
    crt: string;
    pfx: string;
}

interface supplemental_docker_compose_publishers {
    Protocol: "tcp"|"udp";
    PublishedPort: number;
    TargetPort: number;
    URL: string;
}

interface supplemental_docker_event {
    action: "create" | "destroy" | "die" | "kill" | "start" | "stop";
    attributes: {
        execID: string;
        exitCode?: number;
        image: string;
        name: string;
        "org.opencontainers.image.source": string;
    };
    id: string;
    service: string;
    time: string;
    type: string;
}

interface supplemental_dns_callback {
    "0": (err:node_error, records:type_dns_records) => void;
    "1": (err:node_error, records:type_dns_records) => void;
    "10": (err:node_error, records:type_dns_records) => void;
    "11": (err:node_error, records:type_dns_records) => void;
    "2": (err:node_error, records:type_dns_records) => void;
    "3": (err:node_error, records:type_dns_records) => void;
    "4": (err:node_error, records:type_dns_records) => void;
    "5": (err:node_error, records:type_dns_records) => void;
    "6": (err:node_error, records:type_dns_records) => void;
    "7": (err:node_error, records:type_dns_records) => void;
    "8": (err:node_error, records:type_dns_records) => void;
    "9": (err:node_error, records:type_dns_records) => void;
}

interface supplemental_http {
    connect: http_action;
    get: http_action;
    head: http_action;
    options: http_action;
    trace: http_action;
}

interface supplemental_ports_application_item {
    hash: string;
    port: number;
    service: "container" | "server";
    service_name: string;
    type: "tcp" | "udp";

}

interface supplemental_server {
    certificates_client: supplemental_certificate_client;
    config: supplemental_server_config;
    ports: core_server_ports;
    sockets: supplemental_socket_application_tcp[];
}

interface supplemental_server_config {
    activate: boolean;
    block_list?: {
        host: string[];
        ip: string[];
        referrer: string[];
    };
    certificate_path: {
        ca: string;
        cert: string;
        key: string;
    };
    domain_local: string[];
    encryption: type_encryption;
    id: string;
    message_segmentation: number;
    method?: {
        delete?: supplemental_server_method;
        patch?: supplemental_server_method;
        post?: supplemental_server_method;
        put?: supplemental_server_method;
    };
    mutual_tls: boolean;
    name: string;
    ports: core_server_ports;
    redirect_asset?: {
        [key:string]: store_string;
    };
    redirect_domain?: {
        [key:string]: [string, number];
    };
    single_socket?: boolean;
    temporary?: boolean;
    upgrade: boolean;
}

interface supplemental_server_method {
    address: string;
    port: number;
}

interface supplemental_socket_application_list {
    data: services_udp_socket[] | supplemental_socket_application_tcp[];
    time: number;
}

interface supplemental_socket_application_tcp {
    address: transmit_addresses_socket;
    encrypted: boolean;
    hash: string;
    proxy: string;
    role: "client" | "server";
    server_id: string;
    server_name: string;
    time: number;
    type: string;
    userAgent: string;
}

interface supplemental_statistics_facet {
    data: number[];
    labels: string[];
}

interface supplemental_statistics_item {
    cpu: supplemental_statistics_facet;
    disk_in: supplemental_statistics_facet;
    disk_out: supplemental_statistics_facet;
    mem: supplemental_statistics_facet;
    net_in: supplemental_statistics_facet;
    net_out: supplemental_statistics_facet;
    threads: supplemental_statistics_facet;
}

interface supplemental_terminal_request {
    secure: "open" | "secure";
}

interface supplemental_test_performance_data {
    average: number;
    max: number;
    min: number;
    trials: number[];
    variance: number;
}