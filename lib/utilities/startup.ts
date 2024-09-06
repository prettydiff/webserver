
import error from "./error.js";
import node from "./node.js";
import vars from "./vars.js";

// cspell: words bestaudio, keyid, multistreams, pathlen

const startup = function utilities_startup(callback:() => void):void {
    const read = function utilities_startup_read(erp:node_error, fileContents:Buffer):void {
        if (erp === null) {
            const instructions = function utilities_startup_read_instructions():void {
                const config:project_config = JSON.parse(fileContents.toString()) as project_config,
                    errorList:string[] = [
                        "Errors on server configurations from the config.json file.",
                        ""
                    ],
                    includes = function utilities_startup_read_instructions_includes(input:string):void {
                        if (server.domain_local.includes(input) === false && input.toLowerCase().indexOf("fe80") !== 0) {
                            server.domain_local.push(input);
                        }
                    },
                    paths = function utilities_startup_read_instructions_paths(input:type_paths):void {
                        if (server.path === undefined || server.path === null || typeof server.path[input] !== "string" || server.path[input] === "") {
                            server.path[input] = `${vars.path.project}lib${vars.sep}assets${vars.sep + keys_srv[index_srv]}/`;
                        }
                    },
                    interfaces:{ [index: string]: node_os_NetworkInterfaceInfo[]; } = node.os.networkInterfaces(),
                    keys_int:string[] = Object.keys(interfaces),
                    keys_srv:string[] = Object.keys(config);
                let index_int:number = keys_int.length,
                    index_srv:number = keys_srv.length,
                    server:server = null,
                    sub:number = 0;
                vars.servers = config;
                if (index_srv > 0) {
                    do {
                        index_srv = index_srv - 1;
                        index_int = keys_int.length;
                        server = vars.servers[keys_srv[index_srv]];
                        if (server.ports === null || server.ports === undefined) {
                            errorList.push(`${vars.text.angry}*${vars.text.none} Server ${vars.text.cyan + keys_srv[index_srv] + vars.text.none} is missing a ${vars.text.angry}ports${vars.text.none} object.`);
                        } else {
                            if (typeof server.ports.open !== "number") {
                                errorList.push(`${vars.text.angry}*${vars.text.none} Server ${vars.text.cyan + keys_srv[index_srv] + vars.text.none} is missing a numeric value for ${vars.text.angry}ports.open${vars.text.none} property.`);
                            }
                            if (typeof server.ports.secure !== "number") {
                                errorList.push(`${vars.text.angry}*${vars.text.none} Server ${vars.text.cyan + keys_srv[index_srv] + vars.text.none} is missing a numeric value for ${vars.text.angry}ports.secure${vars.text.none} property.`);
                            }
                        }
                        if (typeof server.server_name !== "string" || server.server_name === "") {
                            errorList.push(`${vars.text.angry}*${vars.text.none} Server ${vars.text.cyan + keys_srv[index_srv] + vars.text.none} is missing a numeric value for ${vars.text.angry}server_name${vars.text.none} property.`);
                        }
                        if (server.block_list === undefined || server.block_list === null) {
                            server.block_list = {
                                host: [],
                                ip: [],
                                referrer: []
                            };
                        }
                        paths("storage");
                        paths("web_root");
                        includes("127.0.0.1");
                        includes("::1");
                        includes("[::1]");
                        do {
                            index_int = index_int - 1;
                            sub = interfaces[keys_int[index_int]].length;
                            do {
                                sub = sub - 1;
                                includes(interfaces[keys_int[index_int]][sub].address);
                            } while (sub > 0);
                        } while (index_int > 0);
                    } while (index_srv > 0);
                }
                if (errorList.length > 2) {
                    error(errorList, null, true);
                } else {
                    callback();
                }
            };
            instructions();
        } else {
            error(["Error reading config.json file from project root."], erp, true);
        }
    },
    stat = function utilities_startup_stat(ers:node_error):void {
        if (ers === null) {
            node.fs.readFile(`${vars.path.project}config.json`, read);
        } else if (ers.code === "ENOENT") {
            error([
                `File ${vars.text.angry + vars.path.project}config.json${vars.text.none} does not exist.`,
                "See the readme.md file for an example."
            ], null, false);
        } else {
            error(["Error reading config.json file from project root."], ers, true);
        }
    };

    vars.path.project = process.argv[1].slice(0, process.argv[1].indexOf(`${vars.sep}js${vars.sep}`)) + vars.sep;
    vars.path.certs = `${vars.path.project}lib${vars.sep}certs${vars.sep}`;
    node.fs.stat(`${vars.path.project}config.json`, stat);
};

export default startup;