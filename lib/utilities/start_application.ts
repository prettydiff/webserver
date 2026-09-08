
import assembler from "./assembler.ts";
import broadcast from "../transmit/broadcast.ts";
import clock from "../services/clock.ts";
import clock_demo from "../services/clock_demo.ts";
import directory from "./directory.ts";
import docker from "../services/docker.ts";
import file from "./file.ts";
import hash from "../core/hash.ts";
import log from "../core/log.ts";
import node from "../core/node.ts";
import os_lists from "./os_lists.ts";
import ports_application from "../services/ports_application.ts";
import save from "./save.ts";
import server_create from "../server/server_create.ts";
import server_start from "../server/server_start.ts";
import spawn from "../core/spawn.ts";
import statistics_resources from "../services/statistics_resources.ts";
import test_index from "../test/index.ts";
import universal from "../core/universal.ts";
import vars from "../core/vars.ts";

// cspell: words serv, stcp, sudp, tskey

const start_application = function utilities_startApplication(process_path:string):void {
    // prerequisite tasks will execute first in the order presented
    const prerequisite_tasks:core_start_tasks = {
            admin: {
                label: "Determines if the application is run with administrative privileges.",
                task: function utilities_startApplication_admin():void {
                    spawn(vars.commands.admin_check, function utilities_startApplication_admin_callback(output:core_spawn_output):void {
                        const std:string = output.stdout.replace(/\s+/g, "");
                        if (std === "0" || std === "true") {
                            vars.os.main.process.admin = true;
                        }
                        start_prerequisites();
                    }, {
                        shell: (process.platform === "win32")
                            ? "powershell"
                            : "sh"
                    }).execute();
                }
            },
            features: {
                label: "Reading the features.json file and remove parts of the application.",
                task: function utilities_startApplication_features():void {
                    const flags:store_string = {
                            feature: null,
                            html: null
                        },
                        ready = function utilities_startApplication_features_ready():void {
                            if (typeof flags.feature === "string" && typeof flags.html === "string") {
                                const feature_list:store_flag = JSON.parse(flags.feature),
                                    section = function utilities_startApplication_features_ready_section(section_name:type_dashboard_features, label:string):void {
                                        if (feature_list[section_name] !== true) {
                                            const end_html:number = flags.html.indexOf(`<!-- ${section_name} end -->`),
                                                start_html:number = flags.html.indexOf(`<!-- ${section_name} start -->`);
                                            if (start_html > 0 && end_html > 0) {
                                                flags.html = flags.html.slice(0, start_html) + flags.html.slice(end_html + section_name.length + 13);
                                            }
                                            flags.html = (section_name === "servers-web")
                                                ? flags.html.replace(`<li><button class="nav-focus" data-section="servers-web">${label}</button></li>`, "")
                                                : flags.html.replace(`<li><button data-section="${section_name}">${label}</button></li>`, "");
                                            vars.environment.features[section_name] = false;
                                        } else {
                                            vars.environment.features[section_name] = true;
                                        }
                                    },
                                    parent = function utilities_startApplication_features_ready_parent():void {
                                        const nav_end:number = flags.html.indexOf("</nav>"),
                                            empty:number = flags.html.slice(nav_start, nav_end).indexOf("<ul></ul>");
                                        let start:number = empty + nav_start,
                                            end:number = empty + nav_start;
                                        if (empty > 0) {
                                            do {
                                                end = end + 1;
                                            } while (flags.html.slice(end - 4, end) !== "div>");
                                            do {
                                                start = start - 1;
                                            } while (flags.html.slice(start, start + 4) !== "<div");
                                            flags.html = flags.html.slice(0, start) + flags.html.slice(end);
                                            utilities_startApplication_features_ready_parent();
                                        } else {
                                            if (vars.environment.features["servers-web"] === false) {
                                                flags.html = flags.html.replace("<button", "<button class=\"nav-focus\"");
                                            }
                                            start_prerequisites();
                                        }
                                        flags.html = flags.html.replace(/<div( class="first")?>\s*<h3>\w+(\s\w+)*<\/h3>\s*<ul>\s*<\/ul>\s*<\/div>/g, "");
                                        flags.html = flags.html.replace(/<h2>Navigation<\/h2>\s*<div>/, "<h2>Navigation</h2> <div class=\"first\">");
                                    },
                                    nav_start:number = flags.html.indexOf("<nav>");
                                section("application-logs", "Application Logs");
                                section("compose-containers", "Docker Compose");
                                section("devices", "Devices");
                                section("disks", "Disks");
                                section("dns-query", "DNS Query");
                                section("file-system", "File System");
                                section("hash", "Hash / Base64");
                                section("interfaces", "Interfaces");
                                section("message-inspection", "Message Inspection");
                                section("notes", "Notes");
                                section("os-machine", "OS/Machine");
                                section("ports-application", "App Ports");
                                section("processes", "Processes");
                                section("servers-web", "Web Servers");
                                section("services-os", "Services");
                                section("sockets-application-tcp", "App TCP Sockets");
                                section("sockets-application-udp", "App UDP Sockets");
                                section("sockets-os-tcp", "OS TCP Sockets");
                                section("sockets-os-udp", "OS UDP Sockets");
                                section("statistics-resources", "Resource Statistics");
                                section("terminal", "Terminal");
                                section("test-http", "HTTP Test");
                                section("test-performance", "Performance Test");
                                section("test-websocket", "WebSocket Test");
                                section("udp-socket", "UDP Socket");
                                section("users", "Users");
                                parent();
                                vars.environment.dashboard_page = flags.html;
                            }
                        },
                        callback_html = function utilities_startApplication_features_callbackHTML(html_file:Buffer):void {
                            flags.html = html_file.toString();
                            ready();
                        },
                        callback_feature = function utilities_startApplication_features_callbackFeature(feature_file:Buffer):void {
                            flags.feature = feature_file.toString();
                            ready();
                        };
                    file.read({
                        callback: callback_html,
                        location: `${process_path}lib${vars.path.sep}dashboard${vars.path.sep}dashboard.html`,
                        no_file: null,
                        section: "startup"
                    });
                    file.read({
                        callback: callback_feature,
                        location: `${process_path}features.json`,
                        no_file: null,
                        section: "startup"
                    });
                }
            },
            os_main: {
                label: "Gathers basic operating system and machine data.",
                task: function utilities_startApplication_taskOSMain():void {
                    const osDelay = function utilities_startApplication_taskOSMain_osDelay():void {
                            os_lists("all", function utilities_startApplication_taskOSMain_osDelay_callback(payload:socket_data):void {
                                broadcast(vars.id.dashboard_server, "dashboard", payload);
                            });
                            osDaily();
                        },
                        osDaily = function utilities_startApplication_taskOSMain_osDaily():void {
                            setTimeout(osDelay, 86399975);
                        },
                        midnight:number = (function utilities_startApplication_taskOSMain_midnight():number {
                            const date:Date = new Date(),
                                hours:number = date.getHours(),
                                minutes:number = date.getMinutes(),
                                seconds:number = date.getSeconds(),
                                mill:number = date.getMilliseconds(),
                                night:number = ((23 - hours) * 3600 * 1000) + ((59 - minutes) * 60 * 1000) + ((59 - seconds) * 1000) + (1000 - mill);
                            vars.environment.timeZone_offset = date.getTimezoneOffset() * 60000;
                            return night - 25;
                        }());
                    os_lists("main", start_prerequisites);
                    setTimeout(osDelay, midnight);
                }
            },
            compose: {
                label: "Restores the docker compose containers if docker is available.",
                task: function utilities_startApplication_compose():void {
                    if (vars.environment.features["compose-containers"] === true) {
                        docker.shell_start();
                        docker.list(start_prerequisites);
                    } else {
                        start_prerequisites();
                    }
                }
            },
            servers: {
                label: "Reads the servers.json file to dynamically standup and populate configured web servers.",
                task: function utilities_startApplication_servers():void {
                    const callback = function utilities_startApplication_servers_callback(fileContents:Buffer):void {
                        const configStr:string = (fileContents === null)
                                ? ""
                                : fileContents.toString(),
                            config:core_state_file = (configStr === "" || (/^\s*\{/).test(configStr) === false || (/\}\s*$/).test(configStr) === false)
                                ? null
                                : JSON.parse(configStr) as core_state_file,
                            includes = function utilities_startApplication_servers_callback_includes(input:string):void {
                                if (vars.environment.interfaces.includes(input) === false && input.toLowerCase().indexOf("fe80") !== 0) {
                                    vars.environment.interfaces.push(input);
                                }
                            },
                            interfaces:{ [index: string]: node_os_NetworkInterfaceInfo[]; } = node.os.networkInterfaces(),
                            keys_int:string[] = Object.keys(interfaces),
                            keys_srv:string[] = (config === null)
                                ? null
                                : Object.keys(config.servers);
                        let index_int:number = keys_int.length,
                            index_srv:number = (config === null)
                                ? 0
                                : keys_srv.length,
                            server:supplemental_server_config = null,
                            sub:number = 0;
                        if (config !== null) {
                            if (typeof config.notes === "string") {
                                vars.data.notes = config.notes;
                            }
                            if (config.id !== undefined) {
                                vars.id = config.id;
                            }
                            // @ts-expect-error - the reference dashboard_id no longer exists and is here for backwards compatibility
                            if (typeof config.dashboard_id === "string") {
                                // @ts-expect-error - the reference dashboard_id no longer exists and is here for backwards compatibility
                                vars.id.dashboard_server = config.dashboard_id;
                            }
                            if (config.stats !== undefined) {
                                vars.stats.frequency = config.stats.frequency;
                                vars.stats.records = config.stats.records;
                            }
                        }
                        if (index_srv > 0) {
                            do {
                                index_srv = index_srv - 1;
                                if (vars.environment.features["servers-web"] === true || config.servers[keys_srv[index_srv]].id === config.id.dashboard_server) {
                                    index_int = keys_int.length;
                                    server = config.servers[keys_srv[index_srv]];
                                    if (server.ports === null || server.ports === undefined) {
                                        server.ports = {
                                            open: 0,
                                            secure: 0
                                        };
                                    } else {
                                        if (typeof server.ports.open !== "number") {
                                            server.ports.open = 0;
                                        }
                                        if (typeof server.ports.secure !== "number") {
                                            server.ports.secure = 0;
                                        }
                                    }
                                    if (server.block_list === undefined || server.block_list === null) {
                                        server.block_list = {
                                            host: [],
                                            ip: [],
                                            referrer: []
                                        };
                                    }
                                    if (Array.isArray(server.domain_local) === false) {
                                        server.domain_local = [];
                                    }
                                    if (server.message_segmentation === undefined || server.message_segmentation === null) {
                                        server.message_segmentation = 1e6;
                                    }
                                    vars.data.server[server.id] = {
                                        certificates_client: {
                                            crt: "",
                                            pfx: ""
                                        },
                                        config: server,
                                        ports: {
                                            open: 0,
                                            secure: 0
                                        },
                                        sockets: []
                                    };
                                    vars.data_store.server[server.id] = {
                                        server_certs: {
                                            ca: "",
                                            cert: "",
                                            key: ""
                                        },
                                        server_object: {
                                            open: null,
                                            secure: null
                                        },
                                        sockets_tcp: {
                                            open: [],
                                            secure: []
                                        }
                                    };
                                }
                            } while (index_srv > 0);
                        }
                        if (index_int > 0) {
                            do {
                                index_int = index_int - 1;
                                sub = interfaces[keys_int[index_int]].length;
                                do {
                                    sub = sub - 1;
                                    includes(interfaces[keys_int[index_int]][sub].address);
                                } while (sub > 0);
                            } while (index_int > 0);
                        }
                        if (typeof vars.id.machine === "string" && vars.id.machine.length > 0) {
                            start_prerequisites();
                        } else {
                            const cpu:os_node_cpu = node.os.cpus();
                            hash({
                                algorithm: "sha3-512",
                                callback: function utilities_startApplication_servers_callback_hash(out:core_hash_output):void {
                                    vars.id.machine = out.hash;
                                    machine_id = true;
                                    start_prerequisites();
                                },
                                digest: "hex",
                                hash_input_type: "direct",
                                section: "startup",
                                source: `${process.hrtime.bigint()} ${process.pid} ${process.ppid} ${cpu[0].model} ${cpu[0].speed} ${process.platform} ${node.os.hostname()}`
                            });
                        }
                    };
                    if (vars.options.demo === true) {
                        callback(null);
                    } else {
                        file.read({
                            callback: callback,
                            location: `${vars.path.project}servers.json`,
                            no_file: null,
                            section: "startup"
                        });
                    }
                }
            }
        },
        tasks:core_start_tasks = {
            certificates: {
                label: "Read all default client certificates for available web servers.",
                task: function utilities_startApplication_certificates():void {
                    node.fs.readdir(`${process_path}servers`, function utility_startApplication_certificates_readdir(err:node_error, dir:string[]):void {
                        if (err === null) {
                            let index:number = dir.length;
                            if (index > 0) {
                                const read_cert = function utility_startApplication_certificates_readdir_readCert(path:string):void {
                                        let count:number = 0;
                                        const callback = function utility_startApplication_certificates_readdir_readCert_callback(file:Buffer, location:string, identifier:string):void {
                                            count = count + 1;
                                            if (file !== null) {
                                                if (identifier === "crt") {
                                                    vars.data.server[dir[index]].certificates_client.crt = file.toString("utf-8");
                                                } else {
                                                    vars.data.server[dir[index]].certificates_client.pfx = file.toString("base64");
                                                }
                                            }
                                            if (count > 1) {
                                                add_cert();
                                            }
                                        };
                                        file.read({
                                            callback: callback,
                                            identifier: "pfx",
                                            location: path,
                                            no_file: null,
                                            section: "startup"
                                        });
                                        file.read({
                                            callback: callback,
                                            identifier: "crt",
                                            location: path.replace(/\.pfx$/, ".crt"),
                                            no_file: null,
                                            section: "startup"
                                        });
                                    },
                                    add_cert = function utility_startApplication_certificates_readdir_addCert():void {
                                        index = index - 1;
                                        if (index > -1) {
                                            if (vars.data.server[dir[index]] === undefined) {
                                                utility_startApplication_certificates_readdir_addCert();
                                            } else {
                                                vars.data.server[dir[index]].certificates_client = {
                                                    crt: null,
                                                    pfx: null
                                                };
                                                node.fs.readdir(`${process_path}servers${vars.path.sep + dir[index] + vars.path.sep}certs`, function utility_startApplication_certificates_readdir_addCert_files(erf:node_error, certs:string[]):void {
                                                    if (erf === null) {
                                                        let index_certs:number = certs.length,
                                                            test:boolean = false;
                                                        if (index_certs > 0) {
                                                            do {
                                                                index_certs = index_certs - 1;
                                                                if (certs[index_certs].slice(certs[index_certs].length - 4) === ".pfx") {
                                                                    read_cert(`${process_path}servers${vars.path.sep + dir[index] + vars.path.sep}certs${vars.path.sep + certs[index_certs]}`);
                                                                    test = true;
                                                                    break;
                                                                }
                                                            } while (index_certs > 0);
                                                            if (test === false) {
                                                                utility_startApplication_certificates_readdir_addCert(); 
                                                            }
                                                        } else {
                                                            utility_startApplication_certificates_readdir_addCert();
                                                        }
                                                    } else {
                                                        utility_startApplication_certificates_readdir_addCert();
                                                    }
                                                });
                                            }
                                        } else {
                                            complete_tasks("certificates");
                                        }
                                    };
                                add_cert();
                            } else {
                                complete_tasks("certificates");
                            }
                        } else {
                            complete_tasks("certificates");
                        }
                    });
                }
            },
            cgroup: {
                label: "Find Linux cgroup address for gathering precision docker performance metrics.",
                task: function utilities_startApplication_cgroup():void {
                    if (vars.options.demo === false && vars.environment.features["compose-containers"] === true && vars.environment.compose_status === "" && (vars.os.main.process.admin === true || process.platform === "win32")) {
                        const command:string = (process.platform === "win32")
                                ? vars.commands.docker_read.replace("cat address", "systemctl status containerd")
                                : "systemctl status containerd",
                            shell:string = (process.platform === "win32" && vars.environment.terminal[0].includes("pwsh") === true)
                                ? vars.environment.terminal[0]
                                : null;
                        // first determine if system_d is used
                        spawn(command, function utilities_startApplication_cgroup_systemD(out:core_spawn_output):void {
                            const addresses:string[] = [
                                    "/sys/fs/cgroup/system.slice/",
                                    "/sys/fs/cgroup/memory/system.slice/",
                                    "/sys/fs/cgroup/docker/",
                                    "/sys/fs/cgroup/memory/docker/"
                                ],
                                no_file = function utilities_startApplication_cgroup_noFile():void {
                                    index = index + 1;
                                    if (index < 2) {
                                        if (process.platform === "win32") {
                                            spawn(vars.commands.docker_read.replace("address", addresses[index]).replace("cat", "ls"), windows_callback, {shell: shell}).execute();
                                        } else {
                                            file.stat({
                                                callback: stat_callback,
                                                location: addresses[index],
                                                no_file: utilities_startApplication_cgroup_noFile,
                                                section: "startup"
                                            });
                                        }
                                    } else {
                                        vars.path.cgroup = null;
                                        complete_tasks("cgroup");
                                    }
                                },
                                windows_callback = function utilities_startApplication_cgroup_windowsCallback(out_windows:core_spawn_output):void {
                                    if (out_windows.stderr.length > 0) {
                                        no_file();
                                    } else {
                                        vars.path.cgroup = addresses[index];
                                        complete_tasks("cgroup");
                                    }
                                },
                                stat_callback = function utilities_startApplication_cgroup_statCallback(stats:node_fs_BigIntStats, location:string):void {
                                    vars.path.cgroup = location;
                                    complete_tasks("cgroup");
                                };
                            let index:number = -1;
                            // if output is a string then system_d reported a status for containerd, so docker is a system_d service
                            if (out.stdout.length > 0) {
                                addresses.splice(2, 2);
                            } else {
                                addresses.splice(0, 2);
                            }
                            if (process.platform === "win32" && shell === null) {
                                vars.path.cgroup = null;
                                complete_tasks("cgroup");
                            } else {
                                no_file();
                            }
                        }, {
                            shell: shell
                        }).execute();
                    } else {
                        vars.path.cgroup = null;
                        complete_tasks("cgroup");
                    }
                }
            },
            compose_variables: {
                label: "Gathering stored docker compose variables.",
                task: function utilities_startApplication_composeVariables():void {
                    if (vars.options.demo === true) {
                        vars.data.compose_variables = {
                            APP_DISK: "/path_to_apps",
                            DATA_DISK: "/path_to_disk",
                            PASSWORD: "1234",
                            TAILSCALE_KEY: "tskey-auth-asdf-1234",
                            TAILSCALE_OAUTH_CLIENT: "asdf_1234",
                            TAILSCALE_OAUTH_SECRET: "tskey-client-asdf-1234",
                            TZ: "America/Chicago"
                        };
                        complete_tasks("compose_variables");
                    } else {
                        file.read({
                            callback: function utilities_startApplication_composeVariables_read(raw:Buffer):void {
                                if (raw !== null) {
                                    const lines:string[] = raw.toString().split("\n"),
                                        store:[string, string][] = [],
                                        len:number = lines.length;
                                    let index:number = len,
                                        store_len:number = 0;
                                    do {
                                        index = index - 1;
                                        if ((/^\s*$/).test(lines[index]) === false) {
                                            lines[index] = lines[index].replace(/\s*=\s*/, "=");
                                            store.push([lines[index].slice(0, lines[index].indexOf("=")), lines[index].slice(lines[index].indexOf("=") + 1)]);
                                        }
                                    } while (index > 0);
                                    store.sort(function utilities_startApplication_composeVariables_read_sort(a:[string, string], b:[string, string]):-1|1 {
                                        if (a[0] < b[0]) {
                                            return -1;
                                        }
                                        return 1;
                                    });
                                    index = 0;
                                    store_len = store.length;
                                    if (store_len > 0) {
                                        do {
                                            vars.data.compose_variables[store[index][0]] = store[index][1];
                                            index = index + 1;
                                        } while (index < store_len);
                                    }
                                }
                                complete_tasks("compose_variables");
                            },
                            location: `${process_path}compose${vars.path.sep}.env`,
                            no_file: null,
                            section: "startup"
                        });
                    }
                }
            },
            file: {
                label: "Unix 'file' command discovered.",
                task: function utilities_startApplication_file():void {
                    if (vars.environment.features["file-system"] === true) {
                        if (process.platform === "win32") {
                            vars.commands.file = `${vars.path.process}node_modules${vars.path.sep}file${vars.path.sep}bin${vars.path.sep}file.exe -bi `;
                            complete_tasks("file");
                            return;
                        }
                        spawn("file --help", function utilities_startApplication_file_spawn(output:core_spawn_output):void {
                            if (output.stdout.indexOf("Usage: file [OPTION...] [FILE...]") === 0) {
                                vars.commands.file = "file -bi ";
                            }
                            complete_tasks("file");
                        }).execute();
                    } else {
                        complete_tasks("file");
                    }
                }
            },
            git: {
                label: "Get the latest update time and hash.",
                task: function utilities_startApplication_tasksGit():void {
                    const gitStat = function utilities_startApplication_tasksGit_gitStat(error:node_error, stat:node_fs_Stats):void {
                        if (error === null && stat !== null) {
                            const spawn_item:core_module_spawn = spawn("git show -s --format=%H,%ct HEAD", function utilities_startApplication_tasksGit_gitStat_close(output:core_spawn_output):void {
                                const str:string[] = output.stdout.split(",");
                                vars.environment.date_commit = Number(str[1]) * 1000;
                                vars.environment.git_hash = str[0];
                                spawn_item.spawn.kill();
                                complete_tasks("git");
                            }, {
                                cwd: process_path.slice(0, process_path.length - 1)
                            });
                            spawn_item.execute();
                        } else {
                            complete_tasks("git");
                        }
                    };
                    node.fs.stat(`${process_path}.git`, gitStat);
                }
            },
            html: {
                label: "Read's the dashboard's HTML file for dynamic modification.",
                task: function utilities_startApplication_taskHTML():void {
                    assembler(process_path, function utilities_startApplication_taskHTML_assembler():void {
                        complete_tasks("html");
                    });
                }
            },
            os_devs: {
                label: "Gathers a list of devices registered with the OS kernel.",
                task: function utilities_startApplication_taskOSDevs():void {
                    if (vars.environment.features["devices"] === true) {
                        const callback = function utilities_startApplication_taskOSDevs_callback():void {
                                complete_tasks("os_devs");
                            };
                        os_lists("devs", callback);
                    } else {
                        complete_tasks("os_devs");
                    }
                }
            },
            os_disk: {
                label: "Gathers information about disk hardware and partitions.",
                task: function utilities_startApplication_taskOSDisk():void {
                    if (vars.environment.features["disks"] === true) {
                        const callback = function utilities_startApplication_taskOSDisk_callback():void {
                                complete_tasks("os_disk");
                            };
                        os_lists("disk", callback);
                    } else {
                        complete_tasks("os_disk");
                    }
                }
            },
            os_intr: {
                label: "Gathers information about the state of available network interfaces.",
                task: function utilities_startApplication_taskOSIntr():void {
                    if (vars.environment.features["interfaces"] === true) {
                        const callback = function utilities_startApplication_taskOSIntr_callback():void {
                            complete_tasks("os_intr");
                        };
                        os_lists("intr", callback);
                    } else {
                        complete_tasks("os_intr");
                    }
                }
            },
            os_proc: {
                label: "Gathers a list of running processes.",
                task: (process.platform === "win32")
                    ? function utilities_startApplication_taskOSProcWindows():void {
                        complete_tasks("os_proc");
                    }
                    : function utilities_startApplication_taskOSProc():void {
                        if (vars.environment.features["processes"] === true) {
                            const callback = function utilities_startApplication_taskOSProc_callback():void {
                                complete_tasks("os_proc");
                            };
                            os_lists("proc", callback);
                        } else {
                            complete_tasks("os_proc");
                        }
                    }
            },
            os_serv: {
                label: "Gathers a list of known services.",
                task: function utilities_startApplication_taskOSServ():void {
                    if (vars.environment.features["services-os"] === true) {
                        const callback = function utilities_startApplication_taskOSServ_callback():void {
                            complete_tasks("os_serv");
                        };
                        os_lists("serv", callback);
                    } else {
                        complete_tasks("os_serv");
                    }
                }
            },
            os_stcp: {
                label: "Gathers a list of known network TCP sockets.",
                task: function utilities_startApplication_taskOSSock():void {
                    if (vars.environment.features["sockets-os-tcp"] === true) {
                        const callback = function utilities_startApplication_taskOSSock_callback():void {
                            complete_tasks("os_stcp");
                        };
                        os_lists("stcp", callback);
                    } else {
                        complete_tasks("os_stcp");
                    }
                }
            },
            os_sudp: {
                label: "Gathers a list of known network UDP sockets.",
                task: function utilities_startApplication_taskOSSock():void {
                    if (vars.environment.features["sockets-os-udp"] === true) {
                        const callback = function utilities_startApplication_taskOSSock_callback():void {
                            complete_tasks("os_sudp");
                        };
                        os_lists("sudp", callback);
                    } else {
                        complete_tasks("os_sudp");
                    }
                }
            },
            os_user: {
                label: "Gathers a list of user accounts.",
                task: function utilities_startApplication_taskOSUser():void {
                    if (vars.environment.features["users"] === true) {
                        const callback = function utilities_startApplication_taskOSUser_callback():void {
                            complete_tasks("os_user");
                        };
                        os_lists("user", callback);
                    } else {
                        complete_tasks("os_user");
                    }
                }
            },
            server_audit: {
                label: "Server audit removes directories of server artifacts no longer in the server inventory.",
                task: function utilities_startApplication_serverAudit():void {
                    node.fs.readdir(vars.path.servers, function utilities_startApplication_serverAudit_dirs(erd:node_error, dirs:string[]):void {
                        if (erd === null) {
                            const removed = function utilities_startApplication_serverAudit_dirs_removed():void {
                                count = count - 1;
                                if (count < 1) {
                                    complete_tasks("server_audit");
                                }
                            };
                            let index:number = dirs.length,
                                count:number = 1;
                            do {
                                index = index - 1;
                                if (vars.data.server[dirs[index]] === undefined) {
                                    count = count + 1;
                                    file.remove({
                                        callback: removed,
                                        exclusions: [],
                                        location: vars.path.servers + dirs[index],
                                        section: "startup"
                                    });
                                }
                            } while (index > 0);
                            removed();
                        } else {
                            complete_tasks("server_audit");
                        }
                    });
                }
            },
            services_app: {
                label: "Provides the application's service list to the dashboard UI.",
                task: function utilities_startApplication_servicesApp():void {
                    const callback_directory = function utilities_startApplication_servicesApp_callbackDirectory(dir:core_directory_list):void {
                        const len:number = dir.length,
                            code:store_string = {},
                            definitions:core_services_internal_dependency = {},
                            keys_code:string[] = [],
                            // reads a file
                            read = function utilities_startApplication_servicesApp_callbackDirectory_read(file:Buffer, location:string):void {
                                count = count - 1;

                                // type definition files
                                if ((/\.d\.ts$/).test(location) === true) {
                                    // service_registry.d.ts
                                    if (location === `${process_path}lib${vars.path.sep}typescript${vars.path.sep}service_registry.d.ts`) {
                                        const services:string[] = file.toString().replace(/^\s+/, "").replace(/\s+$/, "").split("\n\n"),
                                            service_add = function utilities_startApplication_serviceApp_callbackDirectory_read_serviceAdd(strings:string[]):void {
                                                const name:string = strings[0].replace(/\s*interface\s+/, "").replace(/\s+\{\s*$/, "");
                                                service = {
                                                    code: strings.slice(0, strings.length - 1).join("\n"),
                                                    dependencies: {},
                                                    description: strings[strings.length - 1].replace(/^\s*\/\/\s*/, ""),
                                                    files: [],
                                                    name: name
                                                };
                                                vars.environment.services_app.push(service);
                                                definitions[name] = [services[index], location.replace(process_path, vars.path.sep)];
                                            },
                                            len:number = services.length - 1;
                                        let index:number = 0,
                                            strings:string[] = null,
                                            service:core_service_internal = null;
                                        do {
                                            strings = services[index].split("\n");
                                            if ((/^\s*\/(\*|\/)\s*cspell/).test(strings[0]) === true) {
                                                if (strings.length > 1) {
                                                    strings.splice(0, 1);
                                                    service_add(strings);
                                                }
                                            } else {
                                                service_add(strings);
                                            }
                                            index = index + 1;
                                        } while (index < len);
                                    // types.d.ts
                                    } else if (location === `${process_path}lib${vars.path.sep}typescript${vars.path.sep}node.d.ts` || location === `${process_path}lib${vars.path.sep}typescript${vars.path.sep}types.d.ts`) {
                                        const raw:string = file.toString(),
                                            list:string[] = raw.slice(raw.indexOf("type")).replace(/^\s+/, "").replace(/\s+$/, "").replace(/\n\n/g, "\n").split("\n");
                                        let index_def:number = list.length,
                                            values:string[] = null;
                                        do {
                                            index_def = index_def - 1;
                                            if (list[index_def].replace(/^\s*/, "").indexOf("type ") === 0) {
                                                values = list[index_def].replace(/^\s*/, "").replace(/\s*=\s*/, "=").split("=");
                                                definitions[values[0].slice(5)] = [`${values[0]} = ${values[1]}`, location.replace(process_path, vars.path.sep)];
                                            }
                                        } while (index_def > 0);
                                    // all other definitions
                                    } else {
                                        const list:string[] = file.toString().replace(/^\s+/, "").replace(/\s+$/, "").split("\n\n");
                                        let index_def:number = list.length,
                                            name:string = "";
                                        do {
                                            index_def = index_def - 1;
                                            // un-indent
                                            if (list[index_def].indexOf("    ") === 0) {
                                                do {
                                                    list[index_def] = list[index_def].replace("    ", "").replace(/\n {4}/g, "\n");
                                                } while (list[index_def].indexOf("    ") === 0);
                                            }
                                            name = list[index_def].split("\n")[0].replace(/\s*interface\s+/, "");
                                            name = name.replace(/\s*\{\s*/, "");
                                            if (name.includes(" ") === true) {
                                                name = name.slice(0, name.indexOf(" "));
                                            }
                                            definitions[name] = [list[index_def], location.replace(process_path, vars.path.sep)];
                                        } while (index_def > 0);
                                    }
                                }
                                code[location] = file.toString();
                                keys_code.push(location);
                                if (count === 0) {
                                    const len_code:number = keys_code.length,
                                        dependency = function utilities_startApplication_servicesApp_callbackDirectory_dependency(sample:[string, string], dep:core_services_internal_dependency):void {
                                            const lines:string[] = sample[0].split("\n");
                                            let index_lines:number = lines.length,
                                                index_names:number = 0,
                                                name:string = "",
                                                names:string[] = null;
                                            do {
                                                index_lines = index_lines - 1;
                                                if ((/^interface\s/).test(lines[index_lines]) === false) {
                                                    name = ((/^type\s/).test(lines[index_lines]) === true)
                                                        ? lines[index_lines].slice(lines[index_lines].indexOf("=") + 1).replace(/^\s+/, "").replace(/\s*;\s*$/, "")
                                                        : lines[index_lines].slice(lines[index_lines].lastIndexOf(":") + 1).replace(/^\s+/, "").replace(/\s*;\s*$/, "");
                                                    if (name.includes("|") === true) {
                                                        names = name.split("|");
                                                    } else {
                                                        names = [name];
                                                    }
                                                    index_names = names.length;
                                                    do {
                                                        index_names = index_names - 1;
                                                        if (names[index_names].includes("_") === true) {
                                                            name = names[index_names].replace(/\s+/g, "");
                                                            if (name.includes("<") === true) {
                                                                name = name.slice(0, name.indexOf("<"));
                                                            }
                                                            if (name.includes("[") === true) {
                                                                name = name.slice(0, name.indexOf("["));
                                                            }
                                                            if (dep[name] === undefined) {
                                                                dep[name] = definitions[name];
                                                                if (definitions[name] !== undefined) {
                                                                    dependency(definitions[name], dep);
                                                                }
                                                            }
                                                        }
                                                    } while (index_names > 0);
                                                }
                                            } while (index_lines > 0);
                                        };
                                    let index_service:number = vars.environment.services_app.length,
                                        index_code:number = 0,
                                        reg_colon:RegExp = null,
                                        reg_as:RegExp = null;
                                    do {
                                        index_service = index_service - 1;
                                        index_code = len_code;
                                        // find files referencing this service by name
                                        do {
                                            index_code = index_code - 1;
                                            reg_colon = new RegExp(`:\\s*${vars.environment.services_app[index_service].name}`);
                                            reg_as = new RegExp(`as\\s+${vars.environment.services_app[index_service].name}`);
                                            if (reg_colon.test(code[keys_code[index_code]]) === true || reg_as.test(code[keys_code[index_code]]) === true || code[keys_code[index_code]].includes(`"${vars.environment.services_app[index_service].name}"`) === true) {
                                                vars.environment.services_app[index_service].files.push(keys_code[index_code].replace(process_path, vars.path.sep));
                                            }
                                        } while (index_code > 0);

                                        // find all type dependencies
                                        dependency([vars.environment.services_app[index_service].code, ""], vars.environment.services_app[index_service].dependencies);
                                    } while (index_service > 0);
                                    complete_tasks("services_app");
                                }
                            };
                        let index_dir:number = len,
                            count:number = len;
                        do {
                            index_dir = index_dir - 1;
                            if (dir[index_dir][1] === "file" && (/\.ts$/).test(dir[index_dir][0]) === true) {
                                file.read({
                                    callback: read,
                                    location: dir[index_dir][0],
                                    no_file: null,
                                    section: "startup"
                                });
                            } else {
                                count = count - 1;
                            }
                        } while (index_dir > 0);
                    };
                    if (vars.environment.features["services-app"] === true) {
                        directory({
                            callback: callback_directory,
                            depth: 0,
                            directory_size: false,
                            exclusions: [],
                            parent: false,
                            path: `${process_path}lib`,
                            relative: false,
                            search: null,
                            symbolic: false
                        });
                    } else {
                        complete_tasks("services_app");
                    }
                }
            },
            test_browser: {
                label: "Finds a designed web browser for test automation if supplied as a terminal argument.",
                task: function utilities_startApplication_taskTestBrowser():void {
                    test_stat("test_browser");
                }
            },
            test_list: {
                label: "Runs test automation only against a specified list.",
                task: function utilities_startApplication_taskTestList():void {
                    test_stat("test_list");
                }
            },
            version: {
                label: "Get application version number from package.json file.",
                task: function utilities_startApplication_version():void {
                    file.read({
                        callback: function utilities_startApplication_version_callback(file_contents:Buffer):void {
                            vars.environment.version = JSON.parse(file_contents.toString()).version;
                            complete_tasks("version");
                        },
                        location: `${process_path}package.json`,
                        no_file: null,
                        section: "startup"
                    });
                }
            }
        },
        test_stat = function utilities_startApplication_testStat(property:"test_browser"|"test_list"):void {
            if (vars.test.testing === true) {
                const get_value = function utilities_startApplication_testStat_getValue():void {
                    const arg:"browser"|"list" = property.replace("test_", "") as "browser"|"list",
                        address:string = (function utilities_startApplication_testStat_getValue_address():string {
                            let start_address:string = (vars.options[arg] === null)
                                ? ""
                                : vars.options[arg];
                            const address_length:number = start_address.length;
                            if (vars.options[arg] === null || vars.options[arg] === undefined) {
                                return "";
                            }
                            if ((start_address.charAt(0) === "\"" && start_address.charAt(address_length - 1) === "\"") || (start_address.charAt(0) === "'" && start_address.charAt(address_length - 1) === "'")) {
                                start_address = `"${start_address.slice(1, address_length - 1)}"`;
                                if (process.platform === "win32") {
                                    start_address = start_address.replace(/\\/g, "\"\\\"").replace("\"\\", "\\");
                                }
                            }
                            if (property === "test_list") {
                                return `${process_path}lib${vars.path.sep}test${vars.path.sep + start_address.replace(/^\.?(\/|\\)/, "")}`;
                            }
                            return start_address;
                        }()),
                        stat_browser = function utilities_startApplication_testStat_stat(err:node_error, details:node_fs_Stats):void {
                            if (err === null && details !== null && details !== undefined) {
                                if (arg === "browser" && vars.test.browser_args.length > 0) {
                                    tasks.test_browser.label = `Testing file found for ${arg}: ${vars.text.green + address.replace(/\\\\/g, "\\")} ${vars.test.browser_args.join(" ")} ${vars.text.none}`;
                                } else {
                                    tasks[property].label = `Testing file found for ${arg}: ${vars.text.green + address.replace(/\\\\/g, "\\") + vars.text.none}`;
                                }
                            } else {
                                tasks[property].label = `Testing file ${vars.text.angry}not${vars.text.none} found for: ${vars.text.red + address.replace(/\\\\/g, "\\") + vars.text.none}`;
                            }
                            if (property === "test_browser") {
                                vars.test.test_browser = address;
                                complete_tasks("test_browser");
                            } else if (property === "test_list") {
                                import(`file://${address.replace(/\\/g, "/")}`).then(function utilities_startApplication_testStat_getValue_list(mod:object):void {
                                    // @ts-expect-error - the Module type definition is not aware of the children exported upon a given module object.
                                    vars.test.list = mod.default;
                                    complete_tasks(property);
                                });
                            }
                        };
                    if (address === "") {
                        complete_tasks(property);
                        return;
                    }
                    node.fs.stat(address, stat_browser);
                };
                tasks.test_browser.label = "No option supplied beginning with 'browser:'";
                tasks.test_list.label = "No option supplied beginning with 'list:'";
                get_value();
            } else {
                tasks[property].label = "Ignored unless executing tests.";
                complete_tasks(property);
            }
        },
        log_task = function utilities_startApplication_logTask(list:"prerequisite"|"task", flag:type_start_pre_tasks | type_start_primary_tasks):void {
            const label:string = (list === "task")
                ? tasks[flag].label
                : prerequisite_tasks[flag].label;
            log.shell([`${asterisk} ${vars.text.cyan}[${process.hrtime.bigint().time_elapsed(vars.environment.start_time)}]${vars.text.none} ${vars.text.green + flag + vars.text.none} - ${label}`]);
        },
        complete_tasks = function utilities_startApplication_completeTasks(flag:type_start_primary_tasks):void {
            log_task("task", flag);
            // to troubleshoot which tasks do not run, in test mode servers task is not executed
            // delete task_definitions[flag];console.log(Object.keys(task_definitions));
            count_task = count_task + 1;
            if (count_task === len_tasks) {
                // sends a server time update every 950ms
                const ready = function utilities_startApplication_completeTasks_ready():void {
                    const default_server:supplemental_server_config = {
                        activate: true,
                        certificate_path: {
                            ca: "",
                            cert: "",
                            key: ""
                        },
                        domain_local: [
                            "localhost",
                            "127.0.0.1",
                            "::1"
                        ],
                        encryption: (vars.options.demo === true)
                            ? "open"
                            : "both",
                        id: "",
                        message_segmentation: 1e6,
                        mutual_tls: false,
                        name: "dashboard",
                        ports: {
                            open: vars.options["port-open"],
                            secure: vars.options["port-secure"]
                        },
                        redirect_asset: {
                            "localhost": {
                                "/lib/assets/*": "/lib/dashboard/*"
                            }
                        },
                        single_socket: false,
                        temporary: false,
                        upgrade: false
                    },
                    start = function utilities_startApplication_completeTasks_ready_start():void {
                        const servers:string[] = Object.keys(vars.data.server),
                            total:number = (vars.test.testing === true)
                                ? 1
                                : servers.length,
                            callback = function utilities_startApplication_completeTasks_ready_start_serverCallback():void {
                                count = count + 1;
                                if (count === total) {
                                    const time:number = Number(process.hrtime.bigint() - vars.environment.start_time),
                                        bun:string = process.versions.bun,
                                        versions:string = (bun === undefined)
                                            ? `${asterisk} Application executed from ${vars.text.green}Node.js${vars.text.none} at version ${vars.text.cyan + process.versions.node + vars.text.none}.`
                                            : `${asterisk} Application executed from ${vars.text.green}bun${vars.text.none} at Node.js API version ${vars.text.cyan + process.versions.node + vars.text.none} and bun version ${vars.text.cyan + bun + vars.text.none}.`,
                                        demo:string = (vars.options.demo === true)
                                            ? `${vars.text.angry}demo${vars.text.none}`
                                            : `${vars.text.green}service${vars.text.none}`,
                                        logs:string[] = [
                                            "",
                                            heading("Startup Complete"),
                                            versions,
                                            `${asterisk} Application completed ${vars.text.cyan + count_task + vars.text.none} startup tasks in ${vars.text.cyan + (time / 1e9) + vars.text.none} seconds.`,
                                            `${asterisk} Application is running in ${demo} mode.`,
                                            `${asterisk} Process ID: ${vars.text.cyan + process.pid + vars.text.none}`,
                                            "",
                                            heading("Web Server Ports"),
                                        ],
                                        pad = function utilities_startApplication_completeTasks_ready_start_serverCallback_pad(str:string, num:number, dir:"left"|"right"):string {
                                            let item:number = longest[num] - str.length;
                                            if (item > 0) {
                                                do {
                                                    if (dir === "left") {
                                                        str = ` ${str}`;
                                                    } else {
                                                        str = `${str} `;
                                                    }
                                                    item = item - 1;
                                                } while (item > 0);
                                            }
                                            return str;
                                        },
                                        logItem = function utilities_startApplication_completeTasks_ready_start_serverCallback_logItem(name:string, encryption:"open"|"secure"|"tcp"|"udp", value:string):void {
                                            const conflict:boolean = (value.indexOf(vars.text.angry) === 0),
                                                str:string = `${asterisk} ${pad(name, 0, "right")} - ${pad(encryption, 1, "right")} - ${value}`;
                                            if (conflict === true) {
                                                if (Number(value.replace(vars.text.none, "").replace(vars.text.angry, "")) < 1025) {
                                                    logs.push(`${str} (Server offline, typically due to insufficient access for reserved port or port conflict.)`);
                                                } else {
                                                    logs.push(`${str} (Server offline, typically due to port conflict.)`);
                                                }
                                            } else {
                                                logs.push(str);
                                            }
                                        };
                                    let index:number = 0,
                                        name:string = "",
                                        ports:type_docker_ports = null,
                                        longest:number[] = [0, 0, 0],
                                        len:number = servers.length;
                                    servers.sort(function utilities_startApplication_completeTasks_read_start_serverCallback_serverSort(a:string, b:string):-1|1 {
                                        if (a > b) {
                                            return -1;
                                        }
                                        return 1;
                                    });
                                    // get string column width
                                    do {
                                        name = vars.data.server[servers[index]].config.name;
                                        if (name.length > longest[0]) {
                                            longest[0] = name.length;
                                        }
                                        if (vars.data.server[servers[index]].config.encryption === "both") {
                                            if (vars.data.server[servers[index]].ports["secure"].toString().length > longest[2]) {
                                                longest[2] = vars.data.server[servers[index]].ports["secure"].toString().length;
                                            }
                                            if (vars.data.server[servers[index]].ports["open"].toString().length > longest[2]) {
                                                longest[3] = vars.data.server[servers[index]].ports["secure"].toString().length;
                                            }
                                            longest[1] = 6;
                                        } else if (vars.data.server[servers[index]].config.encryption === "secure") {
                                            if (vars.data.server[servers[index]].ports["secure"].toString().length > longest[2]) {
                                                longest[2] = vars.data.server[servers[index]].ports["secure"].toString().length;
                                            }
                                            longest[1] = 6;
                                        } else {
                                            if (vars.data.server[servers[index]].ports["open"].toString().length > longest[2]) {
                                                longest[2] = vars.data.server[servers[index]].ports["secure"].toString().length;
                                            }
                                        }
                                        index = index + 1;
                                    } while (index < servers.length);
                                    if (vars.environment.features["ports-application"] === true) {
                                        ports_application();
                                    }
                                    if (vars.test.testing === true) {
                                        test_index();
                                    } else {
                                        const keys:string[] = Object.keys(vars.data.containers),
                                            sort = function utilities_startApplication_completeTasks_ready_start_serverCallback_sort(a:[number, "tcp"|"udp"], b:[number, "tcp"|"udp"]):-1|1 {
                                                if (a[0] < b[0] || (a[0] === b[0] && a[1] < b[1])) {
                                                    return -1;
                                                }
                                                return 1;
                                            };
                                        // from servers
                                        index = 0;
                                        // server[servers[index]].config.ports = user assigned port value
                                        // server[servers[index]].ports = actual system port in use
                                        do {
                                            if (vars.data.server[servers[index]].ports !== undefined) {
                                                if (vars.data.server[servers[index]].config.encryption === "both") {
                                                    logItem(vars.data.server[servers[index]].config.name, "open", (vars.data.server[servers[index]].ports.open === 0)
                                                        ? vars.text.angry + vars.data.server[servers[index]].config.ports.open + vars.text.none
                                                        : vars.text.green + vars.data.server[servers[index]].ports.open + vars.text.none
                                                    );
                                                    logItem(vars.data.server[servers[index]].config.name, "secure", (vars.data.server[servers[index]].ports.secure === 0)
                                                        ? vars.text.angry + vars.data.server[servers[index]].config.ports.secure + vars.text.none
                                                        : vars.text.green + vars.data.server[servers[index]].ports.secure + vars.text.none
                                                    );
                                                } else if (vars.data.server[servers[index]].config.encryption === "open") {
                                                    logItem(vars.data.server[servers[index]].config.name, "open", (vars.data.server[servers[index]].ports.open === 0)
                                                        ? vars.text.angry + vars.data.server[servers[index]].config.ports.open + vars.text.none
                                                        : vars.text.green + vars.data.server[servers[index]].ports.open + vars.text.none
                                                    );
                                                } else if (vars.data.server[servers[index]].config.encryption === "secure") {
                                                    logItem(vars.data.server[servers[index]].config.name, "secure", (vars.data.server[servers[index]].ports.secure === 0)
                                                        ? vars.text.angry + vars.data.server[servers[index]].config.ports.secure + vars.text.none
                                                        : vars.text.green + vars.data.server[servers[index]].ports.secure + vars.text.none
                                                    );
                                                }
                                            }
                                            index = index + 1;
                                        } while (index < len);

                                        // from containers
                                        len = keys.length;
                                        if (len > 0) {
                                            let index_ports:number = 0,
                                                len_ports:number = 0,
                                                title:boolean = false;
                                            index = 0;
                                            longest = [0, 3, 0];
                                            keys.sort();
                                            do {
                                                if (vars.data.containers[keys[index]].name.length > longest[0]) {
                                                    longest[0] = vars.data.containers[keys[index]].name.length;
                                                }
                                                index = index + 1;
                                            } while (index < len);
                                            index = 0;
                                            do {
                                                ports = vars.data.containers[keys[index]].ports;
                                                len_ports = (ports === null)
                                                    ? 0
                                                    : ports.length;
                                                if (len_ports > 0) {
                                                    if (title === false) {
                                                        logs.push("");
                                                        logs.push(heading("Container Ports"));
                                                        title = true;
                                                    }
                                                    longest[2] = 0;
                                                    ports.sort(sort);
                                                    index_ports = 0;
                                                    do {
                                                        if (ports[index_ports][0].toString().length > longest[2]) {
                                                            longest[2] = ports[index_ports][0].toString().length;
                                                        }
                                                        index_ports = index_ports + 1;
                                                    } while (index_ports < len_ports);
                                                    index_ports = 0;
                                                    do {
                                                        logItem(vars.data.containers[keys[index]].name, ports[index_ports][1], vars.text.green + pad(ports[index_ports][0].toString(), 2, "left") + vars.text.none);
                                                        index_ports = index_ports + 1;
                                                    } while (index_ports < len_ports);
                                                }
                                                index = index + 1;
                                            } while (index < len);
                                        }
                                        log.shell(logs, true);

                                        if (vars.options.demo === true) {
                                            process.stderr.write(vars.data.server[vars.id.dashboard_server].ports.open.toString());
                                        }
                                        vars.environment.loading = false;
                                    }
                                }
                            };
                        let count:number = 0,
                            index:number = 0;

                        if (vars.test.testing === true) {
                            server_start(vars.data.server[vars.id.dashboard_server].config.id, callback);
                        } else {
                            do {
                                server_start(vars.data.server[servers[index]].config.id, callback);
                                index = index + 1;
                            } while (index < total);
                        }

                    };
                    clock();
                    if (vars.options.demo === true) {
                        clock_demo();
                    }
                    statistics_resources.data();
                    if (vars.test.testing === true || vars.data.server[vars.id.dashboard_server] === undefined) {
                        server_create({
                            action: "add",
                            server: default_server
                        }, start, true);
                    } else {
                        start();
                    }
                };
                if (machine_id === true) {
                    save(ready, "startup");
                } else {
                    ready();
                }
            }
        },
        start_tasks = function utilities_startApplication_startTasks():void {
            do {
                index_tasks = index_tasks - 1;
                if (vars.test.testing === false || (keys_tasks[index_tasks] !== "servers" && vars.test.testing === true)) {
                    tasks[keys_tasks[index_tasks]].task();
                }
            } while (index_tasks > 0);
        },
        start_prerequisites = function utilities_startApplication_startPrerequisites():void {
            if (keys_prerequisites[index_prerequisites] === undefined) {
                start_tasks();
            } else {
                index_prerequisites = index_prerequisites + 1;
                log_task("prerequisite", keys_prerequisites[index_prerequisites - 1]);
                prerequisite_tasks[keys_prerequisites[index_prerequisites - 1]].task();
            }
        },
        heading = function utilities_startApplication_heading(message:string):string {
            return vars.text.underline + message + vars.text.none;
        },
        asterisk:string = `${vars.text.angry}*${vars.text.none}`,
        keys_tasks:type_start_primary_tasks[] = Object.keys(tasks) as type_start_primary_tasks[],
        keys_prerequisites:type_start_pre_tasks[] = Object.keys(prerequisite_tasks) as type_start_pre_tasks[],
        len_tasks:number = (vars.test.testing === true)
            ? keys_tasks.length - 1 // servers task is not run in test mode
            : keys_tasks.length;
    let index_tasks:number = keys_tasks.length,
        index_prerequisites:number = 0,
        count_task:number = 0,
        machine_id:boolean = false;

    BigInt.prototype.time_elapsed = universal.time_elapsed;
    Number.prototype.commas = universal.commas;
    Number.prototype.dateTime = universal.dateTime;
    Number.prototype.time_elapsed = universal.time_elapsed;
    String.prototype.bytes = universal.bytes;
    String.prototype.bytes_big = universal.bytes_big;
    String.prototype.capitalize = universal.capitalize;
    String.prototype.file_sanitize = universal.file_sanitize;

    vars.environment.hashes = node.crypto.getHashes();

    log.shell(["", heading("Executing start up tasks")]);

    // update OS list of available shells
    if (vars.environment.features["terminal"] === true) {
        if (process.platform === "win32") {
            const stats = function utilities_startApplication_tasksShell_shellWin(index:number):void {
                node.fs.stat(vars.environment.terminal[index], function utilities_startApplication_tasksShell_shellWin_callback(err:node_error) {
                    if (err !== null) {
                        vars.environment.terminal.splice(index, 1);
                    }
                    if (index > 0) {
                        utilities_startApplication_tasksShell_shellWin(index - 1);
                    } else {
                        start_prerequisites();
                    }
                });
            };
            stats(vars.environment.terminal.length - 1);
        } else {
            file.stat({
                callback: function utilities_startApplication_tasksShell_shellStat(stat:node_fs_BigIntStats):void {
                    if (stat === null) {
                        vars.environment.terminal.push("/bin/sh");
                    } else {
                        file.read({
                            callback: function utilities_startApplication_tasksShell_shellStat_shellRead(contents:Buffer):void {
                                const lines:string[] = contents.toString().split("\n"),
                                    len:number = lines.length;
                                let index:number = 1;
                                if (len > 1) {
                                    do {
                                        if (lines[index].indexOf("/bin/") === 0) {
                                            vars.environment.terminal.push(lines[index]);
                                        }
                                        index = index + 1;
                                    } while (index < len);
                                }
                                if (vars.environment.terminal.length < 1) {
                                    vars.environment.terminal.push("/bin/sh");
                                }
                                start_prerequisites();
                            },
                            location: "/etc/shells",
                            no_file: null,
                            section: "startup"
                        });
                    }
                },
                location: "/etc/shells",
                no_file: null,
                section: "startup"
            });
        }
    } else {
        start_prerequisites();
    }
};

export default start_application;