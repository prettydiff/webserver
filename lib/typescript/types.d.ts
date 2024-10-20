
type type_activation_status = ["amber" | "green" | "red", "deactivated" | "new" | "offline" | "online" | "partially online"];
type type_certKey = "ca" | "crt" | "key";
type type_dashboard_action = "activate" | "add" | "deactivate" | type_halt_action;
type type_dashboard_config = config_websocket_create | config_websocket_server | node_childProcess_ExecException | node_error | server | services_dashboard_activate;
type type_dashboard_status = "error" | "informational" | "success";
type type_dashboard_type = "log" | "port" | "server" | "socket";
type type_directory_item = [string, type_file, string, number, number, directory_data, string];
type type_directory_mode = "array" | "hash" | "list" | "read" | "search" | "type";
type type_encryption = "both" | "open" | "secure";
type type_file = "block_device" | "character_device" | "directory" | "fifo_pipe" | "file" | "socket" | "symbolic_link";
type type_hash_algorithm = "blake2d512" | "blake2s256" | "sha1" | "sha3-224" | "sha3-256" | "sha3-384" | "sha3-512" | "sha384" | "sha512-224" | "sha512-256" | "sha512" | "shake128" | "shake256";
type type_halt_action = "destroy" | "halt" | "modify";
type type_hash_input = "direct" | "file";
type type_http_method = "connect" | "delete" | "get" | "head" | "post" | "put";
type type_paths = "storage" | "web_root";
type type_port_conflict = [string, boolean, boolean];
type type_search = "fragment" | "negation" | "regex";
type type_selector = "class" | "id" | "tag";
type type_server_property = "block_list" | "domain_local" | "encryption" | "http" | "name" | "path" | "ports" | "redirect_domain" | "redirect_internal";
type type_service = "dashboard-action" | "dashboard-status" | "process-kill" | "youtube-download-status" | "youtube-download";
type type_socket_data = services_dashboard_action | services_dashboard_status | services_processKill | services_youtubeDownload | services_youtubeStatus;
type type_socket_status = "closed" | "end" | "open" | "pending";
type type_ui_control = "select" | "text";
type type_user_event = FocusEvent | KeyboardEvent | MouseEvent;
type type_vars = "block_list" | "domain_local" | "ports" | "redirect_domain" | "redirect_internal" | "server_name";
type type_youtubeDownload_media = "audio" | "video";
type type_youtubeDownload = "audio-file" | "audio-playlist" | "video-file" | "video-playlist";

type http_action = (headerList:string[], socket:websocket_client, payload:Buffer) => void;
type receiver = (socketData:socket_data, transmit:transmit_socket) => void;
type websocket_message_handler = (resultBuffer:Buffer) => void;