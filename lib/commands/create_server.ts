
import certificate from "./certificate.js";
import error from "../utilities/error.js";
import log from "../utilities/log.js";
import node from "../utilities/node.js";
import vars from "../utilities/vars.js";

const create_server = function commands_createServer(name:string):void {
    const configPath:string = `${vars.path.project}config.json`,
        locations:store_string = {
            "assets": `${vars.path.project}lib${vars.sep}assets${vars.sep + name}/`,
            "certs": `${vars.path.certs + name}/`
        },
        locations_created:store_flag = {
            "assets": false,
            "certs": false
        },
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
            "certificates": "${locations.certs}",
            "storage": "${locations.assets}",
            "web_root": "${locations.assets}"
        },
        "ports": {
            "open": 0,
            "secure": 0
        },
        "redirect_domain": {
            "": ["", 0]
        },
        "redirect_internal": {
            "": {
                "": ""
            }
        },
        "server_name": "${name}"
    }
`,
        flags:store_flag = {
            assets: false,
            certs: false,
            config: false
        },
        complete = function commands_createServer_complete(input:"assets"|"certs"|"config"):void {
            flags[input] = true;
            if (flags.assets === true && flags.certs === true && flags.config === true) {
                certificate({
                    callback: function commands_createServer_complete_certificate():void {
                        const dirText = function commands_createServer_complete_certificate_dirText(key:"assets"|"certs"):string {
                            return (locations_created[key] === true)
                                ? `Directory ${vars.text.cyan + locations[key] + vars.text.none} created.`
                                : `Directory ${vars.text.cyan + locations[key] + vars.text.none} already exists.`;
                        };
                        log([
                            `Server ${vars.text.cyan + name + vars.text.none} created in both the config.json file and default asset directory. Please restart the application to execute the new server.`,
                            dirText("assets"),
                            dirText("certs"),
                            "Certificates created."
                        ], true);
                    },
                    days: 65535,
                    domain_default: null,
                    selfSign: false,
                    server: name
                });
            }
        },
        dirs = function commands_createServer_dirs(input:"assets"|"certs"):void {
            const location:string = locations[input];
            node.fs.stat(location, function commands_createServer_assets(ers:node_error):void {
                if (ers === null) {
                    complete(input);
                } else if (ers.code === "ENOENT") {
                    node.fs.mkdir(location, function commands_createServer_assets_mkdir(erm:node_error):void {
                        if (erm === null) {
                            locations_created[input] = true;
                            complete(input);
                        } else {
                            error([`Error making directory ${location}`], erm, true);
                        }
                    });
                } else {
                    error([`Error performing stat on directory ${location}`], ers, true);
                }
            });
        };
    node.fs.stat(configPath, function commands_createServer_stat(ers:node_error):void {
        const write = function commands_createServer_stat_write(contents:string):void {
            node.fs.writeFile(configPath, contents, function commands_createServer_stat_write_writeFile(erw:node_error):void {
                if (erw === null) {
                    complete("config");
                } else {
                    error([
                        `Error writing file: ${vars.text.angry + configPath + vars.text.none} during the create_server command.`
                    ], erw, true);
                }
            });
        };
        if (ers === null) {
            node.fs.readFile(configPath, function commands_createServer_stat_read(err:node_error, fileRaw:Buffer):void {
                if (err === null) {
                    const str:string = fileRaw.toString(),
                        keys:string[] = Object.keys(JSON.parse(str));
                    if (keys.includes(name) === true) {
                        error([
                            `A server with name ${name} already exists.`,
                            "Either delete the existing server with that name or choose a different name."
                        ], null, true);
                    } else {
                        const fileData:string = fileRaw.toString().replace(/\s*\}\s*$/, `,${config}}`);
                        write(fileData);
                    }
                } else {
                    error(["Error reading application's config.json file."], err, true);
                }
            });
        } else if (ers.code === "ENOENT") {
            write(`{${config}}`);
        } else {
            error([
                `Error reading file: ${vars.text.angry + configPath + vars.text.none} during the create_server command.`
            ], ers, true);
        }
    });
    node.fs.stat(`${vars.path.certs}`, function commands_createServer_certStat(erc:node_error):void {
        if (erc === null) {
            dirs("assets");
            dirs("certs");
        } else if (erc.code === "ENOENT") {
            node.fs.mkdir(`${vars.path.certs}`, function commands_createServer_assets_mkdir(erm:node_error):void {
                if (erm === null) {
                    dirs("assets");
                    dirs("certs");
                } else {
                    error([
                        `Error creating directory: ${vars.text.angry + vars.path.certs + vars.text.none} during the create_server command.`
                    ], erm, true);
                }
            });
        } else {
            error([
                `Error reading directory: ${vars.text.angry + vars.path.certs + vars.text.none} during the create_server command.`
            ], erc, true);
        }
    });
};

export default create_server;