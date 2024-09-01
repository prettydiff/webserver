
import error from "../utilities/error.js";
import node from "../utilities/node.js";
import vars from "../utilities/vars.js";

const create_config = function commands_createConfig():void {
    const configPath:string = `${vars.path.project}config.json`,
        config:project_config = {
            block_list: {
                host: [],
                ip: [],
                referer: []
            },
            domain_local: [],
            path: {
                storage: "",
                web_root: `${vars.path.project}assets/`
            },
            ports: {
                service: {
                    open: 80,
                    secure: 443
                }
            },
            redirect_domain: {
                "": ["", 0]
            },
            redirect_internal: {
                "": {
                    "": ""
                }
            },
            server_name: ""
        };
    node.fs.stat(configPath, function commands_createConfig_stat(ers:node_error):void {
        if (ers === null) {
            error([
                "Project's config.json file already exists.",
                `Delete the existing ${vars.text.angry + configPath + vars.text.none} file before creating a new one.`
            ], null, false);
            return process.exit(1);
        }
        if (ers.code === "ENOENT") {
            node.fs.writeFile(configPath, JSON.stringify(config), function commands_createConfig_stat_writeFile(erw:node_error):void {
                if (erw !== null) {
                    error([
                        `Error writing file: ${vars.text.angry + configPath + vars.text.none} during the create_config command.`
                    ], ers, true);
                    return process.exit(1);
                }
                return process.exit(0);
            });
        }
        error([
            `Error reading file: ${vars.text.angry + configPath + vars.text.none} during the create_config command.`
        ], ers, true);
        return process.exit(1);
    });
};

export default create_config;