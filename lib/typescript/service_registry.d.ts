
// cspell: words serv, stcp, sudp, TLSA

interface services_compose {
    containers: store_compose;
    status: string;
    time: number;
    variables: store_string;
}
// Docker compose objects and their corresponding status

interface services_compose_container {
    action: type_dashboard_action;
    compose: string;
    id: string;
    location: string;
}
// Changes from the user for docker compose objects

interface services_compose_out {
    status: string;
}
// Streams Docker logs to the dashboard UI

interface services_compose_variables {
    [key:string]: string;
}
// A key/value list of custom docker compose template variables

interface services_dashboard_open {
    demo: boolean;
    compose: services_compose;
    hashes: string[];
    http_request: string;
    id: core_vars_id;
    logs: {
        entries: config_log[];
        max: number;
        total: number;
    };
    name: string;
    notes: string;
    os: services_os_all;
    path: core_vars_path;
    "ports-application": services_ports_application;
    repository: string;
    server: services_server_update;
    services_app: core_service_internal[];
    sockets: services_socket_application;
    start_date: number;
    stats: services_statistics_data;
    terminal: string[];
    timeZone_offset: number;
    version: string;
}
// Initial payload to populate the dashboard with data

interface services_demo {
    port: number;
    process: number;
    socket: string;
    time: number;
    time_string: string;
}

interface services_dns_input {
    names: string[];
    reverse: boolean;
    types: string;
}
// A user's request to execute a DNS query

interface services_dns_output {
    [key:string]: {
        "A"?: type_dns_records;
        "AAAA"?: type_dns_records;
        "ANY"?: type_dns_records;
        "CAA"?: type_dns_records;
        "CNAME"?: type_dns_records;
        "MX"?: type_dns_records;
        "NAPTR"?: type_dns_records;
        "NS"?: type_dns_records;
        "PTR"?: type_dns_records;
        "SOA"?: type_dns_records;
        "SRV"?: type_dns_records;
        "TLSA"?: type_dns_records;
        "TXT"?: type_dns_records;
    };
}
// The output of a forward DNS query

interface services_dns_reverse {
    hostnames: store_string_list;
    reverse: true;
}
// The output of a reverse DNS query

interface services_file_system {
    address: string;
    children: boolean;
    depth: number;
    directory_size: boolean;
    dirs: type_directory_item[];
    failures: string[];
    file: string;
    mime: string;
    parent: type_directory_item;
    path_style: "absolute" | "relative";
    search: string;
    sep: "/"|"\\";
}
// File system list output as well as the user request details

interface services_hash {
    algorithm: string;
    base64: boolean;
    digest: "base64" | "hex";
    size: number;
    type: type_hash_input;
    value: string;
}
// Hash and base64 computational output as well as the user request details

interface services_log {
    log: config_log;
    total: number;
}
// Provides a log entry to the UI and allows for sending JS errors from the UI

interface services_message_inspection {
    count: number;
    direction: "in" | "out";
    maximum_size: number;
    message: string;
    service: string;
    throttle_size: number;
    throttle_time: number;
    type: "docker-container" | "web-server";
}
// Initiates streaming of Docker logs and messaging traversing supported web servers to the UI as well as the actions to start/stop/change that messaging

interface services_notes {
    notes: string;
}
// Sends changes to user notes from the UI to offline storage and broadcasts those changes to other devices

interface services_os_all {
    devs: services_os_devs;
    disk: services_os_disk;
    intr: services_os_intr;
    main: services_os_main;
    proc: services_os_proc;
    serv: services_os_serv;
    stcp: services_os_sock;
    sudp: services_os_sock;
    time: number;
    user: services_os_user;
}
// All the information regarding machine and operating system data

interface services_os_devs {
    data: os_devs[];
    time: number;
}
// List of devices attached to the OS

interface services_os_disk {
    data: os_disk[];
    time: number;
}
// List of storage devices and their partitions

interface services_os_intr {
    data: NodeJS.Dict<node_os_NetworkInterfaceInfo[]>;
    time: number;
}
// List of network interfaces 

interface services_os_main {
    machine: {
        cpu: {
            arch: string;
            cores: number;
            endianness: string;
            frequency: number;
            name: string;
        };
        memory: {
            free: number;
            total: number;
        };
    };
    os: {
        env: store_string;
        hostname: string;
        name: string;
        path: string[];
        platform: string;
        release: string;
        type: string;
        uptime: number;
    };
    process: {
        admin: boolean;
        arch: string;
        argv: string[];
        cpuSystem: number;
        cpuUser: number;
        cwd: string;
        memory: {
            external: number;
            rss: number;
            V8: number;
        };
        pid: number;
        platform: string;
        ppid: number;
        uptime: number;
        versions: store_string;
    };
    time: number;
    user_account: {
        gid: number;
        homedir: string;
        uid: number;
    };
}
// Factual data about the server's machine and operating system

interface services_os_proc {
    data: os_proc[];
    time: number;
}
// List of processes running in the OS

interface services_os_serv {
    data: os_serv[];
    time: number;
}
// List of services known to the OS

interface services_os_sock {
    data: os_sock[];
    time: number;
}
// List of network sockets known to the OS

interface services_os_user {
    data: os_user[];
    time: number;
}
// List of user accounts in the OS

interface services_ports_application {
    data: supplemental_ports_application_item[];
    time: number;
}
// TCP and UDP ports used by Docker containers and web servers created by this application

interface services_server_action {
    action: type_dashboard_action;
    server: supplemental_server_config;
}
// A user requested action to activate, stop, remove, or modify a web server

interface services_server_update {
    [key:string]: supplemental_server;
}
// Configuration details and port status for all managed web servers

interface services_socket_application {
    tcp: supplemental_socket_application_tcp[];
    time: number;
    udp: services_udp_socket[];
}
// List of network sockets created by this application and all associated details

interface services_statistics_change {
    frequency: number;
    records: number;
}
// Saves data about how much data to gather and send to the UI for statistics graphs

interface services_statistics_data {
    containers: {
        [key:string]: supplemental_statistics_item;
    };
    duration: number;
    frequency: number;
    now: number;
    records: number;
}
// Details necessary to populate statistics graphs in the UI

interface services_status_clock {
    time_local: number;
    time_zulu: number;
}
// Provides the server's clock time to the UI

interface services_status_clock_demo {
    remaining: string;
}
// Provides the server's clock time to the UI

interface services_terminal_resize {
    cols: number;
    hash: string;
    rows: number;
    section: type_dashboard_features;
    secure: "open" | "secure";
}
// Resizes the shell such that text is formatted properly with invisible control characters

interface services_test_browser {
    index: number;
    magicString: string;
    result: test_assert[];
    store: test_primitive;
    suite_name: string;
    test: test_browserItem;
}
// Test automation messaging to the browser

interface services_test_http {
    body: string;
    encryption: boolean;
    headers: string;
    stats: {
        chunks: {
            chunked: boolean;
            count: number;
        };
        request: {
            size_body: number;
            size_header: number;
        };
        response: {
            size_body: number;
            size_header: number;
        };
        time: number;
    };
    timeout: number;
    uri: string;
}
// HTTP test response details and the user's request for such

interface services_test_performance_input {
    body: string;
    encryption: boolean;
    frame_body_size: number;
    garbage_collection: boolean;
    location: string;
    measure: "roundtrip" | "send";
    port: number;
    quantity_tests: number;
    quantity_transmit: number;
    type: "http" | "websocket";
}
// Indicates instructions for executing a performance experiment

interface services_test_performance_output {
    frame_body_size: number;
    memory: supplemental_test_performance_data;
    message_size: number;
    quantity_tests: number;
    quantity_transmit: number;
    roundtrip: supplemental_test_performance_data;
    send: supplemental_test_performance_data;
    summary: string;
    time: number;
    type: "http" | "websocket";
}
// Data resulting from a performance experiment

interface services_udp_socket {
    address_destination: string;
    address_source: string;
    handler: (message:Buffer) => void;
    hash: string;
    multicast_group: string;
    multicast_interface: string;
    multicast_membership: string;
    multicast_source: string;
    multicast_type: "membership" | "none" | "source";
    port_destination: number;
    port_source: number;
    role: "client" | "server";
    time: number;
    type: "ipv4" | "ipv6";
}
// Sends information about the creation of a UDP socket

interface services_udp_status {
    status: string;
}
// Notifies the user a UDP socket is created

interface services_websocket_handshake {
    encryption: boolean;
    message: string[];
    timeout: number;
}
// Custom crafted message to create a test WebSocket connection

interface services_websocket_message {
    frame: websocket_frame;
    message: string;
}
// Parses the header of a WebSocket test message frame header sufficient to respond to the message on a test socket

interface services_websocket_status {
    connected: boolean;
    encrypted: boolean;
    error: node_error | string;
}
// Sends connection establishment details for a test websocket

type socket_data =
    {data: services_compose_container;       service: "services_compose_container";} |
    {data: services_compose_out;             service: "services_compose_out";} |
    {data: services_compose_variables;       service: "services_compose_variables";} |
    {data: services_compose;                 service: "services_compose";} |
    {data: services_dashboard_open;          service: "services_dashboard_open";} |
    {data: services_demo;                    service: "services_demo";} |
    {data: services_dns_input;               service: "services_dns_input";} |
    {data: services_dns_output;              service: "services_dns_output";} |
    {data: services_dns_reverse;             service: "services_dns_reverse";} |
    {data: services_file_system;             service: "services_file_system";} |
    {data: services_hash;                    service: "services_hash";} |
    {data: services_log;                     service: "services_log";} |
    {data: services_message_inspection;      service: "services_message_inspection";} |
    {data: services_notes;                   service: "services_notes";} |
    {data: services_os_all;                  service: "services_os_all";} |
    {data: services_os_devs;                 service: "services_os_devs";} |
    {data: services_os_disk;                 service: "services_os_disk";} |
    {data: services_os_intr;                 service: "services_os_intr";} |
    {data: services_os_main;                 service: "services_os_main";} |
    {data: services_os_proc;                 service: "services_os_proc";} |
    {data: services_os_serv;                 service: "services_os_serv";} |
    {data: services_os_sock;                 service: "services_os_stcp";} |
    {data: services_os_sock;                 service: "services_os_sudp";} |
    {data: services_os_user;                 service: "services_os_user";} |
    {data: services_ports_application;       service: "services_ports_application";} |
    {data: services_server_action;           service: "services_server_action";} |
    {data: services_server_update;           service: "services_server_update";} |
    {data: services_socket_application;      service: "services_socket_application";} |
    {data: services_statistics_change;       service: "services_statistics_change";} |
    {data: services_statistics_data;         service: "services_statistics_data";} |
    {data: services_status_clock;            service: "services_status_clock";} |
    {data: services_status_clock_demo;       service: "services_status_clock_demo";} |
    {data: services_terminal_resize;         service: "services_terminal_resize";} |
    {data: services_test_browser;            service: "services_test_browser";} |
    {data: services_test_http;               service: "services_test_http";} |
    {data: services_test_performance_input;  service: "services_test_performance_input";} |
    {data: services_test_performance_output; service: "services_test_performance_output";} |
    {data: services_udp_socket;              service: "services_udp_socket";} |
    {data: services_udp_status;              service: "services_udp_status";} |
    {data: services_websocket_handshake;     service: "services_websocket_handshake";} |
    {data: services_websocket_message;       service: "services_websocket_message";} |
    {data: services_websocket_status;        service: "services_websocket_status";};