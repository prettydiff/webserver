
// cspell: words Perc, procs, serv, stcp, sudp, volu

interface core_compose_commands {
    activate: string;
    add: string;
    deactivate: string;
    destroy: string;
    list: string;
    modify: string;
    update: string;
}

interface core_compose_container {
    compose: string;
    created: number;
    description: string;
    id: string;
    image: string;
    license: string;
    location: string;
    name: string;
    ports: type_docker_ports;
    state: type_docker_state;
    status: string;
    version: string;
}

interface core_compose_properties {
    Command: string;
    CreatedAt: string; // date
    ExitCode: number;
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
        Protocol: "tcp" | "udp";
        PublishedPort: number;
        TargetPort: number;
        URL: string;
    }[];
    RunningFor: string;
    Service: string;
    Size: string;
    State: type_docker_state;
    Status: string;
}

interface core_directory_data {
    atimeMs: number;
    ctimeMs: number;
    linkPath: string;
    linkType: type_file | "";
    mode: number;
    mtimeMs: number;
    size: number;
}

interface core_directory_list extends Array<type_directory_item> {
    [index:number]: type_directory_item;
    failures?: string[];
    parent?: type_directory_item;
}

interface core_docker_status {
    BlockIO: string;
    Container: string;
    CPUPerc: string;
    ID: string;
    MemPerc: string;
    MemUsage: string;
    Name: string;
    NetIO: string;
    PIDs: number;
}

interface core_external_ports {
    list: type_external_port[];
    time: number;
}

interface core_hash_output {
    filePath: string;
    hash: string;
    size: number;
}

interface core_message_inspection {
    maximum_size: number;
    measure_size: number;
    measure_time: number;
    service: string;
    socket: websocket_client;
    spawn: core_module_spawn;
    stdout: (out:Buffer) => void;
    throttle_size: number;
    throttle_time: number;
    type: "" | "docker-container" | "web-server";
}

interface core_module_docker {
    commands: core_compose_commands;
    list: (callback:() => void) => void;
    receive: type_receiver;
    resize: type_receiver;
    shell: shell_pty;
    shell_start: () => void;
    variables: (variables:store_string, socket:websocket_client) => void;
}

interface core_module_file {
    mkdir: (config:config_file_mkdir) => void;
    read: (config:config_file_read) => void;
    remove: (config:config_file_remove) => void;
    stat: (config:config_file_stat) => void;
    write: (config:config_file_write) => void;
}

interface core_module_log {
    application: (config:config_log) => void;
    receive: (socket_data:socket_data) => void;
    shell: (input:string[], summary?:boolean) => void;
}

interface core_module_messageInspection {
    send: (data:services_message_inspection) => void;
    set: type_receiver;
}

interface core_module_peer {
    confirm_peer: (socket_data:socket_data) => void;
    confirm_ui: (socket_data:socket_data) => void;
    request_peer: (socket_data:socket_data) => void;
    request_ui: (socket_data:socket_data) => void;
}

interface core_module_spawn {
    close: () => void;
    command: string;
    data_stderr: (buf:Buffer) => void;
    data_stdout: (buf:Buffer) => void;
    error: (err:node_childProcess_ExecException) => void;
    execute: () => void;
    spawn: node_childProcess_ChildProcess;
    store_stderr: string[];
    store_stdout: string[];
    type: string;
}

interface core_module_statistics_resources {
    change: (data:socket_data) => void;
    data: () => void;
}

interface core_module_terminal {
    resize: type_receiver;
    shell: (socket:websocket_pty, config:config_terminal) => void;
}

interface core_module_udp {
    closed: () => void;
    create: (socket_data:socket_data, callback:(socket:transmit_udp) => void) => void;
    handler: (socket:transmit_udp, handler:(message:Buffer) => void) => void;
    send: (socket:transmit_udp, message_item:Array<number>|Buffer|bigint|number|string) => void;
}

interface core_module_universal {
    bytes: () => number;
    bytes_big: () => bigint;
    capitalize: () => string;
    commas: () => string;
    dateTime: (date:boolean, timeZone_offset:number) => string;
    file_sanitize: () => string;
    time_elapsed: () => string;
}

interface core_server_child_input {
    encryption: boolean;
    id: string;
    path_process: string;
    port:number;
    token: string;
}

interface core_server_child_output {
    encryption: boolean;
    id: string;
    pid: number;
    port: number;
}

interface core_server_content {
    [key:string]: (property:type_server_property, parent:HTMLElement) => void;
}

interface core_server_instance extends node_net_Server {
    id?: string;
    secure?: boolean;
}

interface core_server_ports {
    open: number;
    secure: number;
}

interface core_service_internal {
    code: string;
    dependencies: core_services_internal_dependency;
    description: string;
    files: string[];
    name: string;
}

interface core_services_internal_dependency {
    [key:string]: [string, string];
}

interface core_spawn_options {
    cwd?: string;
    env?: store_string;
    error?: (err:node_childProcess_ExecException) => void;
    shell?: string;
    stream_stderr?: boolean;
    stream_stdout?: boolean;
    type?: string;
}

interface core_spawn_output {
    stderr: string;
    stdout: string;
    type: string;
}

interface core_start_tasks {
    [key:string]: {
        label: string;
        task: () => void;
    };
}

interface core_state_file {
    id: core_vars_id;
    notes: string;
    servers: store_server_config;
    stats: {
        frequency: number;
        records: number;
    };
}

interface core_string_detect {
    confidence: number;
    encoding: string;
}

interface core_vars {
    commands: core_vars_commands;
    data: core_vars_data_primary;
    data_meta: core_vars_data_meta;
    data_store: core_vars_data_store;
    environment: core_vars_environment;
    id: core_vars_id;
    options: core_vars_options;
    os: services_os_all;
    path: core_vars_path;
    stats: core_vars_stats;
    test: core_vars_test;
    text: store_string;
}

interface core_vars_commands {
    admin_check: string;
    compose: string;
    compose_empty: string;
    devs: string;
    directory_size: string;
    disk: string;
    docker_net: string;
    docker_procs: string;
    docker_read: string;
    docker_stats: string;
    file: string;
    open: string;
    part: string;
    proc: string;
    serv: string;
    stcp: string;
    sudp: string;
    user: string;
    volu: string;
}

interface core_vars_data_meta {
    // time of last compose update
    compose_time: number;
    // time of last port update
    ports_application: number;
    // time of last sockets update
    sockets: number;
}

interface core_vars_data_primary {
    compose_variables: store_string;
    containers: store_compose;
    logs: config_log[];
    message_inspection: core_message_inspection[];
    notes: string;
    ports_application: supplemental_ports_application_item[];
    server: services_server_update;
    sockets_tcp: supplemental_socket_application_tcp[];
    sockets_udp: services_udp_socket[];
}

interface core_vars_data_store {
    server: {
        [key:string]: {
            // server certificates
            server_certs: transmit_tlsCerts;
            // storage of actual web server objects
            server_object: {
                open: core_server_instance;
                secure: core_server_instance;
            };
            // storage of application managed tcp sockets
            sockets_tcp: {
                open: websocket_client[];
                secure: websocket_client[];
            };
        };
    };
    // storage of application managed udp sockets
    sockets_udp: transmit_udp[];
}

interface core_vars_environment {
    compose_status: string;
    // css for generated web pages and file system display
    css_basic: string;
    // css for the dashboard application
    css_complete: string;
    dashboard_page: string;
    date_commit: number;
    demo_kill: number;
    features: {
        "application-logs": boolean;
        "compose-containers": boolean;
        "devices": boolean;
        "disks": boolean;
        "dns-query": boolean;
        "file-system": boolean;
        "hash": boolean;
        "interfaces": boolean;
        "message-inspection": boolean;
        "notes": boolean;
        "os-machine": boolean;
        "ports-application": boolean;
        "processes": boolean;
        "servers-web": boolean;
        "services-app": boolean;
        "services-os": boolean;
        "sockets-application-tcp": boolean;
        "sockets-application-udp": boolean;
        "sockets-os-tcp": boolean;
        "sockets-os-udp": boolean;
        "statistics-resources": boolean;
        "terminal": boolean;
        "test-http": boolean;
        "test-performance": boolean;
        "test-websocket": boolean;
        "udp-socket": boolean;
        "users": boolean;
    };
    file: boolean;
    git_hash: string;
    hashes: string[];
    http_request: string;
    interfaces: string[];
    license: string;
    loading: boolean;
    logs: {
        max: number;
        total: number;
    };
    name: string;
    repository: string;
    services_app: core_service_internal[];
    start_date: number;
    start_time: bigint;
    terminal: string[];
    timeZone_offset: number;
    version: string;
}

interface core_vars_id {
    dashboard_server: string;
    machine: string;
}

interface core_vars_options {
    "browser": string;
    "delay-intervals": number;
    "delay-time": number;
    "demo": boolean;
    "list": string;
    "no-color": boolean;
    "no-exit": boolean;
    "port-open": number;
    "port-secure": number;
    "stop-on-fail": boolean;
    "test": boolean;
    "test-verbose": boolean;
}

interface core_vars_path {
    cgroup: string;
    compose: string;
    compose_empty: string;
    node: string;
    process: string;
    project: string;
    sep: "/" | "\\";
    servers: string;
}

interface core_vars_stats {
    children: number;
    containers: {
        [key:string]: supplemental_statistics_item;
    };
    duration: number;
    frequency: number;
    net_in: number;
    net_out: number;
    now: number;
    records: number;
}

interface core_vars_test {
    browser_args: string[];
    browser_child: core_module_spawn;
    browser_start: boolean;
    counts: {
        [key:string]: test_counts;
    };
    index: number;
    list: test_list;
    magicString: string;
    store: test_primitive;
    test_browser: string;
    testing: boolean;
    total_assertions: number;
    total_assertions_fail: number;
    total_lists: number;
    total_tests: number;
    total_tests_fail: number;
    total_tests_skipped: number;
    total_time_end: bigint;
    total_time_start: bigint;
}

interface core_windows_drives {
    DriveLetter: string;
    Size: number;
    SizeRemaining: number;
}