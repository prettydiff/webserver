
type certKey = "ca" | "crt" | "key";
type directory_item = [string, file_type, string, number, number, directory_data, string];
type directory_mode = "array" | "hash" | "list" | "read" | "search" | "type";
type file_type = "block_device" | "character_device" | "directory" | "fifo_pipe" | "file" | "socket" | "symbolic_link";
type hash_algorithm_type = "blake2d512" | "blake2s256" | "sha1" | "sha3-224" | "sha3-256" | "sha3-384" | "sha3-512" | "sha384" | "sha512-224" | "sha512-256" | "sha512" | "shake128" | "shake256";
type hash_input_type = "direct" | "file";
type search_type = "fragment" | "negation" | "regex";
type selector_type = "class" | "id" | "tag";
type service_type = "process-kill" | "youtube-download-status" | "youtube-download";
type socket_data_type = services_processKill | services_youtubeDownload | services_youtubeStatus;
type socket_status_type = "closed" | "end" | "open" | "pending";
type socket_type = "browser-youtube-download" | "browser" | "proxy";
type vars_type = "block_list" | "domain_default" | "redirect_domain" | "redirect_internal" | "server_name" | "service_port";
type youtubeDownload_mediaType = "audio" | "video";
type youtubeDownload_type = "audio-file" | "audio-playlist" | "video-file" | "video-playlist";

type receiver = (socketData:socket_data, transmit:transmit_socket) => void;
type websocket_message_handler = (resultBuffer:Buffer) => void;