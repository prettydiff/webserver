# Web Server
This is a personal project with libraries adapted from my other big project [share-file-systems](https://github.com/prettydiff/share-file-systems) but with less and with authentication stripped out.

Because this is a personal project I will not include formal documentation except where it immediately benefits my own self maintenance.
For most technical concerns I will just read the code.
The code and its flow control are self evident from reading.

The server only accepts TLS or open TCP connections but not both.
TCP is the default, and is determined by a static option, `secure`, in the `lib/utilities/vars.ts` file.