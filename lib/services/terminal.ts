
import log from "../core/log.ts";
import send from "../transmit/send.ts";
import vars from "../core/vars.ts";

import { spawn as pty_spawn } from "@lydell/node-pty";

const terminal:core_module_terminal = {
    resize: function services_terminalResize(socket_data:socket_data):void {
        const data:services_terminal_resize = socket_data.data as services_terminal_resize,
            socket:websocket_pty = (function services_terminalResize():websocket_pty {
                const sockets:websocket_client[] = vars.data_store.server[vars.id.dashboard_server].sockets_tcp[data.secure];
                let index:number = sockets.length;
                if (index > 0) {
                    do {
                        index = index - 1;
                        if (sockets[index].hash === data.hash) {
                            return sockets[index] as websocket_pty;
                        }
                    } while (index > 0);
                }
                return null;
            }()),
            pty:shell_pty = (socket === null)
                ? null
                : socket.pty;
        if (pty !== null && Number.isNaN(data.cols) === false && Number.isNaN(data.rows) === false && data.cols > 0 && data.rows > 0) {
            pty.resize(Math.floor(data.cols), Math.floor(data.rows));
        }
    },
    shell: function services_terminalShell(socket:websocket_pty, config:config_terminal):void {
        const pty:shell_pty = pty_spawn(config.shell, [], {
                cols: config.cols,
                cwd: vars.path.project,
                env: process.env,
                name: socket.server_hash,
                rows: config.rows
            }),
            demo:boolean = vars.options.demo,
            close = function services_terminalShell_close():void {
                socket.pty = null;
                socket.pty_status = "killed";
                socket.destroy();
                if (socket.pty_status !== "killed") {
                    pty.kill();
                }
            },
            error = function services_terminalShell_error(err:node_error):void {
                const config:config_log = {
                    error: err,
                    message: "Socket for dashboard terminal failed with error.",
                    origin: "services/terminal.ts",
                    section: "terminal",
                    status: "error",
                    time: Date.now()
                };
                socket.destroy();
                log.application(config);
                close();
            },
            handler = function services_terminalShell_handler(socket:websocket_client, data:Buffer):void {
                if (demo === true) {
                    const str:string = data.toString(),
                        ending:string = (process.platform === "win32")
                            ? "\r"
                            : "\n";
                    if (str === "l") {
                        pty.write("l");
                        pty.write("s");
                        pty.write(ending);
                    } else if (str === "c") {
                        pty.write("c");
                        pty.write("a");
                        pty.write("t");
                        pty.write(" ");
                        pty.write("f");
                        pty.write("e");
                        pty.write("a");
                        pty.write("t");
                        pty.write("u");
                        pty.write("r");
                        pty.write("e");
                        pty.write("s");
                        pty.write(".");
                        pty.write("j");
                        pty.write("s");
                        pty.write("o");
                        pty.write("n");
                        pty.write(ending);
                    }
                } else {
                    pty.write(data.toString());
                }
            },
            out = function services_terminalShell_out(output:string):void {
                if (socket.status === "open") {
                    send(output, socket, 1);
                }
            },
            identifiers:terminal_identifiers = {
                pid: pty.pid,
                port_browser: socket.addresses.remote.port,
                port_terminal: socket.addresses.local.port,
                server_name: socket.server_hash,
                socket_hash: socket.hash
            };
        socket.handler = handler;
        socket.pty = pty;
        socket.pty_status = "open";
        send(JSON.stringify(identifiers), socket, 1);
        pty.onData(out);
        pty.onExit(close);
        socket.on("close", close);
        socket.on("end", close);
        socket.on("error", error);
    }
};

export default terminal;