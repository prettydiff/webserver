
import error from "../utilities/error.js";
import vars from "../utilities/vars.js";

const send = function transmit_send(body:Buffer|socket_data, socketItem:websocket_client, opcode:number):void {
    const writeFrame = function transmit_send_writeFrame():void {
            const writeCallback = function transmit_send_writeFrame_writeCallback():void {
                socketItem.queue.splice(0, 1);
                if (socketItem.queue.length > 0) {
                    transmit_send_writeFrame();
                } else {
                    socketItem.status = "open";
                }
            };
            if (socketItem.status === "open") {
                socketItem.status = "pending";
            }
            if (socketItem.write(socketItem.queue[0]) === true) {
                writeCallback();
            } else {
                socketItem.once("drain", writeCallback);
            }
        },
        socketData:socket_data = body as socket_data,
        isBuffer:boolean = (socketItem === undefined || socketItem === null)
            ? false
            :  (socketData.service === undefined),
        stringBody:string = (isBuffer === true)
            ? null
            : JSON.stringify(socketData);
    let dataPackage:Buffer = (isBuffer === true)
        ? body as Buffer
        : Buffer.from(stringBody);
    if (socketItem === undefined || socketItem === null) {
        return;
    }
    // OPCODES
    // ## Messages
    // 0 - continuation - fragments of a message payload following an initial fragment
    // 1 - text message
    // 2 - binary message
    // 3-7 - reserved for future use
    //
    // ## Control Frames
    // 8 - close, the remote is destroying the socket
    // 9 - ping, a connectivity health check
    // a - pong, a response to a ping
    // b-f - reserved for future use
    //
    // ## Notes
    // * Message frame fragments must be transmitted in order and not interleaved with other messages.
    // * Message types may be supplied as buffer or socketData types, but will always be transmitted as buffers.
    // * Control frames are always granted priority and may occur between fragments of a single message.
    // * Control frames will always be supplied as buffer data types.
    //
    // ## Masking
    // * All traffic coming from the browser will be websocket masked.
    // * I have not tested if the browsers will process masked data as they shouldn't according to RFC 6455.
    // * This application supports both masked and unmasked transmission so long as the mask bit is set and a 32bit mask key is supplied.
    // * Mask bit is set as payload length (up to 127) + 128 assigned to frame header second byte.
    // * Mask key is first 4 bytes following payload length bytes (if any).
    if (opcode === 1 || opcode === 2 || opcode === 3 || opcode === 4 || opcode === 5 || opcode === 6 || opcode === 7) {
        const fragmentSize:number = (socketItem.type === "browser")
                ? 0
                : 1e6,
            op:1|2 = (isBuffer === true)
                ? 2
                : 1,
            fragmentation = function transmit_send_fragmentation(first:boolean):void {
                let finish:boolean = false;
                const frameBody:Buffer = (function transmit_send_fragmentation_frameBody():Buffer {
                        if (fragmentSize < 1 || len === fragmentSize) {
                            finish = true;
                            return dataPackage;
                        }
                        const fragment:Buffer = dataPackage.subarray(0, fragmentSize);
                        dataPackage = dataPackage.subarray(fragmentSize);
                        len = dataPackage.length;
                        if (len < fragmentSize) {
                            finish = true;
                        }
                        return fragment;
                    }()),
                    size:number = frameBody.length,
                    frameHeader:Buffer = (function transmit_send_fragmentation_frameHeader():Buffer {
                        // frame 0 is:
                        // * 128 bits for fin, 0 for unfinished plus opcode
                        // * opcode 0 - continuation of fragments
                        // * opcode 1 - text (total payload must be UTF8 and probably not contain hidden control characters)
                        // * opcode 2 - supposed to be binary, really anything that isn't 100& UTF8 text
                        // ** for fragmented data only first data frame gets a data opcode, others receive 0 (continuity)
                        const frame:Buffer = (size < 126)
                            ? Buffer.alloc(2)
                            : (size < 65536)
                                ? Buffer.alloc(4)
                                : Buffer.alloc(10);
                        frame[0] = (finish === true)
                            ? (first === true)
                                ? 128 + op
                                : 128
                            : (first === true)
                                ? op
                                : 0;
                        // frame 1 is length flag
                        frame[1] = (size < 126)
                            ? size
                            : (size < 65536)
                                ? 126
                                : 127;
                        if (size > 125) {
                            if (size < 65536) {
                                frame.writeUInt16BE(size, 2);
                            } else {
                                frame.writeUIntBE(size, 4, 6);
                            }
                        }
                        return frame;
                    }());
                socketItem.queue.push(Buffer.concat([frameHeader, frameBody]));
                if (finish === true) {
                    if (socketItem.status === "open") {
                        writeFrame();
                    }
                } else {
                    transmit_send_fragmentation(false);
                }
            };
        let len:number = dataPackage.length;
        fragmentation(true);
    } else if (opcode === 8 || opcode === 9 || opcode === 10 || opcode === 11 || opcode === 12 || opcode === 13 || opcode === 14 || opcode === 15) {
        const frameHeader:Buffer = Buffer.alloc(2),
            frameBody:Buffer = dataPackage.subarray(0, 125);
        frameHeader[0] = 128 + opcode;
        frameHeader[1] = frameBody.length;
        socketItem.queue.unshift(Buffer.concat([frameHeader, frameBody]));
        if (socketItem.status === "open") {
            writeFrame();
        }
    } else {
        error([
            `Error queueing message for socket transmission. Opcode ${vars.text.angry + String(opcode) + vars.text.none} is not supported.`
        ], null);
    }
};

export default send;