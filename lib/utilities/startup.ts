
import error from "./error.js";
import file from "./file.js";
import node from "./node.js";
import vars from "./vars.js";

// cspell: words bestaudio, keyid, multistreams, pathlen

const startup = function utilities_startup(callback:() => void):void {
    const read = function utilities_startup_read(fileContents:Buffer):void {
        const configStr:string = fileContents.toString(),
            config:project_config = (configStr === "" || (/^\s*\{/).test(configStr) === false || (/\}\s*$/).test(configStr) === false)
                ? null
                : JSON.parse(configStr) as project_config,
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
            keys_srv:string[] = (config === null)
                ? null
                : Object.keys(config);
        let index_int:number = keys_int.length,
            index_srv:number = (config === null)
                ? 0
                : keys_srv.length,
            server:server = null,
            sub:number = 0;
        vars.servers = (config === null)
            ? {}
            : config;
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
    },
    options = function utilities_startup_options(key:"no_color"|"verbose", iterate:string, property:boolean):void {
        const argv:number = process.argv.indexOf(key);
        if (argv > -1) {
            process.argv.splice(argv, 1);
            if (property === true) {
                vars[key as "verbose"] = true;
            }
            if (iterate !== null) {
                const store:store_string = vars[iterate as "text"],
                    keys:string[] = Object.keys(store);
                let index:number = keys.length;
                do {
                    index = index - 1;
                    if (iterate === "text") {
                        store[keys[index]] = "";
                    }
                } while (index > 0);
            }
        }
    };

    options("no_color", "text", false);
    options("verbose", null, true);
    vars.command = process.argv[2] as type_command;
    vars.path.project = process.argv[1].slice(0, process.argv[1].indexOf(`${vars.sep}js${vars.sep}`)) + vars.sep;
    file.read({
        callback: read,
        error_terminate: true,
        location: `${vars.path.project}config.json`,
        no_file: null
    });
};

export default startup;