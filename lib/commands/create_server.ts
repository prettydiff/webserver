
import certificate from "./certificate.js";
import error from "../utilities/error.js";
import file from "../utilities/file.js";
import log from "../utilities/log.js";
import read_certs from "../utilities/read_certs.js";
import server from "../transmit/server.js";
import vars from "../utilities/vars.js";

// 1. create server directory
// 2. create server's directory structure
// 3. add server to config.json file
// 4. create server's certificates
// 5. add server to the vars.servers object
// 6. launch servers

const create_server = function commands_createServer(name:string, callback:() => void):void {
    const path_config:string = `${vars.path.project}config.json`,
        path_servers:string = `${vars.path.project}servers${vars.sep}`,
        path_name:string = path_servers + name + vars.sep,
        terminate:boolean = (vars.command === "create_server"),
        slash = function commands_createServer_slash(input:string):string {
            return input.replace(/\\/g, "\\\\");
        },
        path_assets:string = slash(`${path_name}assets${vars.sep}`),
        path_certs:string = slash(`${path_name}certs${vars.sep}`),
        config:string = `
    "${name}": {
        "block_list": {
            "host": [],
            "ip": [],
            "referrer": []
        },
        "domain_local": [],
        "http": {
            "delete": "",
            "post": "",
            "put": ""
        },
        "path": {
            "certificates": "${path_certs}",
            "storage": "${path_assets}",
            "web_root": "${path_assets}"
        },
        "ports": {
            "open": 0,
            "secure": 0
        },
        "redirect_domain": {
            "": ["", 0]
        },
        "redirect_internal": {
            "": {
                "": ""
            }
        },
        "server_name": "${name}"
    }
`,
        flags:store_flag = {
            assets: false,
            certs: false,
            config: false
        },
        complete = function commands_createServer_complete(input:"config"|"dir"):void {
            flags[input] = true;
            if (flags.assets === true && flags.certs === true && flags.config === true) {
                certificate({
                    callback: function commands_createServer_complete_certificate():void {
                        if (vars.command === "create_server") {
                            log([
                                `Server ${vars.text.cyan + name + vars.text.none} created.`,
                                `${vars.text.angry}*${vars.text.none} config.json file updated.`,
                                `${vars.text.angry}*${vars.text.none} Directory structure at ${vars.text.cyan + path_name + vars.text.none} created.`,
                                `${vars.text.angry}*${vars.text.none} Certificates created.`,
                                "",
                                "1. Update the config.json file to customize the new server.",
                                "2. Restart the application to execute the new server."
                            ], true);
                        } else {
                            read_certs(name, function index_readCerts(name:string, tlsOptions:transmit_tlsOptions):void {
                                let server_count:number = 0;
                                const config_server:config_websocket_server = {
                                    callback: function commands_createServer_complete_certificate_callback():void {
                                        server_count = server_count + 1;
                                        if (server_count > 1) {
                                            callback();
                                        }
                                    },
                                    name: name,
                                    options: null
                                };
                                vars.servers[name] = {
                                    block_list: {
                                        host: [],
                                        ip: [],
                                        referrer: []
                                    },
                                    domain_local: [],
                                    http: {
                                        delete: "",
                                        post: "",
                                        put: ""
                                    },
                                    path: {
                                        certificates: path_certs,
                                        storage: path_assets,
                                        web_root: path_assets
                                    },
                                    ports: {
                                        open: 0,
                                        secure: 0
                                    },
                                    redirect_domain: {
                                        "": ["", 0]
                                    },
                                    redirect_internal: {
                                        "": {
                                            "": ""
                                        }
                                    },
                                    server_name: name
                                };
                                server(config_server);
                                config_server.options = tlsOptions;
                                server(config_server);
                            });
                        }
                    },
                    days: 65535,
                    domain_default: null,
                    name: name,
                    selfSign: false
                });
            }
        },
        mkdir = function commands_createServer_mkdir(location:string, callback:() => void):void {
            const config_mkdir:file_mkdir = {
                callback: callback,
                error_terminate: terminate,
                location: location
            };
            file.mkdir(config_mkdir);
        },
        write_config = function commands_createServer_writeConfig(contents:string):void {
            file.write({
                callback: function commands_createServer_writeConfig_callback():void {
                    complete("config");
                },
                contents: contents,
                error_terminate: terminate,
                location: path_config
            });
        },
        server_dir = function commands_createServer_serverDir():void {
            let count:number = 0;
            const children = function commands_createServer_statServers_complete_mkdir_children():void {
                count = count + 1;
                if (count > 1) {
                    complete("dir");
                }
            };
            mkdir(path_assets, children);
            mkdir(path_certs, children);
        },
        file_stat_config:file_stat = {
            callback: null,
            error_terminate: terminate,
            location: path_config,
            no_error: function commands_createServer_fileNoError():void {
                file.read({
                    callback: function commands_createServer_stat_read(fileRaw:Buffer):void {
                        const str:string = fileRaw.toString(),
                            keys:string[] = Object.keys(JSON.parse(str));
                        if (keys.includes(name) === true) {
                            error([
                                `A server with name ${name} already exists.`,
                                "Either delete the existing server with that name or choose a different name."
                            ], null, terminate);
                        } else {
                            const file:string = fileRaw.toString(),
                                fileData:string = ((/\s*\{\s*\}\s*/).test(file) === true)
                                    ? `{${config}}`
                                    : file.replace(/\s*\}\s*$/, `,${config}}`);
                            write_config(fileData);
                        }
                    },
                    error_terminate: terminate,
                    location: path_config,
                    no_error: null,
                    no_file: null
                });
            },
            no_file: function commands_createServer_fileNoFile():void {
                write_config(`{${config}}`);
            }
        },
        file_stat_server:file_stat = {
            callback: server_dir,
            error_terminate: terminate,
            location: path_servers,
            no_error: null,
            no_file: function commands_createServer_writeServers():void {
                mkdir(path_servers, null);
            }
        };
    file.stat(file_stat_config);
    file.stat(file_stat_server);
};

export default create_server;