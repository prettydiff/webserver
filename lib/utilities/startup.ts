
import core from "../browser/core.js";
import dashboard_script from "../dashboard/dashboard_script.js";
import file from "./file.js";
import log from "./log.js";
import port_map from "./port_map.js";
import node from "./node.js";
import vars from "./vars.js";

// cspell: words bestaudio, keyid, multistreams, pathlen

const startup = function utilities_startup(callback:() => void):void {
    const flags:store_flag = {
            compose: false,
            config: false,
            html: false
        },
        readComplete = function utilities_startup_readComplete(flag:"compose"|"config"|"html"):void {
            flags[flag] = true;
            if (flags.compose === true && flags.config === true && flags.html === true) {
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
            readComplete("compose");
        },
        readConfig = function utilities_startup_readConfig(fileContents:Buffer):void {
            if (fileContents === null) {
                vars.servers = {};
            } else {
                const configStr:string = fileContents.toString(),
                    config:store_server_config = (configStr === "" || (/^\s*\{/).test(configStr) === false || (/\}\s*$/).test(configStr) === false)
                        ? null
                        : JSON.parse(configStr) as store_server_config,
                    includes = function utilities_startup_read_instructions_includes(input:string):void {
                        if (server.config.domain_local.includes(input) === false && input.toLowerCase().indexOf("fe80") !== 0) {
                            server.config.domain_local.push(input);
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
                        includes("127.0.0.1");
                        includes("::1");
                        includes("[::1]");
                        do {
                            index_int = index_int - 1;
                            sub = interfaces[keys_int[index_int]].length;
                            do {
                                sub = sub - 1;
                                includes(interfaces[keys_int[index_int]][sub].address);
                            } while (sub > 0);
                        } while (index_int > 0);
                        vars.servers[server.config.name] = server;
                    } while (index_srv > 0);
                }
            }
            readComplete("config");
        },
        readHTML = function utilities_startup_readHTML(fileContents:Buffer):void {
            vars.dashboard = fileContents.toString().replace("replace_javascript", `(${dashboard_script.toString().replace(/\(\s*\)/, "(core)")}(${core.toString()}));`);
            readComplete("html");
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
        capitalize = function core_capitalize():string {
            // eslint-disable-next-line no-restricted-syntax
            return this.charAt(0).toUpperCase() + this.slice(1);
        };

    String.prototype.capitalize = capitalize;

    options("no_color", "text");
    vars.path.project = process.argv[1].slice(0, process.argv[1].indexOf(`${vars.sep}js${vars.sep}`)) + vars.sep;
    port_map(null, function utilities_startup_portMap():void {
        file.read({
            callback: readCompose,
            error_terminate: null,
            location: `${vars.path.project}compose.json`,
            no_file: null
        });
        file.read({
            callback: readConfig,
            error_terminate: null,
            location: `${vars.path.project}servers.json`,
            no_file: null
        });
        file.read({
            callback: readHTML,
            error_terminate: null,
            location: `${vars.path.project}lib${vars.sep}dashboard${vars.sep}dashboard.html`,
            no_file: null
        });
    });
};

export default startup;