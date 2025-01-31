
type type_activation_status = ["amber" | "green" | "red", "deactivated" | "new" | "offline" | "online" | "partially online"];
type type_certKey = "ca" | "crt" | "key";
type type_dashboard_action = type_halt_action | "activate" | "add";
type type_dashboard_config = config_websocket_create | config_websocket_server | external_ports | node_childProcess_ExecException | node_error | server | services_dashboard_activate | services_docker_compose | services_socket | store_string;
type type_dashboard_list = "container" | "server";
type type_dashboard_sections = "compose" | "help" | "log" | "port" | "servers" | "socket" | "terminal";
type type_dashboard_status = "error" | "informational" | "success";
type type_dashboard_type = "compose-containers" | "compose-variables" | "log" | "port" | "server" | "socket" | "terminal";
type type_directory_item = [string, type_file, string, number, number, directory_data, string];
type type_directory_mode = "array" | "hash" | "list" | "read" | "search" | "type";
type type_dns_records = node_dns_anyRecord[] | node_dns_mxRecord[] | node_dns_naptrRecord[] | node_dns_soaRecord | node_dns_srvRecord[] | string[] | string[][];
type type_dns_types = "A" | "AAAA" | "CAA" | "CNAME" | "MX" | "NAPTR" | "NS" | "PTR" | "SOA" | "SRV" | "TXT";
type type_docker_state = "created" | "dead" | "exited" | "paused" | "removing" | "restarting" | "running";
type type_encryption = "both" | "open" | "secure";
type type_external_port = [number, string, string, string];
type type_file = "block_device" | "character_device" | "directory" | "fifo_pipe" | "file" | "socket" | "symbolic_link";
type type_hash_algorithm = "blake2d512" | "blake2s256" | "sha1" | "sha3-224" | "sha3-256" | "sha3-384" | "sha3-512" | "sha384" | "sha512-224" | "sha512-256" | "sha512" | "shake128" | "shake256";
type type_halt_action = "deactivate" | "destroy" | "modify";
type type_hash_input = "direct" | "file";
type type_http_method = "connect" | "delete" | "get" | "head" | "post" | "put";
type type_keys = "ArrowDown" | "ArrowLeft" | "ArrowRight" | "ArrowUp" | "Backspace" | "c" | "Delete" | "Enter" | "v";
type type_paths = "storage" | "web_root";
type type_search = "fragment" | "negation" | "regex";
type type_selector = "class" | "id" | "tag";
type type_server_property = "block_list" | "domain_local" | "encryption" | "http" | "name" | "ports" | "redirect_asset" | "redirect_domain";

//   service name            - data type transmitted     - description
// * dashboard-compose-container - store_string              - Docker compose variables
// * dashboard-compose-variables - store_string              - Stores YAML configuration content and a name for a single docker container
// * dashboard-payload           - transmit_dashboard        - Contains all dynamic data for populating a browser page
// * dashboard-server            - services_dashboard_status - A single server's configuration data plus an action to perform
// * dashboard-status            - services_dashboard_status - Typically conveys log entries
type type_service = "dashboard-compose-container" | "dashboard-compose-variables" | "dashboard-dns" | "dashboard-fileSystem" | "dashboard-http" | "dashboard-os" | "dashboard-payload" | "dashboard-server" | "dashboard-status" | "youtube-download-status";
type type_socket_data = services_action_compose | services_action_server | services_dashboard_status | services_dashboard_terminal | services_dns_input | services_dns_output | services_docker_compose | services_fileSystem | services_http_test | services_os | services_processKill | services_youtubeDownload | services_youtubeStatus | store_string | string[] | transmit_dashboard;
type type_socket_status = "closed" | "end" | "open" | "pending";
type type_ui_control = "select" | "text";
type type_vars = "block_list" | "domain_local" | "ports" | "redirect_asset" | "redirect_domain" | "server_name";
type type_youtubeDownload_media = "audio" | "video";
type type_youtubeDownload = "audio-file" | "audio-playlist" | "video-file" | "video-playlist";

type http_action = (headerList:string[], socket:websocket_client, payload:Buffer) => void;
type receiver = (socketData:socket_data, transmit:transmit_socket) => void;
type type_server_action = (data:services_action_server, callback:() => void, halt?:type_halt_action) => void;
type websocket_message_handler = (resultBuffer:Buffer) => void;