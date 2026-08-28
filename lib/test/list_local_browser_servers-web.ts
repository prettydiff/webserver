

const test_listLocalBrowserServersWeb = function test_listLocalBrowserServersWeb():test_list {
    const list:test_list = [
        {
            delay: {
                node: [
                    ["getElementById", "servers-web", null],
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
                        ["getElementsByTagName", "div", 0],
                        ["getElementsByTagName", "button", 0]
                    ]
                }
            ],
            name: "Navigate to servers-web",
            type: "dom",
            unit: [
                {
                    node: [
                        ["getElementById", "servers-web", null],
                        ["getElementsByClassName", "server-list", 0],
                        ["getElementsByTagName", "li", 0]
                    ],
                    qualifier: "is",
                    target: ["class"],
                    type: "attribute",
                    value: "green"
                }
            ]
        },
        {
            interaction: [
                {
                    event: "click",
                    node: [
                        ["getElementById", "servers-web", null],
                        ["getElementsByClassName", "server-list", 0],
                        ["getElementsByTagName", "button", 0]
                    ]
                }
            ],
            name: "Expand dashboard server accordion",
            type: "dom",
            unit: [
                {
                    node: [
                        ["getElementById", "servers-web", null],
                        ["getElementsByClassName", "server-list", 0],
                        ["getElementsByTagName", "li", 0],
                        ["getElementsByTagName", "textarea", 0]
                    ],
                    qualifier: "greater",
                    target: ["offsetTop"],
                    type: "property",
                    value: 10
                },
                {
                    node: [
                        ["getElementById", "servers-web", null],
                        ["getElementsByClassName", "server-list", 0],
                        ["getElementsByTagName", "li", 0],
                        ["getElementsByClassName", "active-ports", 0],
                        ["getElementsByTagName", "li", 1]
                    ],
                    qualifier: "begins",
                    target: ["textContent"],
                    type: "property",
                    value: "Secure - "
                },
                {
                    node: [
                        ["getElementById", "servers-web", null],
                        ["getElementsByClassName", "server-list", 0],
                        ["getElementsByTagName", "li", 0],
                        ["getElementsByClassName", "active-ports", 0],
                        ["getElementsByTagName", "code", 0]
                    ],
                    qualifier: "begins",
                    target: ["textContent"],
                    type: "property",
                    value: "-----BEGIN CERTIFICATE-----"
                },
                {
                    node: [
                        ["getElementById", "servers-web", null],
                        ["getElementsByClassName", "server-list", 0],
                        ["getElementsByTagName", "li", 0],
                        ["getElementsByClassName", "active-ports", 0],
                        ["getElementsByTagName", "code", 1]
                    ],
                    qualifier: "greater",
                    target: ["textContent", "length"],
                    type: "property",
                    value: 500
                },
                {
                    node: [
                        ["getElementById", "servers-web", null],
                        ["getElementsByClassName", "server-list", 0],
                        ["getElementsByTagName", "li", 0],
                        ["getElementsByTagName", "button", 1]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "✎ Edit"
                }
            ]
        },
        {
            interaction: [
                {
                    event: "click",
                    node: [
                        ["getElementById", "servers-web", null],
                        ["getElementsByClassName", "server-list", 0],
                        ["getElementsByTagName", "li", 0],
                        ["getElementsByTagName", "button", 1]
                    ]
                }
            ],
            name: "Edit mode for a server",
            type: "dom",
            unit: [
                {
                    node: [
                        ["getElementById", "servers-web", null],
                        ["getElementsByClassName", "server-list", 0],
                        ["getElementsByTagName", "li", 0],
                        ["getElementsByTagName", "button", 1]
                    ],
                    qualifier: "is",
                    target: ["disabled"],
                    type: "property",
                    value: true
                },
                {
                    node: [
                        ["getElementById", "servers-web", null],
                        ["getElementsByClassName", "server-list", 0],
                        ["getElementsByTagName", "li", 0],
                        ["getElementsByTagName", "button", 1]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "🖪 Modify"
                },
                {
                    node: [
                        ["getElementById", "servers-web", null],
                        ["getElementsByClassName", "server-list", 0],
                        ["getElementsByTagName", "li", 0],
                        ["getElementsByTagName", "h5", 0]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "Edit Summary"
                },
                {
                    node: [
                        ["getElementById", "servers-web", null],
                        ["getElementsByClassName", "server-list", 0],
                        ["getElementsByTagName", "li", 0],
                        ["getElementsByClassName", "edit-summary", 0]
                    ],
                    qualifier: "is",
                    target: ["lastChild", "textContent"],
                    type: "property",
                    value: "The server configuration is valid, but not modified."
                },
                {
                    node: [
                        ["getElementById", "servers-web", null],
                        ["getElementsByClassName", "server-list", 0],
                        ["getElementsByTagName", "li", 0],
                        ["getElementsByClassName", "edit-summary", 0],
                        ["lastChild", null, null]
                    ],
                    qualifier: "is",
                    target: ["class"],
                    type: "attribute",
                    value: "pass-false"
                }
            ]
        }
    ];
    list.name = "Local browser tests - help";
    return list;
};

export default test_listLocalBrowserServersWeb;