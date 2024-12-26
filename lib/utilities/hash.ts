
import log from "./log.js";
import node from "./node.js";

const hash = function utilities_hash(config:config_hash):void {
    const hashOutput:hash_output = {
        filePath: (config.hash_input_type === "file" && typeof config.source === "string")
            ? config.source
            : "",
        hash: ""
    };
    if (config.hash_input_type === "file") {
        node.fs.stat(config.source, function utilities_hash_statCallback(ers:node_error, stat:node_fs_Stats):void {
            if (ers === null && stat.isFile() === true) {
                const hash:node_crypto_Hash = node.crypto.createHash(config.algorithm),
                    hashStream:node_fs_ReadStream = node.fs.createReadStream(config.source),
                    hashBack = function utilities_hash_hashBack():void {
                        hashOutput.hash = hash.digest(config.digest).replace(/\s+/g, "");
                        config.callback(hashOutput);
                    };
                hashStream.pipe(hash);
                hashStream.on("close", hashBack);
            } else {
                log({
                    action: "add",
                    config: null,
                    message: "Hash source is either not a file or resulted in an error.",
                    status: "error",
                    type: "socket"
                });
            }
        });
    } else {
        const hash:node_crypto_Hash = node.crypto.createHash(config.algorithm);
        hash.update(config.source);
        hashOutput.hash = hash.digest(config.digest);
        config.callback(hashOutput);
    }
};

export default hash;