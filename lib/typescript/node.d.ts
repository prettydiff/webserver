
// cspell: words lydell, RSAPSS
import { ChildProcess, ExecException, ExecOptions, SpawnOptions } from "node:child_process";
import { ECDH, Hash, KeyObject, RSAKeyPairOptions } from "node:crypto";
import { BigIntStats, ReadStream, Stats, WriteStream } from "node:fs";
import { ClientRequest, IncomingMessage, OutgoingHttpHeaders, Server as httpServer, ServerResponse } from "node:http";
import { RequestOptions } from "node:https";
import { AddressInfo, NetConnectOpts, Server, Socket } from "node:net";
import { NetworkInterfaceInfo, NetworkInterfaceInfoIPv4, NetworkInterfaceInfoIPv6 } from "node:os";
import { Readable } from "node:stream";
import { StringDecoder } from "node:string_decoder";
import { TLSSocket, TLSSocketOptions } from "node:tls";
import { BrotliCompress, BrotliDecompress } from "node:zlib";

import { IPty } from "@lydell/node-pty";

declare global {
    type node_childProcess_ChildProcess = ChildProcess;
    type node_childProcess_ExecException = ExecException;
    type node_childProcess_ExecOptions = ExecOptions;
    type node_childProcess_SpawnOptions = SpawnOptions;
    type node_crypto_ECDH = ECDH;
    type node_crypto_Hash = Hash;
    type node_crypto_KeyObject = KeyObject;
    type node_crypto_RSAKeyPairOptions = RSAKeyPairOptions<"pem", "pem">;
    type node_error = NodeJS.ErrnoException;
    type node_fs_BigIntStats = BigIntStats;
    type node_fs_ReadStream = ReadStream;
    type node_fs_Stats = Stats;
    type node_fs_WriteStream = WriteStream;
    type node_http_ClientRequest = ClientRequest;
    type node_http_IncomingMessage = IncomingMessage;
    type node_http_OutgoingHttpHeaders = OutgoingHttpHeaders;
    type node_http_Server = httpServer;
    type node_http_ServerResponse = ServerResponse;
    type node_https_RequestOptions = RequestOptions;
    type node_net_AddressInfo = AddressInfo;
    type node_net_NetConnectOpts = NetConnectOpts;
    type node_net_Server = Server;
    type node_net_Socket = Socket;
    type node_os_NetworkInterfaceInfo = NetworkInterfaceInfo;
    type node_os_NetworkInterfaceInfoIPv4 = NetworkInterfaceInfoIPv4;
    type node_os_NetworkInterfaceInfoIPv6 = NetworkInterfaceInfoIPv6;
    type node_stream_Readable = Readable;
    type node_stringDecoder_StringDecoder = StringDecoder;
    type node_tls_TLSSocket = TLSSocket;
    type node_tls_TLSSocketOptions = TLSSocketOptions;
    type node_zlib_BrotliCompress = BrotliCompress;
    type node_zlib_BrotliDecompress = BrotliDecompress;
    type pty = IPty;
}