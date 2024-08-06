
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
                let confCount:number = 0,
                    index:number = 0;
                const config:project_config = JSON.parse(fileContents.toString()) as project_config,
                    confWritten = function utilities_startup_config_instructions_confWritten():void {
                        confCount = confCount + 1;
                        if (confCount === files_total) {
                            callback();
                        }
                    },
                    conf:store_string = (function utilities_startup_config_instructions_paths():store_string {
                        const sep = function utilities_startup_config_instructions_paths_sep(input:string):string {
                                if (input.charAt(input.length - 1) === vars.sep) {
                                    return input;
                                }
                                return input + vars.sep;
                            },
                            assignment = function utilities_startup_config_instructions_paths_assignment(key:vars_type):void {
                                // @ts-expect-error - TypeScript cannot infer a named object property from a typed value of a union.
                                vars[key] = (config[key] === undefined || config[key] === null)
                                    ? vars[key]
                                    : config[key];
                            };
                        assignment("block_list");
                        assignment("domain_default");
                        assignment("redirect_domain");
                        assignment("redirect_internal");
                        assignment("server_name");
                        assignment("service_port");
                        vars.path.storage = sep(config.path.storage);
                        vars.path.web_root = sep(config.path.web_root);
                        return {
                            "audio": `-f bestaudio -o ${vars.path.storage}%(title)sx.%(ext)s --audio-format mp3 --audio-quality 0 --extract-audio --no-mtime --no-playlist`,
                            "audio-file": `--exec "ffmpeg -i ${vars.path.storage}%(title)sx.%(ext)s -vn -ab 320k -ar 48000 -y ${vars.path.storage}%(artist)s-%(title)s.%(ext)s && rm ${vars.path.storage}%(title)sx.%(ext)s"`,
                            "audio-playlist": `--exec "ffmpeg -i ${vars.path.storage}%(title)sx.%(ext)s -vn -ab 320k -ar 48000 -y ${vars.path.storage}%(artist)s-%(playlist_title)s-%(playlist_index)s%(title)s.%(ext)s && rm ${vars.path.storage}%(title)sx.%(ext)s"`,
                            "audio-video": `-f m4a -o ${vars.path.storage}%(artist)s-%(playlist_title)s-%(playlist_index)s%(title)s.%(ext)s --audio-multistreams --audio-quality 0 --extract-audio --no-mtime --no-playlist`,
                            "meta": `--replace-in-metadata artist " and " "And"
--replace-in-metadata artist " of " "Of"
--replace-in-metadata artist " is " "Is"
--replace-in-metadata artist " the " "The"
--replace-in-metadata artist "\\(|\\)| |'|:|," ""
--replace-in-metadata artist "^The" ""
--replace-in-metadata title " and " "And"
--replace-in-metadata title " of " "Of"
--replace-in-metadata title " is " "Is"
--replace-in-metadata title " the " "The"
--replace-in-metadata title "\\(|\\)| |'|:|," ""
--replace-in-metadata title "^The" ""
-u ""
-p ""`,
                            "video": `-f mp4 -o ${vars.path.storage}%(artist)s-%(playlist_title)s-%(playlist_index)s%(title)s.%(ext)s --no-mtime --no-playlist --video-multistreams`
                        };
                    }()),
                    cert_extensions:string = (function utilities_startup_config_instructions_certExtensions():string {
                        const output:string[] = [
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
                            keys:string[] = Object.keys(config.redirect_domain),
                            total:number = keys.length,
                            list1:string[] = [],
                            list2:string[] = [];
                        let cert_index:number = 0,
                            line_index:number = 3;
                        do {
                            if ((/\.secure$/).test(keys[cert_index]) === false) {
                                list1.push(`permitted;DNS.${line_index} = ${keys[cert_index]}`);
                                list2.push(`DNS.${line_index} = ${keys[cert_index]}`);
                                line_index = line_index + 1;
                            }
                            cert_index = cert_index + 1;
                        } while (cert_index < total);
                        list1.push(`permitted;DNS.${line_index} = ${vars.domain_default}`);
                        list2.push(`DNS.${line_index} = ${vars.domain_default}`);
                        output[1] = list1.join("\n");
                        output[3] = list2.join("\n");
                        return output.join("\n");
                    }()),
                    files:[string, string][] = [
                        [`${vars.path.conf}audio-file.conf`, [conf.audio, conf.meta, conf["audio-file"]].join("\n")],
                        [`${vars.path.conf}audio-playlist.conf`, [conf.audio, conf.meta, conf["audio-playlist"]].join("\n")],
                        [`${vars.path.conf}audio-video.conf`, [conf["audio-video"], conf.meta].join("\n")],
                        [`${vars.path.conf}video-file.conf`, [conf.video, conf.meta].join("\n")],
                        [`${vars.path.conf}video-playlist.conf`, [conf.video, conf.meta].join("\n")],
                        [`${vars.path.conf}extensions.cnf`, cert_extensions]
                    ],
                    files_total:number = files.length;
                do {
                    node.fs.writeFile(files[index][0], files[index][1], confWritten);
                    index = index + 1;
                } while (index < files_total);
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