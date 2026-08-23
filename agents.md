# AGENTS
<!-- cspell: words DTLS, Ryzen -->

## License
AGPLv3.
This license was chosen because it contains some features users might find desirable while they might otherwise not find the application itself desirable.
As an author my preference is to promote the full application instead of allowing users to take feature code away without credit.

## Dependencies
Aside from ESLint execution all dependencies are embedded with the application except OpenSSL, Node.js, and optionally Docker.
OpenSSL ships with most modern Linux distributions and becomes available to Windows' shells with installation of git.

## Execution
### Application Execution
`npm run tsc` runs the application.

To run the application in administrative mode on Windows run the same command from an administrative shell.

To run the application in administrative mode on other operating systems use the *sudo* command but point to the full path of the Node binary and the file *lib/index.ts*.
A linux example of administrative execution: `sudo /home/user/.nvm/versions/node/v26.7.0/bin/node lib/index.ts`.
It is recommend to execute the application as an operating system service, such as a systemd service on Linux.

#### Security Warning
It is recommended to execute the application with administrative access for Docker support.
The internal command terminal will execute according the privilege level provided the application.
Be aware this application exposes a great deal of control and system data to public access via a web browser.
When this data should be restricted, such as on a public access web server, it is strongly recommended to change the dashboard server's *mutual_tls* option to true.
The *mutual_tls* option forces all connections to be encrypted and requests a client certificate signed by the server's intermediate certificate.
A *mutual_tls* enabled server will drop all connections that do not conform at the earliest moment.

#### Additional Warning about Mutual TLS
Servers with *mutual_tls* enabled are subject to port inspection.
This occurs because mutual TLS is a secondary handshake that occurs after the regular TLS handshake, which identifies that the server as running a service on the port even though the connection is immediately dropped before data exchange.
Without mutual TLS enabled any violating connection is dropped earlier, which appears as if the port is not in use.

### Test Automation
`npm run test` runs the basic test automation.

#### Test Automation Arguments
* `browser:<file_path>`      - Provides for an absolute file path for a web browser executable to test against.
                               The file path value can be quoted, but if not quoted then spaces must be escaped according to the given shell's syntax rules.
                               Any arguments following this argument will be passed directly to that web browser.
* `delay-intervals:<number>` - A delay test will halt the test runner until the given test evaluates to true by default.
                               The default delay values retry the test 250 times every 50 milliseconds before returning a failed test.
                               This argument allows changing the number of retries.
* `delay-time:<number>`      - Specifies the time between delay intervals in milliseconds from the default 50 milliseconds.
* `list:<file_name>`         - Specifies a single test list file name to execute starting from the project's test directory at */lib/test*.
* `no-exit`                  - Application remains actively available after completing test automation.
* `stop-on-fail`             - Tells the test runner to stop processing further test lists after the first failed assertion.
* `test`                     - If present this option instructs the application to execute test automation.

#### Test Automation Samples
All test automation samples exist in directory *lib/test* and begin with file name *list_local*.
The test samples are named in this way because all testing currently occurs on the dashboard page in a web browser of the local machine.
I have considered providing shell access/output for the dashboard information or running tests in the browser against remote instances of the application, but these features do not yet exist.

The files in that directory which are not test samples are:

* index.ts determines which test samples to execute according to command line arguments.
* runner.ts is the test runner.
* summary.ts provides a summary of results to the shell.

Any tests should conform the code style of the test sample files.

### TypeScript Validation
`npm run tsc` runs the TypeScript compiler and writes failures to the shell.
Please be aware the test automation definitions may be out dates and are immature.

### ESLint
ESLint executions occurs following these steps:

1. Rename the file `package.json` to `package_x.json`.
2. Rename the file `package_dev.json` to `package.json`.
3. Execute `npm install`.
4. Execute `npm run lint`.
5. Fix any lint violations.
6. Rename the file `package.json` to `package_dev.json`.
7. Rename the file `package_x.json` to `package.json`.
8. Execute `npm install`.
9. Execute `git checkout node_modules/file`.
10. Execute `get checkout node_modules/@lydell`.

The reasoning behind this *package.json* file renaming is that regular users have no intention of running ESLint and ESLint is an extremely insecure application due to its many dependencies.

## Build
### Start Up
This application has no separate build process.
All aspects of a build process are integrated into the application's start up.
The dynamically assembled dashboard page is constructed at application start up.

This application does not output JavaScript from TypeScript files, not even for the browser facing logic.
All code executes as TypeScript making using of Node's type stripping feature for TypeScript.
The browser facing code also makes use of Node's type stripping conventions.

All start up conventions occur from the file `lib/utilities/start_application.ts`.

All data saved by the application is saved into a file named `servers.json`.
All other data is stored in volatile system memory and lost when the application closes.

## Code Style
### General Code Style
A single step of indentation is 4 spaces.
Line terminal is a single *LF* character (\u000a).
There will be no space following a function name or preceding the function's type definition.
There will be a space following the function's type definition.
Comments must be indented according to the line they describe.
Line comments are preferred to block comments.

### Function Names
All functions must be both assigned to a variable and named according to convention.
The naming convention for functions is a series of names separated by underscores.

The first of these underscore separated names is determined by the top level directory under the lib directory.
For example all files under the *lib/transmit* directory will start with *transmit*.

The second of these underscore separated names is the name of the respective file, unit, or module represented by the top level function in the file or the top level module name in the case of an object of functions.

The remaining of these underscore separated names is the name of a child function's parent function identifier.
If such an identifier is itself multiple names separated by underscores the local identifier will become camel cased.

As an example `transmit_broadcast_perServer` is the function name for a function identified as either *perServer* or *per_server*, which is a child of a library named *broadcast* located at *lib/transmit*.
If this function had a child function locally identified or assigned as *multi_part* then its function name would be `transmit_broadcast_perServer_multiPart`.

The purpose of this naming convention is to quickly identify a function's logical location by logical hierarchy in addition to file name and line number.
This adds great clarity as compared to anonymous functions in contexts such as code errors or performance profilers.

### TypeScript Validation
The code must then pass TypeScript Validation.
All variable declarations and functions must receive an explicit TypeScript type descriptor.
This is also validated by the ESLint rules.
Execute TypeScript validation with `npm run tsc`.

All TypeScript definitions must be in the form of TypeScript *primitives*, *type* definitions, or *interface* definitions.
All TypeScript definition in the plurality of files located at *lib/typescript* directory.

TypeScript *type* definitions must only apply to flat unions or array definitions and be defined in the file `lib/typescript/types.d.ts`.
All such *type* definitions must be an underscore separated list of names starting with *type*, for example: `type type_directory_item` defines a simple type properly named.

All other TypeScript definitions will occur as *interfaces*.
Interface names are also an underscore separated collection of names, such as *core_vars_data_store*.
The first of these underscore separated names describes the file containing the interface definition and the second of these names describes a feature, section, or library of the application.
All following underscore separated names describe a logical grouping or relationship in which the interface instances occur in the application.

The *lib/typescript/store.d.ts* stores TypeScript interfaces representing object stores.
In this application an object store refers to an object of any key name storing the same value or structure according to the given interface definition.

The *lib/typescript/service_registry.d.ts* file stores service identifiers.
In this application a formal service name describes a data structure that cross a network interface.
The underscore separated names of a given interface will start with *service*.
The second of these underscore separated names describes the given feature or application section making use of the service.
Each service is followed by a regular language description in the form of a code comment and then one empty line.
At the bottom of this file is a large union of service maps where each index of the union maps an interface definition name to the interface it describes in the form of the *socket_data* format comprising an object of *data* and *service*.

The *lib/typescript/service_supplemental.d.ts* file provides interface definitions that extend the service interfaces defined in *lib/typescript/service_registry.d.ts*.
The interfaces defined here following the same underscore separated naming convention, but the first of these underscore separated names is *supplemental*.

### ESLint
The code must achieve 100% conformance to the project's custom ESLint rule definitions.

## Internal Execution
### Data Structure
The application uses a single object named *vars* from file `lib/core/vars.ts` to store all data not saved in the servers.json file.

This object stores a variety of data for test automation.
Most of the universal data for this application is stored in two trees on this object: *data* and *data_store*.
The *data* object tree contains information relevant for both application operations and user awareness of those operations, largely in the form of services defined in the `lib/typescript/service_registry.d.ts` file.
The *data_store* object stores Node.js created service objects such as the actual web server and their sockets.

### Services
All data structures created by this application that traverse a network interface are called services by this application.
All services are defined in `lib/typescript/services_registry.d.ts` and occur as an instance of the *socket_data* interface matching the pattern: *data* and *service* where service is the interface name describing the data.
This means of data description is created to be more user friendly than a RESTful approach while also achieving superior architectural scale and superior performance.

### Features
This application provides its dashboard content sections a la carte.
The user can choose to disable or enable these content features by changing the respective boolean values in the *features.json* file.

### Networking
The application currently only provides network services for HTTP, WebSockets, and their TLS alternatives.

The application has a feature section for UDP sockets, but it is suppressed by default because this feature is poorly tested against real world practical cases.
This application is awaiting future UDP APIs from Node.js that allow for use of DTLS and support for piped streams.

A web server created from this application is not necessarily a HTTP or WeBSocket server.
It is a socket server on which HTTP or WebSocket messages traverse.
This architecture allows the application to scale towards additional native protocol support in the future.

Socket connectivity management occurs in file `lib/transmit/connection.ts`.
Sockets that are allowed to proceed will be extended by `lib/transmit/socketExtension.ts` which additional information and event handling for this application's management and visibility.

Sockets containing HTTP requests will receive usage of files in directory `lib/http`.

WebSocket messages will be sent from file `lib/transmit/send.ts` and will be received by `lib/transmit/receiver.ts`.
These files prepare message data by properly dividing/assembling the data according to message segmentation and parsing of the data frame headers.

This applications redirects network traffic to alternate locations using proxies.
This application forms proxies using the convention: `socket.pipe(proxy);proxy.pipe(socket);`.

This application makes use of Node APIs to fulfill mutual TLS validation instead of OpenSSL.
This occurs by setting the flag `rejectUnauthorized` to false.
This decision was made because OpenSSL logic is opaque to Node.js logic and therefore challenging to inspect and diagnose.
I could not get OpenSSL validation to work and only realized later the problem was not in OpenSSL, Node.js, or this application but in Windows.
Windows had cached a user added client certificate and refused to update that certificate even once deleted and/or overwritten by an updated certificate.

This application does not support all HTTP features.
This is an intentional decision as the the preference for all messaging by this application is over WebSockets.
HTTP responses occur in the form of `transfer-encoding: chunked` as opposed to using a `content-length` header because this allows writing data from a streamed interface directly to the socket as opposed to reading the entirety of a file into memory first.

WebSocket message segmentation size is a configurable option on a given web server's JSON object.

### Network Performance Testing
This application has its own performance library at file `lib/service/test_performance.ts`.

HTTP testing follows the concept of HTTP 1.1 without a keep alive header.
This means a socket must be created, a request must be sent, a response must be received, and the socket must be closed for a single message iteration to occur.

WebSocket tests allow for multiple conditions:
* Whether to include garbage collection time in the measured test time.
* The size of message segmentation.
* Wether to test only for message sends or total round trip of message send and equivalent response.
* Custom message body, as message size is a factor of performance testing and segmentation.

A WebSocket send experiment occurs by creating a socket, pushing messages onto a message queue, waiting for both the message queue to empty and the socket to drain, and then finally closing the socket.
A WebSocket round trip experiment follows a similar pattern as the send experiment except that before closing the socket a count of messages received matching the message quantity occurs.
The only difference between the garbage collection testing is whether the next test executes from a setTimeout delay of 0 milliseconds.
The 0 millisecond delay forces the next operation onto a new call stack in the event loop, which modifies the order of instruction execution.

### Dashboard Web Page Code
All the browser facing code resides in directory `lib/dashboard` and is dynamically assembled at application start up.
Once the dashboard page is assembled the file stored in memory on the *vars* object.

## Agent Assistance Requests
### Test Automation
Test automation is available but many test scenarios are missing, incomplete, out dated, or some lack maturity.
As such critical regressions occur due to large scale code refactors that should not occur at all.

### Performance
This application has discovered that on a AMD Ryzen 9 9900X CPU it can send 3,250,000 WebSocket messages per 0.002 seconds but spends the remaining 0.998 seconds on garbage collection.
This performance gap exists because the way the application is written the given message is already in memory and so each execution step is a cached operation in CPU cache pushing data onto the network interface buffer and Node's instructions are shallow abstractions to the respective kernel interfaces.
Following the CPU operations the language runtime, V8, must then clear the overhead from memory for each of these execution steps and V8 instructions for memory operations are slower than CPU instructions.
I could use some agent assistance to close this performance gap at each layer.
I only have the means to modify this application code, but the concerned performance opportunities could reside in any of: the operating system, V8, Node.js, or this application.
Knowing what to optimize and where to optimize should assist the direction of this application code.
