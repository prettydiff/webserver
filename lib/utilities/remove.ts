
/* lib/terminal/commands/library/remove - A command driven utility to recursively remove file system artifacts. */

import commas from "./commas.js";
import directory from "./directory.js";
import error from "./error.js";
import node from "./node.js";
import vars from "./vars.js";

// similar to posix "rm -rf" command
const remove = function terminal_commands_library_remove(filePath:string, exclusions:string[], callback:() => void):void {
        const removeItems = function terminal_commands_library_remove_removeItems(list:directory_list|string[]):void {
                // directory_list: [].failures
                // 0. absolute path (string)
                // 1. type (fileType)
                // 2. hash (string), empty string unless fileType is "file" and args.hash === true and be aware this is exceedingly slow on large directory trees
                // 3. parent index (number)
                // 4. child item count (number)
                // 5. selected properties from fs.Stat plus some link resolution data
                // 6. write path from the lib/utilities/rename library for file copy
                let a:number = 0;
                const fileList:directory_list = list as directory_list,
                    len:number = fileList.length,
                    destroy = function terminal_commands_library_remove_removeItems_destroy(item:type_directory_item):void {
                        let b:number = exclusions.length;
                        const destruction = function terminal_commands_library_remove_removeItems_destroy_destruction(er:node_error):void {
                            // error handling
                            if (vars.verbose === true && er !== null && er.toString().indexOf("no such file or directory") < 0) {
                                if (er.code === "ENOTEMPTY") {
                                    terminal_commands_library_remove_removeItems_destroy(item);
                                    return;
                                }
                                error(["Error removing file system artifact."], er, false);
                                return;
                            }

                            if (item[0] === fileList[0][0]) {
                                // done
                                if (callback !== null) {
                                    callback();
                                }
                            } else {
                                // decrement the number of child items in a directory
                                fileList[item[3]][4] = fileList[item[3]][4] - 1;
                                // once a directory is empty, process the directory for removal
                                if (fileList[item[3]][4] < 1) {
                                    terminal_commands_library_remove_removeItems_destroy(fileList[item[3]]);
                                }
                            }
                        };
                        if (item[1] === "directory") {
                            // do not remove directories that contain exclusions
                            if (exclusions.length > 0) {
                                do {
                                    b = b - 1;
                                    if (exclusions[b].indexOf(item[0]) === 0) {
                                        destruction(null);
                                        return;
                                    }
                                } while (b < 0);
                                node.fs.rmdir(item[0], destruction);
                            } else {
                                node.fs.rmdir(item[0], destruction);
                            }
                        } else if (exclusions.indexOf(item[0]) < 0) {
                            if (item[1] === "symbolic_link") {
                                node.fs.rm(item[0], destruction);
                            } else {
                                node.fs.unlink(item[0], destruction);
                            }
                        } else {
                            destruction(null);
                        }
                    };
                if (fileList.length < 1) {
                    if (callback !== null) {
                        callback();
                    }
                    return;
                }
                do {
                    if ((fileList[a][1] === "directory" && fileList[a][4] === 0) || fileList[a][1] !== "directory") {
                        destroy(fileList[a]);
                    }
                    a = a + 1;
                } while (a < len);
            },
            dirConfig:config_directory = {
                callback: removeItems,
                depth: 0,
                exclusions: [],
                mode: "read",
                path: filePath,
                relative: false,
                search: "",
                symbolic: true
            };
        directory(dirConfig);
    };

export default remove;