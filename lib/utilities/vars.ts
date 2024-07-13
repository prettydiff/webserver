
import node from "./node.js";

const vars:vars = {
    host: "",
    port: 3333,
    projectPath: "",
    secure: false,
    sep: node.path.sep,
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