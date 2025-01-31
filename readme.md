# Web Server
Serves and proxies HTTP over WebSockets for both TCP and TLS.

## About
### General
* All managed through a central browser-based dashboard
* Easy network port management of all supported servers, docker containers, and everything else on the local machine
* Easy management of multiple web servers
* Easy management of multiple docker containers
* Provides a command terminal in the browser
* Provides a HTTP test tool for sending arbitrary requests and receiving responses.
* Provides a DNS lookup tool that can check a custom variety of record types.

### Local Servers
* Built in proxy and redirection of both internally served assets and externally available locations
* All redirection is fully opaque without use of additional HTTP traffic, such as 300 series status codes
* Serves HTTP and WebSockets from a single port
* Simple TLS service with certificate generator
* Allows creation of multiple servers from a single simple config file
* Stream any supported media through the browser no matter the size
* More intelligent HTTP file system directory lists
* Lists all connected sockets to all managed servers
* Servers include a *temporary* option which creates a server with no state management, no changes to the file system, and is fully destroyed once the first connected socket ends

### Docker Containers
* Provides a dashboard list of all managed containers with status in near real time via Docker Compose events.

## Installation
1. Install [Node.js](https://nodejs.org/)
2. Install [git](https://git-scm.com/)
3. Execute `git clone https://github.com/prettydiff/webserver.git`
4. Execute `cd webserver`
5. Execute `node install.js`
7. Run the application: `npm run server`.
6. Access the dashboard in a browser on the specified random port.

## Optional steps to reduce the dependency count to 3:
1. Delete the `node_modules` directory.
2. Delete the `devDependencies` object from the file `package.json`.
3. Execute `npm install`.
4. Restart the application with `npm run server` or your favorite OS service management tool.

## Limitations
### HTTP Methods
Currently this application only supports the **CONNECT**, **DELETE**, **GET**, **HEAD**, **POST**, and **PUT** methods of HTTP on locally created web servers.
Other method support will come in the future as this project matures.
In the mean time save yourself great frustration and just use WebSockets instead.

### HTTP Features
Support for [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) and [keep-alive headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Keep-Alive) is not written yet.

### HTTP Versions
Currently only [HTTP 1.0](https://datatracker.ietf.org/doc/html/rfc1945) and [HTTP 1.1](https://datatracker.ietf.org/doc/html/rfc2616) versions of HTTP are supported.
This application preferences [WebSockets](https://datatracker.ietf.org/doc/html/rfc6455) for asynchronous, real-time, streamed, and bi-directional communication.
In most cases WebSockets provide greater flexibility and performance than HTTP for data messaging.