
import error from "./error.js";
import node from "./node.js";
import vars from "./vars.js";

const file:file = {
    mkdir: function utilities_fileDir(config:file_mkdir):void {
        node.fs.mkdir(config.location, function utilities_fileDir_mkdir(erm:node_error):void {
            if (erm === null) {
                if (config.callback !== null) {
                    config.callback();
                }
            } else {
                error([`Error creating directory ${vars.text.angry + config.location + vars.text.none}.`], erm, config.error_terminate);
                if (config.error_terminate === false && config.callback !== null) {
                    config.callback();
                }
            }
        });
    },
    read: function utilities_fileRead(config:file_read):void {
        node.fs.readFile(config.location, function utilities_fileRead_read(err:node_error, file_raw:Buffer):void {
            if (err === null) {
                if (config.no_error !== null) {
                    config.no_error();
                }
                if (config.callback !== null) {
                    config.callback(file_raw);
                }
            } else if (err.code === "ENOENT" && config.no_file !== null) {
                config.no_file();
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
    stat: function utilities_fileStat(config:file_stat):void {
        node.fs.stat(config.location, function utilities_fileStat_stat(ers:node_error, stat:node_fs_Stats):void {
            if (ers === null) {
                if (config.no_error !== null) {
                    config.no_error();
                }
                if (config.callback !== null) {
                    config.callback(stat);
                }
            } else if (ers.code === "ENOENT" && config.no_file !== null) {
                config.no_file();
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