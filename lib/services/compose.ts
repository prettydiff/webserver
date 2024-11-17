
import file from "../utilities/file.js";
import log from "../utilities/log.js";
import vars from "../utilities/vars.js";

const compose_variables = function services_compose(socket_data:socket_data):void {
    if (socket_data.service === "dashboard-compose-container") {
        const data:services_compose = socket_data.data as services_compose;
        vars.compose.containers[data.title] = data;
        file.write({
            callback: function services_compose_containerCallback():void {
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
    } else if (socket_data.service === "dashboard-compose-variables") {
        const data:store_string = socket_data.data as store_string;
        vars.compose.variables = data;
        file.write({
            callback: function services_compose_variablesCallback():void {
                log({
                    action: "modify",
                    config: vars.compose.variables,
                    message: "Compose environmental variables updated.",
                    status: "success",
                    type: "compose-variables"
                });
            },
            contents: JSON.stringify(vars.compose),
            error_terminate: null,
            location: `${vars.path.project}compose.json`
        });
    }
};

export default compose_variables;