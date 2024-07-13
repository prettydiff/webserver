
import readCerts from "./utilities/readCerts.js";
import server from "./transmit/server.js";
import vars from "./utilities/vars.js";

vars.projectPath = process.argv[1].slice(0, process.argv[1].indexOf(`${vars.sep}js${vars.sep}`)) + vars.sep;

if (vars.secure === true) {
    readCerts(function index_readCerts(tlsOptions:transmit_tlsOptions):void {
        server({
            callback: function index_readCerts_serverCallback(addressInfo:node_net_AddressInfo):void {
                console.log(addressInfo);
            },
            options: tlsOptions
        });
    });
} else {
    server({
        callback: function index_serverCallback(addressInfo:node_net_AddressInfo):void {
            console.log(addressInfo);
        },
        options: null
    });
}