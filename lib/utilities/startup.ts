
import error from "./error.js";
import node from "./node.js";
import vars from "./vars.js";

// cspell: words bestaudio, keyid, multistreams, pathlen

const startup = function utilities_startup(callback:() => void):void {
    const read = function utilities_startup_read(erp:node_error, fileContents:Buffer):void {
        if (erp === null) {
            const instructions = function utilities_startup_read_instructions():void {
                const config:project_config = JSON.parse(fileContents.toString()) as project_config,
                    sep = function utilities_startup_stat_config_instructions_sep(input:string):string {
                        if (input.charAt(input.length - 1) === vars.sep) {
                            return input;
                        }
                        return input + vars.sep;
                    },
                    assignment = function utilities_startup_read_instructions_assignment(key:type_vars):void {
                        // @ts-expect-error - TypeScript cannot infer a named object property from a typed value of a union.
                        vars[key] = (config[key] === undefined || config[key] === null)
                            ? vars[key]
                            : config[key];
                    },
                    includes = function utilities_startup_read_instructions_includes(input:string):void {
                        if (vars.domain_local.includes(input) === false && input.toLowerCase().indexOf("fe80") !== 0) {
                            vars.domain_local.push(input);
                        }
                    },
                    paths = function utilities_startup_read_instructions_paths(input:type_paths):void {
                        if (config.path === undefined || config.path === null || config.path[input] === undefined || config.path[input] === null) {
                            vars.path[input] = `${vars.path.project}assets/`;
                        } else {
                            vars.path[input] = config.path[input];
                        }
                    },
                    interfaces:{ [index: string]: node_os_NetworkInterfaceInfo[]; } = node.os.networkInterfaces(),
                    keys:string[] = Object.keys(interfaces);
                let index:number = keys.length,
                    sub:number = 0;
                assignment("block_list");
                assignment("domain_local");
                assignment("ports");
                assignment("redirect_domain");
                assignment("redirect_internal");
                assignment("server_name");
                paths("storage");
                paths("web_root");
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
            node.fs.stat(vars.path.conf, function utilities_startup_read_stat(ers:node_error):void {
                if (ers === null) {
                    instructions();
                } else {
                    if (ers.code === "ENOENT") {
                        node.fs.mkdir(vars.path.conf, function utilities_startup_read_stat_mkdir(erm:node_error):void {
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
            error(["Error reading config.json file from project root."], ers);
        }
    };

    vars.path.project = process.argv[1].slice(0, process.argv[1].indexOf(`${vars.sep}js${vars.sep}`)) + vars.sep;
    vars.path.conf = `${vars.path.project}lib${vars.sep}conf${vars.sep}`;
    node.fs.stat(`${vars.path.project}config.json`, stat);
};

export default startup;