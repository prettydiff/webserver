# Web Server
Serves and proxies HTTP over WebSockets for both TCP and TLS.

<!-- cspell: words pihole -->

## About

* Built in proxy and redirection
* Single port for both HTTP and WebSocket service
* Simple TLS server with certificate generator
* Stream any supported media through the browser no matter the size
* More intelligent HTTP file system directory list
* Supports end-to-end encryption

This application defaults all transmissions to TCP socket streams without further assumption.
Upon first data of a new socket the application will first determine if the socket represents the default domain and everything else is supported as a proxy.
TLS sockets remain fully encrypted even through the proxy.

Local domains are further evaluated to determine if the given socket represents HTTP traffic or WebSocket traffic.
Because the server provides HTTP and WebSocket support over raw TCP sockets both HTTP and WebSocket traffic are supported over the same port to the server.

Currently only HTTP method GET is supported.
For my own use all other traffic will be sent as WebSocket messages for the default domain.
For other domains all traffic is pushed through a proxy to a separate unrelated service regardless of protocol or message description.

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
* Build yt-dlp configuration files for downloading media from YouTube: `npm run yt_config`

## Configuration
### config.json
A `config.json` file is required at project root that conforms to:

```typescript
interface project_config {
    domain_local: string[];
    path: {
        storage: string;
        web_root: string;
    };
    ports: {
        dashboard?: project_ports;
        service: project_ports;
    };
    redirect_domain: {
        [key:string]: [string, number];
    };
    redirect_internal: {
        [key:string]: {
            [key:string]: string;
        };
    };
    server_name: string;
}

interface project_ports {
    open: number;
    secure: number;
}
```

* The *domain_local* property provides a list of domains that will be locally supported on the server without redirection.
   * The first domain in this list will be the primary identity used in certificate creation.
   * Loopback IP addresses and local device interface IP addresses are automatically added to the *domain_local* list.
* The *path.storage* property is an absolute file system path where applications should download resources to.
* The *path.web_root* property is an absolute file system path where web pages/assets are served from.
* The *redirecT_domain* stores a object of domain names as key names and an array as a value. That array expects two values where the first is a string representing a host value and the second is a number representing a port value.
   * If the host value is undefined, null, or an empty string it will resolve to the IP of the given server.
   * If a service at a given vanity domain requires separate ports for secure and insecure services then specify the secure port with `secure` as the top level domain, as demonstrated in the following code example.
* The *redirect_internal* stores an object where each key name is a supported domain name.  Each value is an object storing HTTP request destination and redirection pairs for within the domain.
   * Wildcard support exists if a HTTP request destination terminates with an asterisk, as demonstrated in the following code example. Static HTTP request destinations are evaluated before wildcard requests.
* The *ports* stores port numbers for the respective spawned servers.
   * *ports.dashboard* is completely optional and, if present, launches servers for a management dashboard.
      * *ports.dashboard.open* is the port number for TCP dashboard server for access via HTTP and WS.
      * *ports.dashboard.secure* is the port number for the TLS dashboard server for access via HTTPS and WSS.
   * *ports.service* is required and stores the ports for the primary web server.
      * *ports.service.open* launches a TCP server for connections from protocols like HTTP and WS.
      * *ports.service.secure* launches a TLS server for encrypted connections like HTTPS and WSS.

Here is an example `config.json` file:

```json
{
    "domain_local": ["pihole.x", "www.x"],
    "path": {
        "storage": "/myWebSite/downloads/",
        "web_root": "/var/httpd/www/"
    },
    "ports": {
        "dashboard": {
            "open": 3010,
            "secure": 3011
        },
        "secure": {
            "open": 80,
            "secure": 443
        }
    },
    "redirect_domain": {
        "pihole.x": ["", 3001],
        "minecraft.x": ["", 3002],
        "linux.x": ["", 3003],
        "linux.x.secure": ["", 3004]
    },
    "redirect_internal": {
        "pihole.x": {
            "/*": "/admin/"
        }
    },
    "server_name": "My Home Server"
}
```

#### Please Note
* Notice in the example the *redirect_domain* instance for `linux.x` and `linux.x.secure`. The application will not consider `linux.x.secure` to be a domain, but will correctly proxy TLS traffic, WSS and HTTPS, to the port specified.
   * In this case http://linux.x/ would redirect to http://127.0.0.1:3003 or http://[::1]:3003.
   * https://linux.x/ would redirect to https://127.0.0.1:3004 or https://[::1]:3004.
   * Since the host name value for all domains in this example is an empty string they will resolve to any address representing the local server.
* Notice in the example the intra-domain redirects for the example *pihole.x* domain.
   * http://pihole.x/ would redirect to http://pihole.x/admin/.
   * http://pihole.x/login.php would redirect to http://pihole.x/admin/login.php.

### Certificates
This application provides a configuration file to generate TLS certificates using OpenSSL.
OpenSSL is not included with this application.
These certificates are required to run a TLS server.

To generate the certificates simply run: `npm run certificate`.
The required extensions.cnf file is dynamically created from the build command, `npm run build`, and includes all domains mentioned in the *port_map* object of the `config.json` file.

## Defaults
* The default content type, when unknown, is `text/plain; utf8`.
* All relative paths are relative to `path.web_root` from the config file.

## How the Proxy Works
### Code
To see how the proxy works simply read two files.
First, look at the `/lib/index.ts` file to see that two servers run, one for each of TCP and TLS.
Second, look at file `/lib/transmit/server.ts` to see the flow control.
Third, look at file `/lib/transmit/createProxy.ts` to see how a proxy socket is created.

### TLS Identification
Incoming sockets are identified as secure or open due to the presence of property `encrypted` from the core Node TLS library.
The socket's corresponding proxy socket will either be a TCP or TLS socket accordingly.

### Socket Management
The most important piece of code for socket evaluation is:
```typescript
            socket.on("error", function transmit_server_connection_handshake_socketError():void {
                // this worthless error trapping prevents an "unhandled error" escalation that breaks the process
                return null;
            });
            socket.once("data", handshake);
```

Sockets without an assigned event handler for the error event will crash the application when an error does occur, so always handle error events.
Secondly, notice the `once` listener for the data event.
That must be `once` and not `on`, otherwise a new listener is assigned for each incoming network message, which also means a new proxy socket created per message as opposed to per socket.
In the example above `handshake` just refers to an event handler to evaluate one of three things:

* default domain HTTP socket
* default domain WebSocket socket
* other domain, which is pushed into a proxy

### Proxy Creation
1. Create a corresponding socket, wether TCP or TLS.
2. Assign some event handler for the error event so that it does not crash the application.
3. Finally pipe data back and forth like in the following example:

```typescript
            config.socket.pipe(proxy);
            proxy.pipe(config.socket);
            proxy.write(config.buffer);
```