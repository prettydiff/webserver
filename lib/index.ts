
import certificate from "./commands/certificate.js";
import create_config from "./commands/create_config.js";
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
        const config:config_websocket_server = {
            callback: function index_serverCallback(type:type_server, addressInfo:node_net_AddressInfo):void {
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

        // TCP dashboard
        if (vars.ports.dashboard !== null && vars.ports.dashboard !== undefined && typeof vars.ports.dashboard.open === "number") {
            config.type = "dashboard";
            server(config);
            vars.server_count = vars.server_count + 1;
        }

        // TCP server
        config.type = "service";
        server(config);

        readCerts(function index_readCerts(tlsOptions:transmit_tlsOptions):void {
            config.options = tlsOptions;

            // TLS dashboard
            if (vars.ports.dashboard !== null && vars.ports.dashboard !== undefined && typeof vars.ports.dashboard.secure === "number") {
                config.type = "dashboard";
                server(config);
                vars.server_count = vars.server_count + 1;
            }

            // TLS server
            config.type = "service";
            server(config);
        });
    }
});