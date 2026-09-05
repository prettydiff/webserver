

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
        },
        {
            interaction: [
                {
                    event: "click",
                    node: [
                        ["getElementById", "servers-web", null],
                        ["getElementsByClassName", "server-list", 0],
                        ["getElementsByTagName", "li", 0],
                        ["getElementsByTagName", "button", 0]
                    ]
                },
                {
                    event: "click",
                    node: [
                        ["getElementById", "servers-web", null],
                        ["getElementsByClassName", "server-list", 0],
                        ["getElementsByTagName", "li", 0],
                        ["getElementsByTagName", "button", 0]
                    ]
                }
            ],
            name: "Close and reopen server accordion",
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
                        ["parentNode", null, null],
                        ["getElementsByTagName", "button", 0]
                    ]
                }
            ],
            name: "Prepare new insecure server",
            type: "dom",
            unit: [
                {
                    node: [
                        ["getElementById", "servers-web", null],
                        ["getElementsByClassName", "edit", 0],
                        ["getElementsByClassName", "edit-summary", 0],
                        ["getElementsByClassName", "pass-warn", 0]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "Warning: The name 'new_server' is a default placeholder. A more unique name is preferred."
                },
                {
                    node: [
                        ["getElementById", "servers-web", null],
                        ["getElementsByClassName", "edit", 0],
                        ["getElementsByClassName", "edit-summary", 0],
                        ["getElementsByClassName", "pass-warn", 1]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "Warning: A port value of 0 will assign a randomly available port from the local machine. A number greater than 0 and less than 65535 is preferred."
                },
                {
                    node: [
                        ["getElementById", "servers-web", null],
                        ["getElementsByClassName", "server-list", 0],
                        ["parentNode", null, null],
                        ["getElementsByTagName", "button", 0]
                    ],
                    qualifier: "is",
                    target: ["disabled"],
                    type: "property",
                    value: true
                }
            ]
        },
        {
            interaction: [
                {
                    event: "click",
                    node: [
                        ["getElementById", "servers-web", null],
                        ["getElementsByClassName", "edit", 0],
                        ["getElementsByTagName", "textarea", 0]
                    ]
                },
                {
                    event: "setValue",
                    node: [
                        ["getElementById", "servers-web", null],
                        ["getElementsByClassName", "edit", 0],
                        ["getElementsByTagName", "textarea", 0]
                    ],
                    value: `{
    "activate": true,
    "domain_local": [
        "localhost"
    ],
    "encryption": "open",
    "id": "",
    "message_segmentation": 1e6,
    "mutual_tls": false,
    "name": "test-server",
    "ports": {
        "open": 54321
    },
    "upgrade": false
}`
                },
                {
                    event: "keydown",
                    node: [
                        ["getElementById", "servers-web", null],
                        ["getElementsByClassName", "edit", 0],
                        ["getElementsByTagName", "textarea", 0]
                    ],
                    value: "shift"
                },
                {
                    event: "keyup",
                    node: [
                        ["getElementById", "servers-web", null],
                        ["getElementsByClassName", "edit", 0],
                        ["getElementsByTagName", "textarea", 0]
                    ],
                    value: "shift"
                }
            ],
            name: "Define new insecure server",
            type: "dom",
            unit: [
                {
                    node: [
                        ["getElementById", "servers-web", null],
                        ["getElementsByClassName", "edit", 0],
                        ["getElementsByClassName", "edit-summary", 0],
                        ["getElementsByClassName", "pass-warn", null]
                    ],
                    qualifier: "is",
                    target: ["length"],
                    type: "property",
                    value: 0
                }
            ]
        },
        {
            delay: {
                node: [
                    ["getElementById", "servers-web", null],
                    ["getElementsByClassName", "edit", null]
                ],
                qualifier: "is",
                target: ["length"],
                type: "property",
                value: 1
            },
            interaction: [
                {
                    event: "click",
                    node: [
                        ["getElementById", "servers-web", null],
                        ["getElementsByClassName", "edit", 0],
                        ["getElementsByClassName", "server-cancel", 0]
                    ]
                }
            ],
            name: "Cancel new insecure server",
            type: "dom",
            unit: [
                {
                    node: [
                        ["getElementById", "servers-web", null],
                        ["getElementsByClassName", "server-list", 0],
                        ["parentNode", null, null],
                        ["getElementsByTagName", "button", 0]
                    ],
                    qualifier: "is",
                    target: ["disabled"],
                    type: "property",
                    value: false
                }
            ]
        },
        {
            interaction: [
                {
                    event: "click",
                    node: [
                        ["getElementById", "servers-web", null],
                        ["getElementsByClassName", "server-new", 0]
                    ]
                },
                {
                    event: "click",
                    node: [
                        ["getElementById", "servers-web", null],
                        ["getElementsByClassName", "edit", 0],
                        ["getElementsByTagName", "textarea", 0]
                    ]
                },
                {
                    event: "setValue",
                    node: [
                        ["getElementById", "servers-web", null],
                        ["getElementsByClassName", "edit", 0],
                        ["getElementsByTagName", "textarea", 0]
                    ],
                    value: `{
    "activate": true,
    "domain_local": [
        "localhost"
    ],
    "encryption": "open",
    "id": "",
    "message_segmentation": 1e6,
    "mutual_tls": false,
    "name": "test-server",
    "ports": {
        "open": 54321
    },
    "upgrade": false
}`
                },
                {
                    event: "keydown",
                    node: [
                        ["getElementById", "servers-web", null],
                        ["getElementsByClassName", "edit", 0],
                        ["getElementsByTagName", "textarea", 0]
                    ],
                    value: "shift"
                },
                {
                    event: "keyup",
                    node: [
                        ["getElementById", "servers-web", null],
                        ["getElementsByClassName", "edit", 0],
                        ["getElementsByTagName", "textarea", 0]
                    ],
                    value: "shift"
                },
                {
                    event: "click",
                    node: [
                        ["getElementById", "servers-web", null],
                        ["getElementsByClassName", "edit", 0],
                        ["getElementsByClassName", "server-add", 0]
                    ]
                },
                {
                    event: "wait",
                    node: [],
                    value: "200"
                }

            ],
            name: "Create new insecure server",
            type: "dom",
            unit: [
                {
                    node: [
                        ["getElementById", "servers-web", null],
                        ["getElementsByClassName", "edit", null]
                    ],
                    qualifier: "is",
                    target: ["length"],
                    type: "property",
                    value: 0
                },
                {
                    node: [
                        ["getElementById", "servers-web", null],
                        ["getElementsByClassName", "server-list", 0],
                        ["getElementsByTagName", "li", 0],
                        ["getElementsByTagName", "button", 0],
                        ["lastChild", null, null]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "test-server - online"
                },
                {
                    node: [
                        ["getElementById", "servers-web", null],
                        ["getElementsByClassName", "server-list", 0],
                        ["getElementsByTagName", "li", 1],
                        ["getElementsByTagName", "button", 0],
                        ["lastChild", null, null]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "dashboard - online"
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
            name: "Expand new open server accordion",
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
                        ["getElementsByTagName", "li", 0]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "Open - 54321 (TCP)"
                },
                {
                    node: [
                        ["getElementById", "servers-web", null],
                        ["getElementsByClassName", "server-list", 0],
                        ["getElementsByTagName", "li", 0],
                        ["getElementsByClassName", "active-ports", 0],
                        ["getElementsByTagName", "code", 0]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: ""
                },
                {
                    node: [
                        ["getElementById", "servers-web", null],
                        ["getElementsByClassName", "server-list", 0],
                        ["getElementsByTagName", "li", 0],
                        ["getElementsByClassName", "active-ports", 0],
                        ["getElementsByTagName", "code", 1]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: ""
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
                },
                {
                    node: [
                        ["getElementById", "servers-web", null],
                        ["getElementsByClassName", "server-list", 0],
                        ["getElementsByTagName", "li", 0],
                        ["getElementsByClassName", "edit-summary", 0],
                        ["getElementsByClassName", "pass-warn", null]
                    ],
                    qualifier: "is",
                    target: ["length"],
                    type: "property",
                    value: 0
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
            name: "Open server accordion and edit",
            type: "dom",
            unit: [
                {
                    node: [
                        ["getElementById", "servers-web", null],
                        ["getElementsByClassName", "server-list", 0],
                        ["getElementsByTagName", "li", 0],
                        ["getElementsByClassName", "edit", 0],
                        ["getElementsByClassName", "buttons", 0],
                        ["getElementsByTagName", "button", 0]
                    ],
                    qualifier: "is",
                    target: ["class"],
                    type: "attribute",
                    value: "server-deactivate"
                },
                {
                    node: [
                        ["getElementById", "servers-web", null],
                        ["getElementsByClassName", "server-list", 0],
                        ["getElementsByTagName", "li", 0],
                        ["getElementsByClassName", "edit", 0],
                        ["getElementsByClassName", "buttons", 0],
                        ["getElementsByTagName", "button", 0]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "። Deactivate"
                },
                {
                    node: [
                        ["getElementById", "servers-web", null],
                        ["getElementsByClassName", "server-list", 0],
                        ["getElementsByTagName", "li", 0],
                        ["getElementsByClassName", "edit", 0],
                        ["getElementsByClassName", "buttons", 0],
                        ["getElementsByTagName", "button", 1]
                    ],
                    qualifier: "is",
                    target: ["class"],
                    type: "attribute",
                    value: "server-activate"
                },
                {
                    node: [
                        ["getElementById", "servers-web", null],
                        ["getElementsByClassName", "server-list", 0],
                        ["getElementsByTagName", "li", 0],
                        ["getElementsByClassName", "edit", 0],
                        ["getElementsByClassName", "buttons", 0],
                        ["getElementsByTagName", "button", 1]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "⌁ Activate"
                },
                {
                    node: [
                        ["getElementById", "servers-web", null],
                        ["getElementsByClassName", "server-list", 0],
                        ["getElementsByTagName", "li", 0],
                        ["getElementsByClassName", "edit", 0],
                        ["getElementsByClassName", "buttons", 0],
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
                        ["getElementsByClassName", "edit", 0],
                        ["getElementsByClassName", "buttons", 1],
                        ["getElementsByTagName", "button", 0]
                    ],
                    qualifier: "is",
                    target: ["class"],
                    type: "attribute",
                    value: "server-destroy"
                },
                {
                    node: [
                        ["getElementById", "servers-web", null],
                        ["getElementsByClassName", "server-list", 0],
                        ["getElementsByTagName", "li", 0],
                        ["getElementsByClassName", "edit", 0],
                        ["getElementsByClassName", "buttons", 1],
                        ["getElementsByTagName", "button", 0]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "✘ Destroy"
                },
                {
                    node: [
                        ["getElementById", "servers-web", null],
                        ["getElementsByClassName", "server-list", 0],
                        ["getElementsByTagName", "li", 0],
                        ["getElementsByClassName", "edit", 0],
                        ["getElementsByClassName", "buttons", 1],
                        ["getElementsByTagName", "button", 1]
                    ],
                    qualifier: "is",
                    target: ["class"],
                    type: "attribute",
                    value: "server-modify"
                },
                {
                    node: [
                        ["getElementById", "servers-web", null],
                        ["getElementsByClassName", "server-list", 0],
                        ["getElementsByTagName", "li", 0],
                        ["getElementsByClassName", "edit", 0],
                        ["getElementsByClassName", "buttons", 1],
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
                        ["getElementsByClassName", "edit", 0],
                        ["getElementsByClassName", "buttons", 1],
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
                        ["getElementsByClassName", "edit", 0],
                        ["getElementsByClassName", "edit-summary", 0],
                        ["getElementsByClassName", "pass-false", 0]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "The server configuration is valid, but not modified."
                }
            ]
        },
        {
            delay: {
                node: [
                    ["getElementById", "servers-web", null],
                    ["getElementsByClassName", "server-list", 0],
                    ["getElementsByTagName", "li", 0],
                    ["getElementsByTagName", "button", 0],
                    ["lastChild", null, null]
                ],
                qualifier: "is",
                target: ["textContent"],
                type: "property",
                value: "dashboard - online"
            },
            interaction: [
                {
                    event: "click",
                    node: [
                        ["getElementById", "servers-web", null],
                        ["getElementsByClassName", "server-list", 0],
                        ["getElementsByTagName", "li", 0],
                        ["getElementsByClassName", "edit", 0],
                        ["getElementsByClassName", "buttons", 1],
                        ["getElementsByTagName", "button", 0]
                    ]
                }
            ],
            name: "Destroy new server",
            type: "dom",
            unit: [
                {
                    node: [
                        ["getElementById", "servers-web", null],
                        ["getElementsByClassName", "server-list", 0],
                        ["getElementsByTagName", "li", 1]
                    ],
                    qualifier: "is",
                    target: [],
                    type: "element",
                    value: undefined
                }
            ]
        }
    ];
    list.name = "Local browser tests - help";
    return list;
};

export default test_listLocalBrowserServersWeb;