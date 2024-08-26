
import certificate from "./utilities/certificate.js";
import readCerts from "./utilities/readCerts.js";
import server from "./transmit/server.js";
import startup from "./utilities/startup.js";
import vars from "./utilities/vars.js";
import yt_config from "./utilities/yt_config.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any, no-console
const log:(...data:any[]) => void = console.log;
let count:number = 0,
    total:number = 2;

startup(function index():void {
    if (process.argv.includes("certificate") === true) {
        certificate({
            callback: function index_certificate():void {
                log("Certificates create.");
            },
            days: 65535,
            domain_default: vars.domain_local[0],
            selfSign: false
        });
    } else if (process.argv.includes("yt_config") === true) {
        yt_config(function index_ytConfig():void {
            log("yt-dlp scripts written.");
        });
    } else {
        const config:config_websocket_server = {
            callback: function index_serverCallback(type:type_server, addressInfo:node_net_AddressInfo):void {
                count = count + 1;
                if (count === total) {
                    log({
                        address: addressInfo.address,
                        family: addressInfo.family,
                        port: vars.service_port
                    });
                }
            },
            options: null,
            type: "open"
        };
        if (typeof vars.service_port.dashboard === "number") {
            total = total + 1;
        }

        // TCP server
        server(config);

        readCerts(function index_readCerts(tlsOptions:transmit_tlsOptions):void {
            config.options = tlsOptions;
            if (typeof vars.service_port.dashboard === "number") {
                // dashboard
                config.type = "dashboard";
                server(config);
            }

            // TLS server
            config.type = "secure";
            server(config);
        });
    }
});