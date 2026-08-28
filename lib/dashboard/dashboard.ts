

/* eslint-disable @typescript-eslint/no-unused-vars */
// cspell: words serv, stcp, sudp

const dashboard:dashboard = {
    execute: function():void {},
    global: {
        "click": false,
        "loaded": false,
        "payload": {
            "compose": {
                "containers": {},
                "status": "",
                "time": 0,
                "variables": {}
            },
            "hashes": [""],
            "http_request": "",
            id: {
                dashboard_server: "",
                machine: ""
            },
            "logs": {
                "entries": [],
                "max": 0,
                "total": 0
            },
            "name": "",
            "notes": "",
            "os": {
                "devs": {
                    "data": [],
                    "time": 0
                },
                "disk": {
                    "data": [],
                    "time": 0
                },
                "intr": {
                    "data": {},
                    "time": 0
                },
                "main": {
                    "machine": {
                        "cpu": {
                            "arch": "",
                            "cores": 0,
                            "endianness": "",
                            "frequency": 0,
                            "name": ""
                        },
                        "memory": {
                            "free": 0,
                            "total": 0
                        }
                    },
                    "os": {
                        "env": {},
                        "hostname": "",
                        "name": "",
                        "path": [""],
                        "platform": "",
                        "release": "",
                        "type": "",
                        "uptime": 0
                    },
                    "process": {
                        "admin": false,
                        "arch": "",
                        "argv": [""],
                        "cpuSystem": 0,
                        "cpuUser": 0,
                        "cwd": "",
                        "memory": {
                            "V8": 0,
                            "external": 0,
                            "rss": 0
                        },
                        "pid": 0,
                        "platform": "",
                        "ppid": 0,
                        "uptime": 0,
                        "versions": {}
                    },
                    "time": 0,
                    "user_account": {
                        "gid": 0,
                        "homedir": "",
                        "uid": 0
                    }
                },
                "proc": {
                    "data": [],
                    "time": 0
                },
                "serv": {
                    "data": [],
                    "time": 0
                },
                "stcp": {
                    "data": [],
                    "time": 0
                },
                "sudp": {
                    "data": [],
                    "time": 0
                },
                "time": 0,
                "user": {
                    "data": [],
                    "time": 0
                }
            },
            "path": {
                "cgroup": "",
                "compose": "",
                "compose_empty": "",
                "node": "",
                "process": "",
                "project": "",
                "sep": "/",
                "servers": ""
            },
            "ports-application": {
                "data": [],
                "time": 0
            },
            "repository": "",
            "server": {},
            "services_app": [],
            "sockets": {
                "tcp": [],
                "time": 0,
                "udp": []
            },
            "start_date": 0,
            "stats": {
                "containers": {},
                "duration": 0,
                "frequency": 0,
                "now": 0,
                "records": 0
            },
            "terminal": [""],
            "timeZone_offset": 0,
            "version": ""
        },
        "section": "application-logs",
        "state": {
            "dns": {
                "hosts": "",
                "reverse": false,
                "types": ""
            },
            "fileSystem": {
                "children": 0,
                "depth": "",
                "directory_size": 0,
                "path": "",
                "path_style": 0,
                "search": ""
            },
            "graph_display": 0,
            "graph_type": 0,
            "hash": {
                "algorithm": "",
                "digest": "base64",
                "hashFunction": "base64",
                "source": "",
                "type": "file"
            },
            "http": {
                "encryption": false,
                "request": ""
            },
            "messageInspection": "docker-container",
            "nav": "application-logs",
            "table_os": {},
            "tables": {},
            "terminal": "",
            "test_automation":  null,
            "test_performance": {
                body: "",
                connect_address: "",
                connect_port: 80,
                encryption: false,
                frame_body_size: 1000000,
                measure: "send",
                quantity_tests: 50000,
                quantity_transmit: 10,
                type: "websocket"
            },
            "test_websocket": {
                "request_timeout": "",
                "send_frame": "",
                "send_message": ""
            },
            "udp_socket": {
                "address_destination": "",
                "address_source": "",
                "interfaces": "",
                "multicast_group": "",
                "multicast_membership": "",
                "multicast_source": "",
                "port_destination": "",
                "port_source": "",
                "toggle_multicast": "membership",
                "toggle_role": "bind",
                "toggle_type": "ipv4"
            }
        }
    },
    message: {
        "init": function(socket_data:socket_data):void {},
        "receive": function(data:string):void {},
        "send": function(socket_data:socket_data):void {}
    },
    sections: {
        "application-logs": {
            "events": {
                "resize": function():void {}
            },
            "init": function():void {},
            "nodes": {
                "count": null,
                "list": null,
                "total": null
            },
            "receive": function(socket_data:socket_data):void {},
            "tools": {}
        },
        "compose-containers": {
            "cols": 0,
            "events": {
                "cancel_variable": function(event:MouseEvent):void {},
                "edit_variable": function():void {},
                "message_container": function(event:MouseEvent):void {},
                "message_variable": function(event:MouseEvent):void {},
                "resize": function():void {},
                "selection": function():void {},
                "update": function():void {},
                "validate_containers": function(event:FocusEvent|KeyboardEvent):void {},
                "validate_variables": function(event:FocusEvent|KeyboardEvent):void {}
            },
            "init": function():void {},
            "nodes": {
                body: null,
                cols: null,
                list: null,
                list_variables: null,
                new_container: null,
                new_variable: null,
                rows: null,
                shell: null,
                status: null,
                update_button: null,
                update_containers: null,
                update_time: null,
                update_variables: null
            },
            "receive": function(socket_data:socket_data):void {},
            "rows": 0,
            "shell": null,
            "status_out": function(socket_data:socket_data):void {},
            "tools": {}
        },
        "devices": {
            "dataName": "devs",
            "nodes": {
                caseSensitive: null,
                count: null,
                filter_column: null,
                filter_count: null,
                filter_value: null,
                list: null,
                update_button: null,
                update_duration: null,
                update_text: null
            },
            "receive": function():void {}, // not used
            "row": function(record_item:type_lists, tr:HTMLElement):void {},
            "sort_name": [""],
            "time": 0
        },
        "disks": {
            "events": {
                "update": function():void {}
            },
            "init": function():void {},
            "nodes": {
                count: null,
                list: null,
                update_button: null,
                update_duration: null,
                update_text: null
            },
            "receive": function(socket_data:socket_data):void {},
            "time": 0,
            "tools": {}
        },
        "dns-query": {
            "events": {
                "directionEvent": function(event:MouseEvent):void {},
                "query": function(event:KeyboardEvent|MouseEvent):void {}
            },
            "init": function():void {},
            "nodes": {
                hosts: null,
                lookup: null,
                output: null,
                query: null,
                reverse: null,
                types: null
            },
            "receive": function(socket_data:socket_data):void {},
            "tools": {
                "direction": function(reverse:boolean|string):void {}
            }
        },
        "file-system": {
            "block": false,
            "events": {
                "file_button": function(event:MouseEvent):void {},
                "key": function(event:KeyboardEvent):void {},
                "resize": function():void {},
                "send": function(event:Event):void {}
            },
            "init": function():void {},
            "media": {
                "audio": null,
                "image": null,
                "other": null,
                "pdf": null,
                "text": null,
                "video": null
            },
            "nodes": {
                children: null,
                content: null,
                depth: null,
                directory_size: null,
                failures: null,
                output: null,
                path: null,
                path_style: null,
                search: null,
                status: null,
                summary: null,
                tbody: null
            },
            "receive": function(socket_data:socket_data):void {},
            sort: false,
            "time": 0,
            "tools": {
                "media_time": function(input:boolean|number|string):string {return "";}
            }
        },
        "hash": {
            "events": {
                "request": function():void {},
                "toggle_mode": function(event:MouseEvent):void {}
            },
            "init": function():void {},
            "nodes": {
                algorithm: null,
                base64: null,
                button: null,
                digest: null,
                file: null,
                hash: null,
                hex: null,
                output: null,
                size: null,
                source: null,
                string: null,
                time: null,
                type: null
            },
            "receive": function(socket_data:socket_data):void {},
            "time": 0,
            "tools": {}
        },
        "interfaces": {
            "events": {
                "update": function():void {}
            },
            "init": function():void {},
            "nodes": {
                count: null,
                list: null,
                update_button: null,
                update_duration: null,
                update_text: null
            },
            "receive": function(socket_data:socket_data):void {},
            "time": 0,
            "tools": {}
        },
        "message-inspection": {
            "events": {
                "service": function():void {},
                "type": function():void {}
            },
            "init": function():void {},
            "nodes": {
                em_in: null,
                em_out: null,
                label_in: null,
                label_out: null,
                maximum_size: null,
                service: null,
                throttle_size: null,
                throttle_time: null,
                type: null
            },
            "receive": function(socket_data:socket_data):void {},
            "tools": {}
        },
        "notes": {
            "events": {
                "blur": function():void {},
                "key": function():void {},
                "resize": function():void {}
            },
            "init": function():void {},
            "nodes": {
                "textarea": null
            },
            "receive": function(socket_data:socket_data):void {},
            "timer": setTimeout(function():void {}, 0),
            "tools": {}
        },
        "os-machine": {
            "events": {
                "update": function():void {}
            },
            "init": function():void {},
            "nodes": {},
            "nodes_os": {
                "cpu": {
                    "arch": null,
                    "cores": null,
                    "endianness": null,
                    "frequency": null,
                    "name": null
                },
                "env": null,
                "memory": {
                    "free": null,
                    "total": null,
                    "used": null
                },
                "os": {
                    "hostname": null,
                    "name": null,
                    "platform": null,
                    "release": null,
                    "type": null,
                    "uptime": null
                },
                "path": null,
                "process": {
                    "admin": null,
                    "arch": null,
                    "argv": null,
                    "cpuSystem": null,
                    "cpuUser": null,
                    "cwd": null,
                    "memoryExternal": null,
                    "memoryProcess": null,
                    "memoryV8": null,
                    "pid": null,
                    "platform": null,
                    "ppid": null,
                    "uptime": null
                },
                "update_button": null,
                "update_duration": null,
                "update_text": null,
                "user": {
                    "gid": null,
                    "homedir": null,
                    "uid": null
                },
                "versions": null,
            },
            "receive": function(socket_data:socket_data):void {},
            "time": 0,
            "tools": {}
        },
        "ports-application": {
            "dataName": "ports-application",
            "nodes": {
                caseSensitive: null,
                count: null,
                filter_column: null,
                filter_count: null,
                filter_value: null,
                list: null,
                update_button: null,
                update_duration: null,
                update_text: null
            },
            "receive": function():void {}, // not used
            "row": function(record_item:type_lists, tr:HTMLElement):void {},
            "sort_name": [""],
            "time": 0
        },
        "processes": {
            "dataName": "proc",
            "nodes": {
                caseSensitive: null,
                count: null,
                filter_column: null,
                filter_count: null,
                filter_value: null,
                list: null,
                update_button: null,
                update_duration: null,
                update_text: null
            },
            "receive": function():void {}, // not used
            "row": function(record_item:type_lists, tr:HTMLElement):void {},
            "sort_name": [""],
            "time": 0
        },
        "servers-web": {
            "events": {
                "message": function(event:MouseEvent):void {},
                "validate": function(event:FocusEvent|KeyboardEvent):void {}
            },
            "init": function():void {},
            "nodes": {
                "list": null,
                "service_new": null
            },
            "receive": function(socket_data:socket_data):void {},
            "tools": {
                "activePorts": function(id:boolean|string):HTMLElement {return document.createElement("div");}
            }
        },
        "services-app": {
            "events": {},
            "init": function():void {},
            "nodes": {
                "": null
            },
            "receive": function():void {}, // not used
            "tools": {}
        },
        "services-os": {
            "dataName": "serv",
            "nodes": {
                caseSensitive: null,
                count: null,
                filter_column: null,
                filter_count: null,
                filter_value: null,
                list: null,
                update_button: null,
                update_duration: null,
                update_text: null
            },
            "receive": function():void {}, // not used
            "row": function(record_item:type_lists, tr:HTMLElement):void {},
            "sort_name": [""],
            "time": 0
        },
        "sockets-application-tcp": {
            "dataName": "sockets-application-tcp",
            "nodes": {
                caseSensitive: null,
                count: null,
                filter_column: null,
                filter_count: null,
                filter_value: null,
                list: null,
                update_button: null,
                update_duration: null,
                update_text: null
            },
            "receive": function():void {}, // not used
            "row": function(record_item:type_lists, tr:HTMLElement):void {},
            "sort_name": [""],
            "time": 0
        },
        "sockets-application-udp": {
            "dataName": "sockets-application-udp",
            "nodes": {
                caseSensitive: null,
                count: null,
                filter_column: null,
                filter_count: null,
                filter_value: null,
                list: null,
                update_button: null,
                update_duration: null,
                update_text: null
            },
            "receive": function():void {}, // not used
            "row": function(record_item:type_lists, tr:HTMLElement):void {},
            "sort_name": [""],
            "time": 0
        },
        "sockets-os-tcp": {
            "dataName": "stcp",
            "nodes": {
                caseSensitive: null,
                count: null,
                filter_column: null,
                filter_count: null,
                filter_value: null,
                list: null,
                update_button: null,
                update_duration: null,
                update_text: null
            },
            "receive": function():void {}, // not used
            "row": function(record_item:type_lists, tr:HTMLElement):void {},
            "sort_name": [""],
            "time": 0
        },
        "sockets-os-udp": {
            "dataName": "sudp",
            "nodes": {
                caseSensitive: null,
                count: null,
                filter_column: null,
                filter_count: null,
                filter_value: null,
                list: null,
                update_button: null,
                update_duration: null,
                update_text: null
            },
            "receive": function():void {}, // not used
            "row": function(record_item:type_lists, tr:HTMLElement):void {},
            "sort_name": [""],
            "time": 0
        },
        "statistics-resources": {
            "events": {
                "change_display": function():void {},
                "change_type": function():void {},
                "definitions": function(event:FocusEvent|KeyboardEvent):void {}
            },
            "graph_config": {
                "colors": [""],
                "labels": {},
                "title": {}
            },
            "graphs": {},
            "init": function():void {},
            "nodes": {
                duration: null,
                frequency: null,
                graph_display: null,
                graph_type: null,
                graphs: null,
                records: null,
                update: null
            },
            "receive": function(socket_data:socket_data):void {},
            "tools": {
                "graph_composite": function(force_new:boolean|string):void {},
                "graph_individual": function(force_new:boolean|string):void {}
            }
        },
        "terminal": {
            "cols": 0,
            "events": {
                "change": function():void {},
                "data": function(event:websocket_event):void {},
                "firstData": function(event:websocket_event):void {},
                "input": function(input:terminal_input):void {},
                "resize": function():void {},
                "selection": function():void {}
            },
            "id": "",
            "info": {
                "pid": 0,
                "port_browser": 0,
                "port_terminal": 0,
                "server_name": "",
                "socket_hash": ""
            },
            "init": function():void {},
            "item": null,
            "nodes": {
                cols: null,
                output: null,
                rows: null,
                select: null
            },
            "receive": function():void {}, // not used
            "rows": 0,
            socket: null,
            "tools": {
                "": function():void {}
            }
        },
        "test-http": {
            "events": {
                "request": function():void {}
            },
            "init": function():void {},
            "nodes": {
                encryption: null,
                http_request: null,
                request: null,
                responseBody: null,
                responseHeaders: null,
                responseURI: null,
                stats: null,
                timeout: null
            },
            "receive": function(socket_data:socket_data):void {},
            "tools": {}
        },
        "test-performance": {
            events: {
                submit: function():void {},
                type: function(event:MouseEvent) {}
            },
            init: null,
            nodes: {
                body: null,
                button_execute: null,
                connect_address: null,
                connect_port: null,
                encrypt_false: null,
                encrypt_true: null,
                frame_body_size: null,
                garbage_collection_false: null,
                garbage_collection_true: null,
                measure_roundtrip: null,
                measure_send: null,
                quantity_tests: null,
                quantity_transmit: null,
                status: null,
                type_http: null,
                type_websocket: null
            },
            receive: null,
            tools: {}
        },
        "test-websocket": {
            "connected": false,
            "events": {
                "encryption": function(event:MouseEvent):void {},
                "handshakeSend": function():void {},
                "keyup_frame": function(event:Event):void {},
                "keyup_message": function(event:KeyboardEvent):void {},
                "message_send": function():void {}
            },
            "frameBeautify": function(target:"receive"|"send", valueItem?:string):void {},
            "init": function():void {},
            "nodes": {
                button_handshake: null,
                button_send: null,
                encrypt_false: null,
                encrypt_true: null,
                frame_validate: null,
                halt_receive: null,
                handshake: null,
                handshake_label: null,
                handshake_status: null,
                handshake_timeout: null,
                message_receive_body: null,
                message_receive_frame: null,
                message_send_body: null,
                message_send_frame: null,
                status: null
            },
            "receive": function():void {},
            "timeout": 0,
            "tools": {
                "handshake": function():void {},
                "parse_frame": function():websocket_frame {
                    return {
                        "extended": 0,
                        "fin": true,
                        "len": 0,
                        "mask": false,
                        "maskKey": Buffer.alloc(0),
                        "opcode": 0,
                        "rsv1": false,
                        "rsv2": false,
                        "rsv3": false,
                        "size_buffer": 0,
                        "size_fragment": 0,
                        "startByte": 0
                    };
                }
            },
            "transmit": {
                "": function(socket_data:socket_data):void {}
            }
        },
        "udp-socket": {
            "events": {
                "create": function():void {},
                "setState": function():void {},
                "toggle_multicast": function():void {},
                "toggle_role": function():void {},
                "toggle_type": function():void {}
            },
            "init": function():void {},
            "nodes": {
                button_create: null,
                input_address_destination: null,
                input_address_source: null,
                input_multicast_membership: null,
                input_multicast_none: null,
                input_multicast_source: null,
                input_port_destination: null,
                input_port_source: null,
                input_role_client: null,
                input_role_server: null,
                input_type_ipv4: null,
                input_type_ipv6: null,
                interfaces: null,
                multicast_group: null,
                multicast_interface: null,
                multicast_membership: null,
                multicast_source: null,
                status: null,
                toggle_client: null,
                toggle_server: null
            },
            "receive": function(socket_data:socket_data):void {},
            tools: {}
        },
        "users": {
            "dataName": "user",
            "nodes": {
                caseSensitive: null,
                count: null,
                filter_column: null,
                filter_count: null,
                filter_value: null,
                list: null,
                update_button: null,
                update_duration: null,
                update_text: null
            },
            "receive": function():void {}, // not used
            "row": function(record_item:type_lists, tr:HTMLElement):void {},
            sort_name: [""],
            time: 0
        }
    },
    shared_services: {
        "cancel": function(event:MouseEvent):void {},
        "color": function(id:string, type:type_dashboard_list):type_activation_status {return ["green", "online"];},
        "create": function(event:Event):void {},
        "details": function(event:Event):void {},
        "edit": function(event:Event):void {},
        "shellResize": function(config:config_resize):void {},
        "title": function(id:string, type:type_dashboard_list):HTMLElement {return null;}
    },
    socket: null,
    tables: {
        "cell": function(tr:HTMLElement, text:string, raw:string):void {},
        "filter": function(event:Event, target?:HTMLInputElement):void {},
        "init": function(module:module_list|section_ports_application|section_sockets_application):void {},
        "populate": function(module:module_list, item:type_list_services):void {},
        "receive": function(socket_data:socket_data):void {},
        "sort": function(event:MouseEvent, table?:HTMLElement, heading_index?:number):void {},
        "update": function(event:MouseEvent):void {}
    },
    utility: {
        "baseline": function():void {},
        "clock": function(socket_data:socket_data):void {},
        "nodes": {
            clock: null,
            load: null,
            main: null
        },
        "performance_get": function(section:type_dashboard_sections):string {return "";},
        "performance_set": function(section:type_dashboard_sections):void {},
        "resize": function():void {},
        "setState": function():void {}
    }
};
export default dashboard;