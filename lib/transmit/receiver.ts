
import send from "./send.js";
import socket_end from "./socketEnd.js";

const receiver = function transmit_receiver(buf:Buffer):void {
    //    RFC 6455, 5.2.  Base Framing Protocol
    //     0                   1                   2                   3
    //     0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
    //    +-+-+-+-+-------+-+-------------+-------------------------------+
    //    |F|R|R|R| opcode|M| Payload len |    Extended payload length    |
    //    |I|S|S|S|  (4)  |A|     (7)     |             (16/64)           |
    //    |N|V|V|V|       |S|             |   (if payload len==126/127)   |
    //    | |1|2|3|       |K|             |                               |
    //    +-+-+-+-+-------+-+-------------+ - - - - - - - - - - - - - - - +
    //    |     Extended payload length continued, if payload len == 127  |
    //    + - - - - - - - - - - - - - - - +-------------------------------+
    //    |                               |Masking-key, if MASK set to 1  |
    //    +-------------------------------+-------------------------------+
    //    | Masking-key (continued)       |          Payload Data         |
    //    +-------------------------------- - - - - - - - - - - - - - - - +
    //    :                     Payload Data continued ...                :
    //    + - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - +
    //    |                     Payload Data continued ...                |
    //    +---------------------------------------------------------------+

    // eslint-disable-next-line no-restricted-syntax
    const socket:websocket_client = this as websocket_client,
        data:Buffer = (function transmit_receiver_data():Buffer {
            if (buf !== null && buf !== undefined) {
                socket.frame = Buffer.concat([socket.frame, buf]);
            }
            if (socket.frame.length < 2) {
                return null;
            }
            return socket.frame;
        }()),
        extended = function transmit_receiver_extended(input:Buffer):websocket_meta {
            const mask:boolean = (input[1] > 127),
                len:number = (mask === true)
                    ? input[1] - 128
                    : input[1],
                keyOffset:number = (mask === true)
                    ? 4
                    : 0;
            if (len < 126) {
                return {
                    lengthExtended: len,
                    lengthShort: len,
                    mask: mask,
                    startByte: 2 + keyOffset
                };
            }
            if (len < 127) {
                return {
                    lengthExtended: input.subarray(2, 4).readUInt16BE(0),
                    lengthShort: len,
                    mask: mask,
                    startByte: 4 + keyOffset
                };
            }
            return {
                lengthExtended: input.subarray(4, 10).readUIntBE(0, 6),
                lengthShort: len,
                mask: mask,
                startByte: 10 + keyOffset
            };
        },
        frame:websocket_frame = (function transmit_receiver_frame():websocket_frame {
            if (data === null) {
                return null;
            }
            const bits0:string = data[0].toString(2).padStart(8, "0"), // bit string - convert byte number (0 - 255) to 8 bits
                meta:websocket_meta = extended(data);
            return {
                fin: (data[0] > 127),
                rsv1: (bits0.charAt(1) === "1"),
                rsv2: (bits0.charAt(2) === "1"),
                rsv3: (bits0.charAt(3) === "1"),
                opcode: ((Number(bits0.charAt(4)) * 8) + (Number(bits0.charAt(5)) * 4) + (Number(bits0.charAt(6)) * 2) + Number(bits0.charAt(7))),
                mask: meta.mask,
                len: meta.lengthShort,
                extended: meta.lengthExtended,
                maskKey: (meta.mask === true)
                    ? data.subarray(meta.startByte - 4, meta.startByte)
                    : null,
                startByte: meta.startByte
            };
        }()),
        unmask = function transmit_receiver_unmask(input:Buffer):Buffer {
            if (frame.mask === true) {
                // RFC 6455, 5.3.  Client-to-Server Masking
                // j                   = i MOD 4
                // transformed-octet-i = original-octet-i XOR masking-key-octet-j
                input.forEach(function transmit_receiver_unmask_each(value:number, index:number):void {
                    input[index] = value ^ frame.maskKey[index % 4];
                });
            }
            return input;
        },
        payload:Buffer = (function transmit_receiver_payload():Buffer {
            // Payload processing must contend with these 4 constraints:
            // 1. Message Fragmentation - RFC6455 allows messages to be fragmented from a single transmission into multiple transmission frames independently sent and received.
            // 2. Header Separation     - Firefox sends frame headers separated from frame bodies.
            // 3. Node Concatenation    - If Node.js receives message frames too quickly the various binary buffers are concatenated into a single deliverable to the processing application.
            // 4. TLS Max Packet Size   - TLS forces a maximum payload size of 65536 bytes.
            if (frame === null) {
                return null;
            }
            let complete:Buffer = null;
            const size:number = frame.extended + frame.startByte,
                len:number = socket.frame.length;
            if (len < size) {
                return null;
            }
            complete = unmask(socket.frame.subarray(frame.startByte, size));
            socket.frame = socket.frame.subarray(size);

            return complete;
        }());

    if (payload === null) {
        return;
    }

    if (frame.opcode === 8) {
        // socket close
        data[0] = 136;
        data[1] = (data[1] > 127)
            ? data[1] - 128
            : data[1];
        const payload:Buffer = Buffer.concat([data.subarray(0, 2), unmask(data.subarray(2))]);
        socket.write(payload);
        socket_end(socket);
    } else if (frame.opcode === 9) {
        // respond to "ping" as "pong"
        send(data.subarray(frame.startByte), socket, 10);
    } else if (frame.opcode === 10) {
        // pong
        const payloadString:string = payload.toString(),
            pong:websocket_pong = socket.pong[payloadString],
            time:bigint = process.hrtime.bigint();
        if (pong !== undefined) {
            if (time < pong.start + pong.ttl) {
                clearTimeout(pong.timeOut);
                pong.callback(null, time - pong.start);
            }
            delete socket.pong[payloadString];
        }
    } else {
        const segment:Buffer = Buffer.concat([socket.fragment, payload]);
        // this block may include frame.opcode === 0 - a continuation frame
        socket.frameExtended = frame.extended;
        if (frame.fin === true) {
            socket.handler(segment.subarray(0, socket.frameExtended));
            socket.fragment = segment.subarray(socket.frameExtended);
        } else {
            socket.fragment = segment;
        }
    }
    if (socket.frame.length > 2) {
        transmit_receiver(null);
    }
};

export default receiver;