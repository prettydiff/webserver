
import vars from "../core/vars.ts";

const test_listLocalBrowserHash = function test_listLocalBrowserHash():test_list {
    const list:test_list= [
        {
            delay: {
                node: [
                    ["getElementById", "hash", null],
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
                        ["getElementsByTagName", "button", 3]
                    ]
                }
            ],
            name: "Navigate to hash / base64",
            type: "dom",
            unit: []
        },
        {
            delay: {
                node: [
                    ["getElementById", "hash", null],
                    ["getElementsByClassName", "form", 1],
                    ["getElementsByTagName", "textarea", 0]
                ],
                qualifier: "is",
                target: ["value"],
                type: "property",
                value: "cdc5194d384287cb6cf19cd9a0d6df33e844e37b1416f701bd597c791a179199eab851716900f6ebd41b788fd7210db14ef90bf54cf0be78a924de0ca0aa3e70"
            },
            interaction: [
                {
                    event: "setValue",
                    node: [
                        ["getElementById", "hash", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "textarea", 0]
                    ],
                    value: "hello test automation!"
                },
                {
                    event: "click",
                    node: [
                        ["getElementById", "hash", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "button", 0]
                    ]
                }
            ],
            name: "Execute hash with defaults",
            type: "dom",
            unit: []
        },
        {
            delay: {
                node: [
                    ["getElementById", "hash", null],
                    ["getElementsByClassName", "form", 1],
                    ["getElementsByTagName", "textarea", 0]
                ],
                qualifier: "is",
                target: ["value"],
                type: "property",
                value: "zcUZTThCh8ts8ZzZoNbfM+hE43sUFvcBvVl8eRoXkZnquFFxaQD269QbeI/XIQ2xTvkL9UzwvnipJN4MoKo+cA=="
            },
            interaction: [
                {
                    event: "click",
                    node: [
                        ["getElementById", "hash", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 5]
                    ]
                },
                {
                    event: "click",
                    node: [
                        ["getElementById", "hash", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "button", 0]
                    ]
                }
            ],
            name: "Execute hash with base64 digest",
            type: "dom",
            unit: []
        },
        {
            delay: {
                node: [
                    ["getElementById", "hash", null],
                    ["getElementsByClassName", "form", 1],
                    ["getElementsByTagName", "textarea", 0]
                ],
                qualifier: "is",
                target: ["value"],
                type: "property",
                value: "aGVsbG8gdGVzdCBhdXRvbWF0aW9uIQ=="
            },
            interaction: [
                {
                    event: "click",
                    node: [
                        ["getElementById", "hash", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 1]
                    ]
                },
                {
                    event: "click",
                    node: [
                        ["getElementById", "hash", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "button", 0]
                    ]
                }
            ],
            name: "Encode as base64",
            type: "dom",
            unit: [
                {
                    node: [
                        ["getElementById", "hash", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 4]
                    ],
                    qualifier: "is",
                    target: ["disabled"],
                    type: "property",
                    value: true
                },
                {
                    node: [
                        ["getElementById", "hash", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 5]
                    ],
                    qualifier: "is",
                    target: ["disabled"],
                    type: "property",
                    value: true
                }
            ]
        },
        {
            delay: {
                node: [
                    ["getElementById", "hash", null],
                    ["getElementsByClassName", "form", 1],
                    ["getElementsByTagName", "textarea", 0]
                ],
                qualifier: "is",
                target: ["value"],
                type: "property",
                value: "CmltcG9ydCBsb2cgZnJvbSAiLi9jb3JlL2xvZy50cyI7CmltcG9ydCBub2RlIGZyb20gIi4vY29yZS9ub2RlLnRzIjsKaW1wb3J0IHNjcmVlbnNob3RzIGZyb20gIi4vdXRpbGl0aWVzL3NjcmVlbnNob3RzLnRzIjsKaW1wb3J0IHN0YXJ0X2FwcGxpY2F0aW9uIGZyb20gIi4vdXRpbGl0aWVzL3N0YXJ0X2FwcGxpY2F0aW9uLnRzIjsKaW1wb3J0IHZhcnMgZnJvbSAiLi9jb3JlL3ZhcnMudHMiOwoKdmFycy5wYXRoLnNlcCA9IG5vZGUucGF0aC5zZXA7Cgp7CiAgICBsZXQgcHJvY2Vzc19wYXRoOnN0cmluZyA9ICIiLAogICAgICAgIGluZGV4Om51bWJlciA9IHByb2Nlc3MuYXJndi5sZW5ndGgsCiAgICAgICAgY29sb25JbmRleDpudW1iZXIgPSBudWxsLAogICAgICAgIGFyZzpzdHJpbmcgPSBudWxsLAogICAgICAgIHZhbHVlOnN0cmluZyA9IG51bGwsCiAgICAgICAgbnVtYjpudW1iZXIgPSBudWxsOwogICAgaWYgKHZhcnMuY29tbWFuZHMgPT09IHVuZGVmaW5lZCkgewogICAgICAgIGxvZy5zaGVsbChbYE9wZXJhdGluZyBzeXN0ZW0gdHlwZSAke3Byb2Nlc3MucGxhdGZvcm19IGlzIG5vdCB5ZXQgc3VwcG9ydGVkLmBdKTsKICAgICAgICBwcm9jZXNzLmV4aXQoMSk7CiAgICB9CiAgICBkbyB7CiAgICAgICAgaW5kZXggPSBpbmRleCAtIDE7CiAgICAgICAgaWYgKHByb2Nlc3MuYXJndltpbmRleF0uaW5jbHVkZXMoYCR7dmFycy5wYXRoLnNlcH1ub2RlYCkgPT09IHRydWUgJiYgdmFycy5wYXRoLm5vZGUgPT09ICIiKSB7CiAgICAgICAgICAgIHZhcnMucGF0aC5ub2RlID0gcHJvY2Vzcy5hcmd2W2luZGV4XTsKICAgICAgICB9IGVsc2UgaWYgKHByb2Nlc3MuYXJndltpbmRleF0uaW5jbHVkZXMoYCR7dmFycy5wYXRoLnNlcH1saWIke3ZhcnMucGF0aC5zZXB9aW5kZXgudHNgKSA9PT0gdHJ1ZSAmJiB2YXJzLnBhdGgucHJvamVjdCA9PT0gIiIpIHsKICAgICAgICAgICAgcHJvY2Vzc19wYXRoID0gcHJvY2Vzcy5hcmd2W2luZGV4XS5yZXBsYWNlKGBsaWIke3ZhcnMucGF0aC5zZXB9aW5kZXgudHNgLCAiIik7CiAgICAgICAgfSBlbHNlIHsKICAgICAgICAgICAgY29sb25JbmRleCA9IHByb2Nlc3MuYXJndltpbmRleF0uaW5kZXhPZigiOiIpOwogICAgICAgICAgICBhcmcgPSAoY29sb25JbmRleCA+IDApCiAgICAgICAgICAgICAgICA/IHByb2Nlc3MuYXJndltpbmRleF0uc2xpY2UoMCwgY29sb25JbmRleCkudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9eLS0vLCAiIikKICAgICAgICAgICAgICAgIDogcHJvY2Vzcy5hcmd2W2luZGV4XS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL14tLS8sICIiKTsKICAgICAgICAgICAgaWYgKHZhcnMub3B0aW9uc1thcmcgYXMgInRlc3QiXSAhPT0gdW5kZWZpbmVkIHx8IHZhcnMub3B0aW9uc1thcmcuc2xpY2UoMCwgYXJnLmluZGV4T2YoIjoiKSkgYXMgInRlc3QiXSAhPT0gdW5kZWZpbmVkKSB7CiAgICAgICAgICAgICAgICB2YWx1ZSA9IChjb2xvbkluZGV4ID4gMCkKICAgICAgICAgICAgICAgICAgICA/IHByb2Nlc3MuYXJndltpbmRleF0uc2xpY2UoY29sb25JbmRleCArIDEpCiAgICAgICAgICAgICAgICAgICAgOiBudWxsOwogICAgICAgICAgICAgICAgbnVtYiA9IE51bWJlcih2YWx1ZSk7CiAgICAgICAgICAgICAgICBpZiAoYXJnLmluZGV4T2YoImJyb3dzZXIiKSA9PT0gMCkgewogICAgICAgICAgICAgICAgICAgIHZhcnMub3B0aW9uc1siYnJvd3NlciJdID0gdmFsdWU7CiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGFyZy5pbmRleE9mKCJkZWxheS1pbnRlcnZhbHMiKSA9PT0gMCAmJiBpc05hTihudW1iKSA9PT0gZmFsc2UpIHsKICAgICAgICAgICAgICAgICAgICB2YXJzLm9wdGlvbnNbImRlbGF5LWludGVydmFscyJdID0gTWF0aC5mbG9vcihudW1iKTsKICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYXJnLmluZGV4T2YoImRlbGF5LXRpbWUiKSA9PT0gMCAmJiBpc05hTihudW1iKSA9PT0gZmFsc2UpIHsKICAgICAgICAgICAgICAgICAgICB2YXJzLm9wdGlvbnNbImRlbGF5LXRpbWUiXSA9IE1hdGguZmxvb3IobnVtYik7CiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGFyZy5pbmRleE9mKCJsaXN0IikgPT09IDApIHsKICAgICAgICAgICAgICAgICAgICB2YXJzLm9wdGlvbnNbImxpc3QiXSA9IHZhbHVlOwogICAgICAgICAgICAgICAgfSBlbHNlIGlmIChhcmcuaW5kZXhPZigicG9ydC1vcGVuIikgPT09IDAgJiYgaXNOYU4obnVtYikgPT09IGZhbHNlICYmIG51bWIgPiAwICYmIG51bWIgPCA2NTUzNikgewogICAgICAgICAgICAgICAgICAgIHZhcnMub3B0aW9uc1sicG9ydC1vcGVuIl0gPSBNYXRoLmZsb29yKG51bWIpOwogICAgICAgICAgICAgICAgfSBlbHNlIGlmIChhcmcuaW5kZXhPZigicG9ydC1zZWN1cmUiKSA9PT0gMCAmJiBpc05hTihudW1iKSA9PT0gZmFsc2UgJiYgbnVtYiA+IDAgJiYgbnVtYiA8IDY1NTM2KSB7CiAgICAgICAgICAgICAgICAgICAgdmFycy5vcHRpb25zWyJwb3J0LXNlY3VyZSJdID0gTWF0aC5mbG9vcihudW1iKTsKICAgICAgICAgICAgICAgIH0gZWxzZSB7CiAgICAgICAgICAgICAgICAgICAgdmFycy5vcHRpb25zW2FyZyBhcyAidGVzdCJdID0gdHJ1ZTsKICAgICAgICAgICAgICAgICAgICB2YXJzLnRlc3QudGVzdGluZyA9IHRydWU7CiAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgIH0KICAgICAgICB9CiAgICB9IHdoaWxlIChpbmRleCA+IDApOwoKICAgIHZhcnMucGF0aC5wcm9qZWN0ID0gKHZhcnMudGVzdC50ZXN0aW5nID09PSB0cnVlKQogICAgICAgID8gYCR7cHJvY2Vzc19wYXRofXRlc3Qke3ZhcnMucGF0aC5zZXB9YAogICAgICAgIDogcHJvY2Vzc19wYXRoOwogICAgdmFycy5wYXRoLmNvbXBvc2VfZW1wdHkgPSBgJHtwcm9jZXNzX3BhdGh9Y29tcG9zZSR7dmFycy5wYXRoLnNlcH1lbXB0eS55bWxgOwogICAgdmFycy5wYXRoLmNvbXBvc2UgPSBgJHt2YXJzLnBhdGgucHJvamVjdH1jb21wb3NlJHt2YXJzLnBhdGguc2VwfWA7CiAgICB2YXJzLnBhdGguc2VydmVycyA9IGAke3ZhcnMucGF0aC5wcm9qZWN0fXNlcnZlcnMke3ZhcnMucGF0aC5zZXB9YDsKICAgIHZhcnMuY29tbWFuZHMuY29tcG9zZV9lbXB0eSA9IGAke3ZhcnMuY29tbWFuZHMuY29tcG9zZX0gLWYgJHt2YXJzLnBhdGguY29tcG9zZV9lbXB0eX1gOwoKICAgIGlmICh2YXJzLm9wdGlvbnNbIm5vLWNvbG9yIl0gPT09IHRydWUpIHsKICAgICAgICBjb25zdCBrZXlzOnN0cmluZ1tdID0gT2JqZWN0LmtleXModmFycy50ZXh0KTsKICAgICAgICBpbmRleCA9IGtleXMubGVuZ3RoOwogICAgICAgIGRvIHsKICAgICAgICAgICAgaW5kZXggPSBpbmRleCAtIDE7CiAgICAgICAgICAgIHZhcnMudGV4dFtrZXlzW2luZGV4XV0gPSAiIjsKICAgICAgICB9IHdoaWxlIChpbmRleCA+IDApOwogICAgfQogICAgaWYgKHByb2Nlc3MuYXJndi5pbmNsdWRlcygic2NyZWVuc2hvdCIpID09PSB0cnVlIHx8IHByb2Nlc3MuYXJndi5pbmNsdWRlcygic2NyZWVuc2hvdHMiKSA9PT0gdHJ1ZSkgewogICAgICAgIHNjcmVlbnNob3RzKCk7CiAgICB9IGVsc2UgewogICAgICAgIHN0YXJ0X2FwcGxpY2F0aW9uKHByb2Nlc3NfcGF0aCk7CiAgICB9Cn0="
            },
            interaction: [
                {
                    event: "setValue",
                    node: [
                        ["getElementById", "hash", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "textarea", 0]
                    ],
                    value: `${vars.path.project.replace("test", "")}lib${vars.path.sep}index.ts`
                },
                {
                    event: "click",
                    node: [
                        ["getElementById", "hash", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 3]
                    ]
                },
                {
                    event: "click",
                    node: [
                        ["getElementById", "hash", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "button", 0]
                    ]
                }
            ],
            name: "base64 of a file",
            type: "dom",
            unit: [
                {
                    node: [
                        ["getElementById", "hash", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 4]
                    ],
                    qualifier: "is",
                    target: ["disabled"],
                    type: "property",
                    value: true
                },
                {
                    node: [
                        ["getElementById", "hash", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 5]
                    ],
                    qualifier: "is",
                    target: ["disabled"],
                    type: "property",
                    value: true
                }
            ]
        },
        {
            delay: {
                node: [
                    ["getElementById", "hash", null],
                    ["getElementsByClassName", "form", 1],
                    ["getElementsByTagName", "textarea", 0]
                ],
                qualifier: "is",
                target: ["value"],
                type: "property",
                value: "TxowpvoVVpq5LBPKQtZUdLEaVQfsY01TDVHpvLcMKFqtHAstsabHeLwLGlv1aH4XvPOAq9wf23AWWXr+k7vyDA=="
            },
            interaction: [
                {
                    event: "click",
                    node: [
                        ["getElementById", "hash", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 0]
                    ]
                },
                {
                    event: "click",
                    node: [
                        ["getElementById", "hash", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "button", 0]
                    ]
                }
            ],
            name: "hash a file to base64 digest",
            type: "dom",
            unit: [
                {
                    node: [
                        ["getElementById", "hash", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 4]
                    ],
                    qualifier: "is",
                    target: ["disabled"],
                    type: "property",
                    value: false
                },
                {
                    node: [
                        ["getElementById", "hash", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 5]
                    ],
                    qualifier: "is",
                    target: ["disabled"],
                    type: "property",
                    value: false
                }
            ]
        },
        {
            delay: {
                node: [
                    ["getElementById", "hash", null],
                    ["getElementsByClassName", "form", 1],
                    ["getElementsByTagName", "textarea", 0]
                ],
                qualifier: "is",
                target: ["value"],
                type: "property",
                value: "b8f63bfae744cdbb9384e3206a2f14459d8b2dc759f4665be9f4a79f4ea113473bb87de7"
            },
            interaction: [
                {
                    event: "click",
                    node: [
                        ["getElementById", "hash", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "input", 4]
                    ]
                },
                {
                    event: "setValue",
                    node: [
                        ["getElementById", "hash", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "select", 0]
                    ],
                    value: "md5-sha1"
                },
                {
                    event: "click",
                    node: [
                        ["getElementById", "hash", null],
                        ["getElementsByClassName", "form", 0],
                        ["getElementsByTagName", "button", 0]
                    ]
                }
            ],
            name: "hash a file to hex digest with md5-sha1",
            type: "dom",
            unit: []
        }
    ];
    list.name = "Local browser tests - hash";
    return list;
};

export default test_listLocalBrowserHash;