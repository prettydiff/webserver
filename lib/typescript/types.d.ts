
type certKey = "ca" | "crt" | "key";
type file_type = "block_device" | "character_device" | "directory" | "fifo_pipe" | "file" | "socket" | "symbolic_link";
type hash_algorithm_type = "blake2d512" | "blake2s256" | "sha1" | "sha3-224" | "sha3-256" | "sha3-384" | "sha3-512" | "sha384" | "sha512-224" | "sha512-256" | "sha512" | "shake128" | "shake256";
type hash_input_type = "direct" | "file";
type service_type = "";
type socket_data_type = "";
type socket_status_type = "closed" | "end" | "open" | "pending";
type socket_type = "browser";

type receiver = (socketData:socket_data, transmit:transmit_type) => void;
type websocket_message_handler = (resultBuffer:Buffer) => void;