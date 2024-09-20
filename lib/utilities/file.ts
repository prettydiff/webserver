
import directory from "./directory.js";
import error from "./error.js";
import node from "./node.js";
import vars from "./vars.js";

// A collection of abstractions for file system handling
// * mkdir - create one or more directories
// * read - read a file or perform an alternate action if the given file does not exist
// * remove - recursively remove a file system component
// * stat - stat a file system item
// * write - write a file

const file:file = {
    mkdir: function utilities_fileDir(config:file_mkdir):void {
        let ind:number = 0;
        const dirs:string[] = config.location.split(vars.sep),
            len:number = dirs.length,
            errorHandler = function utilities_fileDir_errorHandler(errorInstance:node_error, statInstance:node_fs_Stats, errorCallback:() => void):void {
                const type:string = (statInstance === undefined || statInstance === null)
                    ? null
                    : (statInstance.isFile() === true)
                        ? "file"
                        : (statInstance.isSymbolicLink() === true)
                            ? "symbolic link"
                            : (statInstance.isCharacterDevice() === true)
                                ? "character device"
                                : (statInstance.isFIFO() === true)
                                    ? "FIFO"
                                    : (statInstance.isSocket() === true)
                                        ? "socket"
                                        : "unknown file system object";
                if (errorInstance !== null) {
                    if (errorInstance.code === "ENOENT") {
                        errorCallback();
                        return;
                    }
                    error(["Error making a directory."], errorInstance, config.error_terminate);
                    return;
                }

                if (statInstance.isDirectory() === true) {
                    if (ind < len) {
                        recursiveStat();
                    } else {
                        config.callback();
                    }
                    return;
                }
                error(["Destination for mkdir already exists."], new Error(`Destination directory, '${vars.text.cyan + config.location + vars.text.none}', is a ${type}.`), config.error_terminate);
                return;
            },
            recursiveStat = function utilities_fileDir_recursiveStat():void {
                ind = ind + 1;
                const target:string = dirs.slice(0, ind).join(vars.sep);
                node.fs.stat(target, function utilities_fileDir_recursiveStat_callback(errA:node_error, statA:node_fs_Stats):void {
                    errorHandler(errA, statA, function utilities_fileDir_recursiveStat_callback_errorHandler():void {
                        node.fs.mkdir(target, function utilities_fileDir_recursiveStat_callback_errorHandler_makeDir(errB:node_error):void {
                            if (ind < len) {
                                utilities_fileDir_recursiveStat();
                            } else if (errB === null) {
                                if (config.callback !== null) {
                                    config.callback();
                                }
                            } else {
                                error([`Error creating directory ${vars.text.angry + config.location + vars.text.none}.`], errB, config.error_terminate);
                            }
                        });
                    });
                });
            };
        node.fs.stat(config.location, function utilities_fileDir_stat(statError:node_error, stats:node_fs_Stats):void {
            if (statError === null) {
                if (stats.isDirectory() === true) {
                    if (config.callback !== null) {
                        config.callback();
                    }
                } else {
                    errorHandler(null, stats, null);
                }
            } else {
                recursiveStat();
            }
        });
    },
    read: function utilities_fileRead(config:file_read):void {
        node.fs.readFile(config.location, function utilities_fileRead_read(err:node_error, file_raw:Buffer):void {
            if (err !== null && err.code === "ENOENT") {
                if (config.no_file !== null) {
                    config.no_file();
                } else if (config.callback !== null) {
                    config.callback(file_raw);
                }
            } else if (err === null) {
                if (config.callback !== null) {
                    config.callback(file_raw);
                }
            } else {
                error([`Error reading file ${vars.text.angry + config.location + vars.text.none}.`], err, config.error_terminate);
                if (config.error_terminate === false && config.callback !== null) {
                    config.callback(null);
                }
            }
        });
    },
    remove: function utilities_fileRemove(config:file_remove):void {
        const removeItems = function utilities_fileRemove_removeItems(list:directory_list|string[]):void {
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
                    destroy = function utilities_fileRemove_removeItems_destroy(item:type_directory_item):void {
                        let b:number = (config.exclusions === null)
                            ? 0
                            : config.exclusions.length;
                        const destruction = function utilities_fileRemove_removeItems_destroy_destruction(er:node_error):void {
                            // error handling
                            if (vars.verbose === true && er !== null && er.toString().indexOf("no such file or directory") < 0) {
                                if (er.code === "ENOTEMPTY") {
                                    utilities_fileRemove_removeItems_destroy(item);
                                    return;
                                }
                                error([`Error removing file system artifact ${vars.text.angry + item[0] + vars.text.none}.`], er, config.error_terminate);
                                return;
                            }

                            if (item[0] === fileList[0][0]) {
                                // done
                                if (config.callback !== null) {
                                    config.callback();
                                }
                            } else {
                                // decrement the number of child items in a directory
                                fileList[item[3]][4] = fileList[item[3]][4] - 1;
                                // once a directory is empty, process the directory for removal
                                if (fileList[item[3]][4] < 1) {
                                    utilities_fileRemove_removeItems_destroy(fileList[item[3]]);
                                }
                            }
                        };
                        if (item[1] === "directory") {
                            // do not remove directories that contain exclusions
                            if (config.exclusions !== null && config.exclusions.length > 0) {
                                do {
                                    b = b - 1;
                                    if (config.exclusions[b].indexOf(item[0]) === 0) {
                                        destruction(null);
                                        return;
                                    }
                                } while (b < 0);
                                node.fs.rmdir(item[0], destruction);
                            } else {
                                node.fs.rmdir(item[0], destruction);
                            }
                        } else if (config.exclusions !== null && config.exclusions.indexOf(item[0]) < 0) {
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
                    if (config.callback !== null) {
                        config.callback();
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
                path: config.location,
                relative: false,
                search: "",
                symbolic: true
            };
        directory(dirConfig);
    },
    stat: function utilities_fileStat(config:file_stat):void {
        node.fs.stat(config.location, function utilities_fileStat_stat(ers:node_error, stat:node_fs_Stats):void {
            if (ers !== null && ers.code === "ENOENT") {
                if (config.no_file !== null) {
                    config.no_file();
                } else if (config.callback !== null) {
                    config.callback(stat);
                }
            } else if (ers === null) {
                if (config.callback !== null) {
                    config.callback(stat);
                }
            } else {
                error([`Error reading file ${vars.text.angry + config.location + vars.text.none}.`], ers, config.error_terminate);
                if (config.error_terminate === false && config.callback !== null) {
                    config.callback(null);
                }
            }
        });
    },
    write: function utilities_fileWrite(config:file_write):void {
        node.fs.writeFile(config.location, config.contents, function utilities_fileWrite_write(erw:node_error):void {
            if (erw === null) {
                if (config.callback !== null) {
                    config.callback();
                }
            } else {
                error([`Error writing file ${vars.text.angry + config.location + vars.text.none}.`], erw, config.error_terminate);
                if (config.error_terminate === false && config.callback !== null) {
                    config.callback();
                }
            }
        });
    }
};

export default file;