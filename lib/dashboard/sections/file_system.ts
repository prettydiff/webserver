

import dashboard from "../dashboard.ts";

const ui_file_system = function ui_file_system():void {
    const file_system:section_file_system = {
        block: false,
        events: {
            file_button: function dashboard_sections_fileSystem_fileButton(event:MouseEvent):void {
                const target:HTMLElement = (event.target.lowName() === "button")
                    ? event.target
                    : event.target.getAncestor("button", "tag");
                dashboard.sections["file-system"].nodes.path.value = target.dataset["raw"];
                dashboard.sections["file-system"].events.send(null);
            },
            key: function dashboard_sections_fileSystem_key(event:KeyboardEvent):void {
                if (event.key.toLowerCase() === "enter") {
                    dashboard.sections["file-system"].events.send(null);
                }
            },
            resize: function dashboard_sections_fileSystem_resize():void {
                const outer_height:number = (window.innerHeight - 490) / 10;
                dashboard.sections["file-system"].nodes.output.style.maxHeight = `${outer_height}em`;
            },
            send: function dashboard_sections_fileSystem_send(event:Event):void {
                const address:string = dashboard.sections["file-system"].nodes.path.value.replace(/^\s+/, "").replace(/\s+$/, ""),
                    search:string = dashboard.sections["file-system"].nodes.search.value.replace(/^\s+/, "").replace(/\s+$/, ""),
                    depth:number = Number(dashboard.sections["file-system"].nodes.depth.value),
                    children:boolean = dashboard.sections["file-system"].nodes.children[dashboard.sections["file-system"].nodes.children.selectedIndex].textContent === "true",
                    directory_size:boolean = dashboard.sections["file-system"].nodes.directory_size[dashboard.sections["file-system"].nodes.directory_size.selectedIndex].textContent === "true (extremely slow)",
                    payload:services_file_system = {
                        address: address,
                        children: children,
                        depth: (isNaN(depth) === true)
                            ? 2
                            : Math.floor(depth),
                        directory_size: directory_size,
                        dirs: null,
                        failures: null,
                        file: null,
                        mime: null,
                        parent: null,
                        path_style: dashboard.sections["file-system"].nodes.path_style[dashboard.sections["file-system"].nodes.path_style.selectedIndex].textContent.toLowerCase() as "absolute"|"relative",
                        search: (search !== null && search.replace(/\s+/, "") === "")
                            ? null
                            : search,
                        sep: null
                    };
                
                if (event !== null && event.target === dashboard.sections["file-system"].nodes.path && dashboard.sections["file-system"].nodes.path.value.charAt(dashboard.sections["file-system"].nodes.path.value.length - 1) === dashboard.global.payload.path.sep) {
                    dashboard.sections["file-system"].nodes.path.value = dashboard.sections["file-system"].nodes.path.value.slice(0, dashboard.sections["file-system"].nodes.path.value.length - 1);
                }
                if (dashboard.sections["file-system"].block === false) {
                    if (directory_size === true) {
                        dashboard.sections["file-system"].nodes.tbody.textContent = "";
                    }
                    dashboard.sections["file-system"].block = true;
                    dashboard.utility.performance_set("file-system");
                    dashboard.sections["file-system"].nodes.status.textContent = "Fetching\u2026";
                    dashboard.message.send({data: payload, service: "services_file_system"});
                    dashboard.utility.setState();
                }
            }
        },
        init: function dashboard_sections_fileSystem_init():void {
            const textarea:HTMLTextAreaElement = document.createElement("textarea"),
                media = function dashboard_sections_fileSystem_init_media(name:"audio"|"video"):void {
                    const parent:HTMLElement = dashboard.sections["file-system"].media[name],
                        media_element:HTMLAudioElement = document.createElement(name),
                        track:HTMLElement = document.createElement("button"),
                        input = function dashboard_sections_fileSystem_init_media_input(classy:string):void {
                            const label:HTMLElement = document.createElement("label"),
                                span:HTMLElement = document.createElement("span"),
                                input:HTMLInputElement = document.createElement("input");
                            label.setAttribute("class", classy);
                            input.type = "text";
                            input.readOnly = true;
                            span.textContent = (classy === "time-current")
                                ? "Media current time"
                                : "Media total time";
                            label.appendChild(span);
                            label.appendChild(input);
                            p.appendChild(label);
                        },
                        control = function dashboard_sections_fileSystem_init_media_control(type:"pause"|"play"|"stop"):void {
                            const button:HTMLElement = document.createElement("button"),
                                svg:Element = document.createElementNS("http://www.w3.org/2000/svg", "svg"),
                                g:Element = document.createElementNS("http://www.w3.org/2000/svg", "g"),
                                path:Element = document.createElementNS("http://www.w3.org/2000/svg", "path"),
                                path1:Element = document.createElementNS("http://www.w3.org/2000/svg", "path"),
                                span:HTMLElement = document.createElement("span");
                            button.setAttribute("class", type);
                            if (type === "play") {
                                path.setAttribute("d", "M85.5,51.7l-69,39.8c-1.3,0.8-3-0.2-3-1.7V10.2c0-1.5,1.7-2.5,3-1.7l69,39.8C86.8,49,86.8,51,85.5,51.7z");
                                button.onclick = function dashboard_sections_fileSystem_init_media_control_play(event:MouseEvent):void {
                                    const el:HTMLElement = event.target as HTMLElement,
                                        player:HTMLElement = el.getAncestor("div", "tag"),
                                        media:HTMLAudioElement = player.lastChild as HTMLAudioElement,
                                        currentTime = function dashboard_sections_fileSystem_init_media_control_play_time():void {
                                            const timer:HTMLInputElement = player.getElementsByTagName("input")[0],
                                                bar:HTMLElement = player.getElementsByClassName("media-slider")[0].getElementsByClassName("progress")[0] as HTMLElement;
                                            timer.value = dashboard.sections["file-system"].tools.media_time(media.currentTime);
                                            if (media.currentTime === media.duration) {
                                                media.playing = false;
                                            }
                                            if (media.playing === true) {
                                                setTimeout(dashboard_sections_fileSystem_init_media_control_play_time, 50);
                                                bar.style.width = `${(media.currentTime / media.duration) * 100}%`;
                                            }
                                        };
                                    if (media.playing === true) {
                                        media.currentTime = 0;
                                    }
                                    media.play();
                                    media.playing = true;
                                    setTimeout(currentTime, 50);
                                };
                            } else if (type === "pause") {
                                path.setAttribute("d", "M44.2,78.3H32.1c-1.1,0-2-0.9-2-2V23.7c0-1.1,0.9-2,2-2h12.1c1.1,0,2,0.9,2,2v52.5C46.2,77.4,45.3,78.3,44.2,78.3z");
                                path1.setAttribute("d", "M67.9,78.3H55.8c-1.1,0-2-0.9-2-2V23.7c0-1.1,0.9-2,2-2h12.1c1.1,0,2,0.9,2,2v52.5C69.9,77.4,69,78.3,67.9,78.3z");
                                button.onclick = function dashboard_sections_fileSystem_init_media_control_pause(event:MouseEvent):void {
                                    const el:HTMLElement = event.target as HTMLElement,
                                        player:HTMLElement = el.getAncestor("div", "tag"),
                                        media:HTMLAudioElement = player.lastChild as HTMLAudioElement;
                                    media.pause();
                                    media.playing = false;
                                };
                            } else {
                                path.setAttribute("d", "M78,80H22c-1.1,0-2-0.9-2-2V22c0-1.1,0.9-2,2-2h56c1.1,0,2,0.9,2,2v56C80,79.1,79.1,80,78,80z");
                                button.onclick = function dashboard_sections_fileSystem_init_media_control_stop(event:MouseEvent):void {
                                    const el:HTMLElement = event.target as HTMLElement,
                                        player:HTMLElement = el.getAncestor("div", "tag"),
                                        media:HTMLAudioElement = player.lastChild as HTMLAudioElement,
                                        timer:HTMLInputElement = player.getElementsByTagName("input")[0],
                                        bar:HTMLElement = player.getElementsByClassName("media-slider")[0].getElementsByClassName("progress")[0] as HTMLElement;
                                    media.pause();
                                    bar.style.width = "0%";
                                    timer.value = "00:00:00";
                                    media.playing = false;
                                    media.currentTime = 0;
                                };
                            }
                            svg.setAttribute("version", "1.1");
                            svg.setAttribute("viewBox", "0 0 100 100");
                            g.appendChild(path);
                            if (type === "pause") {
                                g.appendChild(path1);
                            }
                            svg.appendChild(g);
                            span.textContent = type;
                            button.appendChild(svg);
                            button.appendChild(span);
                            p.appendChild(button);
                        },
                        progress = function dashboard_sections_fileSystem_init_media_progress(event:MouseEvent):void {
                            const target:HTMLElement = (event.target.lowName() === "button")
                                    ? event.target
                                    : event.target.getAncestor("button", "tag"),
                                player:HTMLElement = target.getAncestor("div", "tag"),
                                media:HTMLAudioElement = player.lastChild as HTMLAudioElement,
                                progress_bar:HTMLElement = target.getElementsByClassName("progress")[0] as HTMLElement,
                                distance:number = (event.clientX + window.scrollX) - target.offsetLeft,
                                percent:number = (isNaN(media.duration) === true)
                                    ? 0
                                    : distance / target.clientWidth,
                                time:number = (isNaN(media.duration) === true)
                                    ? 0
                                    : media.duration * percent;
                            media.currentTime = time;
                            progress_bar.style.width = `${percent * 100}%`;
                        };
                    let p:HTMLElement = document.createElement("p"),
                        span:HTMLElement = document.createElement("span");
                    // slider / progression track
                    p.setAttribute("class", "media-slider");
                    span.setAttribute("class", "text");
                    span.textContent = "progression";
                    track.appendChild(span);
                    span = document.createElement("span");
                    span.setAttribute("class", "progress");
                    track.appendChild(span);
                    track.onclick = progress;
                    p.appendChild(track);
                    parent.appendChild(p);

                    // timers
                    p = document.createElement("p");
                    input("time-current");
                    input("time-total");
                    span = document.createElement("span");
                    span.setAttribute("class", "clear");
                    p.appendChild(span);
                    parent.appendChild(p);

                    // control buttons
                    p = document.createElement("p");
                    control("play");
                    control("pause");
                    control("stop");
                    span = document.createElement("span");
                    span.setAttribute("class", "clear");
                    p.appendChild(span);
                    p.setAttribute("class", "media-controls");
                    parent.appendChild(p);

                    if (name === "video") {
                        p = document.createElement("p");
                        p.setAttribute("class", "buffer");
                        p.textContent = "Video is buffering.";
                        parent.appendChild(p);
                    }

                    parent.setAttribute("class", "media");
                    parent.appendChild(media_element);
                    media_element.ondurationchange = function dashboard_sections_fileSystem_init_media_duration(event:Event):void {
                        const target:HTMLVideoElement = event.target as HTMLVideoElement,
                            player:HTMLElement = target.getAncestor("div", "tag"),
                            media:HTMLAudioElement = player.lastChild as HTMLAudioElement,
                            duration:HTMLInputElement = player.getElementsByTagName("input")[1];
                        if (target.lowName() === "video") {
                            const buffer:HTMLElement = player.getElementsByClassName("buffer")[0] as HTMLElement;
                            buffer.style.display = "none";
                            target.style.height = `${target.videoHeight}px`;
                            target.style.width = `${target.videoWidth}px`;
                        }
                        duration.value = dashboard.sections["file-system"].tools.media_time(media.duration);
                    };
                    media_element.onerror = function dashboard_sections_fileSystem_init_media_duration(event:Event|string):void {
                        const target:HTMLAudioElement = (typeof event === "string")
                                ? null
                                : event.target as HTMLAudioElement,
                            player:HTMLElement = target.getAncestor("div", "tag"),
                            buffer:HTMLElement = player.getElementsByClassName("buffer")[0] as HTMLElement;
                        if (buffer !== undefined) {
                            buffer.textContent = (typeof event === "string")
                                ? event
                                : JSON.stringify(event);
                            buffer.style.display = "block";
                        }
                    };
                    if (name === "video") {
                        const video:HTMLVideoElement = media_element as HTMLVideoElement;
                        video.playsInline = true;
                        video.preload = "auto";
                    }
                },
                image:HTMLElement = document.createElement("img"),
                label:HTMLElement = document.createElement("label");
            dashboard.sections["file-system"].nodes.depth.onblur = dashboard.sections["file-system"].events.send;
            dashboard.sections["file-system"].nodes.path.onblur = dashboard.sections["file-system"].events.send;
            dashboard.sections["file-system"].nodes.search.onblur = dashboard.sections["file-system"].events.send;
            dashboard.sections["file-system"].nodes.children.onchange = dashboard.sections["file-system"].events.send;
            dashboard.sections["file-system"].nodes.directory_size.onchange = dashboard.sections["file-system"].events.send;
            dashboard.sections["file-system"].nodes.path_style.onchange = dashboard.sections["file-system"].events.send;
            dashboard.sections["file-system"].nodes.depth.onkeydown = dashboard.sections["file-system"].events.key;
            dashboard.sections["file-system"].nodes.path.onkeydown = dashboard.sections["file-system"].events.key;
            dashboard.sections["file-system"].nodes.search.onkeydown = dashboard.sections["file-system"].events.key;
            dashboard.sections["file-system"].nodes.children.selectedIndex = (dashboard.global.state.fileSystem === undefined || dashboard.global.state.fileSystem === null || typeof dashboard.global.state.fileSystem.children !== "number")
                ? 1
                : dashboard.global.state.fileSystem.children;
            dashboard.sections["file-system"].nodes.depth.value = (dashboard.global.state.fileSystem === undefined || dashboard.global.state.fileSystem === null || typeof dashboard.global.state.fileSystem.depth !== "string")
                ? "1"
                : dashboard.global.state.fileSystem.depth;
            dashboard.sections["file-system"].nodes.directory_size.selectedIndex = (dashboard.global.state.fileSystem === undefined || dashboard.global.state.fileSystem === null || typeof dashboard.global.state.fileSystem.directory_size !== "number")
                ? 0
                : dashboard.global.state.fileSystem.directory_size;
            dashboard.sections["file-system"].nodes.path.value = (dashboard.global.state.fileSystem === undefined || dashboard.global.state.fileSystem === null || typeof dashboard.global.state.fileSystem.path !== "string" || dashboard.global.state.fileSystem.path === "")
                ? dashboard.global.payload.path.project.replace(/test(\\|\/)?$/, "")
                : dashboard.global.state.fileSystem.path;
            dashboard.sections["file-system"].nodes.path_style.selectedIndex = (dashboard.global.state.fileSystem === undefined || dashboard.global.state.fileSystem === null || typeof dashboard.global.state.fileSystem.path_style !== "number")
                ? 1
                : dashboard.global.state.fileSystem.path_style;
            dashboard.sections["file-system"].nodes.search.value = (dashboard.global.state.fileSystem === undefined || dashboard.global.state.fileSystem === null || typeof dashboard.global.state.fileSystem.search !== "string")
                ? ""
                : dashboard.global.state.fileSystem.search;
            if (dashboard.sections["file-system"].nodes.path.value.charAt(dashboard.sections["file-system"].nodes.path.value.length - 1) === dashboard.global.payload.path.sep) {
                dashboard.sections["file-system"].nodes.path.value = dashboard.sections["file-system"].nodes.path.value.slice(0, dashboard.sections["file-system"].nodes.path.value.length - 1);
            }
            dashboard.sections["file-system"].events.send(null);
            dashboard.sections["file-system"].media.audio = document.createElement("div");
            dashboard.sections["file-system"].media.image = document.createElement("p");
            dashboard.sections["file-system"].media.text = document.createElement("p");
            dashboard.sections["file-system"].media.video = document.createElement("div");
            textarea.spellcheck = false;
            dashboard.sections["file-system"].media.image.appendChild(image);
            dashboard.sections["file-system"].media.text.appendText("Text file contents converted to UTF-8 ");
            dashboard.sections["file-system"].media.text.appendChild(textarea);
            dashboard.sections["file-system"].media.text.appendChild(label);
            media("audio");
            media("video");
            dashboard.sections["file-system"].media.other = document.createElement("p");
            dashboard.sections["file-system"].media.other.textContent = "File is likely a binary format that cannot be previewed in a web browser.";
            dashboard.sections["file-system"].media.pdf = document.createElement("iframe");
            dashboard.sections["file-system"].events.resize();
        },
        media: {
            audio: null,
            image: null,
            other: null,
            pdf: null,
            text: null,
            video: null
        },
        nodes: {
            children: document.getElementById("file-system").getElementsByTagName("select")[2],
            content: document.getElementById("file-system").getElementsByClassName("file-system-content")[0] as HTMLElement,
            depth: document.getElementById("file-system").getElementsByTagName("input")[2],
            directory_size: document.getElementById("file-system").getElementsByTagName("select")[1],
            failures: document.getElementById("file-system").getElementsByClassName("file-system-failures")[0] as HTMLElement,
            output: document.getElementById("file-system").getElementsByClassName("file-list")[0] as HTMLElement,
            path: document.getElementById("file-system").getElementsByTagName("input")[0],
            path_style: document.getElementById("file-system").getElementsByTagName("select")[0],
            search: document.getElementById("file-system").getElementsByTagName("input")[1],
            status: document.getElementById("file-system").getElementsByClassName("file-list")[0].getElementsByTagName("em")[0],
            summary: document.getElementById("file-system").getElementsByClassName("summary-stats")[0] as HTMLElement,
            tbody: document.getElementById("file-system").getElementsByTagName("tbody")[0]
        },
        receive: function dashboard_sections_fileSystem_receive(data_item:socket_data):void {
            const fs:services_file_system = data_item.data as services_file_system,
                len:number = (fs.dirs === null)
                    ? 0
                    : fs.dirs.length,
                len_fail:number = fs.failures.length,
                fails:HTMLElement = (len_fail > 0 && len > 0 && fs.dirs[0][1] === "directory")
                    ? document.createElement("ul")
                    : document.createElement("p"),
                summary:store_number = {
                    "block_device": 0,
                    "character_device": 0,
                    "directory": (fs.search === null)
                        ? -2
                        : 0,
                    "fifo_pipe": 0,
                    "file": 0,
                    "socket": 0,
                    "symbolic_link": 0
                },
                icons:store_string = {
                    "block_device": "\u2580",
                    "character_device": "\u0258",
                    "directory": "\ud83d\udcc1",
                    "fifo_pipe": "\u275a",
                    "file": "\ud83d\uddce",
                    "socket": "\ud83d\udd0c",
                    "symbolic_link": "\ud83d\udd17"
                },
                failureTitle:HTMLElement = dashboard.sections["file-system"].nodes.failures.parentNode.getElementsByTagName("h3")[0],
                audio:HTMLAudioElement = dashboard.sections["file-system"].media.audio.lastChild as HTMLAudioElement,
                video:HTMLVideoElement = dashboard.sections["file-system"].media.video.lastChild as HTMLVideoElement,
                record = function dashboard_sections_fileSystem_receive_record(index:number):void {
                    const item:type_directory_item = (index < 0)
                            ? fs.parent
                            : fs.dirs[index],
                        name:string = (index < 0)
                            ? ".."
                            : (index === 0 && fs.search === null && fs.address !== "\\")
                                ? "."
                                : item[5],
                        name_raw:string = (index < 1)
                            ? ((/^\w:(\\)?$/).test(fs.address) === true)
                                ? "\\"
                                : item[0]
                            : item[0];
                    let tr:HTMLElement = null,
                        td:HTMLElement = null,
                        button:HTMLElement = null,
                        span:HTMLElement = null,
                        dtg:string[] = null;
                    summary[item[1]] = summary[item[1]] + 1;
                    if (index > 0) {
                        size = size + item[4].size;
                    }
                    dtg = item[4].mtimeMs.dateTime(true, dashboard.global.payload.timeZone_offset).split(", ");
                    span = document.createElement("span");
                    span.setAttribute("class", "icon");
                    span.appendText(icons[item[1]]);
                    button = document.createElement("button");
                    button.onclick = dashboard.sections["file-system"].events.file_button;
                    button.setAttribute("data-raw", name_raw);
                    button.appendChild(span);
                    button.appendText(` ${name}`);
                    td = document.createElement("td");
                    td.setAttribute("class", "file-name");
                    td.appendText(" ");
                    td.appendChild(button);
                    tr = document.createElement("tr");
                    tr.setAttribute("class", (index % 2 === 0) ? "even" : "odd");
                    tr.appendChild(td);

                    td = document.createElement("td");
                    td.appendText(item[1]);
                    tr.appendChild(td);

                    td = document.createElement("td");
                    td.setAttribute("class", "right");
                    td.setAttribute("data-raw", String(item[4].size));
                    td.appendText(item[4].size.commas());
                    tr.appendChild(td);

                    td = document.createElement("td");
                    td.setAttribute("data-raw", String(item[4].mtimeMs));
                    td.appendText(dtg[0]);
                    tr.appendChild(td);

                    td = document.createElement("td");
                    td.appendText(dtg[1]);
                    tr.appendChild(td);

                    td = document.createElement("td");
                    td.appendText(item[4].mode === null ? "" : (item[4].mode & parseInt("777", 8)).toString(8));
                    tr.appendChild(td);

                    td = document.createElement("td");
                    td.setAttribute("class", "right");
                    td.setAttribute("data-raw", String(item[3]));
                    td.appendText(item[3].commas());
                    tr.appendChild(td);
                    dashboard.sections["file-system"].nodes.tbody.appendChild(tr);
                };
            let index_record:number = 0,
                size:number = 0;
            dashboard.sections["file-system"].nodes.status.textContent = `Fetched in ${dashboard.utility.performance_get("file-system")} time.`;
            dashboard.sections["file-system"].nodes.path.value = fs.address;
            dashboard.sections["file-system"].nodes.search.value = (fs.search === null)
                ? ""
                : fs.search;
            dashboard.utility.setState();
            // td[0] = icon name
            // td[1] = type
            // td[2] = size
            // td[3] = modified date
            // td[4] = modified time
            // td[5] = permissions
            // td[6] = children
            dashboard.sections["file-system"].nodes.tbody.textContent = "";
            audio.pause();
            video.pause();
            audio.currentTime = 0;
            video.currentTime = 0;
            if (len < 1 || fs.dirs[0] === null) {
                dashboard.sections["file-system"].nodes.output.style.display = "none";
            } else {
                dashboard.sections["file-system"].nodes.output.style.display = "block";
                if (fs.parent !== null && fs.search === null) {
                    record(-1);
                }
                if (len > 0) {
                    do {
                        record(index_record);
                        index_record = index_record + 1;
                    } while (index_record < len);
                }
                if (dashboard.sections["file-system"].sort === true) {
                    dashboard.tables.sort(null, dashboard.sections["file-system"].nodes.tbody.parentNode, Number(dashboard.sections["file-system"].nodes.tbody.parentNode.dataset["column"]));
                }
            }

            // no results
            if (len === 0) {
                dashboard.sections["file-system"].nodes.summary.style.display = "none";
            // list regular results
            } else if (fs.dirs[0][1] === "directory" || fs.search !== null) {
                const li:HTMLCollectionOf<HTMLElement> = dashboard.sections["file-system"].nodes.summary.getElementsByTagName("li");
                li[0].getElementsByTagName("strong")[0].textContent = (fs.directory_size === true)
                    ? fs.dirs[0][4].size.commas()
                    : size.commas();
                li[1].getElementsByTagName("strong")[0].textContent = (fs.search === null)
                    ? (fs.dirs.length - 1).commas()
                    : (fs.dirs.length).commas();
                li[2].getElementsByTagName("strong")[0].textContent = summary.block_device.commas();
                li[3].getElementsByTagName("strong")[0].textContent = summary.character_device.commas();
                li[4].getElementsByTagName("strong")[0].textContent = summary.directory.commas();
                li[5].getElementsByTagName("strong")[0].textContent = summary.fifo_pipe.commas();
                li[6].getElementsByTagName("strong")[0].textContent = summary.file.commas();
                li[7].getElementsByTagName("strong")[0].textContent = summary.socket.commas();
                li[8].getElementsByTagName("strong")[0].textContent = summary.symbolic_link.commas();
                dashboard.sections["file-system"].nodes.summary.style.display = "block";
            // media/file contents output
            } else {
                dashboard.sections["file-system"].nodes.summary.style.display = "none";
            }

            // list regular results
            if (fs.file === null) {
                dashboard.sections["file-system"].nodes.content.style.display = "none";
                if (len === 0) {
                    fails.appendText("System cannot access file system object at this address.");
                } else if (len_fail > 0) {
                    let index_fail:number = 0,
                        li:HTMLElement = null;
                    do {
                        li = document.createElement("li");
                        li.appendText(fs.failures[index_fail]);
                        fails.appendChild(li);
                        index_fail = index_fail + 1;
                    } while (index_fail < len_fail);
                } else {
                    fails.appendText("0 artifacts failed accessing.");
                }
                failureTitle.textContent = "Items in current directory that could not be read";
            // media/file contents output
            } else {
                const strong:HTMLElement = document.createElement("strong"),
                    media = function dashboard_sections_fileSystem_receive_media(mediaType:type_fileSystem_media):void {
                        const address:string = `${location.origin}/file-system-${fs.address}`,
                            player = function dashboard_sections_fileSystem_receive_media_player(type:"audio"|"video"):void {
                                const times:HTMLCollectionOf<HTMLInputElement> = dashboard.sections["file-system"].media[type].getElementsByTagName("input"),
                                    item:HTMLAudioElement|HTMLVideoElement = (type === "audio")
                                        ? audio
                                        : video,
                                    source:HTMLSourceElement = document.createElement("source");
                                times[0].value = "00:00:00";
                                source.src = address;
                                if (item.childNodes.length > 0) {
                                    item.removeChild(item.lastChild);
                                }
                                source.setAttribute("type", fs.mime);
                                item.appendChild(source);
                                dashboard.sections["file-system"].nodes.content.appendChild(dashboard.sections["file-system"].media[type]);
                                item.load();
                            },
                            h3:HTMLElement = document.createElement("h3");
                        h3.textContent = "File Contents";
                        dashboard.sections["file-system"].nodes.content.textContent = "";
                        dashboard.sections["file-system"].nodes.content.appendChild(h3);
                        dashboard.sections["file-system"].nodes.content.style.display = "block";
                        // if ([
                        //     "application/pdf",
                        //     "application/x-pdf",
                        //     "application/acrobat",
                        //     "text/pdf",
                        //     "text/x-pdf"].includes(fs.mime) === true
                        // ) {
                        //     dashboard.sections["file-system"].media.pdf.src = address;
                        //     dashboard.sections["file-system"].nodes.content.appendChild(dashboard.sections["file-system"].media.pdf);
                        // } else
                        if (mediaType === "audio") {
                            player("audio");
                        } else if (mediaType === "image") {
                            const image:HTMLImageElement = dashboard.sections["file-system"].media.image.getElementsByTagName("img")[0];
                            image.setAttribute("alt", `Dynamically populated image of type ${fs.mime} from file system location ${fs.address}`);
                            image.setAttribute("src", address);
                            dashboard.sections["file-system"].nodes.content.appendChild(dashboard.sections["file-system"].media.image);
                        } else if (mediaType === "text") {
                            dashboard.sections["file-system"].media.text.getElementsByTagName("textarea")[0].value = fs.file.replace(/\u0000/g, "");
                            dashboard.sections["file-system"].nodes.content.appendChild(dashboard.sections["file-system"].media.text);
                        } else if (mediaType === "video") {
                            const buffer:HTMLElement = dashboard.sections["file-system"].media.video.getElementsByClassName("buffer")[0] as HTMLElement;
                            buffer.style.display = "block";
                            player("video");
                        } else {
                            dashboard.sections["file-system"].nodes.content.appendChild(dashboard.sections["file-system"].media.other);
                        }
                    },
                    mediaType:type_fileSystem_media = fs.mime.slice(0, fs.mime.indexOf("/")) as type_fileSystem_media;
                strong.appendText(fs.failures[0]);
                media((mediaType === "application" && fs.failures[0] !== "binary")
                    ? "text"
                    : mediaType
                );
                if (fs.failures[0] === "binary") {
                    fails.appendText("File is either binary or uses a text encoding larger than utf8.");
                } else {
                    fails.appendText("File encoded as ");
                    fails.appendChild(strong);
                    if (fs.mime !== "" && fs.mime !== null) {
                        const mime:HTMLElement = document.createElement("strong");
                        mime.textContent = fs.mime;
                        fails.appendText(" with mime type ");
                        fails.appendChild(mime);
                    }
                    fails.appendText(".");
                }
                failureTitle.textContent = "File encoding";
            }
            fails.setAttribute("class", dashboard.sections["file-system"].nodes.failures.getAttribute("class"));
            dashboard.sections["file-system"].nodes.failures.parentNode.appendChild(fails);
            dashboard.sections["file-system"].nodes.failures.parentNode.removeChild(dashboard.sections["file-system"].nodes.failures);
            dashboard.sections["file-system"].nodes.failures = fails;
            dashboard.sections["file-system"].block = false;
        },
        sort: false,
        time: 0,
        tools: {
            media_time: function dashboard_sections_fileSystem_mediaTime(input:boolean|number|string):string {
                const hour:number = Math.floor(input as number / 3600),
                    min:number = Math.floor((input as number % 3600) / 60),
                    second:number = Math.floor((input as number % 3600) % 60),
                    hStr:string = (hour < 10)
                        ? `0${hour}`
                        : String(hour),
                    mStr:string = (min < 10)
                        ? `0${min}`
                        : String(min),
                    sStr:string = (second < 10)
                        ? `0${second}`
                        : String(second);
                return `${hStr}:${mStr}:${sStr}`;
            }
        }
    };
    dashboard.sections["file-system"] = file_system;
};

export default ui_file_system;