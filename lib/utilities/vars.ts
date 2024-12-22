
import node from "./node.js";

/* cspell: words appdata */

const gid:number = process.getgid(),
    uid:number = process.getuid(),
    vars:vars = {
        compose: {
            containers: {},
            variables: {}
        },
        dashboard: "",
        interfaces: [
            "localhost",
            "127.0.0.1",
            "::1",
            "[::1]"
        ],
        intervals: {
            compose: 0,
            nmap: 60000
        },
        logs: [],
        path: {
            compose: "",
            project: "",
            servers: ""
        },
        processes: {},
        sep: node.path.sep,
        servers: {},
        server_meta: {},
        shell: (process.platform === "win32")
            ? "powershell.exe"
            : "/bin/sh",
        system_ports: {
            list: [],
            time: 0
        },
        start_time: process.hrtime.bigint(),
        terminal: {
            cols: 199,
            rows: 50
        },
        text: {
            angry    : "\u001b[1m\u001b[31m",
            blue     : "\u001b[34m",
            bold     : "\u001b[1m",
            boldLine : "\u001b[1m\u001b[4m",
            clear    : "\u001b[24m\u001b[22m",
            cyan     : "\u001b[36m",
            green    : "\u001b[32m",
            noColor  : "\u001b[39m",
            none     : "\u001b[0m",
            purple   : "\u001b[35m",
            red      : "\u001b[31m",
            underline: "\u001b[4m",
            yellow   : "\u001b[33m"
        },
        user: {
            gid: (gid === 0)
                ? 1000
                : gid,
            uid: (uid === 0)
                ? 1000
                : uid
        }
    };

export default vars;