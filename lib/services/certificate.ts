
import file from "../utilities/file.ts";
import node from "../core/node.ts";
import save from "../utilities/save.ts";
import spawn from "../core/spawn.ts";
import vars from "../core/vars.ts";

// cspell:word addstore, CAcreateserial, certutil, delstore, extfile, genpkey, keyid, passout, pathlen

const certificate = function services_certificate(config:config_certificate):void {
    const cert_path:string = `${vars.path.servers + config.id + vars.path.sep}certs${vars.path.sep}`,
        cert = function services_certificate_cert():void {
            let index:number = 0;
            const commands:string[] = [],
                domain:string = (vars.data.server[config.id].config.domain_local.length < 1)
                    ? "localhost"
                    : vars.data.server[config.id].config.domain_local[0],
                client:string = `${vars.environment.name}_${domain}`,
                crypto = function services_certificate_cert_crypto():void {
                    spawn(commands[index], function services_certificate_cert_crypto_child():void {
                        index = index + 1;
                        if (index < commands.length) {
                            services_certificate_cert_crypto();
                        } else {
                            let count:number = 0;
                            const path:string = `${cert_path + client}.pfx`,
                                store_cert:supplemental_certificate_client = {
                                    crt: null,
                                    pfx: null
                                },
                                read_certificates = function services_certificate_cert_crypto_child_readCerts(file:Buffer, location:string):void {
                                    count = count + 1;
                                    if (file !== null) {
                                        if (location.slice(location.length - 4) === ".crt") {
                                            store_cert.crt = file.toString("utf-8");
                                        } else {
                                            store_cert.pfx = file.toString("base64");
                                        }
                                    }
                                    if (count > 1) {
                                        vars.data.server[config.id].certificates_client = store_cert;
                                        vars.data.server[config.id].config.certificate_path = {
                                            ca: `${vars.path.project}servers${vars.path.sep + config.id + vars.path.sep}certs${vars.path.sep}int.crt`,
                                            cert: `${vars.path.project}servers${vars.path.sep + config.id + vars.path.sep}certs${vars.path.sep}server.crt`,
                                            key: `${vars.path.project}servers${vars.path.sep + config.id + vars.path.sep}certs${vars.path.sep}server.key`
                                        };
                                        save(config.callback, "servers-web");
                                    }
                                };
                            file.read({
                                callback: read_certificates,
                                location: path.replace(/\.pfx$/, ".crt"),
                                no_file: null,
                                section: "certificate"
                            });
                            file.read({
                                callback: read_certificates,
                                location: path,
                                no_file: null,
                                section: "certificate"
                            });
                        }
                    }, {
                        cwd: cert_path
                    }).execute();
                },
                cert_extensions:string = (function services_certificate_cert_extensions():string {
                    const server:supplemental_server_config = (vars.data.server[config.id] === undefined)
                            ? null
                            : vars.data.server[config.id].config,
                        output:string[] = [
                            `[ ca ]
        basicConstraints       = CA:false
        subjectKeyIdentifier   = hash
        authorityKeyIdentifier = keyid,issuer
        subjectAltName         = @alt_names
        nameConstraints        = @name_constraints

[ selfSign ]
        basicConstraints     = critical,CA:true,pathlen:1
        subjectKeyIdentifier = hash
        subjectAltName       = @alt_names
        nameConstraints      = @name_constraints

[ name_constraints ]`,
                            "",
                            `        # End Constraints

[ alt_names ]`,
                            "",
                            "        # End Alt Names"
                        ],
                        keys:string[] = (server === null || server.redirect_domain === null || server.redirect_domain === undefined)
                            ? []
                            : Object.keys(server.redirect_domain),
                        total_keys:number = keys.length,
                        total_local:number = (server === null)
                            ? 0
                            : server.domain_local.length,
                        // total_int:number = vars.interfaces.length,
                        list1:string[] = [],
                        list2:string[] = [],
                        values:string[] = [];
                    let cert_index:number = 0,
                        line_index:number = 0;
                    // redirect_domain
                    if (total_keys > 0) {
                        do {
                            if (
                                keys[cert_index] !== "" &&
                                (/\.secure$/).test(keys[cert_index]) === false &&
                                keys[cert_index].indexOf("[") < 0 &&
                                node.net.isIPv4(keys[cert_index]) === false &&
                                node.net.isIPv6(keys[cert_index]) === false &&
                                values.includes(keys[cert_index]) === false
                            ) {
                                values.push(keys[cert_index]);
                                list1.push(`        permitted;DNS.${line_index} = ${keys[cert_index]}`);
                                list2.push(`        DNS.${line_index} = ${keys[cert_index]}`);
                                line_index = line_index + 1;
                            }
                            cert_index = cert_index + 1;
                        } while (cert_index < total_keys);
                    }
                    // domain_local
                    if (total_local > 0) {
                        cert_index = 0;
                        do {
                            if (
                                server.domain_local[cert_index] !== "" &&
                                server.domain_local[cert_index].indexOf("[") < 0 &&
                                node.net.isIPv4(server.domain_local[cert_index]) === false &&
                                node.net.isIPv6(server.domain_local[cert_index]) === false &&
                                values.includes(server.domain_local[cert_index]) === false
                            ) {
                                values.push(server.domain_local[cert_index]);
                                list1.push(`        permitted;DNS.${line_index} = ${server.domain_local[cert_index]}`);
                                list2.push(`        DNS.${line_index} = ${server.domain_local[cert_index]}`);
                                line_index = line_index + 1;
                            }
                            cert_index = cert_index + 1;
                        } while (cert_index < total_local);
                    }
                    // interfaces
                    // if (total_int > 0) {
                    //     line_index = 0;
                    //     cert_index = 0;
                    //     do {
                    //         if (
                    //             vars.interfaces[cert_index] !== "localhost" &&
                    //             vars.interfaces[cert_index].indexOf("[") < 0 &&
                    //             values.includes(vars.interfaces[cert_index]) === false
                    //         ) {
                    //             values.push(vars.interfaces[cert_index]);
                    //             list1.push(`        permitted;IP.${line_index} = ${vars.interfaces[cert_index]}`);
                    //             list2.push(`        IP.${line_index} = ${vars.interfaces[cert_index]}`);
                    //             line_index = line_index + 1;
                    //         }
                    //         cert_index = cert_index + 1;
                    //     } while (cert_index < total_int);
                    // }
                    output[1] = list1.join("\n");
                    output[3] = list2.join("\n");
                    return output.join("\n");
                }()),

                // OpenSSL features used:
                // * file extensions
                //    - crt: certificate
                //    - csr: certificate signing request
                //    - key: private key associated with a certificate
                //    - srl: CA serial number associated with certificate signing
                // * genpkey, command to generate a private key - https://www.openssl.org/docs/man1.0.2/man1/openssl-genpkey.html
                //    - algorithm: public key algorithm to use
                //    - out      : filename of key output
                // * req, a certificate request command - https://www.openssl.org/docs/man1.0.2/man1/openssl-req.html
                //    - days : time to live in days (expiry)
                //    - key  : key filepath to read from
                //    - new  : generate a new certificate
                //    - nodes: not encrypt a created private key
                //    - out  : filename of certificate output
                //    - subj : data to populate into the certificate
                //    - x509 : generate a self-signed cert
                // * x509, command to display and sign certificates - https://www.openssl.org/docs/man1.0.2/man1/openssl-x509.html
                //    - CA            : specifies the CA certificate file to use for signing
                //    - CAcreateserial: creates a CA serial number file, necessary to avoid an OpenSSL error
                //    - CAkey         : specifies the CA private key file to use for signing
                //    - days          : time to live in days (expiry)
                //    - extensions    : specifies the form of extensions "x509_ext" contained in the extensions file
                //    - extfile       : file location of extension details
                //    - in            : specifies certificate request file path of certificate to sign
                //    - out           : file location to output the signed certificate
                //    - req           : use a certificate request as input opposed to an actual certificate
                create = function services_certificate_cert_create():void {
                    const mode:[string, string] = (config.selfSign === true)
                            ? ["server", domain]
                            : ["root", domain],
                        org:string = `/O=${vars.environment.name.capitalize()}/OU=${vars.environment.name.capitalize()}`,
                        cert = function services_certificate_create_cert(type:type_certName, parent:"int"|"root", path:"ca"|"selfSign"):void {
                            // key file
                            commands.push(`openssl genrsa -out ${type}.key 4096`);
                            // certificate file
                            commands.push(`openssl req -new -sha512 -key ${type}.key -out ${type}.csr -subj "/CN=${domain + org}"`);
                            // sign the certificate
                            commands.push(`openssl x509 -req -sha512 -in ${type}.csr -days ${config.days} -out ${type}.crt -CA ${parent}.crt -CAkey ${parent}.key -CAcreateserial -extfile "extensions.cnf" -extensions ${path}`);
                        },
                        root:string = `openssl req -x509 -new -newkey rsa:4096 -nodes -key ${mode[0]}.key -days ${config.days} -out ${mode[0]}.crt -subj "/CN=${mode[1] + org}"`;
                    commands.push("openssl genrsa -out root.key 4096");
                    if (config.selfSign === true) {
                        commands.push(`${root} -config "extensions.cnf" -extensions selfSign}`);
                    } else {
                        commands.push(root);
                        cert("int", "root", "selfSign");
                        cert("server", "int", "ca");
                        cert(client as "client", "int", "ca");
                        commands.push(`openssl pkcs12 -export -passout pass: -out ${client}.pfx -inkey ${client}.key -in ${client}.crt`);
                    }
                    crypto();
                };
            file.write({
                callback: create,
                contents: cert_extensions,
                location: `${cert_path}extensions.cnf`,
                section: "servers-web"
            });
        };
    if (vars.options.demo === true) {
        config.callback();
    } else {
        file.stat({
            callback: cert,
            location: cert_path,
            no_file: function services_certificate_mkdir():void {
                file.mkdir({
                    callback: cert,
                    location: cert_path,
                    section: "servers-web"
                });
            },
            section: "servers-web"
        });
    }
};

export default certificate;
