

import dashboard from "./dashboard.ts";

const ui_utility = function ui_utility():void {
    const utility:dashboard_utility = {
        // reset the UI to a near empty baseline
        baseline: function dashboard_utility_baseline():void {
            if (dashboard.global.loaded === true) {
                const status:HTMLElement = document.getElementById("connection-status"),
                    replace = function dashboard_utility_baseline_replace(node:HTMLElement, className:boolean):HTMLElement {
                        if (node !== null && node !== undefined && node.parentNode !== null) {
                            const node_new:HTMLElement = document.createElement(node.lowName());
                            if (className === true) {
                                node_new.setAttribute("class", node.getAttribute("class"));
                            }
                            node.parentNode.appendChild(node_new);
                            node.parentNode.removeChild(node);
                            return node_new;
                        }
                        return null;
                    },
                    lists = function dashboard_utility_baseline_lists(section:module_list|module_sections|section_interfaces, filter:boolean):void {
                        if (section !== undefined) {
                            section.nodes.count.textContent = "";
                            section.nodes.list.textContent = "";
                            section.nodes.update_text.textContent = "";
                            if (filter === true) {
                                const sectionList:module_list = section as module_list;
                                sectionList.nodes.caseSensitive.checked = true;
                                sectionList.nodes.filter_column.textContent = "";
                                sectionList.nodes.filter_count.textContent = "";
                                sectionList.nodes.filter_value.value = "";
                            }
                        }
                    },
                    title:HTMLElement = document.getElementsByTagName("h1")[0];
                dashboard.global.loaded = false;
                status.setAttribute("class", "connection-offline");
                status.getElementsByTagName("strong")[0].textContent = "Offline";
                lists(dashboard.sections["interfaces"], false);
                lists(dashboard.sections["sockets-application-tcp"], true);
                lists(dashboard.sections["sockets-application-udp"], true);
                lists(dashboard.sections["sockets-os-tcp"], true);
                lists(dashboard.sections["sockets-os-udp"], true);
                lists(dashboard.sections["devices"], true);
                lists(dashboard.sections["disks"], false);
                lists(dashboard.sections["processes"], true);
                lists(dashboard.sections["services-os"], true);
                lists(dashboard.sections["users"], true);
                if (dashboard.sections["application-logs"] !== undefined) {
                    replace(dashboard.sections["application-logs"].nodes.list, false);
                }
                if (dashboard.sections["compose-containers"] !== undefined) {
                    dashboard.sections["compose-containers"].nodes.body.style.display = "block";
                    dashboard.sections["compose-containers"].nodes.list.textContent = "";
                    dashboard.sections["compose-containers"].nodes.list_variables.textContent = "";
                    dashboard.sections["compose-containers"].nodes.status.style.display = "none";
                    dashboard.sections["compose-containers"].nodes.status.textContent = "";
                    dashboard.sections["compose-containers"].nodes.update_containers.textContent = "";
                    dashboard.sections["compose-containers"].nodes.update_time.textContent = "";
                    dashboard.sections["compose-containers"].nodes.update_variables.textContent = "";
                }
                if (dashboard.sections["file-system"] !== undefined) {
                    const fileSummary:HTMLCollectionOf<HTMLElement> = dashboard.sections["file-system"].nodes.summary.getElementsByTagName("li"),
                        audio:HTMLAudioElement = dashboard.sections["file-system"].media.audio.lastChild as HTMLAudioElement,
                        video:HTMLVideoElement = dashboard.sections["file-system"].media.video.lastChild as HTMLVideoElement;
                    audio.pause();
                    audio.currentTime = 0;
                    video.pause();
                    video.currentTime = 0;
                    fileSummary[0].getElementsByTagName("strong")[0].textContent = "";
                    fileSummary[1].getElementsByTagName("strong")[0].textContent = "";
                    fileSummary[2].getElementsByTagName("strong")[0].textContent = "";
                    fileSummary[3].getElementsByTagName("strong")[0].textContent = "";
                    fileSummary[4].getElementsByTagName("strong")[0].textContent = "";
                    fileSummary[5].getElementsByTagName("strong")[0].textContent = "";
                    fileSummary[6].getElementsByTagName("strong")[0].textContent = "";
                    fileSummary[7].getElementsByTagName("strong")[0].textContent = "";
                    fileSummary[8].getElementsByTagName("strong")[0].textContent = "";
                    dashboard.sections["file-system"].block = false;
                    dashboard.sections["file-system"].nodes.failures.textContent = "";
                    dashboard.sections["file-system"].nodes.output.getElementsByTagName("tbody")[0].textContent = "";
                    dashboard.sections["file-system"].nodes.output.style.display = "none";
                    dashboard.sections["file-system"].nodes.status.textContent = "";
                    dashboard.sections["file-system"].time = 0;
                }
                if (dashboard.sections["notes"] !== undefined) {
                    dashboard.sections["notes"].nodes.textarea.value = "";
                }
                if (dashboard.sections["os-machine"] !== undefined) {
                    dashboard.sections["os-machine"].nodes_os.cpu.arch.textContent = "";
                    dashboard.sections["os-machine"].nodes_os.cpu.cores.textContent = "";
                    dashboard.sections["os-machine"].nodes_os.cpu.endianness.textContent = "";
                    dashboard.sections["os-machine"].nodes_os.cpu.frequency.textContent = "";
                    dashboard.sections["os-machine"].nodes_os.cpu.name.textContent = "";
                    dashboard.sections["os-machine"].nodes_os.memory.free.textContent = "";
                    dashboard.sections["os-machine"].nodes_os.memory.used.textContent = "";
                    dashboard.sections["os-machine"].nodes_os.memory.total.textContent = "";
                    dashboard.sections["os-machine"].nodes_os.os.hostname.textContent = "";
                    dashboard.sections["os-machine"].nodes_os.os.name.textContent = "";
                    dashboard.sections["os-machine"].nodes_os.os.platform.textContent = "";
                    dashboard.sections["os-machine"].nodes_os.os.release.textContent = "";
                    dashboard.sections["os-machine"].nodes_os.os.type.textContent = "";
                    dashboard.sections["os-machine"].nodes_os.os.uptime.textContent = "";
                    dashboard.sections["os-machine"].nodes_os.process.arch.textContent = "";
                    dashboard.sections["os-machine"].nodes_os.process.argv.textContent = "";
                    dashboard.sections["os-machine"].nodes_os.process.cpuSystem.textContent = "";
                    dashboard.sections["os-machine"].nodes_os.process.cpuUser.textContent = "";
                    dashboard.sections["os-machine"].nodes_os.process.cwd.textContent = "";
                    dashboard.sections["os-machine"].nodes_os.process.platform.textContent = "";
                    dashboard.sections["os-machine"].nodes_os.process.pid.textContent = "";
                    dashboard.sections["os-machine"].nodes_os.process.ppid.textContent = "";
                    dashboard.sections["os-machine"].nodes_os.process.uptime.textContent = "";
                    dashboard.sections["os-machine"].nodes_os.process.memoryProcess.textContent = "";
                    dashboard.sections["os-machine"].nodes_os.process.memoryV8.textContent = "";
                    dashboard.sections["os-machine"].nodes_os.process.memoryExternal.textContent = "";
                    dashboard.sections["os-machine"].nodes_os.update_text.textContent = "";
                    dashboard.sections["os-machine"].nodes_os.user.gid.textContent = "";
                    dashboard.sections["os-machine"].nodes_os.user.uid.textContent = "";
                    dashboard.sections["os-machine"].nodes_os.user.homedir.textContent = "";
                }
                if (dashboard.sections["servers-web"] !== undefined) {
                    const server_new:HTMLButtonElement = document.getElementById("servers-web").getElementsByClassName("server-new")[0] as HTMLButtonElement;
                    server_new.disabled = false;
                    dashboard.sections["servers-web"].nodes.list = replace(dashboard.sections["servers-web"].nodes.list, true);
                }
                if (dashboard.sections["terminal"] !== undefined) {
                    dashboard.sections["terminal"].nodes.output = replace(dashboard.sections["terminal"].nodes.output, true);
                    dashboard.sections["terminal"].nodes.output.removeAttribute("data-info");
                    dashboard.sections["terminal"].nodes.output.removeAttribute("data-size");
                    if (dashboard.sections["terminal"].socket !== null) {
                        dashboard.sections["terminal"].socket.close();
                        dashboard.sections["terminal"].socket = null;
                    }
                }
                if (dashboard.sections["test-performance"] !== undefined) {
                    dashboard.sections["test-performance"].nodes.body.value = "";
                    dashboard.sections["test-performance"].nodes.connect_address.value = "";
                    dashboard.sections["test-performance"].nodes.connect_port.value = "";
                    dashboard.sections["test-performance"].nodes.encrypt_false.checked = true;
                    dashboard.sections["test-performance"].nodes.frame_body_size.value = "1000000";
                    dashboard.sections["test-performance"].nodes.quantity_tests.value = "10";
                    dashboard.sections["test-performance"].nodes.quantity_transmit.value = "50000";
                    dashboard.sections["test-performance"].nodes.type_websocket.checked = true;
                }
                if (dashboard.sections["test-websocket"] !== undefined) {
                    dashboard.sections["test-websocket"].nodes.handshake_status.value = "Disconnected.";
                    dashboard.sections["test-websocket"].nodes.button_handshake.textContent = "Connect";
                    dashboard.sections["test-websocket"].nodes.status.setAttribute("class", "connection-offline");
                    dashboard.sections["test-websocket"].nodes.message_receive_body.value = "";
                    dashboard.sections["test-websocket"].nodes.message_receive_frame.value = "";
                    dashboard.sections["test-websocket"].nodes.button_send.disabled = true;
                }
                dashboard.utility.nodes.clock.textContent = "00:00:00L (00:00:00Z)";
                dashboard.utility.nodes.main.style.display = "none";
                dashboard.socket.socket = null;
                title.removeChild(title.getElementsByTagName("a")[0]);
            }
        },
        // provides server status information
        clock: function dashboard_utility_clock(socket_data:socket_data):void {
            const data:services_status_clock = socket_data.data as services_status_clock,
                str = function dashboard_utility_clock_srt(num:number):string {
                    const date:Date = new Date(num),
                        hour:string = String(date.getHours()),
                        minute:string = String(date.getMinutes()),
                        second:string = String(date.getSeconds()),
                        hours:string = (hour.length === 1)
                            ? `0${hour}`
                            : hour,
                        minutes:string = (minute.length === 1)
                            ? `0${minute}`
                            : minute,
                        seconds:string = (second.length === 1)
                            ? `0${second}`
                            : second;
                    return `${hours}:${minutes}:${seconds}`;
                };
            dashboard.utility.nodes.clock.setAttribute("data-local", String(data.time_local));
            if (data.time_zulu === data.time_local) {
                dashboard.utility.nodes.clock.textContent = `${str(data.time_local)}Z`;
            } else {
                dashboard.utility.nodes.clock.textContent = `${str(data.time_local)}L (${str(data.time_zulu)}Z)`;
            }
        },
        clock_demo: function dashboard_utility_clockDemo(socket_data:socket_data):void {
            if (dashboard.global.payload.demo === true) {
                const data:services_status_clock_demo = socket_data.data as services_status_clock_demo;
                dashboard.utility.nodes.clock_demo.textContent = data.remaining;
            }
        },
        nodes: {
            clock: document.getElementById("clock").getElementsByTagName("time")[0],
            clock_demo: document.getElementById("demo-mode").getElementsByTagName("p")[1].getElementsByTagName("strong")[0],
            load: document.getElementsByClassName("title")[0].getElementsByTagName("time")[0],
            main: document.getElementsByTagName("main")[0]
        },
        performance_get: function dashboard_utility_performanceGet(section:type_dashboard_sections):string {
            if (dashboard.sections[section as "file-system"].time > 0) {
                return BigInt(Math.round(Date.now() * 1e6)).time_elapsed(BigInt(dashboard.sections[section as "file-system"].time * 1e6)).replace(/\d{3}$/, "");
            }
            return 0n.time_elapsed(0n).replace(/\d{3}$/, "");
        },
        performance_set: function dashboard_utility_performanceSet(section:type_dashboard_sections):void {
            const now:number = Date.now();
            if (section === "sockets-application-tcp" || section === "sockets-application-udp") {
                if (dashboard.sections["sockets-application-tcp"] !== undefined) {
                    dashboard.sections["sockets-application-tcp"].time = now;
                }
                if (dashboard.sections["sockets-application-udp"] !== undefined) {
                    dashboard.sections["sockets-application-udp"].time = now;
                }
            } else {
                dashboard.sections[section as "file-system"].time = now;
            }
        },
        // a universal bucket to store all resize event handlers
        resize: function dashboard_utility_resize():void {
            if (dashboard.sections["application-logs"] !== undefined) {
                dashboard.sections["application-logs"].events.resize();
            }
            if (dashboard.sections["compose-containers"] !== undefined && dashboard.sections["compose-containers"].events.resize !== null) {
                dashboard.sections["compose-containers"].events.resize();
            }
            if (dashboard.sections["file-system"] !== undefined) {
                dashboard.sections["file-system"].events.resize();
            }
            if (dashboard.sections["notes"] !== undefined) {
                dashboard.sections["notes"].events.resize();
            }
            if (dashboard.sections["terminal"] !== undefined && dashboard.sections["terminal"].events.resize !== null && dashboard.sections["terminal"].socket !== null) {
                dashboard.sections["terminal"].events.resize();
            }
        },
        // gathers state artifacts and saves state data
        setState: function dashboard_utility_setState():void {
            if (dashboard.socket.connected === true && dashboard.global.loaded === true) {
                const lists = function dashboard_utility_setState_lists(module:module_list):void {
                    if (module !== undefined) {
                        const type:string = module.dataName;
                        if (dashboard.global.state.table_os[type] === null || dashboard.global.state.table_os[type] === undefined) {
                            dashboard.global.state.table_os[type] = {
                                filter_column: module.nodes.filter_column.selectedIndex,
                                filter_sensitive: module.nodes.caseSensitive.checked,
                                filter_value: module.nodes.filter_value.value
                            };
                        } else {
                            dashboard.global.state.table_os[type].filter_column = module.nodes.filter_column.selectedIndex;
                            dashboard.global.state.table_os[type].filter_sensitive = module.nodes.caseSensitive.checked;
                            dashboard.global.state.table_os[type].filter_value = module.nodes.filter_value.value;
                        }
                    }
                };
                if (dashboard.sections["dns-query"] !== undefined) {
                    if (dashboard.global.state.dns === undefined || dashboard.global.state.dns === null) {
                        dashboard.global.state.dns = {
                            reverse: dashboard.sections["dns-query"].nodes.reverse.checked,
                            hosts: dashboard.sections["dns-query"].nodes.hosts.value,
                            types: dashboard.sections["dns-query"].nodes.types.value
                        };
                    } else {
                        dashboard.global.state.dns.reverse = dashboard.sections["dns-query"].nodes.reverse.checked;
                        dashboard.global.state.dns.hosts = dashboard.sections["dns-query"].nodes.hosts.value;
                        dashboard.global.state.dns.types = dashboard.sections["dns-query"].nodes.types.value;
                    }
                }
                if (dashboard.sections["file-system"] !== undefined) {
                    if (dashboard.global.state.fileSystem === undefined || dashboard.global.state.fileSystem === null) {
                        dashboard.global.state.fileSystem = {
                            children: dashboard.sections["file-system"].nodes.children.selectedIndex,
                            depth: dashboard.sections["file-system"].nodes.depth.value,
                            directory_size: dashboard.sections["file-system"].nodes.directory_size.selectedIndex,
                            path: dashboard.sections["file-system"].nodes.path.value,
                            path_style: dashboard.sections["file-system"].nodes.path_style.selectedIndex,
                            search: dashboard.sections["file-system"].nodes.search.value
                        };
                    } else {
                        dashboard.global.state.fileSystem.children = dashboard.sections["file-system"].nodes.children.selectedIndex;
                        dashboard.global.state.fileSystem.depth = dashboard.sections["file-system"].nodes.depth.value;
                        dashboard.global.state.fileSystem.directory_size = dashboard.sections["file-system"].nodes.directory_size.selectedIndex;
                        dashboard.global.state.fileSystem.path = dashboard.sections["file-system"].nodes.path.value;
                        dashboard.global.state.fileSystem.path_style = dashboard.sections["file-system"].nodes.path_style.selectedIndex;
                        dashboard.global.state.fileSystem.search = dashboard.sections["file-system"].nodes.search.value;
                    }
                }
                if (dashboard.sections["hash"] !== undefined) {
                    const hashInput:HTMLCollectionOf<HTMLInputElement> = document.getElementById("hash").getElementsByClassName("form")[0].getElementsByTagName("input");
                    if (dashboard.global.state.hash === undefined || dashboard.global.state.hash === null) {
                        dashboard.global.state.hash = {
                            algorithm: (dashboard.sections["hash"].nodes.algorithm[dashboard.sections["hash"].nodes.algorithm.selectedIndex] === undefined)
                                ? ""
                                : dashboard.sections["hash"].nodes.algorithm[dashboard.sections["hash"].nodes.algorithm.selectedIndex].textContent,
                            hashFunction: (hashInput[1].checked === true)
                                ? "base64"
                                : "hash",
                            type: (hashInput[3].checked === true)
                                ? "file"
                                : "string",
                            digest: (hashInput[5].checked === true)
                                ? "base64"
                                : "hex",
                            source: dashboard.sections["hash"].nodes.source.value
                        };
                    } else {
                        dashboard.global.state.hash.algorithm = (dashboard.sections["hash"].nodes.algorithm[dashboard.sections["hash"].nodes.algorithm.selectedIndex] === undefined)
                            ? ""
                            : dashboard.sections["hash"].nodes.algorithm[dashboard.sections["hash"].nodes.algorithm.selectedIndex].textContent;
                        dashboard.global.state.hash.hashFunction = (hashInput[1].checked === true)
                            ? "base64"
                            : "hash";
                        dashboard.global.state.hash.type = (hashInput[3].checked === true)
                            ? "file"
                            : "string";
                        dashboard.global.state.hash.digest = (hashInput[5].checked === true)
                            ? "base64"
                            : "hex";
                        dashboard.global.state.hash.source = dashboard.sections["hash"].nodes.source.value;
                    }
                }
                if (dashboard.sections["message-inspection"] !== undefined) {
                    dashboard.global.state.messageInspection = (dashboard.sections["message-inspection"].nodes.type[dashboard.sections["message-inspection"].nodes.type.selectedIndex].textContent === "Web Server")
                        ? "servers-web"
                        : "docker-container";
                }
                if (dashboard.sections["statistics-resources"] !== undefined) {
                    dashboard.global.state.graph_display = dashboard.sections["statistics-resources"].nodes.graph_display.selectedIndex;
                    dashboard.global.state.graph_type = dashboard.sections["statistics-resources"].nodes.graph_type.selectedIndex;
                }
                if (dashboard.sections["terminal"] !== undefined) {
                    if (dashboard.sections["terminal"].nodes.select[dashboard.sections["terminal"].nodes.select.selectedIndex] !== undefined) {
                        dashboard.global.state.terminal = dashboard.sections["terminal"].nodes.select[dashboard.sections["terminal"].nodes.select.selectedIndex].textContent;
                    }
                }
                if (dashboard.sections["test-http"] !== undefined) {
                    if (dashboard.global.state.http === undefined || dashboard.global.state.http === null) {
                        dashboard.global.state.http = {
                            encryption: (dashboard.sections["test-http"].nodes.encryption.checked === true),
                            request: dashboard.sections["test-http"].nodes.request.value
                        };
                    } else {
                        dashboard.global.state.http.encryption = (dashboard.sections["test-http"].nodes.encryption.checked === true);
                        dashboard.global.state.http.request = dashboard.sections["test-http"].nodes.request.value;
                    }
                }
                if (dashboard.sections["test-performance"] !== undefined) {
                    if (dashboard.global.state.test_performance === undefined || dashboard.global.state.test_performance === null) {
                        dashboard.global.state.test_performance = {
                            body: "",
                            connect_address: "",
                            connect_port: 80,
                            encryption: false,
                            frame_body_size: 1000000,
                            measure: "send",
                            quantity_tests: 10,
                            quantity_transmit: 50000,
                            type: "websocket"
                        };
                    } else {
                        dashboard.global.state.test_performance.body = dashboard.sections["test-performance"].nodes.body.value;
                        dashboard.global.state.test_performance.connect_address = dashboard.sections["test-performance"].nodes.connect_address.value;
                        dashboard.global.state.test_performance.connect_port = Number(dashboard.sections["test-performance"].nodes.connect_port.value);
                        dashboard.global.state.test_performance.encryption = dashboard.sections["test-performance"].nodes.encrypt_true.checked;
                        dashboard.global.state.test_performance.frame_body_size = Number(dashboard.sections["test-performance"].nodes.frame_body_size.value);
                        dashboard.global.state.test_performance.measure = (dashboard.sections["test-performance"].nodes.measure_roundtrip.checked === true)
                            ? "roundtrip"
                            : "send";
                        dashboard.global.state.test_performance.quantity_tests = Number(dashboard.sections["test-performance"].nodes.quantity_tests.value);
                        dashboard.global.state.test_performance.quantity_transmit = Number(dashboard.sections["test-performance"].nodes.quantity_transmit.value);
                        dashboard.global.state.test_performance.type = (dashboard.sections["test-performance"].nodes.type_http.checked === true)
                            ? "http"
                            : "websocket";
                    }
                }
                if (dashboard.sections["test-websocket"] !== undefined) {
                    dashboard.global.state.test_websocket.request_timeout = dashboard.sections["test-websocket"].nodes.handshake_timeout.value;
                    dashboard.global.state.test_websocket.send_frame = dashboard.sections["test-websocket"].nodes.message_send_frame.value;
                    dashboard.global.state.test_websocket.send_message = dashboard.sections["test-websocket"].nodes.message_send_body.value;
                }
                if (dashboard.sections["udp-socket"] !== undefined) {
                    dashboard.global.state.udp_socket.address_destination = dashboard.sections["udp-socket"].nodes.input_address_destination.value;
                    dashboard.global.state.udp_socket.address_source = dashboard.sections["udp-socket"].nodes.input_address_source.value;
                    dashboard.global.state.udp_socket.interfaces = dashboard.sections["udp-socket"].nodes.interfaces[dashboard.sections["udp-socket"].nodes.interfaces.selectedIndex].textContent;
                    dashboard.global.state.udp_socket.multicast_group = dashboard.sections["udp-socket"].nodes.multicast_group.getElementsByTagName("input")[0].value;
                    dashboard.global.state.udp_socket.multicast_membership = dashboard.sections["udp-socket"].nodes.multicast_membership.getElementsByTagName("input")[0].value;
                    dashboard.global.state.udp_socket.multicast_source = dashboard.sections["udp-socket"].nodes.multicast_source.getElementsByTagName("input")[0].value;
                    dashboard.global.state.udp_socket.port_destination = dashboard.sections["udp-socket"].nodes.input_port_destination.value;
                    dashboard.global.state.udp_socket.port_source = dashboard.sections["udp-socket"].nodes.input_port_source.value;
                    if (dashboard.sections["udp-socket"].nodes.input_multicast_membership.checked === true) {
                        dashboard.global.state.udp_socket.toggle_multicast = "membership";
                    } else if (dashboard.sections["udp-socket"].nodes.input_multicast_source.checked === true) {
                        dashboard.global.state.udp_socket.toggle_multicast = "source";
                    } else {
                        dashboard.global.state.udp_socket.toggle_multicast = "none";
                    }
                    if (dashboard.sections["udp-socket"].nodes.input_role_client.checked === true) {
                        dashboard.global.state.udp_socket.toggle_role = "connect";
                    } else {
                        dashboard.global.state.udp_socket.toggle_role = "bind";
                    }
                    if (dashboard.sections["udp-socket"].nodes.input_type_ipv4.checked === true) {
                        dashboard.global.state.udp_socket.toggle_type = "ipv4";
                    } else {
                        dashboard.global.state.udp_socket.toggle_type = "ipv6";
                    }
                }
                lists(dashboard.sections["devices"]);
                lists(dashboard.sections["processes"]);
                lists(dashboard.sections["services-os"]);
                lists(dashboard.sections["sockets-application-tcp"]);
                lists(dashboard.sections["sockets-application-udp"]);
                lists(dashboard.sections["sockets-os-tcp"]);
                lists(dashboard.sections["sockets-os-udp"]);
                lists(dashboard.sections["users"]);
                localStorage.state = JSON.stringify(dashboard.global.state);
            }
        }
    };
    dashboard.utility = utility;
};

export default ui_utility;