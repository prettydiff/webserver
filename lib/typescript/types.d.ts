
type type_certKey = "ca" | "crt" | "key";
type type_command = "certificate" | "create_server" | "delete_server" | "server" | "yt_config";
type type_directory_item = [string, type_file, string, number, number, directory_data, string];
type type_directory_mode = "array" | "hash" | "list" | "read" | "search" | "type";
type type_file = "block_device" | "character_device" | "directory" | "fifo_pipe" | "file" | "socket" | "symbolic_link";
type type_hash_algorithm = "blake2d512" | "blake2s256" | "sha1" | "sha3-224" | "sha3-256" | "sha3-384" | "sha3-512" | "sha384" | "sha512-224" | "sha512-256" | "sha512" | "shake128" | "shake256";
type type_hash_input = "direct" | "file";
type type_http_method = "connect" | "delete" | "get" | "head" | "post" | "put";
type type_paths = "storage" | "web_root";
type type_port_conflict = [string, boolean, boolean];
type type_search = "fragment" | "negation" | "regex";
type type_selector = "class" | "id" | "tag";
type type_service = "process-kill" | "youtube-download-status" | "youtube-download";
type type_socket_data = services_processKill | services_youtubeDownload | services_youtubeStatus;
type type_socket_status = "closed" | "end" | "open" | "pending";
type type_vars = "block_list" | "domain_local" | "ports" | "redirect_domain" | "redirect_internal" | "server_name";
type type_youtubeDownload_media = "audio" | "video";
type type_youtubeDownload = "audio-file" | "audio-playlist" | "video-file" | "video-playlist";

type http_action = (headerList:string[], socket:websocket_client, server_name:string) => void;
type receiver = (socketData:socket_data, transmit:transmit_socket) => void;
type websocket_message_handler = (resultBuffer:Buffer) => void;