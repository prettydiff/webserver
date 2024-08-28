
import vars from "../utilities/vars.js";

const dashboard = function terminal_dashboard(headerList:string[], socket:websocket_client):void {
    const payload:string[] = [
        `HTTP/1.1 200`,
        `content-type: text/html`,
        "",
        "",
        "<!doctype html>",
        "<html lang=\"en\">",
        "<head>",
        "<meta charset=\"utf-8\"/>",
        `<title>${vars.server_name} Dashboard</title>`,
        "<meta content=\"text/html;charset=UTF-8\" http-equiv=\"Content-Type\"/>",
        "<meta content=\"width=device-width, initial-scale=1\" name=\"viewport\"/>",
        "<meta content=\"noindex, nofollow\" name=\"robots\"/>",
        "<meta content=\"#fff\" name=\"theme-color\"/>",
        "<meta content=\"Global\" name=\"distribution\"/>",
        "<meta content=\"en\" http-equiv=\"Content-Language\"/>",
        "<meta content=\"blendTrans(Duration=0)\" http-equiv=\"Page-Enter\"/>",
        "<meta content=\"blendTrans(Duration=0)\" http-equiv=\"Page-Exit\"/>",
        "<meta content=\"text/css\" http-equiv=\"content-style-type\"/>",
        "<meta content=\"application/javascript\" http-equiv=\"content-script-type\"/>",
        "<meta content=\"#bbbbff\" name=\"msapplication-TileColor\"/>",
        "<link href=\"/styles.css\" media=\"all\" rel=\"stylesheet\" type=\"text/css\"/>",
        "<link rel=\"icon\" type=\"image/png\" href=\"data:image/png;base64,iVBORw0KGgo=\"/>",
        "</head>",
        "<body>",
        "<h1>Dashboard</h1>",
        "</body></html>"
    ];
    socket.write(payload.join("\r\n"), function transmit_http_statTest_stat_write_callback():void {
        socket.destroy();
    });
};

export default dashboard;