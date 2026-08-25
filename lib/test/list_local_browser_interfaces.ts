
import vars from "../core/vars.ts";

const test_listLocalBrowserInterfaces = function test_listLocalBrowserInterfaces():test_list {
    const list:test_list = [
        {
            delay: {
                node: [
                    ["getElementById", "interfaces", null],
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
                        ["getElementsByTagName", "div", 2],
                        ["getElementsByTagName", "button", 0]
                    ]
                }
            ],
            name: "Navigate to interfaces",
            type: "dom",
            unit: [
                {
                    node: [
                        ["getElementById", "interfaces", null],
                        ["getElementsByClassName", "table-stats", 0],
                        ["getElementsByTagName", "p", 2],
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
                        ["getElementById", "interfaces", null],
                        ["getElementsByClassName", "item-list", 0],
                        ["getElementsByClassName", "section", 0],
                        ["getElementsByTagName", "h2", 0]
                    ],
                    qualifier: "not",
                    target: ["textContent"],
                    type: "property",
                    value: ""
                },
                {
                    node: [
                        ["getElementById", "interfaces", null],
                        ["getElementsByClassName", "item-list", 0],
                        ["getElementsByClassName", "section", 0],
                        ["getElementsByTagName", "h3", 0]
                    ],
                    qualifier: "not",
                    target: ["textContent"],
                    type: "property",
                    value: ""
                },
                {
                    node: [
                        ["getElementById", "interfaces", null],
                        ["getElementsByClassName", "item-list", 0],
                        ["getElementsByClassName", "section", 0],
                        ["getElementsByTagName", "ul", null]
                    ],
                    qualifier: "greater",
                    target: ["length"],
                    type: "property",
                    value: 0
                },
                {
                    node: [
                        ["getElementById", "interfaces", null],
                        ["getElementsByClassName", "item-list", 0],
                        ["getElementsByClassName", "section", 0],
                        ["getElementsByTagName", "strong", 0]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "address"
                },
                {
                    node: [
                        ["getElementById", "interfaces", null],
                        ["getElementsByClassName", "item-list", 0],
                        ["getElementsByClassName", "section", 0],
                        ["getElementsByTagName", "strong", 1]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "netmask"
                },
                {
                    node: [
                        ["getElementById", "interfaces", null],
                        ["getElementsByClassName", "item-list", 0],
                        ["getElementsByClassName", "section", 0],
                        ["getElementsByTagName", "strong", 2]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "family"
                },
                {
                    node: [
                        ["getElementById", "interfaces", null],
                        ["getElementsByClassName", "item-list", 0],
                        ["getElementsByClassName", "section", 0],
                        ["getElementsByTagName", "strong", 3]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "mac"
                },
                {
                    node: [
                        ["getElementById", "interfaces", null],
                        ["getElementsByClassName", "item-list", 0],
                        ["getElementsByClassName", "section", 0],
                        ["getElementsByTagName", "strong", 4]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "internal"
                },
                {
                    node: [
                        ["getElementById", "interfaces", null],
                        ["getElementsByClassName", "item-list", 0],
                        ["getElementsByClassName", "section", 0],
                        ["getElementsByTagName", "strong", 5]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "cidr"
                }
            ]
        },
        {
            delay: {
                node: [
                    ["getElementById", "interfaces", null],
                    ["getElementsByClassName", "table-stats", 0],
                    ["getElementsByTagName", "p", 2],
                    ["getElementsByTagName", "time", 0]
                ],
                qualifier: "not",
                target: ["textContent"],
                type: "property",
                value: vars.test.magicString
            },
            interaction: [
                {
                    node: [
                        ["getElementById", "interfaces", null],
                        ["getElementsByClassName", "table-stats", 0],
                        ["getElementsByTagName", "button", 0]
                    ],
                    event: "click"
                }
            ],
            name: "Update interfaces",
            type: "dom",
            unit: []
        }
    ];
    list.name = "Local browser tests - interfaces";
    return list;
};

export default test_listLocalBrowserInterfaces;