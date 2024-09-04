
import node from "../utilities/node.js";
import vars from "../utilities/vars.js";

// cspell: words bestaudio, keyid, multistreams, pathlen

const yt_config = function commands_ytConfig(name:string, callback:() => void):void {
    const server:server = vars.servers[name],
        confWritten = function commands_startup_config_instructions_confWritten():void {
            conf_count = conf_count + 1;
            if (conf_count === conf_total) {
                callback();
            }
        },
        conf:store_string = (function commands_startup_config_instructions_paths():store_string {
            return {
                "audio": `-f bestaudio -o ${server.path.storage}%(title)sx.%(ext)s --audio-format mp3 --audio-quality 0 --extract-audio --no-mtime --no-playlist --downloader aria2c`,
                "audio-file": `--exec "ffmpeg -i ${server.path.storage}%(title)sx.%(ext)s -vn -ab 320k -ar 48000 -y ${server.path.storage}%(artist)s-%(title)s.%(ext)s && rm ${server.path.storage}%(title)sx.%(ext)s"`,
                "audio-playlist": `--exec "ffmpeg -i ${server.path.storage}%(title)sx.%(ext)s -vn -ab 320k -ar 48000 -y ${server.path.storage}%(artist)s-%(playlist_title)s-%(playlist_index)s%(title)s.%(ext)s && rm ${server.path.storage}%(title)sx.%(ext)s"`,
                "audio-video": `-f m4a -o ${server.path.storage}%(artist)s-%(playlist_title)s-%(playlist_index)s%(title)s.%(ext)s --audio-multistreams --audio-quality 0 --extract-audio --no-mtime --no-playlist --downloader aria2c`,
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
                "video": `-f mp4 -o ${server.path.storage}%(artist)s-%(playlist_title)s-%(playlist_index)s%(title)s.%(ext)s --no-mtime --no-playlist --video-multistreams --downloader aria2c`
            };
        }()),
        cert_extensions:string = (function commands_startup_config_instructions_certExtensions():string {
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
                keys:string[] = Object.keys(server.redirect_domain),
                total_keys:number = keys.length,
                total_local:number = server.domain_local.length,
                list1:string[] = [],
                list2:string[] = [];
            let cert_index:number = 0,
                line_index:number = 3;
            if (total_keys > 0) {
                do {
                    if ((/\.secure$/).test(keys[cert_index]) === false) {
                        list1.push(`permitted;DNS.${line_index} = ${keys[cert_index]}`);
                        list2.push(`DNS.${line_index} = ${keys[cert_index]}`);
                        line_index = line_index + 1;
                    }
                    cert_index = cert_index + 1;
                } while (cert_index < total_keys);
            }
            if (total_local > 0) {
                cert_index = 0;
                do {
                    list1.push(`permitted;DNS.${line_index} = ${server.domain_local[cert_index]}`);
                    list2.push(`DNS.${line_index} = ${server.domain_local[cert_index]}`);
                    line_index = line_index + 1;
                    cert_index = cert_index + 1;
                } while (cert_index < total_local);
            }
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
        conf_total:number = files.length;
    let conf_count:number = 0,
        index:number = 0;
    do {
        node.fs.writeFile(files[index][0], files[index][1], confWritten);
        index = index + 1;
    } while (index < conf_total);
};

export default yt_config;