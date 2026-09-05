
import node from "../core/node.ts";
import spawn from "../core/spawn.ts";
import vars from "../core/vars.ts";

// cspell: words convertto, pathy

const directory = function utilities_directory(args:config_directory):void {
    // arguments:
    // * callback - function - the output is passed into the callback as an argument
    // * depth - number - how many directories deep a recursive scan should read, a value less than 1 means full recursion
    // * exclusions - string array - a list of items to exclude
    // * parent - boolean - whether to capture data about the parent directory
    // * path - string - where to start in the local file system
    // * relative - boolean - where to use absolute paths or paths relative to the path argument
    // * search - string - the string transformed into a regular express to search for out of the result set
    // * symbolic - boolean - if symbolic links should be identified as opposed to the artifact they point to
    // -
    // core_directory_list: [] with a .failures and .parent property
    // 0. absolute path (string)
    // 1. type (fileType)
    // 2. parent index (number)
    // 3. child item count (number)
    // 4. selected properties from fs.Stat plus some link resolution data
    // 5. alternate path, such as a relative path
    // * property "failures" is a list of file paths that could not be read or opened
    let dir_start:boolean = false;
    const output:core_directory_list = [],
        failures:string[] = [],
        sep:string = node.path.sep,
        driveSize:store_number = {},
        dir_store:store_number = {},
        dir_list:string[] = [],
        search_value:string = (typeof args.search === "string" && args.search !== "")
            ? (sep === "\\")
                ? args.search.toLowerCase()
                : args.search
            : null,
        start_path:string = node.path.resolve(args.path).replace(/(\\|\/)$/, ""),
        exclusions:string[] = (function utilities_directory_exclusions():string[] {
            const ex:string[] = [],
                len:number = args.exclusions.length;
            let index:number = 0;
            if (sep === "/") {
                return args.exclusions;
            }
            if (len > 0) {
                do {
                    ex.push(args.exclusions[index].toLowerCase());
                    index = index + 1;
                } while (index < len);
            }
            return ex;
        }()),
        method:(filePath:string, callback:(er:node_error, stat:node_fs_Stats) => void) => void = (args.symbolic === true)
            ? node.fs.lstat
            : node.fs.stat,
        complete = function utilities_directory_complete(parent:type_directory_item):void {
            const len:number = output.length;
            if (search_value !== null && len > 0) {
                const search_last:number = (search_value === null)
                        ? 0
                        : search_value.length,
                    search_reg_token:string = (search_value === null)
                        ? ""
                        : search_value.slice(1, search_last - 1).replace(/\\/g, "\\"),
                    search_type:type_search = (function utilities_directory_searchType():type_search {
                        if (search_value === null) {
                            return null;
                        }
                        if (search_value !== "//" && search_value !== "/" && search_value.charAt(0) === "/" && search_value.charAt(search_last - 1) === "/" && (/^(?:(?:[^?+*{}()[\]\\|]+|\\.|\[(?:\^?\\.|\^[^\\]|[^\\^])(?:[^\]\\]+|\\.)*\]|\((?:\?[:=!]|\?<[=!]|\?>|\?<[^\W\d]\w*>|\?'[^\W\d]\w*')?|\))(?:(?:[?+*]|\{\d+(?:,\d*)?\})[?+]?)?|\|)*$/).test(search_reg_token) === true) {
                            return "regex";
                        }
                        if (search_value.charAt(0) === "!") {
                            return "negation";
                        }
                        return "fragment";
                    }()),
                    search_reg:RegExp = (search_type === "regex")
                        ? new RegExp(search_reg_token)
                        : null,
                    include = function utilities_directory_statWrap_stat_populate_include(item:type_directory_item):void {
                        const dirs:string[] = (args.path === "\\")
                                ? item[0].split(sep)
                                : item[0].replace(args.path, "").split(sep),
                            name:string = dirs.pop();
                        if (search_type === "regex" && search_reg.test(name) === true) {
                            list.push(item);
                        }
                        if (search_type === "negation" && name.includes(search_value) === false) {
                            list.push(item);
                        }
                        if (search_type === "fragment" && name.includes(search_value) === true) {
                            list.push(item);
                        }
                    },
                    list:core_directory_list = [];
                let index:number = 0;
                do {
                    include(output[index]);
                    index = index + 1;
                } while (index < len);
                list.failures = failures;
                list.parent = output[0];
                args.callback(list);
                return;
            }
            output.failures = failures;
            output.parent = parent;
            args.callback(output);
        },
        fail = function utilities_directory_fail(error:node_error, path:string, parent:number):void {
            if (error !== null && path !== null) {
                failures.push(`${error.code} - ${path}`);
            }
            if (output.length > 0) {
                counter(parent);
            }
        },
        add_item = function utilities_directory_addItem(item:type_directory_item):void {
            output.push(item);
            counter(item[2]);
        },
        counter = function utilities_directory_counter(parent:number):void {
            if (dir_start === true) {
                dir_store[output[parent][0]] = dir_store[output[parent][0]] - 1;
                if (dir_store[output[parent][0]] === 0) {
                    let index:number = dir_list.length;
                    if (index > 0) {
                        do {
                            index = index - 1;
                            if (dir_store[dir_list[index]] > 0) {
                                return;
                            }
                        } while (index > 0);
                    }
                } else {
                    return;
                }
            }
            if (args.parent === true && search_value === null) {
                if (args.path === "/" || args.path === "\\") {
                    complete(null);
                } else if ((/^\w:(\\)?$/).test(args.path) === true) {
                    complete(["\\", "directory", 0, 0, {
                        atimeMs: 0,
                        ctimeMs: 0,
                        linkPath: "",
                        linkType: "",
                        mode: 0,
                        mtimeMs: 0,
                        size: 0
                    }, "\\"]);
                } else {
                    const parent_path:string = (function utilities_directory_counter_parentPath():string {
                        const paths:string[] = args.path.split(sep);
                        paths.pop();
                        if ((paths[0] === "" && paths.length === 1) || (paths[0] === "" && paths[1] === "" && paths.length === 2 && sep === "/")) {
                            return "/";
                        }
                        return paths.join(sep);
                    }());
                    stat_wrap(parent_path, true, 0);
                }
            } else {
                complete(null);
            }
        },
        get_type = function utilities_directory_getType(stat_item:node_fs_Stats):type_file {
            if (stat_item.isFile() === true) {
                return "file";
            }
            if (stat_item.isDirectory() === true) {
                return "directory";
            }
            if (stat_item.isBlockDevice() === true) {
                return "block_device";
            }
            if (stat_item.isCharacterDevice() === true) {
                return "character_device";
            }
            if (stat_item.isFIFO() === true) {
                return "fifo_pipe";
            }
            if (stat_item.isSocket() === true) {
                return "socket";
            }
            if (stat_item.isSymbolicLink() === true) {
                return "symbolic_link";
            }
            return "file";
        },
        stat_wrap = function utilities_directory_statWrap(path:string, parent_item:boolean, parent_index:number):void {
            method(path, function utilities_directory_statWrap_stat(ers:node_error, stat:node_fs_Stats):void {
                if (ers === null) {
                    const populate = function utilities_directory_statWrap_stat_populate(type:"block_device"|"character_device"|"directory"|"fifo_pipe"|"file"|"socket"|"symbolic_link"):void {
                        const stat_obj:core_directory_data = {
                                atimeMs: stat.atimeMs,
                                ctimeMs: stat.ctimeMs,
                                linkPath: "",
                                linkType: "",
                                mode: stat.mode,
                                mtimeMs: stat.mtimeMs,
                                size: ((/^\w:(\\)?$/).test(path) === true && driveSize[path] !== undefined)
                                    ? driveSize[path]
                                    : stat.size
                            },
                            path_drive:string = ((/^\w:(\\)?$/).test(path) === true)
                                ? `${path}\\`
                                : path,
                            dirs:string[] = (args.path === "\\")
                                ? path.split(sep)
                                : path.replace(args.path, "").split(sep),
                            name_fragment:string = dirs.pop(),
                            name_rel:string = ((/^\w:(\\)?$/).test(path) === true)
                                ? path_drive
                                : (args.relative === true)
                                    ? path.slice(start_path.length + 1)
                                    : path,
                            dir_len:number = (args.path === "\\")
                                ? dirs.length + 1
                                : dirs.length,
                            readdir = function utilities_directory_statWrap_stat_populate_readdir(config:config_directory_readdir):void {
                                node.fs.readdir(config.path_drive, function utilities_directory_statWrap_stat_populate_readdir_dirs(err:node_error, dir:string[]):void {
                                    if (err === null) {
                                        if (dir.length > 0) {
                                            dir_store[config.path] = (config.path_drive === args.path)
                                                ? dir.length + 1
                                                : dir.length;
                                            dir_list.push(config.path);
                                            if (dir_start === false && output.length < 1) {
                                                dir_start = true;
                                            }
                                        }
                                        if (config.parent_item === true) {
                                            complete([config.path_drive, "directory", 0, dir.length, config.stat_obj, config.name_rel]);
                                        } else {
                                            add_item([config.path, "directory", config.parent_index, dir.length, config.stat_obj, config.name_rel]);
                                            if (args.path !== "\\" || dir_len - 1 < args.depth) {
                                                dir.forEach(function utilities_directory_statWrap_stat_populate_readdir_dirs_each(value:string):void {
                                                    const pathy:string = (config.path === "/")
                                                        ? ""
                                                        : config.path;
                                                    utilities_directory_statWrap(pathy + sep + value, false, output.length - 1);
                                                });
                                            }
                                        }
                                    } else {
                                        fail(err, config.path, config.parent_index);
                                    }
                                });
                            };
                        if ((exclusions.includes(name_fragment) === true && sep === "/") || (exclusions.includes(name_fragment.toLowerCase()) === true && sep === "\\")) {
                            fail(null, null, parent_index);
                        } else {
                            if (type === "directory") {
                                const config_readdir:config_directory_readdir = {
                                    name_rel: name_rel,
                                    parent_index: parent_index,
                                    parent_item: parent_item,
                                    path: path,
                                    path_drive: path_drive,
                                    stat_obj: stat_obj
                                };
                                if (args.directory_size === true) {
                                    spawn(vars.commands.directory_size, function utilities_directory_statWrap_stat_populate_size(size_output:core_spawn_output):void {
                                        if (parent_item === true || path_drive === args.path || args.depth < 1 || dir_len < args.depth) {
                                            config_readdir.stat_obj.size = Number(size_output.stdout.replace(/\D/g, ""));
                                            readdir(config_readdir);
                                        } else {
                                            stat_obj.size = Number(size_output.stdout.replace(/\D/g, ""));
                                            add_item([path, "directory", parent_index, 0, stat_obj, name_rel]);
                                        }
                                    }, {
                                        cwd: path,
                                        shell: (process.platform === "win32")
                                            ? "powershell"
                                            : "bash"
                                    }).execute();
                                } else {
                                    if (parent_item === true || path_drive === args.path || args.depth < 1 || dir_len < args.depth) {
                                        config_readdir.stat_obj.size = 0;
                                        readdir(config_readdir);
                                    } else {
                                        stat_obj.size = 0;
                                        add_item([path, "directory", parent_index, 0, stat_obj, name_rel]);
                                    }
                                }
                            } else {
                                if (type === "symbolic_link") {
                                    node.fs.realpath(path_drive, {encoding:"utf8"}, function utilities_directory_statWrap_stat_populate_linkPath(erp:node_error, real_path:string):void {
                                        if (erp === null) {
                                            stat_obj.linkPath = real_path;
                                            node.fs.stat(real_path, function utilities_directory_statWrap_stat_populate_linkPath_linkType(ert:node_error, link_type:node_fs_Stats):void {
                                                if (ert === null) {
                                                    stat_obj.linkType = get_type(link_type);
                                                    if (parent_item === true) {
                                                        complete([path, "symbolic_link", 0, 0, stat_obj, name_rel]);
                                                    } else {
                                                        add_item([path, "symbolic_link", parent_index, 0, stat_obj, name_rel]);
                                                    }
                                                } else {
                                                    fail(ert, real_path, parent_index);
                                                }
                                            });
                                        } else {
                                            fail(erp, path, parent_index);
                                        }
                                    });
                                } else {
                                    add_item([path, type, parent_index, 0, stat_obj, name_rel]);
                                }
                            }
                        }
                    };
                    populate(get_type(stat));
                } else {
                    fail(ers, path, parent_index);
                }
            });
        },
        args_len:number = (typeof args.path === "string")
            ? args.path.length
            : 0;
    if (args_len > 0) {
        if (args.path.charAt(args_len - 1) === sep && args_len > 2) {
            args.path = args.path.slice(0, args_len - 1);
        }
        if (args.path === "\\") {
            spawn("get-volume | convertto-json", function utilities_directory_windows(out:core_spawn_output):void {
                const drives:core_windows_drives[] = JSON.parse(out.stdout);
                let index:number = drives.length;
                output.push(["\\", "directory", 0, index, {
                    atimeMs: 0,
                    ctimeMs: 0,
                    linkPath: "",
                    linkType: "",
                    mode: 0,
                    mtimeMs: 0,
                    size: 0
                }, "\\"]);
                if (index > 0) {
                    do {
                        index = index - 1;
                        if (drives[index].DriveLetter !== null) {
                            driveSize[`${drives[index].DriveLetter}:`] = drives[index].Size;
                            stat_wrap(`${drives[index].DriveLetter}:`, false, 0);
                        }
                    } while (index > 0);
                }
            }, {
                error: function utilities_directory_indowsRootError(erw:node_childProcess_ExecException):void {
                    failures.push(`${erw.code} - \\`);
                    complete(null);
                },
                shell: "powershell"
            }).execute();
        } else {
            if (start_path === "") {
                stat_wrap(sep, false, 0);
            } else {
                stat_wrap(start_path, false, 0);
            }
        }
    } else {
        complete(null);
    }
};

export default directory;