
import error from "./error.js";
import node from "./node.js";
import vars from "./vars.js";

// cspell: words bestaudio, keyid, multistreams, pathlen

const startup = function utilities_startup(callback:() => void):void {

    vars.path.project = process.argv[1].slice(0, process.argv[1].indexOf(`${vars.sep}js${vars.sep}`)) + vars.sep;
    vars.path.conf = `${vars.path.project}lib${vars.sep}conf${vars.sep}`;

    // port map to proxy vanity domains
    // if different ports for tls versus net socket then list the TLD as ".secure"
    node.fs.readFile(`${vars.path.project}config.json`, function utilities_startup_config(erp:node_error, fileContents:Buffer):void {
        if (erp === null) {
            const instructions = function utilities_startup_config_instructions():void {
                const config:project_config = JSON.parse(fileContents.toString()) as project_config,
                    sep = function utilities_startup_config_instructions_paths_sep(input:string):string {
                        if (input.charAt(input.length - 1) === vars.sep) {
                            return input;
                        }
                        return input + vars.sep;
                    },
                    assignment = function utilities_startup_config_instructions_paths_assignment(key:type_vars):void {
                        // @ts-expect-error - TypeScript cannot infer a named object property from a typed value of a union.
                        vars[key] = (config[key] === undefined || config[key] === null)
                            ? vars[key]
                            : config[key];
                    },
                    includes = function utilities_startup_config_instructions_paths_includes(input:string):void {
                        if (vars.domain_local.includes(input) === false && input.toLowerCase().indexOf("fe80") !== 0) {
                            vars.domain_local.push(input);
                        }
                    },
                    interfaces:{ [index: string]: node_os_NetworkInterfaceInfo[]; } = node.os.networkInterfaces(),
                    keys:string[] = Object.keys(interfaces);
                let index:number = keys.length,
                    sub:number = 0;
                assignment("block_list");
                assignment("domain_local");
                assignment("redirect_domain");
                assignment("redirect_internal");
                assignment("server_name");
                assignment("service_port");
                vars.path.storage = sep(config.path.storage);
                vars.path.web_root = sep(config.path.web_root);
                includes("127.0.0.1");
                includes("::1");
                includes("[::1]");
                do {
                    index = index - 1;
                    sub = interfaces[keys[index]].length;
                    do {
                        sub = sub - 1;
                        includes(interfaces[keys[index]][sub].address);
                    } while (sub > 0);
                } while (index > 0);
                callback();
            };
            node.fs.stat(vars.path.conf, function utilities_startup_config_stat(ers:node_error):void {
                if (ers === null) {
                    instructions();
                } else {
                    if (ers.code === "ENOENT") {
                        node.fs.mkdir(vars.path.conf, function utilities_startup_config_stat_mkdir(erm:node_error):void {
                            if (erm === null) {
                                instructions();
                            } else {
                                error([`Error creating directory ${vars.path.conf}.`], erm);
                            }
                        });
                    } else {
                        error([`Error reading directory ${vars.path.conf}.`], ers);
                    }
                }
            });
        } else {
            error(["Error reading config.json file from project root."], erp);
        }
    });
};

export default startup;