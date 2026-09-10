
import message_inspection from "../services/message_inspection.ts";
import node from "../core/node.ts";
import send from "./send.ts";

const receiver = function transmit_receiver(this:websocket_client, buf:Buffer):void {
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

    const socket:websocket_client = this as websocket_client,
        frame_reader = function transmit_receiver_frameReader(input:Buffer):websocket_frame {
            const bits0:string = input[0].toString(2).padStart(8, "0"), // bit string - convert byte number (0 - 255) to 8 bits
                mask:boolean = input[1] > 127,
                len:number = (mask === true)
                    ? input[1] - 128
                    : input[1],
                keyOffset:number = (mask === true)
                    ? 4
                    : 0,
                startByte:number = (len < 126)
                    ? 2 + keyOffset
                    : (len === 126)
                        ? 4 + keyOffset
                        : 10 + keyOffset,
                lengthExtended:number = (len < 126)
                    ? (len === 0)
                        ? input.length - startByte
                        : len
                    : (len === 126)
                        ? input.subarray(2, 4).readUInt16BE(0)
                        : input.subarray(4, 10).readUIntBE(0, 6);
            return {
                extended: lengthExtended,
                fin: (input[0] > 127),
                len: len,
                mask: mask,
                maskKey: (mask === true)
                    ? input.subarray(startByte - 4, startByte)
                    : null,
                opcode: ((Number(bits0.charAt(4)) * 8) + (Number(bits0.charAt(5)) * 4) + (Number(bits0.charAt(6)) * 2) + Number(bits0.charAt(7))),
                rsv1: (bits0.charAt(1) === "1"),
                rsv2: (bits0.charAt(2) === "1"),
                rsv3: (bits0.charAt(3) === "1"),
                size_buffer: socket.buffer.length,
                size_fragment: 0,
                startByte: startByte
            };
        },
        unmask = function transmit_receiver_unmask(input:Buffer, key:Buffer):Buffer {
            if (key !== null) {
                // RFC 6455, 5.3.  Client-to-Server Masking
                // j                   = i MOD 4
                // transformed-octet-i = original-octet-i XOR masking-key-octet-j
                input.forEach(function transmit_receiver_unmask_each(value:number, index:number):void {
                    input[index] = value ^ key[index % 4];
                });
            }
            return input;
        },
        evaluation = function transmit_receiver_evaluation():void {
            let frame:websocket_frame = null;
            const payload:Buffer = (function transmit_receiver_evaluation_payload():Buffer {
                // Payload processing must contend with these 4 constraints:
                // 1. Message Fragmentation - RFC6455 allows messages to be fragmented from a single transmission into multiple transmission frames independently sent and received.
                // 2. Header Separation     - Firefox sends frame headers separated from frame bodies.
                // 3. Node Concatenation    - If Node.js receives message frames too quickly the various binary buffers are concatenated into a single deliverable to the processing application.
                // 4. TLS Max Packet Size   - TLS forces a maximum payload size of 65536 bytes.
                //
                // Segmentation Order:
                // 1. Messages frames must not be inter-spliced with frames from other messages, except for control frames
                // 2. Messages can be divided into a base frame and 0 or more continuation frames.  Browsers appear to segment messages into a maximum frame size of 65536 unencrypted or 16384 under TLS.
                // 3. Frames can be further divided to contend with network constraints and traffic congestion.
                // 4. Multiple frames can be joined into a single buffer from a single data event.

                let fragment:Buffer = null;
                if (recursion === false) {
                    // 1. add the latest data to the existing buffer of socket data
                    socket.buffer = Buffer.concat([socket.buffer, buf]);

                    // 2. evaluate the frame header if one is not stored
                    if (socket.frame === null) {
                        socket.frame = frame_reader(socket.buffer);
                        socket.frame.size_fragment = buf.length;
                    }
                }

                // 3. exit when the current buffer is smaller than the frame size
                if (socket.buffer.length < socket.frame.extended + socket.frame.startByte) {
                    recursion = false;
                    return null;
                }

                // 4. externalize the current frame data
                frame = socket.frame;

                // 5. unmask the complete frame
                fragment = unmask(socket.buffer.subarray(frame.startByte, frame.startByte + frame.extended), frame.maskKey);

                // 6. if the frame is a data frame add it to the list of message fragments.
                // data messages can comprise multiple frames that must come in order without intermixing
                // control messages are single frames and can be intermixed between frames of a single data message
                if (frame.opcode < 8) {
                    socket.fragments.push(fragment);
                }

                // 7. remove the frame data from the socket's buffer
                socket.buffer = socket.buffer.subarray(frame.startByte + frame.extended);

                // 8. evaluate the next frame header from the remaining buffer data, if any, to determine needs for recursion
                socket.frame = (socket.buffer.length < 2)
                    ? null
                    : frame_reader(socket.buffer);
                recursion = (socket.frame !== null);
                if (recursion === true) {
                    socket.frame.size_fragment = 0;
                }

                // 9. if the the current frame header has the fin bit then build the payload from the "fragments" array and clear that array
                if (frame.fin === true) {
                    const output:Buffer = (frame.opcode < 8)
                        ? Buffer.concat(socket.fragments)
                        : fragment;
                    if (frame.opcode < 8) {
                        socket.fragments = [];
                    }
                    return output;
                }
                return null;
            }());

            if (payload === null) {
                return;
            }
            if (frame.opcode === 8) {
                // socket close
                payload[0] = 136;
                payload[1] = (frame.mask === true)
                    ? payload[1] - 128
                    : payload[1];
                send(payload, socket, 8);
                setTimeout(function transmit_receiver_evaluation_delay():void {
                    socket.destroy();
                }, 500);
            } else if (frame.opcode === 9) {
                // respond to "ping" as "pong"
                send(payload, socket, 10);
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
                socket.handler(socket, payload, frame);
                message_inspection.send({
                    count: 0,
                    direction: "in",
                    maximum_size: 0,
                    message: new node.stringDecoder.StringDecoder("utf8").end(payload),
                    service: socket.server_hash,
                    throttle_size: 0,
                    throttle_time: 0,
                    type: "web-server"
                });
            }
        };
    let recursion:boolean = false;
    do {
        evaluation();
    // @ts-expect-error the value is assigned from a child function
    } while (recursion === true);
};

export default receiver;