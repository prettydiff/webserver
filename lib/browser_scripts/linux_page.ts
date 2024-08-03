
// cspell: words icewm, openbox, xfce

(function linuxPage():void {
    const select:HTMLCollectionOf<HTMLSelectElement> = document.getElementsByTagName("select"),
        port_map:store_number = {
            http_alpine_xfce: 4000,
            http_alpine_kde: 4002,
            http_alpine_mate: 4004,
            http_alpine_i3: 4006,
            http_alpine_openbox: 4008,
            http_alpine_icewm: 4010,
            https_alpine_xfce: 4001,
            https_alpine_kde: 4003,
            https_alpine_mate: 4005,
            https_alpine_i3: 4007,
            https_alpine_openbox: 4009,
            https_alpine_icewm: 4011
        },
        value_store:[string, string, string] = ["", "", ""],
        linux_link:HTMLElement = document.getElementsByClassName("linux-link")[0] as HTMLElement,
        change = function linuxPage_change():void {
            let select_index:number = select.length,
                opt:HTMLOptionElement,
                port:number = 0;
            do {
                select_index = select_index - 1;
                opt = select[select_index][select[select_index].selectedIndex] as HTMLOptionElement;
                value_store[select_index] = opt.value;
            } while (select_index > 0);
            port = port_map[value_store.join("_")];
            if (linux_link.firstChild !== null) {
                linux_link.removeChild(linux_link.firstChild);
            }

            if (value_store.includes("") === true || port === undefined) {
                linux_link.style.display = "none";
            } else {
                const a:HTMLElement = document.createElement("a"),
                    link:string = `${value_store[0]}://192.168.0.3:${port}/`,
                    text:Text = document.createTextNode(link);
                a.setAttribute("href", `${value_store[0]}://192.168.0.3:${port}/`);
                a.appendChild(text);
                linux_link.appendChild(a);
                linux_link.style.display = "block";
            }
        };
    let index:number = select.length;
    do {
        index = index - 1;
        select[index].onchange = change;
        select[index].selectedIndex = 0;
    } while (index > 0);
}());