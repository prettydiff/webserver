
import error from "./error.js";
import node from "./node.js";
import vars from "./vars.js";

// cspell:word addstore, CAcreateserial, certutil, delstore, extfile, genpkey

const certificate = function utilities_certificate(config:config_certificate):void {
    const cert_path:string = `${vars.path.project}lib${vars.sep}certs`;
    node.fs.stat(cert_path, function utilities_certificate_stat(ers:node_error):void {
        const cert = function utilities_certificate_stat_cert():void {
            let index:number = 0;
            const commands:string[] = [],
                crypto = function utilities_certificate_stat_cert_crypto():void {
                    node.child_process.exec(commands[index], {
                        cwd: cert_path
                    }, function utilities_certificate_stat_cert_crypto_child(erChild:node_childProcess_ExecException):void {
                        if (erChild === null) {
                            index = index + 1;
                            if (index < commands.length) {
                                utilities_certificate_stat_cert_crypto();
                            } else {
                            config.callback();
                            }
                        } else {
                            error([`Error executing command: ${commands[index]}`], erChild);
                        }
                    });
                },

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
                create = function utilities_certificate_stat_cert_create():void {
                    const mode:[string, string] = (config.selfSign === true)
                            ? ["server", vars.domain]
                            : ["root", vars.domain],
                        org:string = `/O=home_server/OU=home_server`,
                        // provides the path to the configuration file used for certificate signing
                        pathConf = function utilities_certificate_stat_cert_create_confPath(configName:"ca"|"selfSign"):string {
                            return `"${vars.path.conf}extensions.cnf" -extensions ${configName}`;
                        },
                        // create a certificate signed by another certificate
                        actionCert = function utilities_certificate_stat_cert_create_cert(type:"int"|"server"):string {
                            return `openssl req -new -sha512 -key ${type}.key -out ${type}.csr -subj "/CN=${vars.domain + org}"`;
                        },
                        // generates the key file associated with a given certificate
                        actionKey = function utilities_certificate_stat_cert_create_key(type:"int"|"root"|"server"):string {
                            return `openssl genrsa -out ${type}.key 4096`;
                        },
                        // signs the certificate
                        actionSign = function utilities_certificate_stat_cert_create_sign(cert:string, parent:string, path:"ca"|"selfSign"):string {
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
            create();
        };
        if (ers === null) {
            cert();
        } else {
            if (ers.code === "ENOENT") {
                node.fs.mkdir(cert_path, function utilities_certificate_mkdir(erm:node_error):void {
                    if (erm === null) {
                        cert();
                    } else {
                        error([`Not able to create directory: ${cert_path}`], erm);
                    }
                });
            } else {
                error([`Not able to create directory: ${cert_path}`], ers);
            }
        }
    });
};

export default certificate;