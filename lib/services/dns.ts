
import node from "../utilities/node.js";
import send from "../transmit/send.js";

const dns = function services_dns(socket_data:socket_data, transmit:transmit_socket):void {
    const data:services_dns_input = socket_data.data as services_dns_input,
        callback = function services_dns_callbacks(index_number:number):(err:node_error, records:type_dns_records) => void {
            return function services_dns_callback1(err:node_error, records:type_dns_records):void {
                if (output[data.names[index_names]] === undefined) {
                    output[data.names[index_names]] = {};
                }
                if (err === null) {
                    output[data.names[index_names]][qualified[index_number]] = records;
                } else {
                    if (err.code === "ENODATA") {
                        output[data.names[index_names]][qualified[index_number]] = [];
                    } else {
                        output[data.names[index_names]][qualified[index_number]] = [`error - ${err.code}`];
                    }
                }
                index_types = index_types + 1;
                if (index_types === len_types) {
                    index_types = 0;
                    index_names = index_names + 1;
                    if (index_names < len_names) {
                        hostname();
                    } else {
                        send({
                            data: output,
                            service: "dashboard-dns"
                        }, transmit.socket as websocket_client, 1);
                    }
                }
            };
        },
        callbacks:dns_callback = {
            "0": callback(0),
            "1": callback(1),
            "2": callback(2),
            "3": callback(3),
            "4": callback(4),
            "5": callback(5),
            "6": callback(6),
            "7": callback(7),
            "8": callback(8),
            "9": callback(9),
            "10": callback(10)
        },
        hostname = function services_dns_hostname():void {
            let count:number = 0;
            do {
                node.dns.resolve(data.names[index_names], qualified[count], callbacks[String(count) as "1"]);
                count = count + 1;
            } while (count < len_types);
        },
        qualifiedPush = function dashboard_dnsResolve_qualifiedPush(key:type_dns_types):void {
            if (types.includes(key) === true) {
                const reg:RegExp = new RegExp(key, "g");
                qualified.push(key);
                types.replace(reg, "");
            }
        },
        types:string = data.types.replace(/,\s*/g, ",").toUpperCase(),
        qualified:type_dns_types[] = [],
        len_names:number = data.names.length,
        output:services_dns_output = {};
    let index_names:number = 0,
        index_types:number = 0,
        len_types:number = 0;
    qualifiedPush("AAAA");
    qualifiedPush("CAA");
    qualifiedPush("CNAME");
    qualifiedPush("MX");
    qualifiedPush("NAPTR");
    qualifiedPush("NS");
    qualifiedPush("PTR");
    qualifiedPush("SOA");
    qualifiedPush("SRV");
    qualifiedPush("TXT");
    if ((/^A$/).test(types) === true || (/,A$/).test(types) === true || (/^A,/).test(types) === true || (/,A,/).test(types) === true) {
        qualified.push("A");
    }
    if (qualified.length === 0) {
        qualified.push("A");
        qualified.push("AAAA");
        qualified.push("CAA");
        qualified.push("CNAME");
        qualified.push("MX");
        qualified.push("NAPTR");
        qualified.push("NS");
        qualified.push("PTR");
        qualified.push("SOA");
        qualified.push("SRV");
        qualified.push("TXT");
    }
    len_types = qualified.length;
    hostname();
};

export default dns;