/* lib/terminal/utilities/node - All the Node APIs used in the project stored in a single location. */

import { isAscii, isUtf8 } from "node:buffer";
import { exec, spawn } from "node:child_process";
import { constants as constantsCrypto, createHash, createPrivateKey, createPublicKey, generateKeyPair, Hash, privateDecrypt, publicEncrypt } from "node:crypto";
import { resolve as resolveDNS } from "node:dns";
import { cp, createReadStream, createWriteStream, lstat, mkdir, open, read, readdir, readFile, readlink, realpath, rename, rm, rmdir, stat, Stats, symlink, unlink, utimes, writeFile } from "node:fs";
import { createServer as httpServer, get as httpGet, request as httpRequest, STATUS_CODES } from "node:http";
import { createServer as httpsServer, get as httpsGet, request as httpsRequest } from "node:https";
import { connect as netConnect, createServer as netCreateServer, isIPv4, isIPv6 } from "node:net";
import { arch, cpus, EOL, freemem, hostname, networkInterfaces, platform, release, totalmem, type } from "node:os";
import { isAbsolute, resolve as resolvePath, sep } from "node:path";
import { clearScreenDown, cursorTo } from "node:readline";
import { Readable } from "node:stream";
import { StringDecoder } from "node:string_decoder";
import { connect as tlsConnect, createServer as tlsCreateServer } from "node:tls";
import { brotliDecompress, constants as constantsZlib, createBrotliCompress, createBrotliDecompress, createGunzip, gunzip, inflate, unzip } from "node:zlib";

const node = {
    buffer: {
        isAscii: isAscii,
        isUtf8: isUtf8
    },
    child_process: {
        exec: exec,
        spawn: spawn
    },
    crypto: {
        constants: constantsCrypto,
        createHash: createHash,
        createPrivateKey: createPrivateKey,
        createPublicKey: createPublicKey,
        generateKeyPair: generateKeyPair,
        privateDecrypt: privateDecrypt,
        publicEncrypt: publicEncrypt,
        Hash: Hash
    },
    dns: {
        resolve: resolveDNS
    },
    fs: {
        cp: cp,
        createReadStream: createReadStream,
        createWriteStream: createWriteStream,
        lstat: lstat,
        mkdir: mkdir,
        open: open,
        read: read,
        readdir: readdir,
        readFile: readFile,
        readlink: readlink,
        realpath: realpath,
        rename: rename,
        rm: rm,
        rmdir: rmdir,
        stat: stat,
        Stats: Stats,
        symlink: symlink,
        unlink: unlink,
        utimes: utimes,
        writeFile: writeFile
    },
    http: {
        createServer: httpServer,
        get: httpGet,
        request: httpRequest,
        STATUS_CODES: STATUS_CODES
    },
    https: {
        createServer: httpsServer,
        get: httpsGet,
        request: httpsRequest
    },
    net: {
        connect: netConnect,
        createServer: netCreateServer,
        isIPv4: isIPv4,
        isIPv6: isIPv6
    },
    os: {
        arch: arch,
        cpus: cpus,
        EOL: EOL,
        freemem: freemem,
        hostname: hostname,
        networkInterfaces: networkInterfaces,
        platform: platform,
        release: release,
        totalmem: totalmem,
        type: type
    },
    path: {
        isAbsolute: isAbsolute,
        resolve: resolvePath,
        sep: sep
    },
    readline: {
        clearScreenDown: clearScreenDown,
        cursorTo: cursorTo
    },
    stream: {
        Readable: Readable
    },
    stringDecoder: {
        StringDecoder: StringDecoder
    },
    tls: {
        connect: tlsConnect,
        createServer: tlsCreateServer
    },
    zlib: {
        brotliDecompress: brotliDecompress,
        constants: constantsZlib,
        createBrotliCompress: createBrotliCompress,
        createBrotliDecompress: createBrotliDecompress,
        createGunzip: createGunzip,
        gunzip: gunzip,
        inflate: inflate,
        unzip: unzip
    }
};

export default node;