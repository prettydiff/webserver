
import directory from "./directory.ts";
import log from "../core/log.ts";
import node from "../core/node.ts";
import vars from "../core/vars.ts";

// A collection of abstractions for file system handling
// * mkdir - create one or more directories
// * read - read a file or perform an alternate action if the given file does not exist
// * remove - recursively remove a file system component
// * stat - stat a file system item
// * write - write a file

const file:core_module_file = {
    mkdir: function utilities_fileDir(config:config_file_mkdir):void {
        let ind:number = 0;
        const dirs:string[] = config.location.split(vars.path.sep),
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
                    log.application({
                        error: errorInstance,
                        message: `Error making directory ${config.location}`,
                        origin: "utilities/file.ts",
                        section: config.section,
                        status: "error",
                        time: Date.now()
                    });
                    return;
                }

                if (statInstance.isDirectory() === true) {
                    if (ind < len) {
                        recursiveStat();
                    } else {
                        config.callback(config.location, config.identifier);
                    }
                    return;
                }
                log.application({
                    error: new Error(`Destination directory, '${vars.text.cyan + config.location + vars.text.none}', is a ${type}.`),
                    message: `Destination for mkdir, ${config.location}, already exists.`,
                    origin: "utilities/file.ts",
                    section: config.section,
                    status: "error",
                    time: Date.now()
                });
                return;
            },
            recursiveStat = function utilities_fileDir_recursiveStat():void {
                ind = ind + 1;
                const target:string = dirs.slice(0, ind).join(vars.path.sep);
                node.fs.stat(target, function utilities_fileDir_recursiveStat_callback(errA:node_error, statA:node_fs_Stats):void {
                    errorHandler(errA, statA, function utilities_fileDir_recursiveStat_callback_errorHandler():void {
                        node.fs.mkdir(target, function utilities_fileDir_recursiveStat_callback_errorHandler_makeDir(errB:node_error):void {
                            if (ind < len) {
                                utilities_fileDir_recursiveStat();
                            } else if (errB === null) {
                                if (config.callback !== null) {
                                    config.callback(config.location, config.identifier);
                                }
                            } else {
                                log.application({
                                    error: errB,
                                    message: `Error making directory ${config.location}`,
                                    origin: "utilities/file.ts",
                                    section: config.section,
                                    status: "error",
                                    time: Date.now()
                                });
                            }
                        });
                    });
                });
            };
        node.fs.stat(config.location, function utilities_fileDir_stat(statError:node_error, stats:node_fs_Stats):void {
            if (statError === null) {
                if (stats.isDirectory() === true) {
                    if (config.callback !== null) {
                        config.callback(config.location, config.identifier);
                    }
                } else {
                    errorHandler(null, stats, null);
                }
            } else {
                recursiveStat();
            }
        });
    },
    read: function utilities_fileRead(config:config_file_read):void {
        node.fs.readFile(config.location, function utilities_fileRead_read(err:node_error, file_raw:Buffer):void {
            if (err !== null && err.code === "ENOENT") {
                if (config.no_file !== null) {
                    config.no_file(config.location, config.identifier);
                } else if (config.callback !== null) {
                    config.callback(null, config.location, config.identifier);
                }
            } else if (err === null) {
                if (config.callback !== null) {
                    config.callback(file_raw, config.location, config.identifier);
                }
            } else {
                log.application({
                    error: err,
                    message: `Error reading file: ${config.location}`,
                    origin: "utilities/file.ts",
                    section: config.section,
                    status: "error",
                    time: Date.now()
                });
                if (config.callback !== null) {
                    config.callback(null, config.location, config.identifier);
                }
            }
        });
    },
    remove: function utilities_fileRemove(config:config_file_remove):void {
        let count:number = 0;
        const complete = function utilities_fileRemove_complete():void {
                count = count - 1;
                if (count < 1) {
                    if (config.callback !== null) {
                        config.callback(config.location, config.identifier);
                    }
                }
            },
            removeItems = function utilities_fileRemove_removeItems(list:core_directory_list):void {
                let index_list:number = list.length;
                count = index_list;
                if (index_list > 0) {
                    do {
                        index_list = index_list - 1;
                        if (config.exclusions.indexOf(list[index_list][0]) > -1) {
                            count = count - 1;
                            list.splice(index_list, 1);
                        }
                    } while (index_list > 0);
                }
                index_list = list.length;
                if (index_list > 0) {
                    do {
                        index_list = index_list - 1;
                        if (list[index_list][1] === "directory") {
                            node.fs.unlink(list[index_list][0], complete);
                        } else {
                            node.fs.rm(list[index_list][1], complete);
                        }
                    } while (index_list > 0);
                }
            },
            dirConfig:config_directory = {
                callback: removeItems,
                depth: 0,
                directory_size: false,
                exclusions: [],
                parent: false,
                path: config.location,
                relative: false,
                search: "",
                symbolic: true
            };
        if (config.exclusions === null || config.exclusions.length === 0) {
            count = 1;
            node.fs.rm(config.location, {
                force: true,
                recursive: true
            }, complete);
        } else {
            directory(dirConfig);
        }
    },
    stat: function utilities_fileStat(config:config_file_stat):void {
        node.fs.stat(config.location, {
            bigint: true
        }, function utilities_fileStat_stat(ers:node_error, stat:node_fs_BigIntStats):void {
            if (ers !== null && ers.code === "ENOENT") {
                if (config.no_file !== null) {
                    config.no_file(config.location, config.identifier);
                } else if (config.callback !== null) {
                    config.callback(stat, config.location, config.identifier);
                }
            } else if (ers === null) {
                if (config.callback !== null) {
                    config.callback(stat, config.location, config.identifier);
                }
            } else {
                log.application({
                    error: ers,
                    message: `Error reading file: ${config.location}`,
                    origin: "utilities/file.ts",
                    section: config.section,
                    status: "error",
                    time: Date.now()
                });
                if (config.callback !== null) {
                    config.callback(null, config.location, config.identifier);
                }
            }
        });
    },
    write: function utilities_fileWrite(config:config_file_write):void {
        if (config.location === `${vars.path.project}servers.json`) {
            // eslint-disable-next-line no-console
            console.error("Changes to servers.json must come from the lib/utilities/save.ts file.");
            process.exit(1);
        } else if (config.location === `${vars.path.project}servers.json-lib/utilities/save.ts`) {
            config.location = `${vars.path.project}servers.json`;
        }
        node.fs.writeFile(config.location, config.contents, function utilities_fileWrite_write(erw:node_error):void {
            if (erw === null) {
                if (config.callback !== null) {
                    config.callback(config.location, config.identifier);
                }
            } else {
                log.application({
                    error: erw,
                    message: `Error writing file: ${config.location}`,
                    origin: "utilities/file.ts",
                    section: config.section,
                    status: "error",
                    time: Date.now()
                });
                if (config.callback !== null) {
                    config.callback(config.location, config.identifier);
                }
            }
        });
    }
};

export default file;