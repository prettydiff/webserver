
import dashboard from "../dashboard.ts";

const ui_test_performance = function ui_test_performance():void {
    const test_performance:section_test_performance = {
        events: {
            submit: function dashboard_sections_testPerformance_submit():void {
                    const numeric = function dashboard_sections_testPerformance_numeric(value:number, baseline:number, port:boolean):number {
                        if (isNaN(value) === true || (port === true && (value < 1 || value > 65535))) {
                            value = baseline;
                        } else {
                            value = Math.floor(value);
                        }
                        return value;
                    },
                    service:services_test_performance_input = {
                        body: dashboard.sections["test-performance"].nodes.body.value,
                        encryption: (dashboard.sections["test-performance"].nodes.encrypt_true.checked === true),
                        frame_body_size: Number(dashboard.sections["test-performance"].nodes.frame_body_size.value),
                        garbage_collection: (dashboard.sections["test-performance"].nodes.garbage_collection_true.checked === true),
                        location: dashboard.sections["test-performance"].nodes.connect_address.value,
                        measure: (dashboard.sections["test-performance"].nodes.measure_send.checked === true)
                            ? "send"
                            : "roundtrip",
                        port: Number(dashboard.sections["test-performance"].nodes.connect_port.value),
                        quantity_tests: Number(dashboard.sections["test-performance"].nodes.quantity_tests.value),
                        quantity_transmit: Number(dashboard.sections["test-performance"].nodes.quantity_transmit.value),
                        type: (dashboard.sections["test-performance"].nodes.type_http.checked === true)
                            ? "http"
                            : "websocket"
                    };
                service.frame_body_size = numeric(service.frame_body_size, 1000000, false);
                service.port = numeric(service.port, (service.encryption === true) ? 443 : 80, true);
                service.quantity_tests = numeric(service.quantity_tests, 10, false);
                service.quantity_transmit = numeric(service.quantity_transmit, 50000, false);
                dashboard.sections["test-performance"].nodes.status.textContent = "Test started.";
                dashboard.sections["test-performance"].nodes.button_execute.disabled = true;
                dashboard.message.send({
                    data: service,
                    service: "services_test_performance_input"
                });
            },
            type: function dashboard_sections_testPerformance_type(event:MouseEvent):void {
                dashboard.utility.setState();
                if (event.target === dashboard.sections["test-performance"].nodes.type_http) {
                    dashboard.sections["test-performance"].nodes.measure_roundtrip.disabled = true;
                    dashboard.sections["test-performance"].nodes.measure_send.disabled = true;
                } else {
                    dashboard.sections["test-performance"].nodes.measure_roundtrip.disabled = false;
                    dashboard.sections["test-performance"].nodes.measure_send.disabled = false;
                }
            }
        },
        init: function dashboard_sections_testPerformance_init():void {
            dashboard.sections["test-performance"].nodes.button_execute.onclick = dashboard.sections["test-performance"].events.submit;
            if (dashboard.global.state.test_performance !== undefined) {
                dashboard.sections["test-performance"].nodes.body.onblur = dashboard.utility.setState;
                dashboard.sections["test-performance"].nodes.connect_address.onblur = dashboard.utility.setState;
                dashboard.sections["test-performance"].nodes.connect_port.onblur = dashboard.utility.setState;
                dashboard.sections["test-performance"].nodes.encrypt_false.onclick = dashboard.utility.setState;
                dashboard.sections["test-performance"].nodes.encrypt_true.onclick = dashboard.utility.setState;
                dashboard.sections["test-performance"].nodes.frame_body_size.onclick = dashboard.utility.setState;
                dashboard.sections["test-performance"].nodes.measure_roundtrip.onclick = dashboard.utility.setState;
                dashboard.sections["test-performance"].nodes.measure_send.onclick = dashboard.utility.setState;
                dashboard.sections["test-performance"].nodes.quantity_tests.onblur = dashboard.utility.setState;
                dashboard.sections["test-performance"].nodes.quantity_transmit.onblur = dashboard.utility.setState;
                dashboard.sections["test-performance"].nodes.type_http.onclick = dashboard.sections["test-performance"].events.type;
                dashboard.sections["test-performance"].nodes.type_websocket.onclick = dashboard.sections["test-performance"].events.type;
                dashboard.sections["test-performance"].nodes.body.value = dashboard.global.state.test_performance.body;
                dashboard.sections["test-performance"].nodes.connect_address.value = dashboard.global.state.test_performance.connect_address;
                dashboard.sections["test-performance"].nodes.connect_port.value = String(dashboard.global.state.test_performance.connect_port);
                if (dashboard.global.state.test_performance.encryption === true) {
                    dashboard.sections["test-performance"].nodes.encrypt_true.checked = true;
                } else {
                    dashboard.sections["test-performance"].nodes.encrypt_false.checked = true;
                }
                dashboard.sections["test-performance"].nodes.frame_body_size.value = String(dashboard.global.state.test_performance.frame_body_size);
                dashboard.sections["test-performance"].nodes.quantity_tests.value = String(dashboard.global.state.test_performance.quantity_tests);
                dashboard.sections["test-performance"].nodes.quantity_transmit.value = String(dashboard.global.state.test_performance.quantity_transmit);
                if (dashboard.global.state.test_performance.measure === "roundtrip") {
                    dashboard.sections["test-performance"].nodes.measure_roundtrip.checked = true;
                } else {
                    dashboard.sections["test-performance"].nodes.measure_send.checked = true;
                }
                if (dashboard.global.state.test_performance.type === "http") {
                    dashboard.sections["test-performance"].nodes.type_http.checked = true;
                    dashboard.sections["test-performance"].nodes.measure_roundtrip.disabled = true;
                    dashboard.sections["test-performance"].nodes.measure_send.disabled = true;
                } else {
                    dashboard.sections["test-performance"].nodes.type_websocket.checked = true;
                    dashboard.sections["test-performance"].nodes.measure_roundtrip.disabled = false;
                    dashboard.sections["test-performance"].nodes.measure_send.disabled = false;
                }
                dashboard.sections["test-performance"].nodes.status.textContent = "Test not started.";
                dashboard.sections["test-performance"].nodes.button_execute.disabled = false;
            }
        },
        nodes: {
            body: document.getElementById("test-performance").getElementsByClassName("form")[0].getElementsByTagName("textarea")[0] as HTMLTextAreaElement,
            button_execute: document.getElementById("test-performance").getElementsByClassName("form")[0].getElementsByTagName("button")[0],
            connect_address: document.getElementById("test-performance").getElementsByClassName("form")[0].getElementsByTagName("input")[9],
            connect_port: document.getElementById("test-performance").getElementsByClassName("form")[0].getElementsByTagName("input")[10],
            encrypt_false: document.getElementById("test-performance").getElementsByClassName("form")[0].getElementsByTagName("input")[3],
            encrypt_true: document.getElementById("test-performance").getElementsByClassName("form")[0].getElementsByTagName("input")[2],
            frame_body_size: document.getElementById("test-performance").getElementsByClassName("form")[0].getElementsByTagName("input")[8],
            garbage_collection_false: document.getElementById("test-performance").getElementsByClassName("form")[0].getElementsByTagName("input")[7],
            garbage_collection_true: document.getElementById("test-performance").getElementsByClassName("form")[0].getElementsByTagName("input")[6],
            measure_roundtrip: document.getElementById("test-performance").getElementsByClassName("form")[0].getElementsByTagName("input")[5],
            measure_send: document.getElementById("test-performance").getElementsByClassName("form")[0].getElementsByTagName("input")[4],
            quantity_tests: document.getElementById("test-performance").getElementsByClassName("form")[0].getElementsByTagName("input")[12],
            quantity_transmit: document.getElementById("test-performance").getElementsByClassName("form")[0].getElementsByTagName("input")[11],
            status: document.getElementById("test-performance").getElementsByClassName("form")[0].getElementsByTagName("strong")[0],
            type_http: document.getElementById("test-performance").getElementsByClassName("form")[0].getElementsByTagName("input")[0],
            type_websocket: document.getElementById("test-performance").getElementsByClassName("form")[0].getElementsByTagName("input")[1]
        },
        receive: function dashboard_sections_testPerformance_receive(socket_data:socket_data):void {
            const data:services_test_performance_output = socket_data.data as services_test_performance_output,
                list:HTMLCollectionOf<HTMLElement> = document.getElementById("test-performance").getElementsByClassName("summary-stats")[0].getElementsByTagName("strong"),
                output = function dashboard_sections_testPerformance_receive_output(index:number, type:"memory"|"roundtrip"|"send"):void {
                    const len:number = (data[type] === undefined)
                            ? 0
                            : data[type].trials.length,
                        label:string = (type === "memory")
                            ? "bytes"
                            : "seconds",
                        value = function dashboard_sections_testPerformance_receive_output_value(input:number):number {
                            if (type === "memory") {
                                return input;
                            }
                            return input / 1e9;
                        };
                    if (len < 1) {
                        list[index].textContent = `0 ${label}`;
                        list[index + 1].textContent = `0 ${label}`;
                        list[index + 2].textContent = `0 ${label}`;
                        list[index + 3].textContent = `0 ${label}, (0.00%)`;
                        list[index + 4].textContent = "[]";
                    } else if (len < 2) {
                        list[index + 4].textContent = (`[${data[type].trials.toString()}]`);
                    } else {
                        let index_data:number = 0,
                            em:HTMLElement = null;
                        list[index].textContent = `${value(data[type].min).commas()} ${label}`;
                        list[index + 1].textContent = `${value(data[type].average).commas()} ${label}`;
                        list[index + 2].textContent = `${value(data[type].max).commas()} ${label}`;
                        list[index + 3].textContent = (data[type].variance === 0 || data[type].average === 0)
                            ? `0 ${label}, (0.00%)`
                            : `\u00b1${value(data[type].variance).toFixed(9).replace(/0+$/, "")} ${label}, (${((data[type].variance / data[type].average) * 100).toFixed(2)}%)`;
                        list[index + 4].textContent = "[";
                        do {
                            if (data[type].trials[index_data] === data[type].max) {
                                em = document.createElement("em");
                                em.setAttribute("class", "red");
                                em.setAttribute("title", "maximum value");
                                em.textContent = data[type].max.toString();
                                list[index + 4].appendChild(em);
                            } else if (data[type].trials[index_data] === data[type].min) {
                                em = document.createElement("em");
                                em.setAttribute("class", "green");
                                em.setAttribute("title", "minimum value");
                                em.textContent = data[type].min.toString();
                                list[index + 4].appendChild(em);
                            } else {
                                list[index + 4].appendText(data[type].trials[index_data].toString());
                            }
                            if (index_data < len - 1) {
                                list[index + 4].appendText(", ");
                            }
                            index_data = index_data + 1;
                        } while (index_data < len);
                        list[index + 4].appendText("]");
                    }
                };
            if (data.summary === "Test complete.") {
                list[0].textContent = data.quantity_transmit.commas();
                list[1].textContent = data.quantity_tests.commas();
                list[2].textContent = `${data.message_size.commas()} bytes`;
                list[3].textContent = `${data.frame_body_size.commas()} bytes`;
                list[4].textContent = `${(data.time / 1e9).commas()} seconds`;
                list[5].textContent = data.type;
            } else {
                list[0].textContent = "0";
                list[1].textContent = "0";
                list[2].textContent = "0 bytes";
                list[3].textContent = "0 bytes";
                list[4].textContent = "0 seconds";
                list[5].textContent = data.type;
            }
            output(16, "memory");
            output(6, "send");
            output(11, "roundtrip");
            dashboard.sections["test-performance"].nodes.status.textContent = data.summary;
            dashboard.sections["test-performance"].nodes.button_execute.disabled = false;
        },
        tools: {}
    };
    dashboard.sections["test-performance"] = test_performance;
};

export default ui_test_performance;