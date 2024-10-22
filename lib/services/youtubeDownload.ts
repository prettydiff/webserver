
import humanTime from "../utilities/humanTime.js";
import node from "../utilities/node.js";
import send from "../transmit/send.js";
import vars from "../utilities/vars.js";

const youtube_download = function services_youtubeDownload(socketData:socket_data, transmit:transmit_socket):void {
    const data:services_youtubeDownload = socketData.data as services_youtubeDownload,
        socket:websocket_client = transmit.socket as websocket_client,
        type:type_youtubeDownload = data.type,
        types:string[] = type.split("-"),
        originalMediaType:type_youtubeDownload_media = types[0] as type_youtubeDownload_media,
        startTime:bigint = process.hrtime.bigint(),

        message = function services_youtubeDownload_message(item:string, pid:number):void {
            send({
                data: {
                    pid: pid,
                    status: item,
                    time: humanTime(startTime)
                },
                service: "youtube-download-status"
            }, socket, 1);
        },
        spawnOpts:node_childProcess_SpawnOptions = {
            cwd: vars.path.project,
            detached: true,
            shell: true
        },
        merge = function services_youtubeDownload_merge(fileName:string):void {
            const str:string = `ffmpeg -i "${fileName}.mp4" -i "${fileName}.m4a" -c:v copy -c:a aac "${fileName}x.mp4" && rm "${fileName}.mp4" && rm "${fileName}.m4a"`,
                spawn:node_childProcess_ChildProcess = node.child_process.spawn(str, spawnOpts);
            vars.processes[spawn.pid] = spawn;
            message(`[COMMAND] ${str}`, spawn.pid);
            socket.on("close", function services_youtubeDownload_socketClose():void {
                spawn.kill(1);
                delete vars.processes[spawn.pid];
            });
            spawn.on("close", function services_youtubeDownload_merge_close():void {
                message("Operation complete!", spawn.pid);
                spawn.kill(0);
                delete vars.processes[spawn.pid];
            });
            spawn.on("error", function services_youtubeDownload_merge_error(error:node_error):void {
                message(`[SPAWN error] ${JSON.stringify(error)}`, spawn.pid);
            });
            spawn.stderr.on("data", function services_youtubeDownload_merge_stderr(data:Buffer):void {
                message(`[STDERR] ${data.toString()}`, spawn.pid);
            });
            spawn.stdout.on("data", function services_youtubeDownload_merge_data(data:Buffer):void {
                message(data.toString(), spawn.pid);
            });
        },
        createSpawn = function services_youtubeDownload_createSpawn(mediaType:"audio"|"video", fileNameItem:string):void {
            let fileName:string = "";
            const options:string = ((/-+\w/).test(data.options.replace(/^\s+/, "")) === true)
                    ? ` ${data.options}`
                    : "",
                name:string = (originalMediaType === "video" && mediaType === "audio")
                    ? "audio-video.conf"
                    : `${mediaType}-${types[1]}.conf`,
                script:string = `yt-dlp --config-locations ${vars.path.project}servers${vars.sep + socket.server + vars.sep + name + options} ${data.address}`,
                spawn:node_childProcess_ChildProcess = node.child_process.spawn(script, spawnOpts);
            vars.processes[spawn.pid] = spawn;
            message(`[COMMAND] ${script}`, spawn.pid);
            socket.on("close", function services_youtubeDownload_createSpawn_socketClose():void {
                spawn.kill(1);
                delete vars.processes[spawn.pid];
            });
            spawn.on("close", function services_youtubeDownload_close():void {
                if (mediaType === "audio" && originalMediaType === "audio") {
                    message("Operation complete!", spawn.pid);
                } else if (mediaType === "audio" && originalMediaType === "video") {
                    setTimeout(function services_youtubeDownload_createSpawn_close_merge():void {
                        merge(fileNameItem);
                    }, 10000);
                } else if (originalMediaType === "video") {
                    createSpawn("audio", fileName);
                }
                spawn.kill(0);
                delete vars.processes[spawn.pid];
            });
            spawn.on("error", function services_youtubeDownload_createSpawn_error(error:node_error):void {
                message(`[SPAWN error] ${JSON.stringify(error)}`, spawn.pid);
            });
            spawn.stderr.on("data", function services_youtubeDownload_createSpawn_stderr(data:Buffer):void {
                message(`[STDERR] ${data.toString()}`, spawn.pid);
            });
            spawn.stdout.on("data", function services_youtubeDownload_createSpawn_data(data:Buffer):void {
                const str:string = data.toString(),
                    pathFragment:string = "[download] Destination: ";
                if (mediaType === "video" && str.indexOf(pathFragment) > -1 && str.indexOf(`${vars.sep}yt_download${vars.sep}`) > 0) {
                    const fullName:string = str.split(pathFragment)[1];
                    fileName = fullName.slice(0, fullName.lastIndexOf("."));
                }
                message(str, spawn.pid);
            });
        };
    createSpawn(originalMediaType, "");
};

export default youtube_download;