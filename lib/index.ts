
import certificate from "./utilities/certificate.js";
import readCerts from "./utilities/readCerts.js";
import server from "./transmit/server.js";
import startup from "./utilities/startup.js";
import vars from "./utilities/vars.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any, no-console
const log:(...data:any[]) => void = console.log;
let count:number = 0;

startup(function index():void {
    if (process.argv.includes("certificate") === true) {
        certificate({
            callback: function index_certificate():void {
                log("Certificates create.");
            },
            days: 65535,
            selfSign: false
        });
    } else {
        readCerts(function index_readCerts(tlsOptions:transmit_tlsOptions):void {
            server({
                callback: function index_readCerts_serverCallback(addressInfo:node_net_AddressInfo):void {
                    count = count + 1;
                    if (count > 1) {
                        log({
                            address: addressInfo.address,
                            family: addressInfo.family,
                            port: vars.service_port
                        });
                    }
                },
                options: tlsOptions
            });
        });
        server({
            callback: function index_serverCallback(addressInfo:node_net_AddressInfo):void {
                count = count + 1;
                if (count > 1) {
                    log({
                        address: addressInfo.address,
                        family: addressInfo.family,
                        port: vars.service_port
                    });
                }
            },
            options: null
        });
    }
});