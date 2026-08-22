
import dashboard from "../dashboard.ts";

const ui_application_logs = function ui_application_logs():void {
    const application_logs:section_applicationLogs = {
        events: {
            resize: function dashboard_sections_applicationLog_resize():void {
                const output_height:number = window.innerHeight - 50;
                dashboard.sections["application-logs"].nodes.list.style.height = `${output_height / 10}em`;
            }
        },
        init: function dashboard_sections_applicationLog_init():void {
            // populate log data
            let index:number = dashboard.global.payload.logs.entries.length;
            if (index > 0) {
                do {
                    index = index - 1;
                    dashboard.sections["application-logs"].receive({
                        data: {
                            log: dashboard.global.payload.logs.entries[index],
                            total: dashboard.global.payload.logs.total
                        },
                        service: "services_log"
                    });
                } while (index > 0);
            }
            dashboard.sections["application-logs"].events.resize();
        },
        nodes: {
            count: document.getElementById("application-logs").getElementsByClassName("logs-count")[0] as HTMLElement,
            list: document.getElementById("application-logs").getElementsByTagName("ul")[0],
            total: document.getElementById("application-logs").getElementsByClassName("logs-total")[0] as HTMLElement
        },
        receive: function dashboard_sections_applicationLog_receive(socket_data:socket_data):void {
            const item:services_log = socket_data.data as services_log,
                li:HTMLElement = document.createElement("li"),
                timeElement:HTMLElement = document.createElement("time"),
                strong:HTMLElement = document.createElement("strong"),
                code:HTMLElement = document.createElement("code"),
                time:string = `[${item.log.time.dateTime(true, null)}]`,
                p:HTMLElement = document.createElement("p"),
                span:HTMLElement = document.createElement("span"),
                len:number = dashboard.sections["application-logs"].nodes.list.childNodes.length;
            timeElement.appendText(time);
            strong.textContent = item.log.section;
            span.textContent = item.log.message;
            p.textContent = ((item.log.section === "servers-web" || item.log.section === "sockets-application-tcp" || item.log.section === "sockets-application-udp") && (/\.ts$/).test(item.log.origin) === false)
                ? (dashboard.global.payload.server[item.log.origin] === undefined)
                    ? item.log.origin
                    : `(${dashboard.global.payload.server[item.log.origin].config.name}) ${item.log.origin}`
                : (item.log.section === "compose-containers" && (/\.ts$/).test(item.log.origin) === false)
                    ? `(${dashboard.global.payload.compose.containers[item.log.origin].name}) ${item.log.origin}`
                    : item.log.origin;
            li.appendChild(timeElement);
            li.appendChild(strong);
            li.appendChild(span);
            if (item.log.status === "error" && item.log.error !== null) {
                const str:string = JSON.stringify(item.log.error);
                if (str !== "" && str !== "{}" && str !== null) {
                    code.textContent = str;
                    p.appendChild(code);
                }
            }
            li.appendChild(p);
            if (dashboard.global.payload !== null && len > dashboard.global.payload.logs.max) {
                dashboard.sections["application-logs"].nodes.list.removeChild(dashboard.sections["application-logs"].nodes.list.lastChild);
                dashboard.sections["application-logs"].nodes.count.textContent = String(len);
            } else {
                dashboard.sections["application-logs"].nodes.count.textContent = String(len + 1);
            }
            dashboard.sections["application-logs"].nodes.list.insertBefore(li, dashboard.sections["application-logs"].nodes.list.firstChild);
            if (item.total !== null && item.total > 0) {
                dashboard.sections["application-logs"].nodes.total.textContent = String(item.total);
            }
        },
        tools: null
    };
    dashboard.sections["application-logs"] = application_logs;
};

export default ui_application_logs;