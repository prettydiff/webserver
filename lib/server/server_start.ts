
import broadcast from "../transmit/broadcast.ts";
import certificate from "../services/certificate.ts";
import connection from "../transmit/connection.ts";
import file from "../utilities/file.ts";
import log from "../core/log.ts";
import node from "../core/node.ts";
import vars from "../core/vars.ts";

// cspell: words untrapped

const server_start = function server_start(id:string, callback:(name:string) => void):void {
    let count:number = 0;
    const open = function server_start_open(options:transmit_tlsOptions):void {
        const wsServer:core_server_instance = (options === null)
                // options are of type TlsOptions
                ? node.net.createServer()
                : node.tls.createServer({
                    ca: options.certificates.ca,
                    cert: options.certificates.cert,
                    key: options.certificates.key,
                    rejectUnauthorized: false,
                    requestCert: (vars.data.server[id].config.mutual_tls === true)
                }, connection),
            secureType:"open"|"secure" = (options === null)
                ? "open"
                : "secure",
            complete = function server_start_open_complete(id:string):void {
                count = count + 1;
                if (callback !== null && callback !== undefined && ((vars.data.server[id].config.encryption === "both" && count > 1) || vars.data.server[id].config.encryption !== "both")) {
                    count = 0;
                    broadcast(vars.id.dashboard_server, "dashboard", {
                        data: vars.data.server,
                        service: "services_server_update"
                    });
                    callback(id);
                }
            },
            listenerCallback = function server_start_open_listenerCallback(this:core_server_instance):void {
                // eslint-disable-next-line @typescript-eslint/no-this-alias
                const serverItem:core_server_instance = this,
                    address:node_net_AddressInfo = serverItem.address() as node_net_AddressInfo,
                    secure:"open"|"secure" = (serverItem.secure === true)
                        ? "secure"
                        : "open";
                vars.data_store.server[serverItem.id].server_object[secure] = serverItem;
                if (vars.data.server[serverItem.id].ports === undefined) {
                    vars.data.server[serverItem.id].ports = {
                        open: 0,
                        secure: 0
                    };
                }
                vars.data.server[serverItem.id].ports[secure] = address.port;
                log.application({
                    error: null,
                    message: `${secure.capitalize()} server came online at port ${address.port}.`,
                    origin: id,
                    section: "servers-web",
                    status: "informational",
                    time: Date.now()
                });
                complete(serverItem.id);
            },
            server_error = function server_start_open_serverError(this:core_server_instance, ser:node_error):void {
                const secure:"open"|"secure" = (this.secure === true)
                        ? "secure"
                        : "open",
                    message:string = (ser !== null && ser !== undefined && ser.code === "EADDRINUSE")
                        ? `Port conflict on port ${vars.data.server[this.id].config.ports[secure]} of ${secure} server.`
                        : `${secure.capitalize()} went offline.  Was listening on port ${vars.data.server[this.id].ports[secure]}.`;
                log.application({
                    error: ser,
                    message: message,
                    origin: id,
                    section: "servers-web",
                    status: "error",
                    time: Date.now()
                });
                if (vars.environment.loading === true && ser !== null && ser !== undefined) {
                    // eslint-disable-next-line no-console
                    console.log(ser);
                }
                complete(this.id);
            };
        // type identification assignment
        wsServer.secure = (options === null)
            ? false
            : true;
        wsServer.id = id;
        wsServer.on("error", server_error);
        wsServer.on("close", server_error);
        if (vars.data.server[wsServer.id] !== undefined && options !== null) {
            vars.data_store.server[wsServer.id].server_certs = options.certificates;
        }

        // insecure connection listener
        if (options === null) {
            wsServer.on("connection", connection);
        }

        // secure connection listener
        wsServer.listen({
            port: (vars.options[`port-${secureType}`] > 0 && id === vars.id.dashboard_server)
                ? vars.options[`port-${secureType}`]
                : vars.data.server[id].config.ports[secureType]
        }, listenerCallback);
    };

    // create default structures
    if (Array.isArray(vars.data.server[id].config.domain_local) === false) {
        vars.data.server[id].config.domain_local = [];
    }
    if (vars.data_store.server[id] === undefined) {
        vars.data_store.server[id].server_object = {
            open: null,
            secure: null
        };
        vars.data_store.server[id].sockets_tcp = {
            open: [],
            secure: []
        };
    }

    if (vars.data.server[id].config.encryption === "open") {
        if (vars.data.server[id].config.single_socket === true || vars.data.server[id].config.temporary === true) {
            file.remove({
                callback: function server_start_starterOpen():void {
                    open(null);
                },
                exclusions: null,
                location: vars.path.servers + id,
                section: "servers-web"
            });
        } else {
            open(null);
        }
    } else {
        // for TLS must read the cert chain first
        let count:number = 0,
            flag_error:boolean = false;
        const certLocation:string = `${vars.path.servers + id + vars.path.sep}certs${vars.path.sep}`,
            https:transmit_tlsOptions = {
                certificates: {
                    ca: "",
                    cert: "",
                    key: ""
                },
                fileFlag: {
                    ca: false,
                    cert: false,
                    key: false
                }
            },
            certCheck = function server_start_certCheck():void {
                if (https.fileFlag.ca === true && https.fileFlag.cert === true && https.fileFlag.key === true) {
                    const starter = function server_start_certCheck_starterSecure():void {
                        if (vars.data.server[id].config.encryption === "both") {
                            // starts server without TLS certs for non-TLS server
                            open(null);
                        }
                        open(https);
                    };
                    if (vars.data.server[id].config.single_socket === true || vars.data.server[id].config.temporary === true) {
                        file.remove({
                            callback: starter,
                            exclusions: null,
                            location: vars.path.servers + id,
                            section: "servers-web"
                        });
                    } else {
                        starter();
                    }
                }
            },
            stat_callback = function server_start_statCallback(error:node_error):void {
                count = count + 1;
                if (error !== null) {
                    flag_error = true;
                }
                if (count === 3) {
                    const read_cert = function server_start_statCallback_readCert():void {
                        const read_callback = function server_start_statCallback_readCert_readCallback(file:Buffer, location:string, id:string):void {
                            const type:"ca"|"cert"|"key" = id as "ca"|"cert"|"key";
                            if (file === null) {
                                log.application({
                                    error: new Error(),
                                    message: `Required certificate files are missing for server named ${vars.data.server[id].config.name}.`,
                                    origin: id,
                                    section: "servers-web",
                                    status: "error",
                                    time: Date.now()
                                });
                            } else {
                                https.certificates[type] = file.toString();
                                https.fileFlag[type] = true;
                                certCheck();
                            }
                        };
                        file.read({
                            callback: read_callback,
                            identifier: "ca",
                            location: path_ca,
                            no_file: null,
                            section:  "servers-web"
                        });
                        file.read({
                            callback: read_callback,
                            identifier: "cert",
                            location: path_cert,
                            no_file: null,
                            section:  "servers-web"
                        });
                        file.read({
                            callback: read_callback,
                            identifier: "key",
                            location: path_key,
                            no_file: null,
                            section:  "servers-web"
                        });
                    };
                    count = 0;
                    if (flag_error === false) {
                        read_cert();
                    } else {
                        certificate({
                            callback: read_cert,
                            days: 65535,
                            id: id,
                            selfSign: false
                        });
                    }
                }
            },
            path_ca:string = (vars.data.server[id].config.certificate_path === undefined)
                ? `${certLocation}int.crt`
                : vars.data.server[id].config.certificate_path.ca,
            path_cert:string = (vars.data.server[id].config.certificate_path === undefined)
                ? `${certLocation}server.crt`
                : vars.data.server[id].config.certificate_path.ca,
            path_key:string = (vars.data.server[id].config.certificate_path === undefined)
                ? `${certLocation}server.key`
                : vars.data.server[id].config.certificate_path.ca;
        node.fs.stat(path_ca, stat_callback);
        node.fs.stat(path_cert, stat_callback);
        node.fs.stat(path_key, stat_callback);
    }
};

export default server_start;
