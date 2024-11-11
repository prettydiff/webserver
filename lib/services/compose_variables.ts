
import file from "../utilities/file.js";
import log from "../utilities/log.js";
import vars from "../utilities/vars.js";

const compose_variables = function services_composeVariables(socket_data:socket_data):void {
    const data:store_string = socket_data.data as store_string;
    vars.compose.variables = data;
    file.write({
        callback: function services_composeVariables_callback():void {
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
};

export default compose_variables;