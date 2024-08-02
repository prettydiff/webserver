
import core from "./core.js";

(function youtube():void {
    const inputs:HTMLCollectionOf<HTMLInputElement> = document.getElementsByTagName("input"),
        download:HTMLButtonElement = document.getElementsByTagName("button")[0],
        cancel:HTMLButtonElement = document.getElementsByTagName("button")[1],
        message = function youtube_message(event:websocket_event):void {
            const status:HTMLElement = document.getElementsByClassName("ytStatus")[0] as HTMLElement,
                pOld:HTMLElement = status.getElementsByTagName("p")[0],
                pNew:HTMLElement = document.createElement("p"),
                message:socket_data = JSON.parse(event.data) as socket_data,
                data:services_youtubeStatus = message.data as services_youtubeStatus,
                strong:HTMLElement = document.createElement("strong");
            let text:Text = document.createTextNode(data.time);
            strong.appendChild(text);
            pNew.appendChild(strong);
            text = document.createTextNode(` ${data.status}`);
            pNew.appendChild(text);
            pid = data.pid;
            if (pOld === undefined) {
                status.appendChild(pNew);
            } else {
                if (data.status === "Operation complete!") {
                    pNew.setAttribute("class", "success");
                    download.disabled = false;
                }
                status.insertBefore(pNew, pOld);
                status.style.cursor = "auto";
            }
        },
        open = function youtube_open():void {
            if (download !== undefined) {
                download.onclick = function youtube_open_download():void {
                    const h2Text:Text = document.createTextNode("Status"),
                        ytStatus:HTMLElement = document.getElementsByClassName("ytStatus")[0] as HTMLElement,
                        h2:HTMLElement = document.createElement("h2"),
                        addressInput:HTMLInputElement = document.getElementsByClassName("input-address")[0] as HTMLInputElement,
                        optionsInput:HTMLInputElement = document.getElementsByClassName("input-options")[0] as HTMLInputElement,
                        address:string = addressInput.value.replace(/\s+/g, ""),
                        options:string = optionsInput.value.replace(/\s+/g, ""),
                        domain:string = "https://www.youtube.com/watch?v=",
                        playlist:string = "https://www.youtube.com/playlist?list=",
                        ampIndex:number = address.indexOf("&"),
                        addressFragment:string = (ampIndex > 0)
                            ? address.slice(domain.length, ampIndex)
                            : address.replace(domain, ""),
                        playlistFragment:string = (ampIndex > 0)
                            ? address.slice(playlist.length, ampIndex)
                            : address.replace(playlist, "");
                    h2.appendChild(h2Text);

                    // eslint-disable-next-line no-restricted-syntax
                    ytStatus.innerHTML = "";
                    ytStatus.appendChild(h2);
                    if (address.indexOf(domain) === 0 && (/^(\w|-){11}$/).test(addressFragment) === true) {
                        socket.send(JSON.stringify({
                            "data": {
                                "address": address,
                                "options": options,
                                "type": `${mediaType}-file`
                            },
                            "service": "youtube-download"
                        }));
                        ytStatus.style.cursor = "wait";
                        download.disabled = true;
                    } else if (address.indexOf(playlist) === 0 && (/^(\w|-){30,50}$/).test(playlistFragment) === true) {
                        socket.send(JSON.stringify({
                            "data": {
                                "address": address,
                                "options": options,
                                "type": `${mediaType}-playlist`
                            },
                            "service": "youtube-download"
                        }));
                        ytStatus.style.cursor = "wait";
                        download.disabled = true;
                    } else {
                        const errorText = function youtube_option_download_errorText(input:[string, string, string]):void {
                            const p:HTMLElement = document.createElement("p"),
                                strong:HTMLElement = document.createElement("strong");
                            let text:Text = document.createTextNode(input[0]);
                            p.appendChild(text);
                            if (input[1] === null) {
                                p.setAttribute("class", "fail");
                                ytStatus.appendChild(p);
                                return;
                            }
                            text = document.createTextNode(input[1]);
                            strong.appendChild(text);
                            p.appendChild(strong);
                            text = document.createTextNode(input[2]);
                            p.appendChild(text);
                            ytStatus.appendChild(p);
                        };
                        errorText(["Operation failed.", null, null]);
                        errorText([
                            "For single songs/videos expected something beginning: ",
                            "https://www.youtube.com/watch?v=",
                            " followed by an 11 character identifier."
                        ]);
                        errorText([
                            "For playlist links expected something beginning: ",
                            "https://www.youtube.com/playlist?list=",
                            " followed by an identifier around 34 characters long."
                        ]);

                        download.disabled = false;
                    }
                };
            }
            if (cancel !== undefined) {
                cancel.onclick = function youtube_open_cancel():void {
                    if (pid > 0) {
                        socket.send(JSON.stringify({
                            data: {
                                process: pid
                            },
                            service: "process-kill"
                        }));
                        pid = 0;
                    }
                };
            }
        },
        radioToggle = function youtube_radioToggle(event:MouseEvent):void {
            let index:number = inputs.length,
                parent:HTMLElement,
                child:HTMLElement;
            const target:HTMLInputElement = event.target as HTMLInputElement;
            do {
                index = index - 1;
                if (inputs[index].type === "radio") {
                    parent = inputs[index].parentNode;
                    child = parent.firstChild as HTMLElement;
                    child.removeAttribute("class");
                }
            } while (index > 0);
            if (target.checked === true) {
                parent = target.parentNode;
                child = parent.firstChild as HTMLElement;
                child.setAttribute("class", "checked");
                mediaType = target.value as "audio"|"video";
            }
        },
        socket:WebSocket = core("browser-youtube-download", open, message);
    let index:number = inputs.length,
        pid:number = 0,
        mediaType:"audio"|"video" = "audio";
    document.getElementsByTagName("body")[0].onclick = function youtube_body():void {
        if (closed === true) {
            location.reload();
        }
    };
    do {
        index = index - 1;
        if (inputs[index].type === "radio") {
            inputs[index].onclick = radioToggle;
        }
    } while (index > 0);
}());