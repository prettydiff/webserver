
import vars from "../utilities/vars.js";

const redirection = function transmit_redirection(domain:string, message:Buffer|string, server_name:string):Buffer|string {
    const str:string = (Buffer.isBuffer(message) === true)
            ? message.toString()
            : message as string,
        headerStr:string = str.slice(0, str.indexOf("\r\n")),
        server:services_server = vars.servers[server_name].config;
    if (headerStr.indexOf("HTTP") > 0) {
        const header:string[] = headerStr.split(" "),
            keys:string[] = Object.keys(server.redirect_internal[domain]);
        let index:number = keys.length,
            key:string = "",
            wild:string = "";
        if (index > 0) {
            // look for exact matches first
            do {
                index = index - 1;
                key = keys[index];
                if (key === header[1] && key.charAt(key.length - 1) !== "*") {
                    header[1] = server.redirect_internal[domain][key];
                    return Buffer.from(str.replace(headerStr, header.join(" ")));
                }
            } while (index > 0);
            
            // look for wildcard matches second
            index = keys.length;
            do {
                index = index - 1;
                key = keys[index];
                wild = key.replace(/\*$/, "");
                if (key.charAt(key.length - 1) === "*" && header[1].indexOf(wild) === 0 && header[1].indexOf(server.redirect_internal[domain][key]) !== 0) {
                    header[1] = header[1].replace(wild, server.redirect_internal[domain][key]);
                    return Buffer.from(str.replace(headerStr, header.join(" ")));
                }
            } while (index > 0);
        }
        return message;
    }
    return message;
};

export default redirection;