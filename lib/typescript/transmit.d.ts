
interface stat_item extends node_fs_Stats {
    path: string;
    type: file_type;
}

interface statList extends Array<stat_item> {
    [index:number]: stat_item;
}

interface socket_data {
    data: socket_data_type;
    service: service_type;
}

interface transmit_addresses_socket {
    local: {
        address: string;
        port: number;
    };
    remote: {
        address: string;
        port: number;
    };
}

interface transmit_receiver {
    [key:string]: receiver;
}

interface transmit_tlsOptions {
    fileFlag: {
        ca: boolean;
        crt: boolean;
        key: boolean;
    };
    options: {
        ca: string;
        cert: string;
        key: string;
    };
}

interface transmit_type {
    socket: node_http_ClientRequest | node_http_ServerResponse | websocket_client;
    type: "http" | "ws";
}

interface websocket_client extends node_tls_TLSSocket {
    fragment: Buffer;
    frame: Buffer;
    frameExtended: number;
    handler: websocket_message_handler;
    hash: string;
    ping: (ttl:number, callback:(err:node_error, roundtrip:bigint) => void) => void;
    pong: {
        [key:string]: websocket_pong;
    };
    queue: Buffer[];
    role: "client"|"server";
    status: socket_status_type;
    type: socket_type;
}

interface websocket_frame {
    extended: number;
    fin: boolean;
    len: number;
    mask: boolean;
    maskKey: Buffer;
    opcode: number;
    rsv1: boolean;
    rsv2: boolean;
    rsv3: boolean;
    startByte: number;
}

interface websocket_list {
    [key:string]: websocket_client;
}

interface websocket_meta {
    lengthExtended: number;
    lengthShort: number;
    mask: boolean;
    startByte: number;
}

interface websocket_pong {
    callback: (err:node_error, roundTrip:bigint) => void;
    start: bigint;
    timeOut: NodeJS.Timeout;
    timeOutMessage: node_error;
    ttl: bigint;
}

interface websocket_store {
    [key:string]: websocket_list;
}