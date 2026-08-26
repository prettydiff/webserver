

import dashboard from "../dashboard.ts";

const ui_test_websocket = function ui_test_websocket():void {
    const test_websocket:section_test_websocket = {
        connected: false,
        events: {
            encryption: function dashboard_sections_websocketTest_encryption(event:MouseEvent):void {
                const target:HTMLInputElement = (event === null)
                        ? (dashboard.sections["test-websocket"].nodes.encrypt_true.checked === true)
                            ? dashboard.sections["test-websocket"].nodes.encrypt_true
                            : dashboard.sections["test-websocket"].nodes.encrypt_false
                        : event.target as HTMLInputElement,
                    port_open:number = dashboard.global.payload.server[dashboard.global.payload.id.dashboard_server].ports.open,
                    port_secure:number = dashboard.global.payload.server[dashboard.global.payload.id.dashboard_server].ports.secure,
                    text:string = dashboard.sections["test-websocket"].nodes.handshake.value,
                    reg:RegExp = new RegExp(`(H|h)ost\\s*:\\s*${location.hostname}:(${port_open}|${port_secure})`);
                if (reg.test(text) === true) {
                    if (target === dashboard.sections["test-websocket"].nodes.encrypt_true) {
                        dashboard.sections["test-websocket"].nodes.handshake.value = text.replace(reg, `Host: ${location.hostname}:${port_secure}`);
                    } else {
                        dashboard.sections["test-websocket"].nodes.handshake.value = text.replace(reg, `Host: ${location.hostname}:${port_open}`);
                    }
                }
            },
            handshakeSend: function dashboard_sections_websocketTest_handshakeSend():void {
                const timeout:number = Number(dashboard.sections["test-websocket"].nodes.handshake_timeout.value),
                    payload:services_websocket_handshake = {
                        encryption: (dashboard.sections["test-websocket"].nodes.encrypt_true.checked === true),
                        message: (dashboard.sections["test-websocket"].connected === true)
                            ? ["disconnect"]
                            : dashboard.sections["test-websocket"].nodes.handshake.value.replace(/^\s+/, "").replace(/\s+$/, "").replace(/\r\n/g, "\n").split("\n"),
                        timeout: (isNaN(timeout) === true)
                            ? 0
                            : timeout
                    };
                dashboard.sections["test-websocket"].timeout = payload.timeout;
                dashboard.sections["test-websocket"].nodes.status.value = "";
                dashboard.message.send({data: payload, service: "services_websocket_handshake"});
                dashboard.utility.setState();
            },
            keyup_frame: function dashboard_sections_websocketTest_keyupFrame(event:Event):void {
                const encodeLength:TextEncoder = new TextEncoder(),
                    text:string = dashboard.sections["test-websocket"].nodes.message_send_body.value,
                    textLength:number = encodeLength.encode(text).length,
                    frame:websocket_frame = {
                        extended: 0,
                        fin: true,
                        len: 0,
                        mask: false,
                        maskKey: null,
                        opcode: 1,
                        rsv1: false,
                        rsv2: false,
                        rsv3: false,
                        size_buffer: 0,
                        size_fragment: 0,
                        startByte: 0
                    };
                let frame_try:websocket_frame = null;
                // eslint-disable-next-line no-restricted-syntax
                try {
                    frame_try = dashboard.sections["test-websocket"].tools.parse_frame();
                // eslint-disable-next-line no-empty
                } catch {}
                if (frame_try !== null) {
                    const opcode:number = (isNaN(frame_try.opcode) === true)
                        ? 1
                        : Math.floor(frame_try.opcode);
                    frame.fin = (frame_try.fin === false)
                        ? false
                        : true;
                    frame.mask = (frame_try.mask === true)
                        ? true
                        : false;
                    frame.opcode = (opcode > -1 && opcode < 16)
                        ? opcode
                        : 1;
                    frame.rsv1 = (frame_try.rsv1 === true)
                        ? true
                        : false;
                    frame.rsv2 = (frame_try.rsv2 === true)
                        ? true
                        : false;
                    frame.rsv3 = (frame_try.rsv3 === true)
                        ? true
                        : false;
                }
                if (textLength < 126) {
                    frame.extended = 0;
                    frame.len = textLength;
                    frame.startByte = 2;
                } else if (textLength < 65536) {
                    frame.extended = textLength;
                    frame.len = 126;
                    frame.startByte = 4;
                } else {
                    frame.extended = textLength;
                    frame.len = 127;
                    frame.startByte = 10;
                }
                if (frame.mask === true) {
                    frame.startByte = frame.startByte + 4;
                }
                if (frame.fin === false) {
                    dashboard.sections["test-websocket"].nodes.frame_validate.style.display = "block";
                    dashboard.sections["test-websocket"].nodes.frame_validate.getElementsByTagName("em")[0].textContent = "Warning: Frame fin flag is set to false.";
                } else if ((frame.opcode > 2 && frame.opcode < 8) || frame.opcode > 10) {
                    dashboard.sections["test-websocket"].nodes.frame_validate.style.display = "block";
                    dashboard.sections["test-websocket"].nodes.frame_validate.getElementsByTagName("em")[0].textContent = "Warning: Frame opcode value is a valid but non-standard value.";
                } else {
                    dashboard.sections["test-websocket"].nodes.frame_validate.style.display = "none";
                }
                dashboard.sections["test-websocket"].frameBeautify("send", JSON.stringify(frame));
                dashboard.utility.setState();
            },
            keyup_message: function dashboard_sections_websocketTest_keyupMessage(event:KeyboardEvent):void {
                dashboard.sections["test-websocket"].events.keyup_frame(event);
            },
            message_send: function dashboard_sections_websocketTest_messageSend():void {
                const payload:services_websocket_message = {
                    frame: dashboard.sections["test-websocket"].tools.parse_frame(),
                    message: dashboard.sections["test-websocket"].nodes.message_send_body.value
                };
                dashboard.message.send({data: payload, service: "services_websocket_message"});
                dashboard.sections["test-websocket"].events.keyup_frame(null);
            }
        },
        frameBeautify: function dashboard_sections_websocketTest_frameBeautify(target:"receive"|"send", valueItem?:string):void {
            const value:string = (valueItem === null || valueItem === undefined)
                ? dashboard.sections["test-websocket"].nodes[`message_${target}_frame`].value
                : valueItem;
            dashboard.sections["test-websocket"].nodes[`message_${target}_frame`].value = value
                .replace("{", "{\n    ")
                .replace(/,/g, ",\n    ")
                .replace(/,?\s*\}/, "\n}")
                .replace(/:/g, ": ");
        },
        init: function dashboard_sections_websocketTest_init():void {
            const form:HTMLElement = dashboard.sections["test-websocket"].nodes.encrypt_true.getAncestor("form", "class"),
                h4:HTMLElement = form.getElementsByTagName("h4")[0],
                scheme:HTMLElement = form.getElementsByTagName("p")[1],
                emOpen:HTMLElement = document.createElement("em"),
                emSecure:HTMLElement = document.createElement("em"),
                port_open:number = dashboard.global.payload.server[dashboard.global.payload.id.dashboard_server].ports.open,
                port_secure:number = dashboard.global.payload.server[dashboard.global.payload.id.dashboard_server].ports.secure;
            dashboard.sections["test-websocket"].tools.handshake();
            dashboard.sections["test-websocket"].nodes.button_handshake.onclick = dashboard.sections["test-websocket"].events.handshakeSend;
            dashboard.sections["test-websocket"].nodes.button_send.onclick = dashboard.sections["test-websocket"].events.message_send;
            dashboard.sections["test-websocket"].nodes.encrypt_false.onclick = dashboard.sections["test-websocket"].events.encryption;
            dashboard.sections["test-websocket"].nodes.encrypt_true.onclick = dashboard.sections["test-websocket"].events.encryption;
            dashboard.sections["test-websocket"].nodes.message_send_body.onkeyup = dashboard.sections["test-websocket"].events.keyup_message;
            dashboard.sections["test-websocket"].nodes.message_send_frame.onblur = dashboard.sections["test-websocket"].events.keyup_frame;
            dashboard.sections["test-websocket"].nodes.handshake_label.textContent = "";
            // server socket status messaging
            if (isNaN(port_open) === true) {
                dashboard.sections["test-websocket"].nodes.encrypt_true.checked = true;
                h4.style.display = "none";
                scheme.style.display = "none";
                emSecure.textContent = String(port_secure);
                dashboard.sections["test-websocket"].nodes.handshake_label.appendText("secure - ");
                dashboard.sections["test-websocket"].nodes.handshake_label.appendChild(emSecure);
            } else if (isNaN(port_secure) === true) {
                dashboard.sections["test-websocket"].nodes.encrypt_false.checked = true;
                h4.style.display = "none";
                scheme.style.display = "none";
                emOpen.textContent = String(port_open);
                dashboard.sections["test-websocket"].nodes.handshake_label.appendText("open - ");
                dashboard.sections["test-websocket"].nodes.handshake_label.appendChild(emOpen);
            } else {
                emOpen.textContent = String(port_open);
                emSecure.textContent = String(port_secure);
                dashboard.sections["test-websocket"].nodes.handshake_label.appendText("open - ");
                dashboard.sections["test-websocket"].nodes.handshake_label.appendChild(emOpen);
                dashboard.sections["test-websocket"].nodes.handshake_label.appendText(", secure - ");
                dashboard.sections["test-websocket"].nodes.handshake_label.appendChild(emSecure);
            }
            dashboard.sections["test-websocket"].nodes.encrypt_false.onclick = dashboard.sections["test-websocket"].events.encryption;
            dashboard.sections["test-websocket"].nodes.encrypt_true.onclick = dashboard.sections["test-websocket"].events.encryption;
            dashboard.sections["test-websocket"].events.encryption(null);
            if (dashboard.global.state.test_websocket === null || dashboard.global.state.test_websocket === undefined) {
                dashboard.global.state.test_websocket = {
                    request_timeout: "0",
                    send_frame: "",
                    send_message: ""
                };
            } else {
                dashboard.sections["test-websocket"].nodes.handshake_timeout.value = dashboard.global.state.test_websocket.request_timeout;
                if (dashboard.global.state.test_websocket.send_frame === "" || location.href.includes("test_browser") === true) {
                    dashboard.sections["test-websocket"].nodes.message_send_frame.value = `{
    "extended": 0,
    "fin": false,
    "len": 0,
    "mask": false,
    "maskKey": "",
    "opcode": 1,
    "rsv1": false,
    "rsv2": false,
    "rsv3": false,
    "startByte": 0,
}`;
                    dashboard.sections["test-websocket"].nodes.frame_validate.style.display = "block";
                } else {
                    dashboard.sections["test-websocket"].nodes.message_send_frame.value = dashboard.global.state.test_websocket.send_frame;
                    if ((/frame\s*:\s*false/).test(dashboard.sections["test-websocket"].nodes.message_send_frame.value) === true) {
                        dashboard.sections["test-websocket"].nodes.frame_validate.style.display = "block";
                    }
                }
                dashboard.sections["test-websocket"].nodes.message_send_body.value = dashboard.global.state.test_websocket.send_message;
            }
        },
        nodes: {
            button_handshake: document.getElementById("test-websocket").getElementsByClassName("form")[0].getElementsByTagName("button")[0] as HTMLButtonElement,
            button_send: document.getElementById("test-websocket").getElementsByClassName("form")[2].getElementsByTagName("button")[0] as HTMLButtonElement,
            encrypt_false: document.getElementById("test-websocket").getElementsByClassName("form")[0].getElementsByTagName("input")[0] as HTMLInputElement,
            encrypt_true: document.getElementById("test-websocket").getElementsByClassName("form")[0].getElementsByTagName("input")[1] as HTMLInputElement,
            frame_validate: document.getElementById("test-websocket").getElementsByClassName("form")[1].getElementsByClassName("form")[0].getElementsByTagName("p")[3],
            halt_receive: document.getElementById("test-websocket").getElementsByClassName("form")[3].getElementsByTagName("input")[0] as HTMLInputElement,
            handshake: document.getElementById("test-websocket").getElementsByClassName("form")[0].getElementsByTagName("textarea")[0] as HTMLTextAreaElement,
            handshake_label: document.getElementById("test-websocket").getElementsByClassName("form")[0].getElementsByClassName("ports")[0].getElementsByTagName("span")[0],
            handshake_status: document.getElementById("test-websocket").getElementsByClassName("form")[0].getElementsByTagName("textarea")[1] as HTMLTextAreaElement,
            handshake_timeout: document.getElementById("test-websocket").getElementsByClassName("form")[0].getElementsByTagName("input")[2] as HTMLInputElement,
            message_receive_body: document.getElementById("test-websocket").getElementsByClassName("form")[3].getElementsByTagName("textarea")[1] as HTMLTextAreaElement,
            message_receive_frame: document.getElementById("test-websocket").getElementsByClassName("form")[3].getElementsByTagName("textarea")[0] as HTMLTextAreaElement,
            message_send_body: document.getElementById("test-websocket").getElementsByClassName("form")[2].getElementsByTagName("textarea")[1] as HTMLTextAreaElement,
            message_send_frame: document.getElementById("test-websocket").getElementsByClassName("form")[2].getElementsByTagName("textarea")[0] as HTMLTextAreaElement,
            status: document.getElementById("websocket-status") as HTMLTextAreaElement
        },
        receive: null,
        timeout: 0,
        tools: {
            handshake: function dashboard_sections_WebsocketTest_handshake():void {
                const handshakeString:string[] = [],
                    key:string = window.btoa((Math.random().toString() + Math.random().toString()).slice(2, 18));
                handshakeString.push("GET / HTTP/1.1");
                handshakeString.push(`Host: ${location.host}`);
                handshakeString.push("Upgrade: websocket");
                handshakeString.push("Connection: Upgrade");
                handshakeString.push(`Sec-WebSocket-Key: ${key}`);
                handshakeString.push(`Origin: ${location.origin}`);
                handshakeString.push("Sec-WebSocket-Protocol: test-websocket");
                handshakeString.push("Sec-WebSocket-Version: 13");
                dashboard.sections["test-websocket"].nodes.handshake.value = handshakeString.join("\n");
            },
            parse_frame: function dashboard_sections_websocketTest_parseFrame():websocket_frame {
                return JSON.parse(dashboard.sections["test-websocket"].nodes.message_send_frame.value
                    .replace(/",\s+/g, "\",")
                    .replace(/\{\s+/, "{")
                    .replace(/,\s+\}/, "}"));
            }
        },
        transmit: {
            message_receive: function dashboard_sections_websocketTest_messageReceive(data_item:socket_data):void {
                if ((dashboard.sections["test-websocket"].nodes.halt_receive.checked === true && dashboard.sections["test-websocket"].nodes.message_receive_frame.value !== "") || dashboard.sections["test-websocket"].nodes.halt_receive.checked === false) {
                    const data:services_websocket_message = data_item.data as services_websocket_message;
                    dashboard.sections["test-websocket"].nodes.message_receive_body.value = data.message;
                    dashboard.sections["test-websocket"].frameBeautify("receive", JSON.stringify(data.frame));
                }
            },
            status: function dashboard_sections_websocketTest_status(data_item:socket_data):void {
                const data:services_websocket_status = data_item.data as services_websocket_status;
                if (data.connected === true) {
                    const encryption:string = (data.encrypted === true)
                        ? "Encrypted"
                        : "Insecure";
                    dashboard.sections["test-websocket"].nodes.button_handshake.textContent = "Disconnect";
                    dashboard.sections["test-websocket"].nodes.status.setAttribute("class", "connection-online");
                    dashboard.sections["test-websocket"].nodes.status.lastChild.textContent = `Online (${encryption})`;
                    dashboard.sections["test-websocket"].connected = true;
                    dashboard.sections["test-websocket"].nodes.message_receive_body.value = "";
                    dashboard.sections["test-websocket"].nodes.message_receive_frame.value = "";
                    dashboard.sections["test-websocket"].nodes.button_send.disabled = false;
                } else {
                    dashboard.sections["test-websocket"].nodes.button_handshake.textContent = "Connect";
                    dashboard.sections["test-websocket"].nodes.status.setAttribute("class", "connection-offline");
                    dashboard.sections["test-websocket"].nodes.status.lastChild.textContent = "Offline";
                    dashboard.sections["test-websocket"].connected = false;
                    dashboard.sections["test-websocket"].nodes.button_send.disabled = true;
                }
                if (data.error === null) {
                    if (data.connected === true) {
                        dashboard.sections["test-websocket"].nodes.handshake_status.value = "Connected.";
                    } else {
                        dashboard.sections["test-websocket"].nodes.handshake_status.value = "Disconnected.";
                    }
                } else if (typeof data.error === "string") {
                    dashboard.sections["test-websocket"].nodes.handshake_status.value = data.error;
                } else {
                    let error:string = JSON.stringify(data.error);
                    if (data.error.code === "ETIMEDOUT") {
                        dashboard.sections["test-websocket"].nodes.handshake_status.value = `WebSocket handshake exceeded the specified timeout of ${dashboard.sections["test-websocket"].timeout} milliseconds.`;
                    } else {
                        if (typeof data.error !== "string" && data.error.code === "ECONNRESET") {
                            error = `The server dropped the connection. Ensure the encryption options matches whether the server's port accepts encrypted traffic.\n\n${error}`;
                        }
                        dashboard.sections["test-websocket"].nodes.handshake_status.value = error;
                    }
                }
            }
        }
    };
    dashboard.sections["test-websocket"] = test_websocket;
};

export default ui_test_websocket;