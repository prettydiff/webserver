
import vars from "../utilities/vars.js";

const redirection = function transmit_redirection(domain:string, message:Buffer|string):Buffer|string {
    const str:string = (Buffer.isBuffer(message) === true)
            ? message.toString()
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
            : message as string,
        headerStr:string = str.slice(0, str.indexOf("\r\n"));
    if (headerStr.indexOf("HTTP") > 0) {
        const header:string[] = headerStr.split(" "),
            keys:string[] = Object.keys(vars.redirect_internal[domain]);
        let index:number = keys.length,
            key:string = "",
            wild:string = "";
        if (index > 0) {
            // look for exact matches first
            do {
                index = index - 1;
                key = keys[index];
                if (key === header[1] && key.charAt(key.length - 1) !== "*") {
                    header[1] = vars.redirect_internal[domain][key];
                    return Buffer.from(str.replace(headerStr, header.join(" ")));
                }
            } while (index > 0);
            
            // look for wildcard matches second
            index = keys.length;
            do {
                index = index - 1;
                key = keys[index];
                wild = key.replace(/\*$/, "");
                if (key.charAt(key.length - 1) === "*" && header[1].indexOf(wild) === 0 && header[1].indexOf(vars.redirect_internal[domain][key]) !== 0) {
                    header[1] = header[1].replace(wild, vars.redirect_internal[domain][key]);
                    return Buffer.from(str.replace(headerStr, header.join(" ")));
                }
            } while (index > 0);
        }
        return message;
    }
    return message;
};

export default redirection;