
interface store_arrays {
    [key:string]: object[];
}

interface store_bigint {
    [key:string]: bigint;
}

interface store_children {
    [key:string]: node_childProcess_ChildProcess;
}

interface store_children_os {
    [key:string]: core_module_spawn;
}

interface store_compose {
    [key:string]: core_compose_container;
}

interface store_demo {
    [key:string]: services_demo;
}

interface store_elements {
    [key:string]: HTMLElement;
}

interface store_flag {
    [key:string]: boolean;
}

interface store_function {
    [key:string]: () => void;
}

interface store_module_map {
    [key:string]: module_list | section_ports_application | section_sockets_application;
}

interface store_number {
    [key:string]: number;
}

interface store_os_difference {
    [key:string]: config_os_comparison;
}

interface store_ports {
    [key:string]: core_server_ports;
}

interface store_server_config {
    [key:string]: supplemental_server_config;
}

interface store_servers {
    [key:string]: supplemental_server;
}

interface store_sockets {
    [key:string]: websocket_client[];
}

interface store_store_flag {
    [key:string]: store_flag;
}

interface store_string {
    [key:string]: string;
}

interface store_string_list {
    [key:string]: string[];
}

interface store_test_list {
    [key:string]: test_list;
}
