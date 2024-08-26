
import node from "./node.js";

/* cspell: words appdata */

const vars:vars = {
    // destroy incoming sockets that exactly match criteria in these lists
    block_list: {
        host: [],
        ip: [],
        referer: []
    },
    // locally supported domains that will not be redirected
    domain_local: [],
    path: {
        conf: "",
        project: "",
        storage: "",
        web_root: ""
    },
    processes: {},
    redirect_domain: {},
    redirect_internal: {},
    sep: node.path.sep,
    server_name: "",
    servers: {},
    service_port: {
        dashboard: null,
        open: 80,
        secure: 443
    },
    sockets: {},
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
    verbose: false
};

export default vars;