
import get_address from "../utilities/getAddress.js";
import log from "../utilities/log.js";
import send from "../transmit/send.js";
import server_halt from "./server_halt.js";
import vars from "../utilities/vars.js";

import { spawn } from "@lydell/node-pty";

// cspell: words lydell

const terminal = function services_terminal(socket:websocket_client):void {
    const pty:pty = spawn(vars.shell, [], {
            cols: vars.terminal.cols,
            cwd: vars.path.project,
            env: process.env,
            name: socket.server,
            rows: vars.terminal.rows
        }),
        close = function services_terminalShell_close():void {
            if (vars.servers[socket.server] !== undefined) {
                server_halt({
                    action: "destroy",
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
        },
        address:transmit_addresses_socket = get_address({
            socket: socket,
            type: "ws"
        }),
        identifiers:terminal_identifiers = {
            pid: pty.pid,
            port_browser: address.remote.port,
            port_terminal: address.local.port,
            server_name: socket.server
        };
    let input:string = null;
    socket.handler = handler;
    send(JSON.stringify(identifiers), socket, 3);
    pty.onData(out);
    pty.onExit(close);
    socket.on("close", close);
    socket.on("end", close);
    socket.on("error", error);
};

export default terminal;