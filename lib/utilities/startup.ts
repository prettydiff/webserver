
import broadcast from "../transmit/broadcast.js";
import commas from "./commas.js";
import core from "../browser/core.js";
import dashboard_script from "../dashboard/dashboard_script.js";
import dateTime from "./dateTime.js";
import docker_ps from "../services/docker_ps.js";
import file from "./file.js";
import node from "./node.js";
import port_map from "../services/port_map.js";
import vars from "./vars.js";

// cspell: words bestaudio, keyid, multistreams, nmap, pathlen

const startup = function utilities_startup(callback:() => void):void {
    const flags:store_flag = {
            compose: false,
            config: false,
            css: false,
            docker: false,
            html: false,
            ports: false
        },
        readComplete = function utilities_startup_readComplete(flag:"config"|"css"|"docker"|"html"):void {
            flags[flag] = true;
            if (flags.config === true && flags.css === true && flags.docker === true && flags.html === true) {
                callback();
            }
        },
        readCompose = function utilities_startup_readCompose(fileContents:Buffer):void {
            if (fileContents === null) {
                vars.compose = {
                    containers: {},
                    variables: {}
                };
            } else {
                vars.compose = JSON.parse(fileContents.toString());
            }
            flags.compose = true;
            commandsCallback();
            osUpdate();
        },
        readCSS = function utilities_startup_readCSS(fileContents:Buffer):void {
            const css:string = fileContents.toString();
            vars.css = css.slice(css.indexOf(":root"), css.indexOf("/* end basic html */"));
            readComplete("css");
        },
        readConfig = function utilities_startup_readConfig(fileContents:Buffer):void {
            const configStr:string = (fileContents === null)
                    ? ""
                    : fileContents.toString(),
                config:store_server_config = (configStr === "" || (/^\s*\{/).test(configStr) === false || (/\}\s*$/).test(configStr) === false)
                    ? null
                    : JSON.parse(configStr) as store_server_config,
                includes = function utilities_startup_read_instructions_includes(input:string):void {
                    if (vars.interfaces.includes(input) === false && input.toLowerCase().indexOf("fe80") !== 0) {
                        vars.interfaces.push(input);
                    }
                },
                interfaces:{ [index: string]: node_os_NetworkInterfaceInfo[]; } = node.os.networkInterfaces(),
                keys_int:string[] = Object.keys(interfaces),
                keys_srv:string[] = (config === null)
                    ? null
                    : Object.keys(config);
            let index_int:number = keys_int.length,
                index_srv:number = (config === null)
                    ? 0
                    : keys_srv.length,
                server:server = null,
                sub:number = 0;
            if (index_srv > 0) {
                do {
                    index_srv = index_srv - 1;
                    index_int = keys_int.length;
                    server = {
                        config: config[keys_srv[index_srv]],
                        sockets: [],
                        status: {
                            open: 0,
                            secure: 0
                        }
                    };
                    if (server.config.ports === null || server.config.ports === undefined) {
                        server.config.ports = {
                            open: 0,
                            secure: 0
                        };
                    } else {
                        if (typeof server.config.ports.open !== "number") {
                            server.config.ports.open = 0;
                        }
                        if (typeof server.config.ports.secure !== "number") {
                            server.config.ports.secure = 0;
                        }
                    }
                    if (server.config.block_list === undefined || server.config.block_list === null) {
                        server.config.block_list = {
                            host: [],
                            ip: [],
                            referrer: []
                        };
                    }
                    if (Array.isArray(server.config.domain_local) === false) {
                        server.config.domain_local = [];
                    }
                    vars.servers[server.config.name] = server;
                } while (index_srv > 0);
            }
            do {
                index_int = index_int - 1;
                sub = interfaces[keys_int[index_int]].length;
                do {
                    sub = sub - 1;
                    includes(interfaces[keys_int[index_int]][sub].address);
                } while (sub > 0);
            } while (index_int > 0);
            readComplete("config");
        },
        readXterm = function utilities_startup_readXterm(xtermFile:Buffer):void {
            const xterm:string = xtermFile.toString().replace(/\s*\/\/# sourceMappingURL=xterm\.js\.map/, "");
            file.read({
                callback: function utilities_startup_readHTML(fileContents:Buffer):void {
                    vars.dashboard = fileContents.toString()
                        .replace("${payload.intervals.nmap}", (vars.intervals.nmap / 1000).toString())
                        .replace("${payload.intervals.compose}", (vars.intervals.compose / 1000).toString())
                        .replace("replace_javascript", `${xterm}const commas=${commas.toString()};(${dashboard_script.toString().replace(/\(\s*\)/, "(core)")}(${core.toString()}));`);
                    readComplete("html");
                },
                error_terminate: null,
                location: `${vars.path.project}lib${vars.sep}dashboard${vars.sep}dashboard.html`,
                no_file: null
            });
        },
        options = function utilities_startup_options(key:"no_color"|"verbose", iterate:string):void {
            const argv:number = process.argv.indexOf(key);
            if (argv > -1) {
                process.argv.splice(argv, 1);
                if (iterate !== null) {
                    const store:store_string = vars[iterate as "text"],
                        keys:string[] = Object.keys(store);
                    let index:number = keys.length;
                    do {
                        index = index - 1;
                        if (iterate === "text") {
                            store[keys[index]] = "";
                        }
                    } while (index > 0);
                }
            }
        },
        capitalize = function utilities_startup_capitalize():string {
            // eslint-disable-next-line no-restricted-syntax
            return this.charAt(0).toUpperCase() + this.slice(1);
        },
        commandsCallback = function utilities_startup_commandsCallback():void {
            if (flags.compose === true && flags.ports === true) {
                docker_ps(dockerCallback);
                file.read({
                    callback: readConfig,
                    error_terminate: null,
                    location: `${vars.path.project}servers.json`,
                    no_file: null
                });
                file.read({
                    callback: readXterm,
                    error_terminate: null,
                    location: `${vars.path.project}node_modules${vars.sep}@xterm${vars.sep}xterm${vars.sep}lib${vars.sep}xterm.js`,
                    no_file: null
                });
                file.read({
                    callback: readCSS,
                    error_terminate: null,
                    location: `${vars.path.project}lib${vars.sep}dashboard${vars.sep}styles.css`,
                    no_file: null
                });
            }
        },
        portCallback = function utilities_startup_portCallback():void {
            flags.ports = true;
            commandsCallback();
        },
        dockerCallback = function utilities_startup_dockerCallback():void {
            readComplete("docker");
        },
        osUpdate = function utilities_startup_osUpdate():void {
            const os:services_os = {
                machine: {
                    interfaces: node.os.networkInterfaces(),
                    memory: {
                        free: node.os.freemem(),
                        total: node.os.totalmem()
                    }
                },
                os: {
                    uptime: node.os.uptime()
                },
                process: {
                    cpuSystem: process.cpuUsage().system,
                    cpuUser: process.cpuUsage().user,
                    uptime: process.uptime()
                },
                time: Date.now()
            };
            vars.os.machine.interfaces = os.machine.interfaces;
            vars.os.machine.memory.free = os.machine.memory.free;
            vars.os.machine.memory.total = os.machine.memory.total;
            vars.os.os.uptime = os.os.uptime;
            vars.os.process.cpuSystem = os.process.cpuSystem;
            vars.os.process.cpuUser = os.process.cpuUser;
            vars.os.process.uptime = os.process.uptime;
            broadcast("dashboard", "dashboard", {
                data: os,
                service: "dashboard-os"
            });
            setTimeout(utilities_startup_osUpdate, 60000);
        };

    String.prototype.capitalize = capitalize;
    Number.prototype.dateTime = dateTime;

    options("no_color", "text");
    vars.path.project = process.argv[1].slice(0, process.argv[1].indexOf(`${vars.sep}js${vars.sep}`)) + vars.sep;
    vars.path.compose = `${vars.path.project}compose${vars.sep}`;
    vars.path.servers = `${vars.path.project}servers${vars.sep}`;
    port_map(portCallback);
    file.read({
        callback: readCompose,
        error_terminate: null,
        location: `${vars.path.project}compose.json`,
        no_file: null
    });
    if (process.platform !== "win32") {
        file.stat({
            callback: function utilities_startup_bash(stat:node_fs_BigIntStats):void {
                if (stat !== null) {
                    vars.shell = "/bin/bash";
                }
            },
            error_terminate: null,
            location: "/bin/bash",
            no_file: null
        });
    }
};

export default startup;