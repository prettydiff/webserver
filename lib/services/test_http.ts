
import http_request from "../http/http_request.ts";
import send from "../transmit/send.ts";

const test_http = function services_testHTTP(socket_data:socket_data, transmit:transmit_socket):void {
    const data:services_test_http = socket_data.data as services_test_http,
        startTime:bigint = process.hrtime.bigint();
    http_request(data, function services_testHTTP_callback(config:config_http_request_output):void {
        const response_body:string = (config.error === null)
                    ? (config.response_body_raw === undefined)
                        ? ""
                        : config.response_body_raw
                    : JSON.stringify(config.error),
                urlOutput = function http_request_urlOutput():string {
                    const urls:string[] = [
                            "",
                            `"absolute": ${JSON.stringify(config.url)},`
                        ],
                        urlPush = function http_request_data_urlPush(input:"hash"|"host"|"hostname"|"origin"|"password"|"pathname"|"port"|"protocol"|"search"|"username", noComma?:boolean):void {
                            const comma:string = (noComma === true)
                                ? ""
                                : ",";
                            urls.push(`"${input}": "${config.url[input]}"${comma}`);
                        };   
                    urlPush("origin");
                    urlPush("protocol");
                    urlPush("username");
                    urlPush("password");
                    urlPush("host");
                    urlPush("hostname");
                    urlPush("port");
                    urlPush("pathname");
                    urlPush("search");
                    urlPush("hash", true);
                    return `{${urls.join("\n    ")}\n}`;
                },
                output:services_test_http = {
                    body: response_body,
                    encryption: data.encryption,
                    headers: config.response_headers,
                    stats: {
                        chunks: {
                            chunked: config.chunked,
                            count: (config.chunked === true)
                                ? config.chunks
                                : 1
                        },
                        request: {
                            size_body: Buffer.byteLength(data.body),
                            size_header: Buffer.byteLength(data.headers)
                        },
                        response: {
                            size_body: Buffer.byteLength(response_body),
                            size_header: Buffer.byteLength(config.response_headers)
                        },
                        time: (Math.round(Number(process.hrtime.bigint() - startTime) / 1e6) / 1000)
                    },
                    timeout: Math.round(Number(process.hrtime.bigint() - startTime) / 1e6),
                    uri: (config.error === null)
                        ? urlOutput()
                        : ""
                };
        send({
            data: output,
            service: "services_test_http"
        }, transmit.socket as websocket_client, 3);
    });
};

export default test_http;