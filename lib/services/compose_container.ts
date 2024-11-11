
import file from "../utilities/file.js";
import log from "../utilities/log.js";
import vars from "../utilities/vars.js";

const compose_container = function services_composeContainer(socket_data:socket_data):void {
    const data:services_compose_container = socket_data.data as services_compose_container;
    let index:number = vars.compose.containers.length,
        exists:boolean = false;
    if (index > 0) {
        do {
            index = index - 1;
            if (vars.compose.containers[index].title === data.title) {
                exists = true;
                vars.compose.containers[index] = data;
                break;
            }
        } while (index > 0);
    }
    if (exists === false) {
        vars.compose.containers.push(data);
    }
    file.write({
        callback: function services_composeVariables_callback():void {
            log({
                action: "modify",
                config: vars.compose.containers,
                message: "Compose environmental variables updated.",
                status: "success",
                type: "compose-containers"
            });
        },
        contents: JSON.stringify(vars.compose),
        error_terminate: null,
        location: `${vars.path.project}compose.json`
    });
};

export default compose_container;