
import readCerts from "./utilities/readCerts.js";
import server from "./transmit/server.js";
import vars from "./utilities/vars.js";

vars.path.project = process.argv[1].slice(0, process.argv[1].indexOf(`${vars.sep}js${vars.sep}`)) + vars.sep;

let count:number = 0;

readCerts(function index_readCerts(tlsOptions:transmit_tlsOptions):void {
    server({
        callback: function index_readCerts_serverCallback(addressInfo:node_net_AddressInfo):void {
            count = count + 1;
            if (count > 1) {
                console.log({
                    address: addressInfo.address,
                    family: addressInfo.family,
                    port: vars.port
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
            console.log({
                address: addressInfo.address,
                family: addressInfo.family,
                port: vars.port
            });
        }
    },
    options: null
});