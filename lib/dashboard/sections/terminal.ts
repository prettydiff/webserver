

import dashboard from "../dashboard.ts";
import Terminal from "@xterm/xterm";

const ui_terminal = function ui_terminal():void {
    const terminal:section_terminal = {
        // https://xtermjs.org/docs/
        cols: 0,
        events: {
            change: function dashboard_sections_terminal_change():void {
                dashboard.utility.setState();
                dashboard.sections["terminal"].item.dispose();
                dashboard.sections["terminal"].socket.close();
                dashboard.sections["terminal"].item = null;
                dashboard.sections["terminal"].socket = null;
                dashboard.sections["terminal"].tools.shell();
            },
            data: function dashboard_sections_terminal_data(event:websocket_event):void {
                dashboard.sections["terminal"].item.write(event.data);
            },
            firstData: function dashboard_sections_terminal_firstData(event:websocket_event):void {
                dashboard.sections["terminal"].socket.onmessage = dashboard.sections["terminal"].events.data;
                dashboard.sections["terminal"].info = JSON.parse(event.data);
                dashboard.sections["terminal"].nodes.output.setAttribute("data-info", event.data);
                setTimeout(function dashboard_sections_terminal_firstData_delay():void {
                    dashboard.sections["terminal"].item.clear();
                }, 50);
            },
            input: function dashboard_sections_terminal_input(input:terminal_input):void {
                if (dashboard.sections["terminal"].socket.readyState === 1) {
                    dashboard.sections["terminal"].socket.send(input.key);
                }
            },
            resize: null,
            selection: function dashboard_sections_terminal_selection():void {
                if (dashboard.global.click === true) {
                    navigator.clipboard.write([
                        new ClipboardItem({["text/plain"]: dashboard.sections["terminal"].item.getSelection()})
                    ]);
                }
            }
        },
        id: null,
        info: null,
        init: function dashboard_sections_terminal_init():void {
            const len:number = dashboard.global.payload.terminal.length;
            let option:HTMLElement = null,
                index:number = 0;
            dashboard.sections["terminal"].nodes.select.textContent = "";
            if (len > 0) {
                do {
                    option = document.createElement("option");
                    option.textContent = dashboard.global.payload.terminal[index];
                    if (dashboard.global.payload.terminal[index] === dashboard.global.state.terminal) {
                        option.setAttribute("selected", "selected");
                    }
                    dashboard.sections["terminal"].nodes.select.appendChild(option);
                    index = index + 1;
                } while (index < len);
                dashboard.sections["terminal"].nodes.select.onchange = dashboard.sections["terminal"].events.change;
                if (dashboard.global.state.terminal === "") {
                    dashboard.sections["terminal"].nodes.select.selectedIndex = 0;
                    dashboard.utility.setState();
                }
            }
            if (typeof Terminal === "undefined") {
                setTimeout(dashboard_sections_terminal_init, 200);
            } else {
                dashboard.sections["terminal"].tools.shell();
            }
            dashboard.shared_services.shellResize({
                node: dashboard.sections["terminal"].nodes.output,
                section: "terminal",
                shell: dashboard.sections["terminal"].item
            });
            if (dashboard.global.payload.demo === true) {
                dashboard.sections["terminal"].nodes.demo_terminal.style.display = "block";
            }
        },
        item: null,
        nodes: {
            cols: document.getElementById("terminal").getElementsByClassName("dimensions")[0].getElementsByTagName("em")[0],
            demo_terminal: document.getElementById("terminal").getElementsByClassName("section")[2].getElementsByClassName("demo-terminal")[0] as HTMLElement,
            output: document.getElementById("terminal").getElementsByClassName("terminal-output")[0] as HTMLElement,
            rows: document.getElementById("terminal").getElementsByClassName("dimensions")[0].getElementsByTagName("em")[1],
            select: document.getElementById("terminal").getElementsByTagName("select")[0] as HTMLSelectElement
        },
        receive: null,
        rows: 0,
        socket: null,
        tools: {
            shell: function dashboard_sections_terminal_shell():void {
                const encryption:type_encryption = (location.protocol === "http:")
                        ? "open"
                        : "secure",
                    scheme:"ws"|"wss" = (encryption === "open")
                        ? "ws"
                        : "wss";
                // @ts-expect-error - xterm has not updated their types to reflect Terminal is a constructor
                dashboard.sections["terminal"].item = new Terminal({
                    cols: dashboard.sections["terminal"].cols,
                    cursorBlink: true,
                    cursorStyle: "underline",
                    disableStdin: false,
                    rows: dashboard.sections["terminal"].rows,
                    theme: {
                        background: "#222",
                        selectionBackground: "#444"
                    }
                });
                dashboard.sections["terminal"].item.open(dashboard.sections["terminal"].nodes.output);
                dashboard.sections["terminal"].item.onKey(dashboard.sections["terminal"].events.input);
                dashboard.sections["terminal"].item.write("Terminal emulator pending connection...\r\n");
                // client-side terminal is ready, so alert the backend to initiate a pseudo-terminal
                dashboard.sections["terminal"].socket = new WebSocket(`${scheme}://${location.host}/?shell=${encodeURIComponent(dashboard.global.state.terminal)}&cols=${dashboard.sections["terminal"].cols}&rows=${dashboard.sections["terminal"].rows}`, ["dashboard-terminal"]);
                dashboard.sections["terminal"].socket.onmessage = dashboard.sections["terminal"].events.firstData;
                if (typeof navigator.clipboard === "undefined") {
                    const em:HTMLElement = document.getElementById("terminal").getElementsByClassName("tab-description")[0].getElementsByTagName("em")[0] as HTMLElement;
                    if (location.protocol === "http:") {
                        em.textContent = "Terminal clipboard functionality only available when page is requested with HTTPS.";
                        em.style.fontWeight = "bold";
                    } else if (em !== undefined) {
                        em.parentNode.removeChild(em);
                    }
                } else {
                    dashboard.sections["terminal"].item.onSelectionChange(dashboard.sections["terminal"].events.selection);
                }
            }
        }
    };
    dashboard.sections["terminal"] = terminal;
};

export default ui_terminal;