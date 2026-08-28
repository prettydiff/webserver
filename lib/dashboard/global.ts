
import dashboard from "./dashboard.ts";

const ui_global = function ui_global():void {
    const global:dashboard_global = {
        click: false,
        loaded: false,
        payload: null,
        section: "servers-web",
        state: (function dashboard_state():state_store {
            const local:string = (typeof localStorage === "undefined")
                    ? undefined
                    : localStorage.state,
                item:state_store = (local === undefined || local === null || local === "")
                    ? {
                        dns: {
                            hosts: "",
                            types: ""
                        },
                        fileSystem: {
                            children: 0,
                            depth: "1",
                            directory_size: 0,
                            path: "",
                            path_style: 1,
                            search: ""
                        },
                        graph_display: 0,
                        graph_type: 0,
                        hash: {
                            algorithm: "sha3-512",
                            digest: "hex",
                            hashFunction: "hash",
                            source: "",
                            type: "string"
                        },
                        http: {
                            encryption: true,
                            request: ""
                        },
                        messageInspection: "servers-web",
                        nav: "servers-web",
                        table_os: {},
                        tables: {},
                        terminal: "",
                        test_automation: null,
                        test_performance: {
                            body: "",
                            connect_address: "",
                            connect_port: 80,
                            encryption: false,
                            quantity_tests: 10,
                            quantity_transmit: 1000,
                            type: "websocket"
                        },
                        test_websocket: {
                            request_timeout: "0",
                            send_frame: "",
                            send_message: ""
                        },
                        udp_socket: {
                            address_destination: "",
                            address_source: "",
                            interface: "",
                            multicast_group: "",
                            multicast_membership: "",
                            multicast_source: "",
                            port_destination: "",
                            port_source: "",
                            toggle_multicast: "none",
                            toggle_role: "connect",
                            toggle_type: "ipv6"
                        }
                    }
                    : JSON.parse(local);
            return item;
        }())
    };
    dashboard.global = global;
};

export default ui_global;