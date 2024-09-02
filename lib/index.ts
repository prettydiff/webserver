
import certificate from "./commands/certificate.js";
import create_config from "./commands/create_config.js";
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
    // certificate command
    if (process.argv.includes("certificate") === true) {
        certificate({
            callback: function index_certificate():void {
                log("Certificates create.");
            },
            days: 65535,
            domain_default: vars.domain_local[0],
            selfSign: false
        });
    // create_config command
    } else if (process.argv.includes("yt_config") === true) {
        create_config();
    // yt_config command
    } else if (process.argv.includes("yt_config") === true) {
        yt_config(function index_ytConfig():void {
            log("yt-dlp scripts written.");
        });
    // service, default behavior
    } else {
        readCerts(function index_readCerts(tlsOptions:transmit_tlsOptions):void {
            const keys:string[] = Object.keys(vars.ports),
                config:config_websocket_server = {
                    callback: function index_serverCallback(type:string, addressInfo:node_net_AddressInfo):void {
                        count = count + 1;
                        if (count === vars.server_count) {
                            log({
                                address: addressInfo.address,
                                family: addressInfo.family,
                                port: vars.ports
                            });
                        }
                    },
                    options: null,
                    type: "service"
                };
            let index:number = keys.length;
            if (index > 0) {
                do {
                    index = index - 1;
                    if (typeof vars.ports[keys[index]].secure === "number") {
                        config.options = tlsOptions;
                        config.type = keys[index];
                        vars.server_count = vars.server_count + 1;
                        server(config);
                    }
                    if (typeof vars.ports[keys[index]].open === "number") {
                        config.options = null;
                        config.type = keys[index];
                        vars.server_count = vars.server_count + 1;
                        server(config);
                    }
                } while (index > 0);
            }
            if (vars.server_count < 1) {
                error([
                    `${vars.text.angry}No servers initiated.${vars.text.none}`,
                    `Check the ${vars.text.cyan}ports${vars.text.none} property of config.json file. Example:`,
                    "\"ports\": {",
                    "    \"service\": {",
                    "        \"open\": 0",
                    "        \"secure\": 0",
                    "    }",
                    "}",
                    "Ensure the port values are numbers between 0-65535. A value of 0 will assign any randomly available port."
                ], null, false);
                process.exit(1);
            }
        });
    }
});