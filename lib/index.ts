
import certificate from "./commands/certificate.js";
import create_server from "./commands/create_server.js";
import error from "./utilities/error.js";
import readCerts from "./utilities/readCerts.js";
import server from "./transmit/server.js";
import startup from "./utilities/startup.js";
import vars from "./utilities/vars.js";
import yt_config from "./commands/yt_config.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any, no-console
const log:(...data:any[]) => void = console.log;
let count:number = 0;

startup(function index():void {
    const servers:string[] = Object.keys(vars.servers);
    if (servers.length < 1) {
        error([
            `${vars.text.angry}No servers initiated.${vars.text.none}`,
            `Ensure the ${vars.text.cyan}config.json${vars.text.none} file is properly populated with at least one server.`
        ], null, true);
    } else {
        // certificate command
        if (process.argv.includes("certificate") === true) {
            certificate({
                callback: function index_certificate():void {
                    log("Certificates created.");
                },
                days: 65535,
                domain_default: vars.servers[servers[0]].domain_local[0],
                selfSign: false
            });
        // create_config command
        } else if (process.argv.includes("create_config") === true) {
            const name:string = process.argv[3];
            if (name === undefined) {
                error([
                    "Server name not specified."
                ], null, true);
                return;
            }
            create_server(name);
        // yt_config command
        } else if (process.argv.includes("yt_config") === true) {
            const name:string = process.argv[3];
            if (vars.servers[name] === undefined) {
                error([
                    `Server ${name} does not exist in the config.json file.`
                ], null, true);
                return;
            }
            yt_config(process.argv[3], function index_ytConfig():void {
                log("yt-dlp scripts written.");
            });
        // service, default behavior
        } else {
            readCerts(function index_readCerts(tlsOptions:transmit_tlsOptions):void {
                const total:number = servers.length,
                    portList:store_ports = {},
                    config:config_websocket_server = {
                        callback: function index_serverCallback(name:string, addressInfo:node_net_AddressInfo):void {
                            count = count + 1;
                            portList[name] = vars.servers[name].ports;
                            if (count === total) {
                                log({
                                    address: addressInfo.address,
                                    family: addressInfo.family,
                                    port: portList
                                });
                            }
                        },
                        name: "",
                        options: null
                    };
                let index:number = servers.length;
                do {
                    index = index - 1;
                    config.options = tlsOptions;
                    config.name = servers[index];
                    server(config);
                    config.options = null;
                    config.name = servers[index];
                    server(config);
                } while (index > 0);
            });
        }
    }
});