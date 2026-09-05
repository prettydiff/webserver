

const test_listLocalBrowserNotes = function test_listLocalBrowserNotes():test_list {
    const list:test_list = [
        {
            delay: {
                node: [
                    ["getElementById", "notes", null],
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
                        ["getElementsByTagName", "button", 4]
                    ]
                }
            ],
            name: "Navigate to notes",
            type: "dom",
            unit: []
        },
        {
            delay: {
                node: [
                    ["getElementById", "notes", null],
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
                        ["getElementById", "notes", null],
                        ["getElementsByTagName", "textarea", 0]
                    ]
                },
                {
                    event: "setValue",
                    node: [
                        ["getElementById", "notes", null],
                        ["getElementsByTagName", "textarea", 0]
                    ],
                    value: "testing section notes from test automation"
                },
                {
                    event: "blur",
                    node: [
                        ["getElementById", "notes", null],
                        ["getElementsByTagName", "textarea", 0]
                    ]
                },
                {
                    event: "refresh",
                    node: []
                },
                {
                    event: "wait",
                    node: [],
                    value: "1000"
                }
            ],
            name: "Refresh page and check notes value",
            type: "dom",
            unit: [
                {
                    node: [
                        ["getElementById", "notes", null],
                        ["getElementsByTagName", "textarea", 0]
                    ],
                    qualifier: "is",
                    target: ["value"],
                    type: "property",
                    value: "testing section notes from test automation"
                }
            ]
        }
    ];
    list.name = "Local browser tests - notes";
    return list;
};
export default test_listLocalBrowserNotes;