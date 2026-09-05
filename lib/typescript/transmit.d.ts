
// cspell: words ifindex, ifname, linkmode, netnsid, operstate, qdisc

interface stat_item extends node_fs_Stats {
    path: string;
    type: type_file;
}
type statList = stat_item[];

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

interface transmit_linux_ip extends Array<transmit_linux_ip_item> {
    [index:number]: transmit_linux_ip_item;
}

interface transmit_linux_ip_item {
    address: string;
    broadcast: string;
    flags: string[];
    group: string;
    ifindex: number;
    ifname: string;
    link_index: number;
    link_netnsid: number;
    link_type: string;
    linkmode: "DEFAULT";
    mtu: number;
    operstate: "DOWN"|"UP";
    qdisc: string;
    stats64: {
        rx: transmit_linux_ip_stats;
        tx: transmit_linux_ip_stats;
    };
}

interface transmit_linux_ip_stats {
    bytes: number;
    carrier_errors: number;
    collisions: number;
    dropped: number;
    errors: number;
    packets: number;
}

interface transmit_receiver {
    [key:string]: type_receiver;
}

interface transmit_socket {
    socket: node_http_ClientRequest | node_http_ServerResponse | websocket_client;
    type: "http" | "ws";
}

interface transmit_socket_messageHandler {
    [key:string]: websocket_message_handler;
}

interface transmit_tlsCerts {
    ca: string;
    cert: string;
    key: string;
}

interface transmit_tlsOptions {
    certificates: transmit_tlsCerts;
    fileFlag: {
        ca: boolean;
        cert: boolean;
        key: boolean;
    };
}

interface transmit_udp extends node_dgram_Socket {
    addresses: transmit_addresses_socket;
    hash: string;
    multicast_type: "membership" | "none" | "source";
    role: "client" | "server";
    time: number;
    type: "ipv4" | "ipv6";
}

interface websocket_client extends node_tls_TLSSocket {
    addresses: transmit_addresses_socket;
    buffer: Buffer;
    fragments: Buffer[];
    frame: websocket_frame;
    handler: websocket_message_handler;
    hash: string;
    ping: (ttl:number, callback:(err:node_error, roundtrip:bigint) => void) => void;
    pong: {
        [key:string]: websocket_pong;
    };
    proxy: websocket_client;
    queue: Buffer[];
    queue_callback?: () => void;
    queue_index:number;
    role: "client"|"server";
    secure: boolean;
    segmentation: number;
    server_hash: string;
    status: type_socket_status;
    time: number;
    type: string;
    userAgent: string;
}

interface websocket_pty extends websocket_client {
    pty: shell_pty;
    pty_status: "killed" | "open";
}

interface websocket_event extends Event {
    data: string;
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
    size_buffer: number;
    size_fragment: number;
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

interface websocket_test {
    find_socket: (direction:"in"|"out", hashString:string) => websocket_client;
    handler_client: websocket_message_handler;
    handshake: type_receiver;
    message: type_receiver;
}