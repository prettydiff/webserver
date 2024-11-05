
import log from "../utilities/log.js";
import send from "../transmit/send.js";
import server from "../transmit/server.js";
import server_halt from "./server_halt.js";
import vars from "../utilities/vars.js";

import { spawn } from "@lydell/node-pty";

// cspell: words lydell

const terminal:terminal_library = {
    delay: null,
    server: function services_terminalServer(socketData:socket_data, transmit:transmit_socket):void {
        const data:services_dashboard_action = socketData.data as services_dashboard_action,
            encryption:"open"|"secure" = data.configuration.encryption as "open"|"secure",
            socket:websocket_client = transmit.socket as websocket_client,
            log:services_dashboard_status = {
                action: "add",
                configuration: data.configuration,
                message: `Server named ${data.configuration.name} created.`,
                status: "success",
                time: Date.now(),
                type: "server"
            };
        vars.servers[data.configuration.name] = {
            config: data.configuration,
            sockets: [],
            status: {
                [encryption]: 0
            }
        };
        vars.server_meta[data.configuration.name] = {
            server: {
                open: null,
                secure: null
            },
            sockets: {
                open: [],
                secure: []
            }
        };
        server(data, function services_terminal_callback(name:string):void {{
            terminal.delay = setTimeout(function services_terminal_callback_delay():void {
                const type:"open"|"secure" = vars.servers[name].config.encryption as "open"|"secure";
                if (vars.server_meta[name].sockets[type].length < 1) {
                    server_halt({
                        action: "deactivate",
                        configuration: vars.servers[name].config
                    }, function services_terminal_callback_delay_callback():void {
                        delete vars.server_meta[name];
                        delete vars.servers[name];
                    });
                }
                terminal.delay = null;
            }, 20000);
        }});
        // using send instead of log because this is not for broadcast
        send({
            data: log,
            service: "dashboard-status"
        }, socket, 1);
    },
    shell: function services_terminalShell(socket:websocket_client):void {
        const command:string = (process.platform === "win32")
                ? "powershell.exe"
                : "/bin/sh",
            pty:pty = spawn(command, [], {
                cols: vars.terminal.cols,
                cwd: vars.path.project,
                env: process.env,
                name: socket.server,
                rows: vars.terminal.rows
            }),
            close = function services_terminalShell_close():void {
                if (terminal.delay !== null) {
                    clearTimeout(terminal.delay);
                }
                if (vars.servers[socket.server] !== undefined) {
                    server_halt({
                        action: "deactivate",
                        configuration: vars.servers[socket.server].config
                    }, function services_terminal_callback_delay_callback():void {
                        delete vars.server_meta[socket.server];
                        delete vars.servers[socket.server];
                    });
                }
                pty.kill();
            },
            error = function services_terminalShell_error(err:node_error):void {
                const config:config_log = {
                    action: "activate",
                    config: err,
                    message: "Socket for dashboard terminal failed with error.",
                    status: "error",
                    type: "terminal"
                };
                log(config);
                close();
            },
            handler = function services_terminalShell_handler(data:Buffer):void {
                input = data.toString();
                pty.write(input);
            },
            out = function services_terminalShell_out(output:string):void {
                send(output, socket, 3);
            };
        let input:string = null;
        socket.handler = handler;
        pty.onData(out);
        pty.onExit(close);
        socket.on("close", close);
        socket.on("end", close);
        socket.on("error", error);
    }
};

export default terminal;