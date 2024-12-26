
import file from "../utilities/file.js";
import log from "../utilities/log.js";
import vars from "../utilities/vars.js";

// cspell: words bestaudio, keyid, multistreams, pathlen

const yt_config = function services_ytConfig(name:string, callback:() => void):void {
    const server:server = vars.servers[name];
    if (server === undefined) {
        log({
            action: null,
            config: null,
            message: `Server named ${name} does not exist. Called from library yt_config.`,
            status: "error",
            type: "log"
        });
    } else {
        const dest:string = vars.path.servers + name + vars.sep,
            confWritten = function services_ytConfig_confWritten():void {
                conf_count = conf_count + 1;
                if (conf_count === conf_total) {
                    callback();
                }
            },
            conf:store_string = (function services_ytConfig_confWritten_paths():store_string {
                return {
                    "audio": `-f bestaudio -o ${dest}%(title)sx.%(ext)s --audio-format mp3 --audio-quality 0 --extract-audio --no-mtime --no-playlist --downloader aria2c`,
                    "audio-file": `--exec "ffmpeg -i ${dest}%(title)sx.%(ext)s -vn -ab 320k -ar 48000 -y ${dest}%(artist)s-%(title)s.%(ext)s && rm ${dest}%(title)sx.%(ext)s"`,
                    "audio-playlist": `--exec "ffmpeg -i ${dest}%(title)sx.%(ext)s -vn -ab 320k -ar 48000 -y ${dest}%(artist)s-%(playlist_title)s-%(playlist_index)s%(title)s.%(ext)s && rm ${dest}%(title)sx.%(ext)s"`,
                    "audio-video": `-f m4a -o ${dest}%(artist)s-%(playlist_title)s-%(playlist_index)s%(title)s.%(ext)s --audio-multistreams --audio-quality 0 --extract-audio --no-mtime --no-playlist --downloader aria2c`,
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
                    "video": `-f mp4 -o ${dest}%(artist)s-%(playlist_title)s-%(playlist_index)s%(title)s.%(ext)s --no-mtime --no-playlist --video-multistreams --downloader aria2c`
                };
            }()),
            files:[string, string][] = [
                [`${dest}audio-file.conf`, [conf.audio, conf.meta, conf["audio-file"]].join("\n")],
                [`${dest}audio-playlist.conf`, [conf.audio, conf.meta, conf["audio-playlist"]].join("\n")],
                [`${dest}audio-video.conf`, [conf["audio-video"], conf.meta].join("\n")],
                [`${dest}video-file.conf`, [conf.video, conf.meta].join("\n")],
                [`${dest}video-playlist.conf`, [conf.video, conf.meta].join("\n")]
            ],
            conf_total:number = files.length;
        let conf_count:number = 0,
            index:number = 0;
        do {
            file.write({
                callback: confWritten,
                contents: files[index][1],
                error_terminate: null,
                location: files[index][0]
            });
            index = index + 1;
        } while (index < conf_total);
    }
};

export default yt_config;