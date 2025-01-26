
import commas from "./commas.js";
import hash from "./hash.js";
import node from "./node.js";
import vars from "./vars.js";

// similar to node's fs.readdir, but recursive
const directory = function utilities_directory(args:config_directory):void {
        // arguments:
        // * callback - function - the output is passed into the callback as an argument
        // * depth - number - how many directories deep a recursive scan should read, 0 = full recursion
        // * hash - boolean - whether file types should be hashed
        // * exclusions - string array - a list of items to exclude
        // * path - string - where to start in the local file system
        // * symbolic - boolean - if symbolic links should be identified
        // -
        // directory_list: [].failures
        // 0. absolute path (string)
        // 1. type (fileType)
        // 2. hash (string), empty string unless fileType is "file" and args.hash === true and be aware this is exceedingly slow on large directory trees
        // 3. parent index (number)
        // 4. child item count (number)
        // 5. selected properties from fs.Stat plus some link resolution data
        // 6. write path from the lib/utilities/rename library for file copy
        // * property "failures" is a list of file paths that could not be read or opened
        let dirTest:boolean = false,
            size:number = 0,
            dirs:number = 0,
            longest:number = 0,
            startItem:string = null;
        const dirCount:number[] = [],
            dirNames:string[] = [],
            searchLast:number = (args.search === null)
                ? 0
                : args.search.length - 1,
            searchReg:RegExp = (args.search === null)
                ? null
                : new RegExp(args.search.slice(1, searchLast)),
            searchType:type_search = (function utilities_directory_searchType():type_search {
                if (args.mode === "search") {
                    const regString:string = args.search.slice(1, searchLast);
                    if (vars.sep === "\\") {
                        args.search = args.search.toLowerCase();
                    }
                    if (args.search !== "//" && args.search !== "/" && args.search.charAt(0) === "/" && args.search.charAt(searchLast) === "/" && (/^(?:(?:[^?+*{}()[\]\\|]+|\\.|\[(?:\^?\\.|\^[^\\]|[^\\^])(?:[^\]\\]+|\\.)*\]|\((?:\?[:=!]|\?<[=!]|\?>|\?<[^\W\d]\w*>|\?'[^\W\d]\w*')?|\))(?:(?:[?+*]|\{\d+(?:,\d*)?\})[?+]?)?|\|)*$/).test(regString) === true) {
                        return "regex";
                    }
                    if (args.search.charAt(0) === "!") {
                        return "negation";
                    }
                    if (args.search.charAt(0) !== "!") {
                        return "fragment";
                    }
                }
                return null;
            }()),
            list:directory_list = [],
            fileList:string[] = [],
            output = function utilities_directory_output():void {
                if (args.mode === "array" || args.mode === "list") {
                    const sortStrings = function utilities_directory_output_sortStrings():string[] {
                        if (vars.sep === "\\") {
                            fileList.sort(function utilities_directory_output_sortStrings_sortFunction(a:string, b:string):-1|1 {
                                if (a.toLowerCase() < b.toLowerCase()) {
                                    return -1;
                                }
                                return 1;
                            });
                        } else {
                            fileList.sort();
                        }
                        if (args.path === vars.sep) {
                            const index:number = fileList.indexOf(vars.sep);
                            fileList.splice(index, 1);
                            fileList.splice(0, 0, vars.sep);
                        }
                        return fileList;
                    };
                    args.callback(sortStrings());
                } else if (args.mode === "hash") {
                    let index:number = 0,
                        fileCount:number = 0;
                    const listLength:number = list.length,
                        loop = function utilities_directory_output_hashLoop():void {
                            do {
                                index = index + 1;
                            } while (index < listLength && list[index][1] !== "file");
                            if (index === listLength) {
                                args.callback(list);
                            } else {
                                hashInput.source = list[index][0];
                                hash(hashInput);
                            }
                        },
                        hashInput:config_hash = {
                            algorithm: "sha3-512",
                            callback: function utilities_directory_output_hashCallback(output:hash_output):void {
                                list[index][2] = output.hash;
                                fileCount = fileCount + 1;
                                if (index > 0) {
                                    loop();
                                } else {
                                    args.callback(list);
                                }
                            },
                            digest: "hex",
                            hash_input_type: "file",
                            source: null
                        };
                    if (list[0][1] === "file") {
                        hashInput.source = list[0][0];
                        hash(hashInput);
                    } else {
                        loop();
                    }
                } else if (args.mode === "search") {
                    args.callback(list);
                } else {
                    args.callback(list);
                }
            },
            method:(filePath:string, callback:(er:node_error, stat:node_fs_Stats) => void) => void = (args.symbolic === true)
                ? node.fs.lstat
                : node.fs.stat,
            dirCounter = function utilities_directory_dirCounter(item:string):void {
                const dirList:string[] = item.split(vars.sep);
                let dirPath:string = "",
                    index:number = 0;
                dirList.pop();
                dirPath = dirList.join(vars.sep);
                if ((/^\w:$/).test(dirPath) === true) {
                    dirPath = `${dirPath}\\`;
                } else if (dirPath === "") {
                    dirPath = vars.sep;
                }
                index = dirNames.indexOf(dirPath);
                if (index < 0 && args.path === "\\" && (/^\w:\\$/).test(dirPath) === true) {
                    index = 0;
                }
                dirCount[index] = dirCount[index] - 1;
                if (dirNames.length === 0 && item === args.path) {
                    // empty directory, nothing to traverse
                    output();
                } else if (dirCount[index] < 1) {
                    // dirCount and dirNames are parallel arrays
                    dirCount.splice(index, 1);
                    dirNames.splice(index, 1);
                    dirs = dirs - 1;
                    if (dirs < 1) {
                        output();
                    } else {
                        utilities_directory_dirCounter(dirPath);
                    }
                }
            },
            statWrapper = function utilities_directory_statWrapper(filePath:string, parent:number):void {
                method(filePath, function utilities_directory_statWrapper_stat(er:node_error, stats:node_fs_Stats):void {
                    const statData:directory_data = (stats === undefined)
                        ? null
                        : {
                            atimeMs: stats.atimeMs,
                            ctimeMs: stats.ctimeMs,
                            linkPath: "",
                            linkType: "",
                            mode: stats.mode,
                            mtimeMs: stats.mtimeMs,
                            size: stats.size
                        },
                        driveLetter = function utilities_directory_statWrapper_stat_driveLetter(input:string):string {
                            return `${input}\\`;
                        },
                        relPath:string = (args.relative === true)
                            ? filePath.replace(args.path + vars.sep, "")
                            : filePath,
                        search = function utilities_directory_statWrapper_stat_search(searchItem:string):boolean {
                            const names:string = searchItem.split(vars.sep).pop(),
                                named:string = (vars.sep === "\\")
                                    ? names.toLowerCase()
                                    : names;
                            if (searchType === "regex" && searchReg.test(named) === true) {
                                return true;
                            }
                            if (searchType === "negation" && named.indexOf(args.search.slice(1)) < 0) {
                                return true;
                            }
                            if (searchType === "fragment" && named.indexOf(args.search) > -1) {
                                return true;
                            }
                            return false;
                        },
                        dir = function utilities_directory_statWrapper_stat_dir(item:string):void {
                            const dirBody = function utilities_directory_statWrapper_stat_dir_dirBody(files:string[]):void {
                                const index:number = (args.mode === "array" || args.mode === "list")
                                        ? fileList.length
                                        : list.length,
                                    relItem:string = (args.relative === true)
                                        ? item.replace(args.path + vars.sep, "")
                                        : item;
                                if (args.mode === "array") {
                                    fileList.push(relItem);
                                } else if (args.mode === "list") {
                                    fileList.push(`directory  0  ${relPath}`);
                                } else {
                                    if (args.mode === "search") {
                                        if (search(item) === true) {
                                            list.push([relPath, "directory", "", parent, files.length, statData, ""]);
                                        }
                                    } else {
                                        list.push([relItem, "directory", "", parent, files.length, statData, ""]);
                                    }
                                }
                                if (files.length < 1) {
                                    dirCounter(item);
                                } else {
                                    // dirCount and dirNames are parallel arrays
                                    dirCount.push(files.length);
                                    dirNames.push(item);
                                    dirs = dirs + 1;
                                }
                                files.forEach(function utilities_directory_statWrapper_stat_dir_readDir_each(value:string):void {
                                    if (item === "\\") {
                                        utilities_directory_statWrapper(value, index);
                                    } else if ((/^\w:\\$/).test(item) === true) {
                                        utilities_directory_statWrapper(item + value, index);
                                    } else if (item === "/") {
                                        utilities_directory_statWrapper(`/${value}`, index);
                                    } else {
                                        utilities_directory_statWrapper(item + vars.sep + value, index);
                                    }
                                });
                            };
                            if (item === "\\") {
                                //cspell:disable-next-line
                                node.child_process.exec("wmic logicaldisk get name", function utilities_directory_statWrapper_stat_dir_windowsRoot(erw:node_childProcess_ExecException, stdout:string, stderr:string):void {
                                    if (erw !== null || stderr !== "") {
                                        list.failures.push(`${erw.code} - ${item}`);
                                        if (dirs > 0) {
                                            dirCounter(item);
                                        } else {
                                            output();
                                        }
                                    } else {
                                        const drives:string[] = stdout.replace(/Name\s+/, "").replace(/\s+$/, "").replace(/\s+/g, " ").split(" ");
                                        dirBody(drives);
                                    }
                                });
                            } else {
                                node.fs.readdir(item, {encoding: "utf8"}, function utilities_directory_statWrapper_stat_dir_readDir(erd:node_error, files:string[]):void {
                                    if (erd !== null) {
                                        list.failures.push(`${erd.code} - ${item}`);
                                        if (dirs > 0) {
                                            dirCounter(item);
                                        } else {
                                            output();
                                        }
                                    } else {
                                        dirBody(files);
                                    }
                                });
                            }
                        },
                        populate = function utilities_directory_statWrapper_stat_populate(type:"block_device"|"character_device"|"directory"|"fifo_pipe"|"error"|"file"|"socket"|"symbolic_link"):void {
                            if (type === "error") {
                                if (list[parent] !== undefined) {
                                    list[parent][4] = list[parent][4] - 1;
                                }
                                list.failures.push(`${er.code} - ${filePath}`);
                            } else {
                                if (args.mode === "search") {
                                    if (search(filePath) === true) {
                                        list.push([relPath, type, "", parent, 0, statData, ""]);
                                    }
                                } else if (args.mode === "array" || args.mode === "list") {
                                    if (args.mode === "array") {
                                        fileList.push(relPath);
                                    } else {
                                        const typePadding:string = (type === "symbolic_link")
                                                ? "link     "
                                                : (type === "file")
                                                    ? "file     "
                                                    : "directory",
                                            comma:string = commas(stats.size),
                                            size:number = comma.length;
                                        if (size > longest) {
                                            longest = size;
                                        }
                                        fileList.push(`${typePadding}  ${comma}  ${relPath}`);
                                    }
                                } else {
                                    list.push([relPath, type, "", parent, 0, statData, ""]);
                                }
                            }
                            if (dirs > 0) {
                                dirCounter(filePath);
                            } else {
                                output();
                            }
                        },
                        linkAction = function utilities_directory_statWrapper_stat_linkAction():void {
                            if (args.mode === "type") {
                                args.callback(null);
                                return;
                            }
                            populate("symbolic_link");
                        },
                        linkCallback = function utilities_directory_statWrapper_stat_linkCallback(linkErr:node_error, linkStat:node_fs_Stats):void {
                            if (linkErr === null) {
                                statData.linkType = (linkStat.isDirectory() === true)
                                    ? "directory"
                                    : "file";
                                node.fs.realpath(filePath, function terminal_Commands_directory_statWrapper_stat_linkCallback_realPath(realErr:node_error, realPath:string):void {
                                    if (realErr === null) {
                                        statData.linkPath = realPath;
                                        linkAction();
                                    } else {
                                        populate("error");
                                    }
                                });
                            } else {
                                populate("error");
                            }
                        };
                    if (filePath === "\\") {
                        const date:Date = new Date(),
                            empty = function utilities_directory_statWrapper_empty():boolean {
                                return false;
                            };
                        er = null;
                        stats = {
                            dev: 0,
                            ino: 0,
                            mode: 0,
                            nlink: 0,
                            uid: 0,
                            gid: 0,
                            rdev: 0,
                            size: 0,
                            blksize: 0,
                            blocks: 0,
                            atimeMs: 0,
                            mtimeMs: 0,
                            ctimeMs: 0,
                            birthtimeMs: 0,
                            atime: date,
                            mtime: date,
                            ctime: date,
                            birthtime: date,
                            isBlockDevice: empty,
                            isCharacterDevice: empty,
                            isDirectory: function utilities_directory_statWrapper_isDirectory():boolean {
                                return true;
                            },
                            isFIFO: empty,
                            isFile: empty,
                            isSocket: empty,
                            isSymbolicLink: empty
                        };
                    }
                    if (er !== null) {
                        if (er.message.indexOf("no such file or directory") > 0) {
                            if (args.mode === "type") {
                                args.callback(null);
                                return;
                            }
                            populate("error");
                        } else {
                            populate("error");
                        }
                    } else if (stats.isDirectory() === true) {
                        if (args.mode === "type") {
                            args.callback(null);
                            return;
                        }
                        const dirs:number = (args.path === "\\" && (/\w:$/).test(filePath) === false)
                            ? `\\${filePath.replace(startItem, "")}`.split(vars.sep).length
                            : filePath.replace(startItem, "").split(vars.sep).length;
                        if (args.depth < 1 || dirs < args.depth || dirTest === false) {
                            dirTest = true;
                            dir(filePath.replace(/^\w:$/, driveLetter));
                        } else {
                            populate("directory");
                        }
                    } else if (stats.isSymbolicLink() === true) {
                        if (args.symbolic === true) {
                            linkAction();
                        } else {
                            node.fs.stat(filePath, linkCallback);
                        }
                    } else {
                        if (stats.isBlockDevice() === true) {
                            if (args.mode === "type") {
                                args.callback(null);
                            } else {
                                populate("block_device");
                            }
                        } else if (stats.isCharacterDevice() === true) {
                            if (args.mode === "type") {
                                args.callback(null);
                            } else {
                                populate("character_device");
                            }
                        } else if (stats.isFIFO() === true) {
                            if (args.mode === "type") {
                                args.callback(null);
                            } else {
                                populate("fifo_pipe");
                            }
                        } else if (stats.isSocket() === true) {
                            if (args.mode === "type") {
                                args.callback(null);
                            } else {
                                populate("socket");
                            }
                        } else {
                            if (args.mode === "type") {
                                args.callback(null);
                            } else {
                                size = size + stats.size;
                                populate("file");
                            }
                        }
                    }
                });
            };
        if (args.path === null) {
            return;
        }
        args.path = (args.path.length > 2)
            ? args.path.replace(/(\/|\\)$/, "")
            : args.path;
        startItem = (args.path === "/")
            ? "/"
            : args.path + vars.sep;
        list.failures = [];
        statWrapper(args.path, 0);
    };

export default directory;