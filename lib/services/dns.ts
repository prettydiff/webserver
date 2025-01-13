
import node from "../utilities/node.js";

const dns = function services_dns(socket_data:socket_data, transmit:transmit_socket):void {
    const data:services_dns_input = socket_data.data as services_dns_input,
        lenNames:number = data.names.length,
        lenTypes:number = data.types.length,
        output:services_dns_output = {};
    let indexNames:number = 0,
        indexTypes:number = 0;
    //node.dns.resolve(list[index], "A", );
};

export default dns;