
import error from "../utilities/error.js";
import remove from "../utilities/remove.js";
import vars from "../utilities/vars.js";

const delete_server = function commands_deleteServer(name:string, callback:() => void):void {
    const terminate:boolean = (vars.command === "delete_server");
    if (vars.servers[name] === undefined) {
        error([
            `Server with name ${name} does not exist.`,
            "No server deleted."
        ], null, terminate);
    } else {
        let count_dirs:number = 0;
        const dirs_callback = function commands_deleteServer_remove():void {
                count_dirs = count_dirs + 1;
                if (count_dirs > 1) {
                    delete vars.servers[name];

                }
            };
        remove(`${vars.path.project}certs${vars.sep + name}`, [], dirs_callback);
        remove(`${vars.path.project}lib${vars.sep}assets${vars.sep + name}`, [], dirs_callback);
    }
};

export default delete_server;