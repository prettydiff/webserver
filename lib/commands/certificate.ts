
import file from "../utilities/file.js";
import log from "../utilities/log.js";
import node from "../utilities/node.js";
import vars from "../utilities/vars.js";

// cspell:word addstore, CAcreateserial, certutil, delstore, extfile, genpkey, keyid, pathlen

const certificate = function commands_certificate(config:config_certificate):void {
    const cert_path:string = `${vars.path.project}servers${vars.sep + config.name + vars.sep}certs${vars.sep}`,
        cert = function commands_certificate_cert():void {
            let index:number = 0;
            const commands:string[] = [],
                crypto = function commands_certificate_cert_crypto():void {
                    node.child_process.exec(commands[index], {
                        cwd: cert_path
                    }, function commands_certificate_cert_crypto_child(erChild:node_childProcess_ExecException):void {
                        if (erChild === null) {
                            index = index + 1;
                            if (index < commands.length) {
                                commands_certificate_cert_crypto();
                            } else {
                            config.callback();
                            }
                        } else {
                            log({
                                action: "add",
                                config: vars.servers[config.name],
                                message: `Error executing command: ${commands[index]}`,
                                status: "error",
                                type: "server"
                            });
                        }
                    });
                },
                cert_extensions:string = (function commands_certificate_cert_extensions():string {
                    const server:server_configuration = (vars.servers[config.name] === undefined)
                            ? null
                            : vars.servers[config.name].config,
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

        [ name_constraints ]
        # Name constraints list is dynamically populated from vars.network.domain
        permitted;DNS.1 = localhost
        permitted;DNS.2 = 192.168.0.3`,
                        "",
                        `# permitted;IP.1 = 127.0.0.1/255.0.0.0
        # End Constraints

        [ alt_names ]
        # Alt names list is dynamically populated from vars.network.domain
        DNS.1 = localhost
        DNS.2 = 192.168.0.3`,
                        "",
                        `# IP.1 = 127.0.0.1/255.0.0.0
        # End Alt Names
        `
                        ],
                        keys:string[] = (server === null)
                            ? []
                            : Object.keys(server.redirect_domain),
                        total_keys:number = keys.length,
                        total_local:number = (server === null)
                            ? 0
                            : server.domain_local.length,
                        list1:string[] = [],
                        list2:string[] = [];
                    let cert_index:number = 0,
                        line_index:number = 3;
                    if (total_keys > 0) {
                        do {
                            if (keys[cert_index] !== "" && (/\.secure$/).test(keys[cert_index]) === false) {
                                list1.push(`permitted;DNS.${line_index} = ${keys[cert_index]}`);
                                list2.push(`DNS.${line_index} = ${keys[cert_index]}`);
                                line_index = line_index + 1;
                            }
                            cert_index = cert_index + 1;
                        } while (cert_index < total_keys);
                    }
                    if (total_local > 0) {
                        cert_index = 0;
                        do {
                            if (server.domain_local[cert_index] !== "") {
                                list1.push(`permitted;DNS.${line_index} = ${server.domain_local[cert_index]}`);
                                list2.push(`DNS.${line_index} = ${server.domain_local[cert_index]}`);
                                line_index = line_index + 1;
                            }
                            cert_index = cert_index + 1;
                        } while (cert_index < total_local);
                    }
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
                create = function commands_certificate_cert_create():void {
                    const mode:[string, string] = (config.selfSign === true)
                            ? ["server", config.domain_default]
                            : ["root", config.domain_default],
                        org:string = "/O=home_server/OU=home_server",
                        // provides the path to the configuration file used for certificate signing
                        pathConf = function commands_certificate_cert_create_confPath(configName:"ca"|"selfSign"):string {
                            return `"${cert_path}extensions.cnf" -extensions ${configName}`;
                        },
                        // create a certificate signed by another certificate
                        actionCert = function commands_certificate_cert_create_cert(type:"int"|"server"):string {
                            return `openssl req -new -sha512 -key ${type}.key -out ${type}.csr -subj "/CN=${config.domain_default + org}"`;
                        },
                        // generates the key file associated with a given certificate
                        actionKey = function commands_certificate_cert_create_key(type:"int"|"root"|"server"):string {
                            return `openssl genrsa -out ${type}.key 4096`;
                        },
                        // signs the certificate
                        actionSign = function commands_certificate_cert_create_sign(cert:string, parent:string, path:"ca"|"selfSign"):string {
                            return `openssl x509 -req -sha512 -in ${cert}.csr -days ${config.days} -out ${cert}.crt -CA ${parent}.crt -CAkey ${parent}.key -CAcreateserial -extfile ${pathConf(path)}`;
                        },
                        root:string = `openssl req -x509 -new -newkey rsa:4096 -nodes -key ${mode[0]}.key -days ${config.days} -out ${mode[0]}.crt -subj "/CN=${mode[1] + org}"`;
                    if (config.selfSign === true) {
                        commands.push(actionKey("root"));
                        commands.push(`${root} -config ${pathConf("selfSign")}`);
                    } else {
                        // 1. generate a private key for root certificate
                        commands.push(actionKey("root"));
                        // 2. generate a root certificate
                        commands.push(root);
                        // 3. generate a private key for intermediate certificate
                        commands.push(actionKey("int"));
                        // 4. generate an intermediate certificate signing request
                        commands.push(actionCert("int"));
                        // 5. sign the intermediate certificate with the root certificate
                        commands.push(actionSign("int", "root", "selfSign"));
                        // 6. generate a private key for server certificate
                        commands.push(actionKey("server"));
                        // 7. generate a server certificate signing request
                        commands.push(actionCert("server"));
                        // 8. sign the server certificate with the intermediate certificate
                        commands.push(actionSign("server", "int", "ca"));
                    }
                    crypto();
                };
            file.write({
                callback: create,
                contents: cert_extensions,
                error_terminate: vars.servers[config.name],
                location: `${cert_path}extensions.cnf`
            });
        };
    file.stat({
        callback: cert,
        error_terminate: vars.servers[config.name],
        location: cert_path,
        no_file: function commands_certificate_mkdir():void {
            file.mkdir({
                callback: cert,
                error_terminate: vars.servers[config.name],
                location: cert_path
            });
        }
    });
};

export default certificate;