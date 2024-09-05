
import error from "../utilities/error.js";
import node from "../utilities/node.js";
import vars from "../utilities/vars.js";

const create_config = function commands_createConfig(name:string):void {
    const configPath:string = `${vars.path.project}config.json`,
        assets:string = `${vars.path.project}lib${vars.sep}assets${vars.sep + name}/`,
        config:string = `
    "${name}": {
        "block_list": {
            "host": [],
            "ip": [],
            "referer": []
        },
        "domain_local": [],
        "http": {
            "delete": "",
            "post": "",
            "put": ""
        },
        "path": {
            storage: "${assets}",
            web_root: "${assets}"
        },
        ports: {
            open: 0,
            secure: 0
        },
        redirect_domain: {
            "": ["", 0]
        },
        redirect_internal: {
            "": {
                "": ""
            }
        },
        server_name: "${name}"
    }
`,
        flags:store_flag = {
            config: false,
            dir: false
        },
        complete = function commands_createConfig_complete(input:string):void {
            flags[input] = true;
            if (flags.config === true && flags.dir === true) {
                // eslint-disable-next-line no-console
                console.log(`Server ${name} created in both the config.json file and default asset directory. Please restart the application to execute the new server.`);
            }
        },
        write = function commands_createConfig_write(contents:string):void {
            node.fs.writeFile(configPath, contents, function commands_createConfig_write_writeFile(erw:node_error):void {
                if (erw === null) {
                    complete("config");
                }
                error([
                    `Error writing file: ${vars.text.angry + configPath + vars.text.none} during the create_config command.`
                ], erw, true);
            });
        };
    node.fs.stat(assets, function commands_createConfig_assets(ers:node_error):void {
        if (ers === null) {
            complete("dir");
        } else if (ers.code === "ENOENT") {
            node.fs.mkdir(assets, function commands_createConfig_assets_mkdir(erm:node_error):void {
                if (erm === null) {
                    complete("dir");
                } else {
                    error([`Error making directory ${assets}`], erm, true);
                }
            });
        } else {
            error([`Error performing stat on directory ${assets}`], ers, true);
        }
    });
    node.fs.stat(configPath, function commands_createConfig_stat(ers:node_error):void {
        if (ers === null) {
            node.fs.readFile(configPath, function commands_createConfig_stat_read(err:node_error, fileRaw:Buffer):void {
                if (err === null) {
                    const fileData:string = fileRaw.toString().replace(/\s*\}\s*$/, `,${config}}`);
                    write(fileData);
                } else {
                    error(["Error reading application's config.json file."], err, true);
                }
            });
        } else if (ers.code === "ENOENT") {
            write(`{${config}}`);
        }
        error([
            `Error reading file: ${vars.text.angry + configPath + vars.text.none} during the create_config command.`
        ], ers, true);
    });
};

export default create_config;