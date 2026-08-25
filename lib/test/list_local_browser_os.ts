
import vars from "../core/vars.ts";

const test_listLocalBrowserOS = function test_listLocalBrowserOS():test_list {
    const list:test_list = [
        {
            delay: {
                node: [
                    ["getElementById", "os-machine", null],
                    ["getElementsByTagName", "h2", 0]
                ],
                qualifier: "greater",
                target: ["offsetTop"],
                type: "property",
                value: 10
            },
            interaction: [
                {
                    event: "click",
                    node: [
                        ["getElementsByTagName", "nav", 0],
                        ["getElementsByTagName", "div", 3],
                        ["getElementsByTagName", "button", 0]
                    ]
                }
            ],
            name: "Navigate to os",
            type: "dom",
            unit: [
                {
                    node: [
                        ["getElementById", "os-machine", null],
                        ["getElementsByClassName", "table-stats", 0],
                        ["getElementsByTagName", "time", 0]
                    ],
                    qualifier: "not",
                    store: true,
                    target: ["textContent"],
                    type: "property",
                    value: ""
                },
                {
                    node: [
                        ["getElementById", "os-machine", null],
                        ["getElementsByClassName", "section", 0],
                        ["getElementsByClassName", "section", 0],
                        ["getElementsByTagName", "h3", 0]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "Machine"
                },
                {
                    node: [
                        ["getElementById", "os-machine", null],
                        ["getElementsByClassName", "section", 0],
                        ["getElementsByClassName", "section", 0],
                        ["getElementsByTagName", "h4", 0]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "CPU"
                },
                {
                    node: [
                        ["getElementById", "os-machine", null],
                        ["getElementsByClassName", "section", 0],
                        ["getElementsByClassName", "section", 0],
                        ["getElementsByTagName", "h4", 1]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "Memory"
                },
                {
                    node: [
                        ["getElementById", "os-machine", null],
                        ["getElementsByClassName", "section", 0],
                        ["getElementsByClassName", "section", 1],
                        ["getElementsByTagName", "h3", 0]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "Operating System"
                },
                {
                    node: [
                        ["getElementById", "os-machine", null],
                        ["getElementsByClassName", "section", 0],
                        ["getElementsByClassName", "section", 1],
                        ["getElementsByTagName", "h4", 0]
                    ],
                    qualifier: "is",
                    target: ["firstChild", "textContent"],
                    type: "property",
                    value: "Path "
                },
                {
                    node: [
                        ["getElementById", "os-machine", null],
                        ["getElementsByClassName", "section", 0],
                        ["getElementsByClassName", "section", 1],
                        ["getElementsByTagName", "h4", 1]
                    ],
                    qualifier: "is",
                    target: ["firstChild", "textContent"],
                    type: "property",
                    value: "Environmental Variables "
                },
                {
                    node: [
                        ["getElementById", "os-machine", null],
                        ["getElementsByClassName", "section", 0],
                        ["getElementsByClassName", "section", 2],
                        ["getElementsByTagName", "h3", 0]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "Application Process"
                },
                {
                    node: [
                        ["getElementById", "os-machine", null],
                        ["getElementsByClassName", "section", 0],
                        ["getElementsByClassName", "section", 2],
                        ["getElementsByTagName", "h4", 0]
                    ],
                    qualifier: "is",
                    target: ["firstChild", "textContent"],
                    type: "property",
                    value: "Node.js Dependency Versions "
                },
                {
                    node: [
                        ["getElementById", "os-machine", null],
                        ["getElementsByClassName", "section", 0],
                        ["getElementsByClassName", "section", 3],
                        ["getElementsByTagName", "h3", 0]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "User"
                }
            ]
        },
        {
            delay: {
                node: [
                    ["getElementById", "os-machine", null],
                    ["getElementsByClassName", "table-stats", 0],
                    ["getElementsByTagName", "time", 0]
                ],
                qualifier: "not",
                target: ["textContent"],
                type: "property",
                value: vars.test.magicString
            },
            interaction: [
                {
                    event: "click",
                    node: [
                        ["getElementById", "os-machine", null],
                        ["getElementsByClassName", "table-stats", 0],
                        ["getElementsByTagName", "button", 0]
                    ]
                }
            ],
            name: "Update OS content",
            type: "dom",
            unit: []
        }
    ];
    list.name = "Local browser tests - os";
    return list;
};

export default test_listLocalBrowserOS;