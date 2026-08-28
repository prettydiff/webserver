
import vars from "../core/vars.ts";

const test_listLocalBrowserFileSystem = function test_listLocalBrowserFileSystem():test_list {
    const list:test_list = [
        {
            delay: {
                node: [
                    ["getElementById", "file-system", null],
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
                        ["getElementsByTagName", "div", 4],
                        ["getElementsByTagName", "button", 1]
                    ]
                }
            ],
            name: "Navigate to file-system",
            type: "dom",
            unit: []
        },
        {
            delay: {
                node: [
                    ["getElementById", "file-system", null],
                    ["getElementsByClassName", "file-list", 0],
                    ["getElementsByTagName", "tbody", 0],
                    ["getElementsByTagName", "tr", null]
                ],
                qualifier: "greater",
                target: ["length"],
                type: "property",
                value: 15
            },
            interaction: [
                {
                    event: "click",
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 0]
                    ]
                },
                {
                    event: "setValue",
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 0]
                    ],
                    value: vars.path.project.replace(`${vars.path.sep}test`, "").replace(/(\\|\/)$/, "")
                },
                {
                    event: "keydown",
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 0]
                    ],
                    value: "Enter"
                },
                {
                    event: "keyup",
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 0]
                    ],
                    value: "Enter"
                }
            ],
            name: "Navigate to project path",
            type: "dom",
            unit: [
                {
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", null]
                    ],
                    qualifier: "is",
                    target: ["length"],
                    type: "property",
                    value: 3
                },
                {
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 0]
                    ],
                    qualifier: "ends",
                    target: ["value"],
                    type: "property",
                    value: ["webserver", "aphorio"]
                },
                {
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 1]
                    ],
                    qualifier: "is",
                    target: ["value"],
                    type: "property",
                    value: ""
                },
                {
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 2]
                    ],
                    qualifier: "is",
                    target: ["value"],
                    type: "property",
                    value: "1"
                },
                {
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "select", 0],
                        ["getElementsByTagName", "option", null]
                    ],
                    qualifier: "is",
                    target: ["length"],
                    type: "property",
                    value: 2
                },
                {
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "file-list", 0],
                        ["getElementsByTagName", "tbody", 0],
                        ["getElementsByTagName", "tr", null]
                    ],
                    qualifier: "greater",
                    target: ["length"],
                    type: "property",
                    value: 15
                },
                {
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 1]
                    ],
                    qualifier: "is",
                    target: ["value"],
                    type: "property",
                    value: ""
                },
                {
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 2]
                    ],
                    qualifier: "is",
                    target: ["value"],
                    type: "property",
                    value: "1"
                },
                {
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "select", 0]
                    ],
                    qualifier: "is",
                    target: ["selectedIndex"],
                    type: "property",
                    value: 1
                },
                {
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "select", 1]
                    ],
                    qualifier: "is",
                    target: ["selectedIndex"],
                    type: "property",
                    value: 0
                },
                {
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "file-list", 0],
                        ["getElementsByTagName", "tbody", 0],
                        ["getElementsByTagName", "tr", 0],
                        ["getElementsByTagName", "button", 0]
                    ],
                    qualifier: "is",
                    target: ["lastChild", "textContent"],
                    type: "property",
                    value: " .."
                },
                {
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "file-list", 0],
                        ["getElementsByTagName", "tbody", 0],
                        ["getElementsByTagName", "tr", 1],
                        ["getElementsByTagName", "button", 0]
                    ],
                    qualifier: "is",
                    target: ["lastChild", "textContent"],
                    type: "property",
                    value: " ."
                },
                {
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "file-list", 0],
                        ["getElementsByTagName", "tbody", 0],
                        ["getElementsByTagName", "tr", 2],
                        ["getElementsByTagName", "button", 0]
                    ],
                    qualifier: "is",
                    target: ["lastChild", "textContent"],
                    type: "property",
                    value: " .git"
                },
                {
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "file-list", 0],
                        ["getElementsByTagName", "tbody", 0],
                        ["getElementsByTagName", "tr", 2],
                        ["getElementsByTagName", "td", 2]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "0"
                },
                {
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "file-list", 0],
                        ["getElementsByTagName", "tbody", 0],
                        ["getElementsByTagName", "tr", 3],
                        ["getElementsByTagName", "td", 2]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "0"
                }
            ]
        },
        {
            delay: {
                node: [
                    ["getElementById", "file-system", null],
                    ["getElementsByClassName", "section", 0],
                    ["getElementsByClassName", "file-system-failures", 0]
                ],
                qualifier: "is",
                target: ["textContent"],
                type: "property",
                value: "System cannot access file system object at this address."
            },
            interaction: [
                {
                    event: "click",
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 2]
                    ]
                },
                {
                    event: "setValue",
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 2]
                    ],
                    value: "1"
                },
                {
                    event: "click",
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 1]
                    ]
                },
                {
                    event: "setValue",
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 1]
                    ],
                    value: "index"
                },
                {
                    event: "keydown",
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 1]
                    ],
                    value: "Enter"
                },
                {
                    event: "keyup",
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 1]
                    ],
                    value: "Enter"
                }
            ],
            name: "Search for 'index' at depth '1'",
            type: "dom",
            unit: []
        },
        {
            delay: {
                node: [
                    ["getElementById", "file-system", null],
                    ["getElementsByClassName", "file-list", 0],
                    ["getElementsByTagName", "tbody", 0],
                    ["getElementsByTagName", "tr", null]
                ],
                qualifier: "is",
                target: ["length"],
                type: "property",
                value: 2
            },
            interaction: [
                {
                    event: "click",
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 2]
                    ]
                },
                {
                    event: "setValue",
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 2]
                    ],
                    value: "2"
                },
                {
                    event: "keydown",
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 2]
                    ],
                    value: "Enter"
                },
                {
                    event: "keyup",
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 2]
                    ],
                    value: "Enter"
                }
            ],
            name: "Search for 'index' at depth '2'",
            type: "dom",
            unit: [
                {
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "file-list", 0],
                        ["getElementsByTagName", "tbody", 0],
                        ["getElementsByTagName", "tr", 0],
                        ["getElementsByTagName", "button", 0]
                    ],
                    qualifier: "is",
                    target: ["lastChild", "textContent"],
                    type: "property",
                    value: ` .git${vars.path.sep}index`
                },
                {
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "file-list", 0],
                        ["getElementsByTagName", "tbody", 0],
                        ["getElementsByTagName", "tr", 1],
                        ["getElementsByTagName", "button", 0]
                    ],
                    qualifier: "is",
                    target: ["lastChild", "textContent"],
                    type: "property",
                    value: ` lib${vars.path.sep}index.ts`
                }
            ]
        },
        {
            delay: {
                node: [
                    ["getElementById", "file-system", null],
                    ["getElementsByClassName", "file-list", 0],
                    ["getElementsByTagName", "tbody", 0],
                    ["getElementsByTagName", "tr", null]
                ],
                qualifier: "greater",
                target: ["length"],
                type: "property",
                value: 10
            },
            interaction: [
                {
                    event: "setValue",
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "select", 0]
                    ],
                    value: "Absolute"
                },
                {
                    event: "click",
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 1]
                    ]
                },
                {
                    event: "setValue",
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 1]
                    ],
                    value: ""
                },
                {
                    event: "click",
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 2]
                    ]
                },
                {
                    event: "setValue",
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 2]
                    ],
                    value: "1"
                },
                {
                    event: "keydown",
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 2]
                    ],
                    value: "Enter"
                },
                {
                    event: "keyup",
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 2]
                    ],
                    value: "Enter"
                }
            ],
            name: "Display absolute paths, no directory size",
            type: "dom",
            unit: [
                {
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "file-list", 0],
                        ["getElementsByTagName", "tbody", 0],
                        ["getElementsByTagName", "tr", 2],
                        ["getElementsByTagName", "button", 0]
                    ],
                    qualifier: "ends",
                    target: ["lastChild", "textContent"],
                    type: "property",
                    value: `${vars.path.sep}.git`
                },
                {
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "file-list", 0],
                        ["getElementsByTagName", "tbody", 0],
                        ["getElementsByTagName", "tr", 2],
                        ["getElementsByTagName", "td", 2]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "0"
                },
                {
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "file-list", 0],
                        ["getElementsByTagName", "tbody", 0],
                        ["getElementsByTagName", "tr", 3],
                        ["getElementsByTagName", "button", 0]
                    ],
                    qualifier: "ends",
                    target: ["lastChild", "textContent"],
                    type: "property",
                    value: `${vars.path.sep}bin`
                },
                {
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "file-list", 0],
                        ["getElementsByTagName", "tbody", 0],
                        ["getElementsByTagName", "tr", 3],
                        ["getElementsByTagName", "td", 2]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "0"
                }
            ]
        },
        {
            delay: {
                node: [
                    ["getElementById", "file-system", null],
                    ["getElementsByClassName", "file-list", 0],
                    ["getElementsByTagName", "tbody", 0],
                    ["getElementsByTagName", "tr", 2],
                    ["getElementsByTagName", "button", 0]
                ],
                qualifier: "ends",
                target: ["lastChild", "textContent"],
                type: "property",
                value: `${vars.path.sep}.git`
            },
            interaction: [
                {
                    event: "setValue",
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "select", 1]
                    ],
                    value: "true (extremely slow)"
                },
                {
                    event: "click",
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 1]
                    ]
                },
                {
                    event: "setValue",
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 1]
                    ],
                    value: ""
                },
                {
                    event: "click",
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 2]
                    ]
                },
                {
                    event: "setValue",
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 2]
                    ],
                    value: "1"
                },
                {
                    event: "keydown",
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 2]
                    ],
                    value: "Enter"
                },
                {
                    event: "keyup",
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 2]
                    ],
                    value: "Enter"
                }
            ],
            name: "Display absolute paths and directory size",
            type: "dom",
            unit: [
                {
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "file-list", 0],
                        ["getElementsByTagName", "tbody", 0],
                        ["getElementsByTagName", "tr", 2],
                        ["getElementsByTagName", "td", 2]
                    ],
                    qualifier: "not",
                    target: ["textContent"],
                    type: "property",
                    value: "0"
                },
                {
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "file-list", 0],
                        ["getElementsByTagName", "tbody", 0],
                        ["getElementsByTagName", "tr", 3],
                        ["getElementsByTagName", "button", 0]
                    ],
                    qualifier: "ends",
                    target: ["lastChild", "textContent"],
                    type: "property",
                    value: `${vars.path.sep}bin`
                },
                {
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "file-list", 0],
                        ["getElementsByTagName", "tbody", 0],
                        ["getElementsByTagName", "tr", 3],
                        ["getElementsByTagName", "td", 2]
                    ],
                    qualifier: "not",
                    target: ["textContent"],
                    type: "property",
                    value: "0"
                }
            ]
        },
        {
            delay: {
                node: [
                    ["getElementById", "file-system", null],
                    ["getElementsByClassName", "file-list", 0],
                    ["getElementsByTagName", "tbody", 0],
                    ["getElementsByTagName", "tr", 2],
                    ["getElementsByTagName", "button", 0]
                ],
                qualifier: "ends",
                target: ["lastChild", "textContent"],
                type: "property",
                value: " .git"
            },
            interaction: [
                {
                    event: "setValue",
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "select", 0]
                    ],
                    value: "Relative"
                },
                {
                    event: "click",
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 1]
                    ]
                },
                {
                    event: "setValue",
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 1]
                    ],
                    value: ""
                },
                {
                    event: "click",
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 2]
                    ]
                },
                {
                    event: "setValue",
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 2]
                    ],
                    value: "1"
                },
                {
                    event: "keydown",
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 2]
                    ],
                    value: "Enter"
                },
                {
                    event: "keyup",
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 2]
                    ],
                    value: "Enter"
                }
            ],
            name: "Display relative paths and directory size",
            type: "dom",
            unit: [
                {
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "file-list", 0],
                        ["getElementsByTagName", "tbody", 0],
                        ["getElementsByTagName", "tr", 6],
                        ["getElementsByTagName", "td", 2]
                    ],
                    qualifier: "not",
                    target: ["textContent"],
                    type: "property",
                    value: "0"
                },
                {
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "file-list", 0],
                        ["getElementsByTagName", "tbody", 0],
                        ["getElementsByTagName", "tr", 3],
                        ["getElementsByTagName", "button", 0]
                    ],
                    qualifier: "is",
                    target: ["lastChild", "textContent"],
                    type: "property",
                    value: " bin"
                },
                {
                    node: [
                        ["getElementById", "file-system", null],
                        ["getElementsByClassName", "file-list", 0],
                        ["getElementsByTagName", "tbody", 0],
                        ["getElementsByTagName", "tr", 3],
                        ["getElementsByTagName", "td", 2]
                    ],
                    qualifier: "not",
                    target: ["textContent"],
                    type: "property",
                    value: "0"
                }
            ]
        }
    ];
    list.name = "Local browser tests - file system";
    return list;
};

export default test_listLocalBrowserFileSystem;