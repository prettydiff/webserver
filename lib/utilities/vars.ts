
import node from "./node.js";

/* cspell: words appdata */

const gid:number = (typeof process.getgid === "undefined")
        ? 0
        : process.getgid(),
    uid:number = (typeof process.getuid === "undefined")
        ? 0
        : process.getuid(),
    vars:vars = {
        commands: {
            compose: (process.platform === "win32")
                ? "docker-compose"
                : "docker compose",
            docker: "docker",
            nmap: "nmap"
        },
        compose: {
            containers: {},
            variables: {}
        },
        css: "",
        dashboard: "",
        hashes: node.crypto.getHashes(),
        http_headers: "",
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
        os: {
            machine: {
                cpu: {
                    arch: node.os.arch(),
                    endianness: node.os.endianness(),
                    frequency: node.os.cpus()[0].speed,
                    name: node.os.cpus()[0].model,
                },
                interfaces: node.os.networkInterfaces(),
                memory: {
                    free: node.os.freemem(),
                    total: node.os.totalmem()
                }
            },
            os: {
                env: process.env,
                hostname: node.os.hostname(),
                path: (process.platform === "win32")
                    ? process.env.Path.split(";")
                    : (process.env.PATH === undefined)
                        ? []
                        : process.env.PATH.split(":"),
                platform: node.os.platform(),
                release: node.os.release(),
                type: node.os.type(),
                uptime: node.os.uptime(),
                version: node.os.version()
            },
            process: {
                arch: process.arch,
                argv: process.argv,
                cpuSystem: process.cpuUsage().system,
                cpuUser: process.cpuUsage().user,
                cwd: process.cwd(),
                pid: process.pid,
                platform: process.platform,
                ppid: process.ppid,
                uptime: process.uptime(),
                versions: process.versions
            },
            user: {
                gid: (gid === 0)
                    ? 1000
                    : gid,
                homedir: node.os.homedir(),
                uid: (gid === 0)
                    ? 1000
                    : uid
            }
        },
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
        }
    };

export default vars;