
import http_write from "./http_write.ts";

const http_trace = function http_trace(headerList:string[], socket:websocket_client):void {
    const len:number = headerList.length,
        get_header = function http_trace_getHeader(name:string):string {
            let index:number = len;
            if (len > 0) {
                do {
                    index = index - 1;
                    if (headerList[index].toLowerCase().indexOf(name.toLowerCase()) === 0) {
                        return headerList[index];
                    }
                } while (index > 0);
            }
            return null;
        },
        output:string[] = [
            "HTTP/1.1 200 OK",
            "content-length: ",
            `date: ${new Date(Date.now()).toUTCString()}`,
            "server: Aphorio",
            "content-type: message/http",
            "",
            headerList[0],
            get_header("host"),
            get_header("user-agent"),
            get_header("accept")
        ];
    output[1] = output[1] + output.slice(output.length - 4).join("\r\n").length;
    http_write(socket, output.join("\r\n"), true);
};

export default http_trace;