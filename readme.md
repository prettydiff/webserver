# Web Server
Serves and proxies HTTP over WebSockets for both TCP and TLS.

<!-- cspell: words pihole, webserver -->

## About
* Built in proxy and redirection
* Single port for both HTTP and WebSocket service
* Simple TLS service with certificate generator
* Allows creation of multiple servers from a single simple config file
* Stream any supported media through the browser no matter the size
* More intelligent HTTP file system directory list

This application defaults all transmissions to TCP socket streams without further assumption.
In this browser this mostly means it serves HTTP over WebSockets.
Upon first data of a new socket the application will first determine if the socket represents the default domain and everything else is supported as a proxy.
The proxies of TLS sockets are also TLS.

Local domains are further evaluated to determine if the given socket represents HTTP traffic or WebSocket traffic.
Because the server provides HTTP and WebSocket support over raw TCP sockets both HTTP and WebSocket traffic are supported over the same port to the server.

## Installation
1. Install [Node.js](https://nodejs.org/)
2. Install [git](https://git-scm.com/)
3. Execute `git clone https://github.com/prettydiff/webserver.git`
4. Execute `cd webserver`
5. Execute `node install.js`
6. Customize the `config.json` file to fit your preferences.
7. Run the services according to your operating system's service management or as an application with command `npm run server`.

## TLS support
This application provides support for TLS to all locally administered domain names.
It does not install the generated certificates into either the operating system or installed web browsers.
This means the server works perfectly well to send and receive TLS encrypted traffic, but it also means web browsers will complain about untrusted certificates the first time they access a supported domain.

## Commands
* Build the application execute: `npm run build`
* Generate TLS certificates: `npm run certificate`
* Execute the application: `npm run server`
* Validate application logic: `npm run tsc`
* Run the project lint rules: `npm run lint`
* Build yt-dlp configuration files for downloading media from YouTube: `npm run yt_config name_of_server`

## Configuration
A `config.json` file is required at project root.
This configuration file is essentially an object listing one or more server configurations.

### Schema and Syntax
Here is the expected configuration schema as a TypeScript interface.
* Property names ending with a question mark, **?**, are optional properties and may be ignored. All other property names are required. 
* The `[key:string]` bit of code represents the name of your server in the code.  Any string will work.
* The `string[]` bit of code represents a list of variable length whose values are only string types.

```typescript
interface project_config {
    [key:string]: {
        block_list?: {
            host: string[];
            ip: string[];
            referrer: string[];
        };
        domain_local?: string[];
        http?: {
            delete?: string;
            post?: string;
            put?: string;
        };
        path?: {
            storage?: string;
            web_root?: string;
        };
        ports: {
            open: number;
            secure: number;
        };
        redirect_domain?: {
            [key:string]: [string, number];
        };
        redirect_internal?: {
            [key:string]: store_string;
        };
        server_name: string;
    }
}
```

### Property Definitions
* **block_list** - Optional. Connections to the server originating from the given host, ip, or referrer will be destroyed. To the client it looks like no service is available.
* **domain_local** - Optional. Domains and IP addresses provided in this list we be treated as destinations to an HTTP or WebSocket server. All other connections for domains or IP addresses not listed here or in the `redirect_domain` property will be dropped exactly as if they were identified by the block list.
* **http** - Optional. This object stores command line instructions for how to handle HTTP methods *delete*, *post*, and *put*.  If these values are not provided the server will return an HTTP status of *403* for these request method types.
* **path.storage** - Optional. An absolute file path where the server should store things it wishes to write to the file system.  When this is absent it will default to `/lib/assets/[server_name]` where `[server_name]` is the server's name.
* **path.web_root** - Optional. An absolute file path where the server should serve client facing web assets like HTML, CSS, and JavaScript.  When this is absent it will default to `/lib/assets/[server_name]` where `[server_name]` is the server's name.
* **ports.open** - Required. The port number to serve unencrypted protocols HTTP and WS.
* **ports.secure** - Required. The port number to serve encrypted protocols HTTPS and WSS.
* **redirect_domain** - Optional. An object storing domain names and where to redirect them to.
   * In the value the first index, a string, is the hostname where to redirect the domain to. An empty string or null value suggests to redirect the domain to a different port on the same machine.
   * The value in the second index, a number, identifies the port where to redirect the domain to.
   * If a given domain requires separate ports for both encrypted and unencrypted traffic simply specify the encrypted name instance with a `.secure` extension.
* **redirect_internal** - Optional. Redirects a requested resource from one location on the current server to a different location. This redirection only occurs on the server out of sight from the user and alters the response content but it does not modify the address of the request.
* **server_name** - Required. This stores a proper human readable name of the server.

### config.json Example
```json
{
    "cheney": {
        "domain_local": ["www.x", "linux.x"],
        "http": {
            "delete": "~/scripts/delete.sh",
            "post": "~/scripts/post.sh",
            "put": "~/scripts/put.sh"
        },
        "path": {
            "storage": "/srv/disk/yt_download/",
            "web_root": ""
        },
        "ports": {
            "open": 80,
            "secure": 443
        },
        "redirect_domain": {
            "jellyfin.x": ["", 3002],
            "jellyfin.x.secure": ["", 3003],
            "mealie.x": ["", 3004],
            "youtube.x": ["", 3001]
        },
        "redirect_internal": {
            "linux.x": {
                "/": "/linux/"
            },
            "pihole.x": {
                "/*": "/admin/"
            }
        },
        "server_name": "Cheney"
    }
}
```

#### Notes About the Example config.json
* Notice there is no *block_list* property.  Those are optional so they, and other optional properties, can be omitted.
* The properties of the `http` object each take a shell command.  This application supports HTTP methods for *DELETE*, *POST*, and *PUT* but does not execution actions upon those methods.  Instead this application passes off that execution to external applications as a child process executed through a shell.
* Notice that *path.web_root* is assigned an empty string, so it will resolve to the default location for this server: `/lib/assets/cheney/`.
* If ports are not included the application will fail with an error message.
* In *redirect_domain* noticed the two keys `jellyfin.x` and `jellyfin.x.secure`.  Any encrypted traffic for the `jellyfin.x` domain will be redirected to port 3003.  `jellyfin.x.secure` will not be considered a domain.
* Notice that domain `linux.x` is specified in the *domain_local* list and is also specified in the *redirect_internal* property.
   * All traffic bound for domain *linux.x* will receive responses from the same local server that is serving `www.x` without direction to a different server.
   * All requests for resource `/` on `linux.x` will be redirected to file system location `/linux/index.html` relative to the *path.web_root* location on server *Cheney* due to the rule in *redirect_internal*.
   * To the user they will see `http://linux.x/` or `https://linux.x/` in their browser address bar, but its really just the same service responses as from domain `www.x` with web content served from relative file system path `/linux/`.

### Certificates
This application provides a configuration file to generate TLS certificates using OpenSSL.
OpenSSL is not included with this application.
These certificates are required to run a TLS server.

To generate the certificates simply run: `npm run certificate`.
The required extensions.cnf file is dynamically created from the build command, `npm run build`, and includes all domains mentioned in the *port_map* object of the `config.json` file.

## Defaults
* Both HTTP and WS are served from the same port while HTTPS and WSS protocols are also served from the same port.
* The default content type, when unknown, is `text/plain; utf8`.
* All relative paths are relative to `path.web_root` from the config file.
* The default HTML file name is `index.html`. If a request for a resource resolves a directory the server will look for a `index.html` file in that directory and return the contents of that file.

## More Servers
To add more servers follow these steps:
1. Just update the config.json file. With another server object.  In the example above there is one server named *cheney*, so just add more server objects.
2. Note that the **ports must be unique** or the application will generate an error.

## How the Proxy Works
### Code
Its as simple as `socket.pipe(proxy);proxy.pipe(socket);` where *socket* and *proxy* are each TCP or TLS socket streams.

## Limitations
### HTTP Methods
Currently this application only supports the **CONNECT**, **DELETE**, **GET**, **HEAD**, **POST**, and **PUT** methods of HTTP.
Other method support will come in the future as this project matures.
In the mean time save yourself great frustration and just use WebSockets instead.

### HTTP Features
Support for [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) and [keep-alive headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Keep-Alive) is not written yet.

### HTTP Versions
Currently only [HTTP 1.0](https://datatracker.ietf.org/doc/html/rfc1945) and [HTTP 1.1](https://datatracker.ietf.org/doc/html/rfc2616) versions of HTTP are supported.
This application preferences [WebSockets](https://datatracker.ietf.org/doc/html/rfc6455) for asynchronous, real-time, streamed, and bi-directional communication.
In most cases WebSockets provide greater flexibility and performance than HTTP for data messaging.