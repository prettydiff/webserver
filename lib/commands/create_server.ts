
import certificate from "./certificate.js";
import error from "../utilities/error.js";
import file from "../utilities/file.js";
import log from "../utilities/log.js";
import read_certs from "../utilities/read_certs.js";
import server from "../transmit/server.js";
import vars from "../utilities/vars.js";

// 1. create server's directory structure
// 2. add server to config.json file
// 3. add server to the vars.servers object
// 4. create server's certificates
// 5. launch servers
// 6. call the callback

const create_server = function commands_createServer(name:string, callback:() => void):void {
    let count:number = 0;
    const path_config:string = `${vars.path.project}config.json`,
        path_servers:string = `${vars.path.project}servers${vars.sep}`,
        path_name:string = path_servers + name + vars.sep,
        terminate:boolean = (vars.command === "create_server"),
        slash = function commands_createServer_slash(input:string):string {
            return input.replace(/\\/g, "\\\\");
        },
        path_assets:string = `${path_name}assets${vars.sep}`,
        path_certs:string = `${path_name}certs${vars.sep}`,
        flags:store_flag = {
            config: false,
            dir: false
        },
        complete = function commands_createServer_complete(input:"config"|"dir"):void {
            flags[input] = true;
            if (flags.config === true && flags.dir === true) {
                // 4. add server to the vars.servers object
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
                // 5. create server's certificates
                certificate({
                    callback: function commands_createServer_complete_certificate():void {
                        if (vars.command === "create_server") {
                            log([
                                `Server ${vars.text.cyan + name + vars.text.none} ${vars.text.green}created${vars.text.none}.`,
                                `${vars.text.angry}*${vars.text.none} config.json file updated.`,
                                `${vars.text.angry}*${vars.text.none} Directory structure at ${vars.text.cyan + path_name + vars.text.none} created.`,
                                `${vars.text.angry}*${vars.text.none} Certificates created.`,
                                "",
                                "1. Update the config.json file to customize the new server.",
                                "",
                                ""
                            ], true);
                        } else {
                            read_certs(name, function index_readCerts(name:string, tlsOptions:transmit_tlsOptions):void {
                                let server_count:number = 0;
                                const config_server:config_websocket_server = {
                                    callback: function commands_createServer_complete_certificate_callback():void {
                                        server_count = server_count + 1;
                                        if (server_count > 1 && callback !== null) {
                                            // 7. call the callback
                                            callback();
                                        }
                                    },
                                    name: name,
                                    options: null
                                };
                                // 6. launch servers
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
        // 3. add server to config.json file
        write_config = function commands_createServer_writeConfig(fileContents:string):void {
            const config:string = `
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
            "certificates": "${slash(path_certs)}",
            "storage": "${slash(path_assets)}",
            "web_root": "${slash(path_assets)}"
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
                contents:string = (fileContents === null || fileContents === "")
                    ? `{${config}}`
                    : ((/\s*\{\s*\}\s*/).test(fileContents) === true)
                        ? `{${config}}`
                        : fileContents.replace(/\s*\}\s*$/, `,${config}}`);
            file.write({
                callback: function commands_createServer_writeConfig_callback():void {
                    complete("config");
                },
                contents: contents,
                error_terminate: terminate,
                location: path_config
            });
        },
        children = function commands_createServer_serverDir_children():void {
            count = count + 1;
            if (count > 1) {
                complete("dir");
            }
        },
        file_stat_config:file_stat = {
            callback: function commands_createServer_fileNoError():void {
                file.read({
                    callback: function commands_createServer_fileNoError_read(fileRaw:Buffer):void {
                        const str:string = fileRaw.toString(),
                            keys:string[] = (str === "" || (/^\s*\{/).test(str) === false || (/\}\s*$/).test(str) === false)
                                ? null
                                : Object.keys(JSON.parse(str));
                        if (keys !== null && keys.includes(name) === true) {
                            error([
                                `A server with name ${name} already exists.`,
                                "Either delete the existing server with that name or choose a different name."
                            ], null, terminate);
                        } else {
                            write_config(fileRaw.toString());
                        }
                    },
                    error_terminate: terminate,
                    location: path_config,
                    no_file: null
                });
            },
            error_terminate: terminate,
            location: path_config,
            no_file: function commands_createServer_fileNoFile():void {
                write_config(null);
            }
        };
    file.stat(file_stat_config);
    file.mkdir({
        callback: children,
        error_terminate: terminate,
        location: path_assets
    });
    file.mkdir({
        callback: children,
        error_terminate: terminate,
        location: path_certs
    });
};

export default create_server;