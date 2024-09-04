
import http_connect from "./http_connect.js";
import http_get from "./http_get.js";
import http_post from "./http_post.js";

const http:services_http = {
    connect: http_connect,
    delete: http_post,
    get: http_get,
    head: http_get,
    post: http_post,
    put: http_post
};

export default http;