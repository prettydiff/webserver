
(function youtube():void {
    const socket:WebSocket = new WebSocket(location.origin, ["browser-youtube-download"]),
        inputs:HTMLCollectionOf<HTMLInputElement> = document.getElementsByTagName("input"),
        button:HTMLButtonElement = document.getElementsByTagName("button")[0],
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
            if (pOld === undefined) {
                status.appendChild(pNew);
            } else {
                if (data.status === "Operation complete!") {
                    pNew.setAttribute("class", "success");
                    button.disabled = false;
                }
                status.insertBefore(pNew, pOld);
                status.style.cursor = "auto";
            }
        },
        open = function youtube_open():void {
            button.onclick = function youtube_open_click():void {
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
                    button.disabled = true;
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
                    button.disabled = true;
                } else {
                    const strong:HTMLElement = document.createElement("strong");
                    let p:HTMLElement = document.createElement("p"),
                        text:Text = document.createTextNode("Operation failed.");
                    p.setAttribute("class", "fail");
                    p.appendChild(text);
                    ytStatus.appendChild(p);

                    p = document.createElement("p");
                    text = document.createTextNode("For single videos expected something beginning: ");
                    p.appendChild(text);
                    text = document.createTextNode("https://www.youtube.com/watch?v=");
                    strong.appendChild(text);
                    p.appendChild(strong);
                    text = document.createTextNode(" followed by an 11 character identifier.");
                    p.appendChild(text);
                    ytStatus.appendChild(p);

                    p = document.createElement("p");
                    text = document.createTextNode("Unsupported address.");
                    p.appendChild(text);
                    text = document.createTextNode("For playlist links expected something beginning: ");
                    p.appendChild(text);
                    text = document.createTextNode("https://www.youtube.com/playlist?list=");
                    strong.appendChild(text);
                    p.appendChild(strong);
                    text = document.createTextNode(" followed by an identifier around 34 characters long.");
                    p.appendChild(text);
                    ytStatus.appendChild(p);

                    button.disabled = false;
                }
            };
        },
        radioToggle = function youtube_radioToggle(event:MouseEvent):void {
            let index:number = inputs.length,
                parent:HTMLElement,
                child:HTMLElement;
            const target:HTMLInputElement = event.target as HTMLInputElement;
            do {
                index = index - 1;
                if (inputs[index].type === "radio") {
                    parent = inputs[index].parentNode  as HTMLElement;
                    child = parent.firstChild as HTMLElement;
                    child.removeAttribute("class");
                }
            } while (index > 0);
            if (target.checked === true) {
                parent = target.parentNode as HTMLElement;
                child = parent.firstChild as HTMLElement;
                child.setAttribute("class", "checked");
                mediaType = target.value as "audio"|"video";
            }
        };
    let index:number = inputs.length,
        mediaType:"audio"|"video" = "audio";
    socket.onmessage = message;
    socket.onopen = open;
    do {
        index = index - 1;
        if (inputs[index].type === "radio") {
            inputs[index].onclick = radioToggle;
        }
    } while (index > 0);
}());