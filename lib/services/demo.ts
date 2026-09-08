
import node from "../core/node.ts";
import send from "../transmit/send.ts";
import vars from "../core/vars.ts";

const demo = function services_demo(socket_data:socket_data, transmit:transmit_socket):void {
    const child:node_childProcess_ChildProcess = node.child_process.fork(`${vars.path.project}lib${vars.path.sep}index.ts`, {
            execArgv: ["demo"],
            stdio: "pipe"
        }),
        socket:websocket_client = transmit.socket as websocket_client;
    child.stderr.on("data", function services_demo_stderr(data:Buffer):void {
        // console.log("stderr");console.log(data.toString());
        send(data, socket, 2);
    });
    child.stdout.on("data", function services_demo_stderr(data:Buffer):void {
        // console.log(data.toString());
        send(data, socket, 2);
    });
};

export default demo;