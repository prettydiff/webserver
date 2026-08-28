
import dashboard from "./dashboard.ts";
// cspell: words serv, stcp, sudp

const ui_message = function ui_message():void {
    const message:dashboard_message = {
        init: function dashboard_message_init(socket_data:socket_data):void {
            if (dashboard.global.loaded === false) {
                const data:services_dashboard_open = socket_data.data as services_dashboard_open,
                    title:HTMLElement = document.getElementsByTagName("h1")[0],
                    anchor:HTMLElement = document.createElement("a"),
                    encryption:string = (dashboard.socket.socket.url.indexOf("wss") === 0)
                        ? "Encrypted"
                        : "Insecure",
                    status:HTMLElement = document.getElementById("connection-status"),
                    init = function dashboard_execute_init(section_name:type_dashboard_features, table:boolean):void {
                        if (dashboard.sections[section_name] !== undefined) {
                            if (table === true) {
                                dashboard.tables.init(dashboard.sections[section_name as type_dashboard_tables]);
                            } else {
                                dashboard.sections[section_name as type_dashboard_init].init();
                            }
                        }
                    };
                dashboard.global.payload = data;
                init("application-logs", false);
                init("compose-containers", false);
                init("devices", true);
                init("disks", false);
                init("dns-query", false);
                init("file-system", false);
                init("hash", false);
                init("interfaces", false);
                init("message-inspection", false);
                init("notes", false);
                init("os-machine", false);
                init("ports-application", true);
                init("processes", true);
                init("servers-web", false);
                init("services-app", false);
                init("services-os", true);
                init("sockets-application-tcp", true);
                init("sockets-application-udp", true);
                init("sockets-os-tcp", true);
                init("sockets-os-udp", true);
                init("statistics-resources", false);
                init("terminal", false);
                init("test-http", false);
                init("test-performance", false);
                init("test-websocket", false);
                init("udp-socket", false);
                init("users", true);
                dashboard.utility.nodes.main.style.display = "block";
                anchor.setAttribute("href", dashboard.global.payload.repository);
                anchor.textContent = `version ${dashboard.global.payload.version}`;
                title.appendChild(anchor);
                if (status !== null ) {
                    status.getElementsByTagName("strong")[0].textContent = `Online (${encryption})`;
                    status.setAttribute("class", "connection-online");
                }
                if (dashboard.utility.nodes.load.textContent === "0.00000 seconds") {
                    dashboard.utility.nodes.load.textContent = `${(performance.now() / 1e3).toFixed(3)} seconds`;
                }
                window.show_payload = function dashboard_execute_showPayload():[string, services_dashboard_open] {
                    return [
                        JSON.stringify(dashboard.global.payload).length.commas(),
                        dashboard.global.payload
                    ];
                };
                dashboard.global.loaded = true;
            }
        },
        receive: function dashboard_message_receive(data:string):void {
            const message_item:socket_data = JSON.parse(data),
                service_map:map_messages = {
                    "services_test_browser": null,
                    "services_compose": (dashboard.sections["compose-containers"] === undefined)
                        ? null
                        : dashboard.sections["compose-containers"].receive,
                    "services_compose_out": (dashboard.sections["compose-containers"] === undefined)
                        ? null
                        : dashboard.sections["compose-containers"].status_out,
                    "services_dashboard_open": dashboard.message.init,
                    "services_dns_output": (dashboard.sections["dns-query"] === undefined)
                        ? null
                        : dashboard.sections["dns-query"].receive,
                    "services_dns_reverse": (dashboard.sections["dns-query"] === undefined)
                        ? null
                        : dashboard.sections["dns-query"].receive,
                    "services_file_system": (dashboard.sections["file-system"] === undefined)
                        ? null
                        : dashboard.sections["file-system"].receive,
                    "services_hash": (dashboard.sections["hash"] === undefined)
                        ? null
                        : dashboard.sections["hash"].receive,
                    "services_log": (dashboard.sections["application-logs"] === undefined)
                        ? null
                        : dashboard.sections["application-logs"].receive,
                    "services_message_inspection": (dashboard.sections["message-inspection"] === undefined)
                        ? null
                        : dashboard.sections["message-inspection"].receive,
                    "services_notes": (dashboard.sections["notes"] === undefined)
                        ? null
                        : dashboard.sections["notes"].receive,
                    "services_os_devs": (dashboard.sections["devices"] === undefined)
                        ? null
                        : dashboard.tables.receive,
                    "services_os_disk": (dashboard.sections["disks"] === undefined)
                        ? null
                        : dashboard.sections["disks"].receive,
                    "services_os_intr": (dashboard.sections["interfaces"] === undefined)
                        ? null
                        : dashboard.sections["interfaces"].receive,
                    "services_os_main": (dashboard.sections["os-machine"] === undefined)
                        ? null
                        : dashboard.sections["os-machine"].receive,
                    "services_os_proc": (dashboard.sections["processes"] === undefined)
                        ? null
                        : dashboard.tables.receive,
                    "services_os_serv": (dashboard.sections["services-os"] === undefined)
                        ? null
                        : dashboard.tables.receive,
                    "services_os_stcp": (dashboard.sections["sockets-os-tcp"] === undefined)
                        ? null
                        : dashboard.tables.receive,
                    "services_os_sudp": (dashboard.sections["sockets-os-udp"] === undefined)
                        ? null
                        : dashboard.tables.receive,
                    "services_os_user": (dashboard.sections["users"] === undefined)
                        ? null
                        : dashboard.tables.receive,
                    "services_ports_application": (dashboard.sections["ports-application"] === undefined)
                        ? null
                        : dashboard.tables.receive,
                    "services_server_update": (dashboard.sections["servers-web"] === undefined)
                        ? null
                        : dashboard.sections["servers-web"].receive,
                    "services_socket_application": (dashboard.sections["sockets-application-tcp"] === undefined)
                        ? (dashboard.sections["sockets-application-udp"] === undefined)
                            ? null
                            : dashboard.tables.receive
                        : dashboard.tables.receive,
                    "services_statistics_data": (dashboard.sections["statistics-resources"] === undefined)
                        ? null
                        : dashboard.sections["statistics-resources"].receive,
                    "services_status_clock": dashboard.utility.clock,
                    "services_test_http": (dashboard.sections["test-http"] === undefined)
                        ? null
                        : dashboard.sections["test-http"].receive,
                    "services_test_performance_output": (dashboard.sections["test-performance"] === undefined)
                        ? null
                        : dashboard.sections["test-performance"].receive,
                    "services_udp_status": (dashboard.sections["udp-socket"] === undefined)
                        ? null
                        : dashboard.sections["udp-socket"].receive,
                    "services_websocket_message": (dashboard.sections["test-websocket"] === undefined)
                        ? null
                        : dashboard.sections["test-websocket"].transmit.message_receive,
                    "services_websocket_status": (dashboard.sections["test-websocket"] === undefined)
                        ? null
                        : dashboard.sections["test-websocket"].transmit.status
                };
            if (message_item.service === "services_os_all") {
                const data:services_os_all = message_item.data as services_os_all;
                if (dashboard.sections["devices"] !== undefined) {
                    dashboard.tables.populate(dashboard.sections["devices"], data.devs);
                }
                if (dashboard.sections["disks"] !== undefined) {
                    dashboard.sections["disks"].receive({
                        data: data.disk,
                        service: "services_os_disk"
                    });
                }
                if (dashboard.sections["interfaces"] !== undefined) {
                    dashboard.sections["interfaces"].receive({
                        data: data.intr,
                        service: "services_os_intr"
                    });
                }
                if (dashboard.sections["os-machine"] !== undefined) {
                    dashboard.sections["os-machine"].receive({
                        data: data.main,
                        service: "services_os_main"
                    });
                }
                if (dashboard.sections["processes"] !== undefined) {
                    dashboard.tables.receive({
                        data: data.proc,
                        service: "services_os_proc"
                    });
                }
                if (dashboard.sections["services-os"] !== undefined) {
                    dashboard.tables.receive({
                        data: data.serv,
                        service: "services_os_serv"
                    });
                }
                if (dashboard.sections["sockets-os-tcp"] !== undefined) {
                    dashboard.tables.receive({
                        data: data.stcp,
                        service: "services_os_stcp"
                    });
                }
                if (dashboard.sections["sockets-os-udp"] !== undefined) {
                    dashboard.tables.receive({
                        data: data.sudp,
                        service: "services_os_sudp"
                    });
                }
                if (dashboard.sections["users"] !== undefined) {
                    dashboard.tables.receive({
                        data: data.user,
                        service: "services_os_user"
                    });
                }
            } else if (service_map[message_item.service] !== null) {
                service_map[message_item.service](message_item);
            }
        },
        // send dashboard service messages
        send: function dashboard_message_send(socket_data:socket_data):void {
            dashboard.socket.queue(JSON.stringify(socket_data));
        },
    };
    dashboard.message = message;
};

export default ui_message;