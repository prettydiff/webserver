

const test_listLocalBrowserDisks = function test_listLocalBrowserDisks():test_list {
    const list:test_list = [
        {
            delay: {
                node: [
                    ["getElementById", "disks", null],
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
                        ["getElementsByTagName", "button", 2]
                    ]
                }
            ],
            name: "Navigate to disks",
            type: "dom",
            unit: []
        },
        {
            delay: null,
            interaction: [],
            name: "Check if disks list is populated",
            type: "dom",
            unit: [
                {
                    node: [
                        ["getElementById", "disks", null],
                        ["getElementsByClassName", "section", 0],
                        ["getElementsByClassName", "section", 0],
                        ["getElementsByTagName", "h3", 0]
                    ],
                    qualifier: "greater",
                    target: ["offsetTop"],
                    type: "property",
                    value: 10
                },
                {
                    node: [
                        ["getElementById", "disks", null],
                        ["getElementsByClassName", "section", 0],
                        ["getElementsByClassName", "section", 0],
                        ["getElementsByTagName", "li", 0],
                        ["getElementsByTagName", "strong", 0]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "Bus"
                },
                {
                    node: [
                        ["getElementById", "disks", null],
                        ["getElementsByClassName", "section", 0],
                        ["getElementsByClassName", "section", 0],
                        ["getElementsByTagName", "h6", 0]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "Partitions"
                }
            ]
        }
    ];
    list.name = "Local browser tests - disks";
    return list;
};

export default test_listLocalBrowserDisks;