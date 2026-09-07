
import create_socket from "../transmit/create_socket.ts";
import hash from "../core/hash.ts";
import http_request from "../http/http_request.ts";
import send from "../transmit/send.ts";
import vars from "../core/vars.ts";

const test_performance = function services_testPerformance(socket_data:socket_data, transmit:transmit_socket):void {
    let index_test:number = 0,
        index_http:number = 0,
        time_start:bigint = 0n;
    const data:services_test_performance_input = socket_data.data as services_test_performance_input,
        output:services_test_performance_output = {
            frame_body_size: data.frame_body_size,
            memory: {
                average: 0,
                max: 0,
                min: 0,
                trials: [],
                variance: 0
            },
            message_size: Buffer.from(data.body).byteLength,
            roundtrip: {
                average: 0,
                max: 0,
                min: 0,
                trials: [],
                variance: 0
            },
            send: {
                average: 0,
                max: 0,
                min: 0,
                trials: [],
                variance: 0
            },
            summary: "",
            quantity_tests: data.quantity_tests,
            quantity_transmit: data.quantity_transmit,
            time: 0,
            type: data.type
        },
        socket_service:websocket_client = transmit.socket as websocket_client,
        // 0 - test start time
        // 1 - test send complete
        // 2 - test round trip complete
        test_time:[bigint, bigint, bigint][] = [],
        memory:[number, number][] = [],
        times = function services_testPerformance_times(summary:string, error:boolean):void {
            if (error === false) {
                const setTimes = function services_testPerformance_times_setTimes(type:"memory"|"roundtrip"|"send"):void {
                    const value_index:1|2 = (type === "roundtrip")
                            ? 2
                            : 1;
                    let index:number = 0,
                        value:number = 0,
                        variance:number = 0,
                        variance_step:number = 0,
                        total:number = 0;
                    do {
                        value = (type === "memory")
                            ? memory[index][1] - memory[index][0]
                            : Number(test_time[index][value_index] - test_time[index][0]);
                        output[type].trials.push(value);
                        if (output[type].min === 0 || value < output[type].min) {
                            output[type].min = value;
                        }
                        if (value > output[type].max) {
                            output[type].max = value;
                        }
                        total = total + value;
                        index = index + 1;
                    } while (index < data.quantity_tests);
                    output[type].average = (total / data.quantity_tests);
                    index = 0;
                    do {
                        variance_step = output[type].trials[index] - output[type].average;
                        variance = variance + ((variance_step < 0)
                            ? variance_step * -1
                            : variance_step
                        );
                        index = index + 1;
                    } while (index < data.quantity_tests);
                    output[type].variance = (type === "memory")
                        ? Math.round(variance / data.quantity_tests)
                        : (variance / data.quantity_tests);
                };
                if (data.type === "http" || data.measure === "roundtrip") {
                    setTimes("roundtrip");
                }
                if (data.type === "websocket") {
                    setTimes("send");
                }
                setTimes("memory");
                output.time = Number(process.hrtime.bigint() - time_start);
            }
            output.summary = summary;
            send({
                data: output,
                service: "services_test_performance_output"
            }, socket_service, 3);
        },
        complete = function services_testPerformance_complete(measure:"roundtrip"|"send", socket_test:websocket_client):void {
            if (measure === data.measure) {
                socket_test.destroy();
                const index_value:number = (measure === "roundtrip")
                    ? 2
                    : 1;
                test_time[test_time.length - 1][index_value] = process.hrtime.bigint();
                const mem:os_node_memoryUsage = process.memoryUsage();
                memory[memory.length - 1][1] = mem.heapUsed;
                index_test = index_test + 1;
                if (index_test < data.quantity_tests) {
                    if (data.garbage_collection === true) {
                        setTimeout(test_type, 0);
                    } else {
                        test_type();
                    }
                } else {
                    times("Test complete.", false);
                }
            } else {
                test_time[test_time.length - 1][1] = process.hrtime.bigint();
            }
        },
        test_http = function services_testPerformance_testHTTP():void {
            http_request({
                body: data.body,
                encryption: data.encryption,
                headers: vars.environment.http_request,
                stats: null,
                timeout: 1000,
                uri: ""
            }, function services_testPerformance_testHTTP_callback(output:config_http_request_output):void {
                if (output.error === null) {
                    test_time[test_time.length - 1][2] = process.hrtime.bigint();
                    index_http = index_http + 1;
                    if (index_http < data.quantity_transmit) {
                        services_testPerformance_testHTTP();
                    } else {
                        index_http = 0;
                        index_test = index_test + 1;
                        if (index_test < data.quantity_tests) {
                            if (data.garbage_collection === true) {
                                setTimeout(test_type, 0);
                            } else {
                                test_type();
                            }
                        } else {
                            times("Test complete.", false);
                        }
                    }
                } else {
                    times(JSON.stringify(output.error), true);
                }
            }, [data.location, data.port]);
        },
        test_websocket = function services_testPerformance_testWebSocket():void {
            hash({
                algorithm: "sha3-512",
                callback: function services_testPerformance_testWebsocket_hash(output:core_hash_output):void {
                    let index_receive:number = 1;
                    create_socket({
                        callback: function services_testPerformance_testWebsocket_hash_create(socket_test:websocket_client, timeout:bigint, error:node_error):void {
                            if (socket_test === null || (error !== null && error !== undefined)) {
                                const message:string = JSON.stringify(error);
                                if (message === "{}") {
                                    times(error.message, true);
                                } else {
                                    times(message, true);
                                }
                            } else {
                                let index:number = data.quantity_transmit;
                                socket_test.segmentation = data.frame_body_size;
                                socket_test.proxy = transmit.socket as websocket_client;
                                socket_test.queue_callback = function services_testPerformance_testWebSocket_hash_create_queueCallback():void {
                                    if (index < 1) {
                                        complete("send", socket_test);
                                    }
                                };
                                if (index > 0) {
                                    do {
                                        index = index - 1;
                                        setTimeout(function services_testPerformance_testWebSocket_hash_create_send():void {
                                            send(data.body, socket_test, 1);
                                        }, 0);
                                    } while (index > 0);
                                }
                            }
                        },
                        handler: (data.measure === "roundtrip")
                            ? function services_testPerformance_testWebsocket_hash_handler(socket_test:websocket_client):void {
                                index_receive = index_receive + 1;
                                if (index_receive === data.quantity_transmit) {
                                    complete("roundtrip", socket_test);
                                }
                            }
                            : null,
                        hash: output.hash,
                        headers: null,
                        ip: data.location,
                        port: data.port,
                        proxy: null,
                        resource: "/",
                        secure: data.encryption,
                        server: vars.id.dashboard_server,
                        timeout: 2000,
                        type: "test-performance-socket"
                    });
                },
                digest: "hex",
                hash_input_type: "direct",
                section: "test-performance",
                source: String(Math.random() + Date.now())
            });
        },
        test_type = function services_testPerformance_testType():void {
            const mem:os_node_memoryUsage = process.memoryUsage();
            memory.push([mem.heapUsed, 0]);
            test_time.push([process.hrtime.bigint(), 0n, 0n]);
            if (data.type === "websocket") {
                test_websocket();
            } else {
                test_http();
            }
        };
    if (typeof data.quantity_tests === "number" && typeof data.quantity_transmit === "number" && data.quantity_tests > 0 && data.quantity_transmit > 0) {
        if (vars.options.demo === true) {
            if (data.quantity_tests > 10) {
                data.quantity_tests = 10;
            }
            if (data.quantity_transmit > 1000) {
                data.quantity_transmit = 1000;
            }
        }
        time_start = process.hrtime.bigint();
        test_type();
    } else {
        times("Test properties 'quantity_transmit' or 'quantity_test' is not a number greater than 0.", true);
    }
};

export default test_performance;