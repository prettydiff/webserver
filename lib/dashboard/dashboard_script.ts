
import core from "../browser/core.js";

const dashboard = function dashboard():void {
    // test for port conflicts when creating servers from the dashboard


    const socket:WebSocket = core(function dashboard_open():void {}, function dashboard_message():void {}),
        payload:transmit_dashboard = JSON.parse(document.getElementsByTagName("input")[0].value),
        body:HTMLElement = document.getElementsByTagName("body")[0],
        server_create:HTMLButtonElement = document.getElementsByClassName("server_create")[0] as HTMLButtonElement,
        server_list = function dashboard_open_serverList():void {
            const tag:HTMLElement = document.getElementById("server_list"),
                list:string[] = Object.keys(payload.servers),
                list_old:HTMLElement = tag.getElementsByTagName("ul")[0],
                ul:HTMLElement = document.createElement("ul"),
                server_details = function dashboard_open_serverList_serverDetails(name:string):HTMLElement {
                    const li:HTMLElement = document.createElement("li"),
                        h3:HTMLElement = document.createElement("h3");
                    h3.appendText(name);
                    li.appendChild(h3);
                    return li;
                };
            let index:number = list.length;

            if (list_old !== undefined) {
                tag.removeChild(list_old);
            }
            list.sort(function dashboard_open_serverList_sort(a:string, b:string):-1|1 {
                if (a > b) {
                    return -1;
                }
                return 1;
            });
            do {
                index = index - 1;
                ul.appendChild(server_details(list[index]));
            } while (index > 0);
            tag.appendChild(ul);
        };

    server_create.onclick = function dashboard_open_createServer():void {};
    server_list();
};

export default dashboard;