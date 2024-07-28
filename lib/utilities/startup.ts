
import error from "./error.js";
import node from "./node.js";
import vars from "./vars.js";

// cspell: words bestaudio, multistreams

const startup = function utilities_startup(callback:() => void):void {

    vars.path.project = process.argv[1].slice(0, process.argv[1].indexOf(`${vars.sep}js${vars.sep}`)) + vars.sep;
    vars.path.yt_dlp = `${vars.path.project}lib${vars.sep}conf${vars.sep}`;

    // port map to proxy vanity domains
    // if different ports for tls versus net socket then list the TLD as ".secure"
    node.fs.readFile(`${vars.path.project}config.json`, function transmit_server_portMap(erp:node_error, fileContents:Buffer):void {
        if (erp === null) {
            let confCount:number = 0;
            const config:projectConfig = JSON.parse(fileContents.toString()) as projectConfig,
                confWritten = function utilities_startup_confWritten():void {
                    confCount = confCount + 1;
                    if (confCount === 5) {
                        callback();
                    }
                },
                conf:store_string = (function utilities_startup_paths():store_string {
                    vars.port_map = config.port_map;
                    vars.path.storage = config.path.storage;
                    vars.path.web_root = config.path.web_root;
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
                }());
            node.fs.writeFile(`${vars.path.yt_dlp}audio-file.conf`, [conf.audio, conf.meta, conf["audio-file"]].join("\n"), confWritten);
            node.fs.writeFile(`${vars.path.yt_dlp}audio-playlist.conf`, [conf.audio, conf.meta, conf["audio-playlist"]].join("\n"), confWritten);
            node.fs.writeFile(`${vars.path.yt_dlp}audio-video.conf`, [conf["audio-video"], conf.meta].join("\n"), confWritten);
            node.fs.writeFile(`${vars.path.yt_dlp}video-file.conf`, [conf.video, conf.meta].join("\n"), confWritten);
            node.fs.writeFile(`${vars.path.yt_dlp}video-playlist.conf`, [conf.video, conf.meta].join("\n"), confWritten);

        } else {
            error(["Error reading project file portMap.json, which maps vanity domains to port numbers for the HTTP proxy."], erp);
        }
    });
};

export default startup;