
import broadcast from "../transmit/broadcast.ts";
import node from "../core/node.ts";
import send from "../transmit/send.ts";
import vars from "../core/vars.ts";

const demo:core_module_demo = {
    clock: function services_demo_clock(time_end:number, id:string, callback:(time_string:string) => void):void {
        if (id === "local" || (id !== "local" && demo.instances[id] !== undefined)) {
            const time:number = time_end - Date.now();
            if (time < 0) {
                callback("00:00");
            } else {
                const minute:string = String(Math.floor(time / 60000)),
                    minute_pad:string = (minute.length > 1)
                        ? minute
                        : `0${minute}`,
                    seconds:number = (time % 60000) / 1000,
                    seconds_str:string[] = seconds.toString().split("."),
                    seconds_sup:string = (seconds_str[0].length === 1)
                        ? `0${seconds_str[0]}`
                        : seconds_str[0];
                callback(`${minute_pad}:${seconds_sup}`);
                setTimeout(function services_demo_clock_recurse_delay():void {
                    services_demo_clock(time_end, id, callback);
                }, 975);
            }
        }
    },
    clock_self: function services_demo_clockSelf():void {
        if (vars.options.demo === true) {
            const time_end:number = Date.now() + 600000,
                payload:services_demo = {
                    port: vars.data.server[vars.id.dashboard_server].ports.open,
                    process: process.pid,
                    socket: "",
                    time: time_end,
                    time_string: ""
                };
            demo.clock(time_end, "local", function services_demo_clockSelf_broadcast(time_string:string):void {
                broadcast(vars.id.dashboard_server, "dashboard", {
                    data: {remaining: time_string},
                    service: "services_status_clock_demo"
                });
                if (time_string === "00:00") {
                    setTimeout(function services_demo_clock_recurse_kill() {
                        process.exit(0);
                    }, 50);
                }
            });
            process.stderr.write(JSON.stringify(payload));
        }
    },
    instances: {},
    kill: function services_demo_kill(id:string, socket:websocket_client):void {
        if (demo.instances[id] !== undefined) {
            if (socket !== null) {
                const payload:services_demo = {
                    port: demo.instances[id].port,
                    process: demo.instances[id].process,
                    socket: id,
                    time: demo.instances[id].time,
                    time_string: "00:00"
                };
                send({
                    data: payload,
                    service: "services_demo"
                }, socket, 3);
            }
            demo.instances[id].child.kill(0);
            delete demo.instances[id];
        }
    },
    service: function services_demo_service(socket_data:socket_data, transmit:transmit_socket):void {
        const socket:websocket_client = (transmit === null)
                ? null
                : transmit.socket as websocket_client,
            hash:string = (socket === null)
                ? "local"
                : socket.hash;
        if (demo.instances[hash] === undefined) {
            const args:string[] = (function services_demo_service_args():string[] {
                    const len:number = process.argv.length,
                        output:string[] = [];
                    let index:number = 1;
                    if (len > 1) {
                        do {
                            output.push(process.argv[index]);
                            index = index + 1;
                        } while (index < len);
                    }
                    output.push("demo");
                    return output;
                }()),
                child:node_childProcess_ChildProcess = node.child_process.fork(`${vars.path.project}lib${vars.path.sep}index.ts`, {
                    execArgv: args,
                    stdio: "pipe"
                });
            child.on("exit", function services_demo_service_exit():void {
                demo.kill(hash, socket);
            });
            child.stderr.on("data", function services_demo_service_stderr(stderr:Buffer):void {
                try {
                    const data:services_demo = JSON.parse(stderr.toString()),
                        payload:services_demo = {
                            child: child,
                            port: data.port,
                            process: data.process,
                            socket: hash,
                            time: data.time,
                            time_string: ""
                        };
                    demo.instances[socket.hash] = payload;
                    demo.clock(data.time, hash, function services_demo_service_stderr_clock(time_string):void {
                        demo.instances[socket.hash].time_string = time_string;
                        if (socket !== null) {
                            const payload_send:services_demo = {
                                port: demo.instances[socket.hash].port,
                                process: demo.instances[socket.hash].process,
                                socket: socket.hash,
                                time: demo.instances[socket.hash].time,
                                time_string: time_string
                            };
                            send({
                                data: payload_send,
                                service: "services_demo"
                            }, socket, 3);
                        }
                    });
                } catch (e:unknown) {
                    const payload:services_demo = {
                        port: 0,
                        process: 0,
                        socket: `Error: Failed to receive data identifiers from demo instance. ${e}`,
                        time: 0,
                        time_string: ""
                    };
                    if (socket !== null) {
                        send({
                            data: payload,
                            service: "services_demo"
                        }, socket, 3);
                    }
                }
            });
        } else if (socket !== null) {
            send({
                data: demo.instances[hash],
                service: "services_demo"
            }, socket, 3);
        }
    }
};

export default demo;