
// cspell: words bootable

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
                        ["getElementsByTagName", "li", 1],
                        ["getElementsByTagName", "strong", 0]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "Guid"
                },
                {
                    node: [
                        ["getElementById", "disks", null],
                        ["getElementsByClassName", "section", 0],
                        ["getElementsByClassName", "section", 0],
                        ["getElementsByTagName", "li", 2],
                        ["getElementsByTagName", "strong", 0]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "Name"
                },
                {
                    node: [
                        ["getElementById", "disks", null],
                        ["getElementsByClassName", "section", 0],
                        ["getElementsByClassName", "section", 0],
                        ["getElementsByTagName", "li", 3],
                        ["getElementsByTagName", "strong", 0]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "Serial"
                },
                {
                    node: [
                        ["getElementById", "disks", null],
                        ["getElementsByClassName", "section", 0],
                        ["getElementsByClassName", "section", 0],
                        ["getElementsByTagName", "li", 4],
                        ["getElementsByTagName", "strong", 0]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "Size Disk"
                },
                {
                    node: [
                        ["getElementById", "disks", null],
                        ["getElementsByClassName", "section", 0],
                        ["getElementsByClassName", "section", 0],
                        ["getElementsByTagName", "h4", 0]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "Partitions"
                },
                {
                    node: [
                        ["getElementById", "disks", null],
                        ["getElementsByClassName", "section", 0],
                        ["getElementsByClassName", "section", 0],
                        ["getElementsByClassName", "os-interface", 0],
                        ["getElementsByTagName", "strong", 0]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "Active"
                },
                {
                    node: [
                        ["getElementById", "disks", null],
                        ["getElementsByClassName", "section", 0],
                        ["getElementsByClassName", "section", 0],
                        ["getElementsByClassName", "os-interface", 0],
                        ["getElementsByTagName", "strong", 1]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "Bootable"
                },
                {
                    node: [
                        ["getElementById", "disks", null],
                        ["getElementsByClassName", "section", 0],
                        ["getElementsByClassName", "section", 0],
                        ["getElementsByClassName", "os-interface", 0],
                        ["getElementsByTagName", "strong", 2]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "File System"
                },
                {
                    node: [
                        ["getElementById", "disks", null],
                        ["getElementsByClassName", "section", 0],
                        ["getElementsByClassName", "section", 0],
                        ["getElementsByClassName", "os-interface", 0],
                        ["getElementsByTagName", "strong", 3]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "Hidden"
                },
                {
                    node: [
                        ["getElementById", "disks", null],
                        ["getElementsByClassName", "section", 0],
                        ["getElementsByClassName", "section", 0],
                        ["getElementsByClassName", "os-interface", 0],
                        ["getElementsByTagName", "strong", 4]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "Id"
                },
                {
                    node: [
                        ["getElementById", "disks", null],
                        ["getElementsByClassName", "section", 0],
                        ["getElementsByClassName", "section", 0],
                        ["getElementsByClassName", "os-interface", 0],
                        ["getElementsByTagName", "strong", 5]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "Path"
                },
                {
                    node: [
                        ["getElementById", "disks", null],
                        ["getElementsByClassName", "section", 0],
                        ["getElementsByClassName", "section", 0],
                        ["getElementsByClassName", "os-interface", 0],
                        ["getElementsByTagName", "strong", 6]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "Read Only"
                },
                {
                    node: [
                        ["getElementById", "disks", null],
                        ["getElementsByClassName", "section", 0],
                        ["getElementsByClassName", "section", 0],
                        ["getElementsByClassName", "os-interface", 0],
                        ["getElementsByTagName", "strong", 7]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "Size Free"
                },
                {
                    node: [
                        ["getElementById", "disks", null],
                        ["getElementsByClassName", "section", 0],
                        ["getElementsByClassName", "section", 0],
                        ["getElementsByClassName", "os-interface", 0],
                        ["getElementsByTagName", "strong", 8]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "Size Used"
                },
                {
                    node: [
                        ["getElementById", "disks", null],
                        ["getElementsByClassName", "section", 0],
                        ["getElementsByClassName", "section", 0],
                        ["getElementsByClassName", "os-interface", 0],
                        ["getElementsByTagName", "strong", 9]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "Size Total"
                },
                {
                    node: [
                        ["getElementById", "disks", null],
                        ["getElementsByClassName", "section", 0],
                        ["getElementsByClassName", "section", 0],
                        ["getElementsByClassName", "os-interface", 0],
                        ["getElementsByTagName", "strong", 10]
                    ],
                    qualifier: "is",
                    target: ["textContent"],
                    type: "property",
                    value: "Type"
                }
            ]
        }
    ];
    list.name = "Local browser tests - disks";
    return list;
};

export default test_listLocalBrowserDisks;