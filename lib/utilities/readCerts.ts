
import error from "./error.js";
import node from "./node.js";
import vars from "./vars.js";

const readCerts = function utilities_readCerts(callback:(options:transmit_tlsOptions, certLogs:string[]) => void):void {
    const certLocation:string = `${vars.path.project}lib${vars.sep}certs${vars.sep}`,
        certName:string = "server",
        caName:string = "int",
        https:transmit_tlsOptions = {
            options: {
                ca: "",
                cert: "",
                key: ""
            },
            fileFlag: {
                ca: false,
                crt: false,
                key: false
            }
        },
        certCheck = function utilities_readCerts_certCheck():void {
            if (https.fileFlag.ca === true && https.fileFlag.crt === true && https.fileFlag.key === true) {
                if (https.options.ca === "" || https.options.cert === "" || https.options.key === "") {
                    error([
                        `${vars.text.angry}Required certificate files are missing.${vars.text.none}`,
                        "Run the build again:",
                        `${vars.text.cyan}npm run build${vars.text.none}`
                    ], null, true);
                } else {
                    callback(https, []);
                }
            }
        },
        httpsRead = function utilities_readCerts_httpsRead(certType:type_certKey):void {
            const location:string = (certType === "ca")
                ? `${certLocation + caName}.crt`
                : `${certLocation + certName}.${certType}`;
            node.fs.readFile(location, "utf8", function utilities_readCerts_httpsRead_readFile(fileError:node_error, fileData:string):void {
                https.fileFlag[certType] = true;
                if (fileError === null) {
                    if (certType === "crt") {
                        https.options.cert = fileData;
                    } else {
                        https.options[certType] = fileData;
                    }
                }
                certCheck();
            });
        },
        httpsFile = function utilities_readCerts_httpsFile(certType:type_certKey):void {
            const location:string = (certType === "ca")
                ? `${certLocation + caName}.crt`
                : `${certLocation + certName}.${certType}`;
            node.fs.stat(location, function utilities_readCerts_httpsFile_stat(statError:node_error):void {
                if (statError === null) {
                    httpsRead(certType);
                } else {
                    https.fileFlag[certType] = true;
                    certCheck();
                }
            });
        };

    httpsFile("ca");
    httpsFile("crt");
    httpsFile("key");
};

export default readCerts;