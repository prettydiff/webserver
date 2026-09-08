
import demo from "../services/demo.ts";
import dns from "../services/dns.ts";
import docker from "../services/docker.ts";
import fileSystem from "../services/fileSystem.ts";
import hash from "../services/hash.ts";
import log from "../core/log.ts";
import message_inspection from "../services/message_inspection.ts";
import notes from "../services/notes.ts";
import os from "../services/os.ts";
import ports_application from "../services/ports_application.ts";
import servers from "../server/index.ts";
import socket_list from "../services/socket_list.ts";
import statistics_resources from "../services/statistics_resources.ts";
import terminal from "../services/terminal.ts";
import test_http from "../services/test_http.ts";
import test_performance from "../services/test_performance.ts";
import test_runner from "../test/runner.ts";
import udp_socket from "../services/udp_socket.ts";
import websocket_test from "../services/websocket.ts";

// cspell: words serv, stcp, sudp

const router = function transmit_router(socketData:socket_data, transmit:transmit_socket):void {
    const services:string = socketData.service,
        actions:transmit_receiver = {
            "services_compose_container": docker.receive,
            "services_compose_variables": docker.receive,
            "services_demo": demo,
            "services_dns_input": dns,
            "services_file_system": fileSystem,
            "services_hash": hash,
            "services_log": log.receive,
            "services_message_inspection": message_inspection.set,
            "services_notes": notes,
            "services_os_all": os,
            "services_os_devs": os,
            "services_os_disk": os,
            "services_os_intr": os,
            "services_os_main": os,
            "services_os_proc": os,
            "services_os_serv": os,
            "services_os_sock": os,
            "services_os_stcp": os,
            "services_os_sudp": os,
            "services_os_user": os,
            "services_ports_application": ports_application,
            "services_server_action": servers,
            "services_socket_application": socket_list,
            "services_statistics_change": statistics_resources.change,
            "services_terminal_resize": terminal.resize,
            "services_test_browser": test_runner.receive,
            "services_test_http": test_http,
            "services_test_performance_input": test_performance,
            "services_udp_socket": udp_socket,
            "services_websocket_handshake": websocket_test.handshake,
            "services_websocket_message": websocket_test.message
        };
    if (services === "services_terminal_resize") {
        const data:services_terminal_resize = socketData.data as services_terminal_resize;
        if (data.section === "compose-containers") {
            docker.resize(socketData, transmit);
        } else {
            terminal.resize(socketData, transmit);
        }
    } else if (actions[services] !== undefined) {
        actions[services](socketData, transmit);
    }
};

export default router;