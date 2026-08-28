
// cspell: words serv, Tlsa, stcp, sudp, volu


type test_domMethod = "activeElement" | "addClass" | "childNodes" | "documentElement" | "firstChild" | "getAncestor" | "getElementById" | "getElementsByAttribute" | "getElementsByClassName" | "getElementsByName" | "getElementsByTagName" | "getElementsByText" | "getModalsByModalType" | "getNodesByType" | "lastChild" | "nextSibling" | "parentNode" | "previousSibling" | "removeClass" | "window";
type test_eventName = "blur" | "click" | "command" | "contextmenu" | "dblclick" | "focus" | "keydown" | "keyup" | "mousedown" | "mouseenter" | "mouseleave" | "mousemove" | "mouseout" | "mouseover" | "mouseup" | "move" | "refresh" | "resize" | "select" | "setValue" | "touchend" | "touchstart" | "wait";
type test_primitive = bigint | boolean | number | string | null | undefined;
type test_qualifier = "begins" | "contains" | "ends" | "greater" | "is" | "lesser" | "not contains" | "not" | "numeric";

type type_activation_status = ["amber" | "green" | "red", "deactivated" | "new" | "offline" | "online" | "partially online"];
type type_browserDOM = ["activeElement" | "addClass" | "childNodes" | "documentElement" | "firstChild" | "getAncestor" | "getElementById" | "getElementsByAttribute" | "getElementsByClassName" | "getElementsByName" | "getElementsByTagName" | "getElementsByText" | "getModalsByModalType" | "getNodesByType" | "lastChild" | "nextSibling" | "parentNode" | "previousSibling" | "removeClass" | "window", string, number];
type type_certKey = "ca" | "crt" | "key";
type type_certName = "client" | "int" | "root" | "server";
type type_dashboard_action = type_halt_action | "activate" | "add" | "update";
type type_dashboard_list = "container" | "server";
type type_dashboard_init = "application-logs" | "compose-containers" | "disks" | "dns-query" | "file-system" | "hash" | "interfaces" | "message-inspection" | "notes" | "os-machine" | "servers-web" | "services-app" | "statistics-resources" | "terminal" | "test-http" | "test-performance" | "test-websocket" | "udp-socket";
type type_dashboard_features = type_dashboard_init | type_dashboard_tables;
type type_dashboard_sections = type_dashboard_features | "faq" | "help";
type type_dashboard_status = "error" | "informational";
type type_dashboard_tables = "devices" | "ports-application" | "processes" | "services-os" | "sockets-application-tcp" | "sockets-application-udp" | "sockets-os-tcp" | "sockets-os-udp" | "users";
type type_dashboard_table_services = "services_os_devs" | "services_os_proc" | "services_os_serv" | "services_os_stcp" | "services_os_sudp" | "services_os_user" | "services_ports_application" | "services_socket_application";
// type_directory_type
// 0 - absolute path
// 1 - file system item type
// 2 - hash
// 3 - index of parent
// 4 - child item count
// 5 - stats
// 6 - rename write path
type type_directory_item = [string, type_file, number, number, core_directory_data, string];
type type_dns_records = node_dns_anyRecord[] | node_dns_caaRecord[] | node_dns_mxRecord[] | node_dns_naptrRecord[] | node_dns_soaRecord | node_dns_srvRecord[] | node_dns_TlsaRecord[] | string[] | string[][];
type type_dns_types = "A" | "AAAA" | "CAA" | "CNAME" | "MX" | "NAPTR" | "NS" | "PTR" | "SOA" | "SRV" | "TLSA" | "TXT";
type type_docker_ports = [number, "tcp"|"udp"][];
type type_docker_state = "created" | "dead" | "exited" | "paused" | "removing" | "restarting" | "running";
type type_encryption = "both" | "open" | "secure";
type type_external_port = [number, string, string, string];
type type_file = "block_device" | "character_device" | "directory" | "fifo_pipe" | "file" | "socket" | "symbolic_link";
type type_fileSystem_media = "application" | "audio" | "image" | "text" | "video";
type type_graph = "cpu" | "disk" | "mem" | "net" | "threads";
type type_graph_datasets = [graph_dataset[], string[]];
type type_graph_keys = "cpu" | "disk_in" | "disk_out" | "mem" | "net_in" | "net_out" | "threads";
type type_halt_action = "deactivate" | "destroy" | "modify";
type type_hash_input = "direct" | "file";
type type_http_method = "connect" | "get" | "head" | "options" | "trace";
type type_keys = "ArrowDown" | "ArrowLeft" | "ArrowRight" | "ArrowUp" | "Backspace" | "c" | "Delete" | "Enter" | "v";
type type_list_services = services_os_devs | services_os_proc | services_os_serv | services_os_sock | services_os_user | services_ports_application | supplemental_socket_application_list;
type type_lists = os_devs | os_proc | os_serv | os_sock | os_user | services_udp_socket | supplemental_ports_application_item | supplemental_socket_application_tcp;

type type_os_key = type_os_list_names_base | "disk" | "part" | "stcp" | "sudp" | "volu";
type type_os_list_names = type_os_list_names_base | "stcp" | "sudp";
type type_os_list_names_base = "devs" | "proc" | "serv" | "user";
type type_os_services = type_os_list_names | "all" | "disk" | "intr" | "main";

type type_paths = "storage" | "web_root";
type type_search = "fragment" | "negation" | "regex";
type type_selector = "class" | "id" | "tag";
type type_server_property = "activate" | "block_list" | "domain_local" | "encryption" | "id" | "method" | "name" | "ports" | "redirect_asset" | "redirect_domain" | "single_socket" | "temporary" | "upgrade";

type type_socket_status = "closed" | "end" | "open" | "pending";
type type_start_pre_tasks = "admin" | "compose" | "os_main";
type type_start_primary_tasks = "certificates" | "cgroup" | "compose_variables" | "file"| "git" | "html" | "os_devs" | "os_disk" | "os_intr" | "os_proc" | "os_serv" | "os_stcp" | "os_sudp" | "os_user" | "servers" | "services_app" | "test_browser" | "test_list" | "version";

type type_ui_control = "select" | "text";
type type_vars = "block_list" | "domain_local" | "ports" | "redirect_asset" | "redirect_domain" | "server_name";

type http_action = (headerList:string[], socket:websocket_client, payload:Buffer) => void;
type type_receiver = (socketData:socket_data, transmit:transmit_socket) => void;
type type_server_action = (data:services_server_action, callback:() => void, halt?:type_halt_action) => void;
type websocket_message_handler = (socket:websocket_client, resultBuffer:Buffer, frame:websocket_frame) => void;