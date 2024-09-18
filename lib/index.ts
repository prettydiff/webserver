
import certificate from "./commands/certificate.js";
import create_server from "./commands/create_server.js";
import delete_server from "./commands/delete_server.js";
import error from "./utilities/error.js";
import log from "./utilities/log.js";
import read_certs from "./utilities/read_certs.js";
import server from "./transmit/server.js";
import startup from "./utilities/startup.js";
import vars from "./utilities/vars.js";
import yt_config from "./commands/yt_config.js";

startup(function index():void {
    const servers:string[] = Object.keys(vars.servers);
    if  (vars.command === "create_server") {
        // create_server command
        const name:string = process.argv[3],
            callback = function index_createServerCallback():void {
                log([`Server ${name} created.`], true);
            };
        if (name === undefined) {
            error([
                "Server name not specified.",
                `Example: ${vars.text.cyan}npm run create_server my_server${vars.text.none}`
            ], null, true);
            return;
        }
        create_server(name, callback);
    } else if (vars.command === "delete_server") {
        // delete_server command
        const name:string = process.argv[3],
            callback = function index_createServerCallback():void {
                log([`Server ${name} created.`], true);
            };
        if (name === undefined) {
            error([
                "Server name not specified.",
                `Example: ${vars.text.cyan}npm run create_server my_server${vars.text.none}`
            ], null, true);
            return;
        }
        delete_server(name, callback);
    } else if (servers.length < 1) {
        // yt_config command
        error([
            `${vars.text.angry}No servers initiated.${vars.text.none}`,
            `Ensure the ${vars.text.cyan}config.json${vars.text.none} file is properly populated with at least one server.`
        ], null, true);
    } else {
        // certificate command
        if (vars.command === "certificate") {
            const name:string = process.argv[3];
            if (name === undefined) {
                error([
                    "Server name not specified.",
                    `Example: ${vars.text.cyan}npm run certificate my_server${vars.text.none}`
                ], null, true);
                return;
            }
            certificate({
                callback: function index_certificate():void {
                    log(["Certificates created."], true);
                },
                days: 65535,
                domain_default: vars.servers[servers[0]].domain_local[0],
                name: name,
                selfSign: false
            });
        // create_server command
        } else if (vars.command === "yt_config") {
            const name:string = process.argv[3];
            if (vars.servers[name] === undefined) {
                error([
                    `Server ${name} does not exist in the config.json file.`
                ], null, true);
                return;
            }
            yt_config(process.argv[3], function index_ytConfig():void {
                log(["yt-dlp scripts written."], true);
            });
        // service, default behavior
        } else {
            const servers:string[] = Object.keys(vars.servers),
                total:number = servers.length,
                portList:store_ports = {},
                config:config_websocket_server = {
                    callback: function index_serverCallback(name:string, secure:"open"|"secure"):void {
                        count = count + 1;
                        if (portList[name] === undefined) {
                            portList[name] = {
                                open: 0,
                                secure: 0
                            };
                        }
                        portList[name][secure] = vars.servers[name].ports[secure];
                        if (count === total * 2) {
                            const logs:string[] = [
                                    "Web Servers started.",
                                    "",
                                    "Ports:",
                                ],
                                keys:string[] = Object.keys(portList);
                            keys.sort();
                            let ports:number = 0;
                            do {
                                logs.push(`${vars.text.angry}*${vars.text.none} ${portList[keys[ports]].open} - ${keys[ports]}, open`);
                                logs.push(`${vars.text.angry}*${vars.text.none} ${portList[keys[ports]].secure} - ${keys[ports]}, secure`);
                                ports = ports + 1;
                            } while (ports < keys.length);
                            log(logs, false);
                        }
                    },
                    name: "",
                    options: null
                };
            let index:number = 0,
                count:number = 0;
            do {
                read_certs(servers[index], function index_readCerts(name:string, tlsOptions:transmit_tlsOptions):void {
                    config.options = tlsOptions;
                    config.name = name;
                    server(config);
                    config.options = null;
                    config.name = name;
                    server(config);
                    index = index + 1;
                });
            } while (index < total);
        }
    }
});