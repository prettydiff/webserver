
import log from "../utilities/log.js";
import node from "../utilities/node.js";
import send from "../transmit/send.js";
import server from "../transmit/server.js";
import server_halt from "../commands/server_halt.js";
import vars from "../utilities/vars.js";

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
            spawn:node_childProcess_ChildProcess = node.child_process.spawn(command, {
                cwd: vars.path.project,
                shell: true
            }),
            close = function services_terminalShell_close():void {
                if (terminal.delay !== null) {
                    clearTimeout(terminal.delay);
                }
                spawn.kill(0);
                if (vars.servers[socket.server] !== undefined) {
                    server_halt({
                        action: "deactivate",
                        configuration: vars.servers[socket.server].config
                    }, function services_terminal_callback_delay_callback():void {
                        delete vars.server_meta[socket.server];
                        delete vars.servers[socket.server];
                    });
                }
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
                input = `${data.toString()}\n`;
                spawn.stdin.write(input);
            },
            out = function services_terminalShell_out(data:Buffer):void {console.log(data.toString());
                const output:string = data.toString(),
                    trimmed:string = output.replace(/\s+$/, "");
                if (input !== null && trimmed !== input.replace(/\s+$/, "")) {
                    if ((/^\s+$/).test(output) === true) {
                        const final:string = result.join("\r\n").replace(/^(\r|\n)+/, "");
                        if (final !== "") {
                            send(final, socket, 3);
                            result = [];
                        }
                    } else {
                        result.push(trimmed);
                    }
                }
            };
        let input:string = null,
            result:string[] = [];
        socket.handler = handler;
        spawn.on("message", out);
        spawn.stdout.on("data", out);
        spawn.stderr.on("data", out);
        spawn.on("close", close);
        spawn.on("error", error);
        socket.on("close", close);
        socket.on("end", close);
        socket.on("error", error);
    }
}

export default terminal;