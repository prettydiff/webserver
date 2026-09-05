
import file from "./file.ts";
import vars from "../core/vars.ts";

const save = function utilities_save(callback:() => void, section:type_dashboard_sections|"startup"):void {
    if (vars.options.demo === true) {
        if (callback !== null) {
            callback();
        }
    } else {
        const configs:store_server_config = (function utilities_save_configs():store_server_config {
            const output:store_server_config = {},
                keys:string[] = Object.keys(vars.data.server),
                len:number = keys.length;
            let index:number = 0;
            if (len > 0) {
                do {
                    output[keys[index]] = vars.data.server[keys[index]].config;
                    index = index + 1;
                } while (index < len);
            }
            return output;
        }()),
        payload:core_state_file = {
            id: vars.id,
            notes: vars.data.notes,
            servers: configs,
            stats: vars.stats
        };
        file.write({
            callback: callback,
            contents: JSON.stringify(payload),
            location: `${vars.path.project}servers.json-lib/utilities/save.ts`,
            section: section
        });
    }
};

export default save;