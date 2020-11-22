# API References

## Application & Router

- Application Options:

  - `server`: Allows to optionally override the HTTP server instance to be used.

    > Default: `undefined`.

  - `onError`: A handler when an error is thrown.

    > Default: `((error, req, res) => res.send(error))`.

  - `onNotFound`: A handler when no route definitions were matched.

    > Default: `((req, res) => res.send("Cannot " + req.method + " " + req.url))`.

- Router Options:

  - `prefix`: Allow append the path before each route.

    > Default: `undefined`.

#### get(route, handler, handler, [, handler...])

> Routes HTTP GET requests to the specified path with the specified handler functions.

#### post(route, handler, [, handler...])

> Routes HTTP POST requests to the specified path with the specified handler functions.

#### put(route, handler, [, handler...])

> Routes HTTP PUT requests to the specified path with the specified handler functions.

#### patch(route, handler, [, handler...])

> Routes HTTP PATCH requests to the specified path with the specified handler functions.

#### delete(route, handler, [, handler...])

> Routes HTTP DELETE requests to the specified path with the specified handler functions.

#### head(route, handler, [, handler...])

> Routes HTTP HEAD requests to the specified path with the specified handler functions.

#### options(route, handler, [, handler...])

> Routes HTTP OPTIONS requests to the specified path with the specified handler functions.

#### trace(route, handler, [, handler...])

> Routes HTTP TRACE requests to the specified path with the specified handler functions.

#### all(route, handler, [, handler...])

> This method accepts all of HTTP method of the request, such as GET, PUT, POST.

#### app.use(route, handler [, handler...])

> Mounts the specified middleware function or functions at the specified path: the middleware function is executed when the base of the requested path matches path.

## Request

The req object is an enhanced version of Node’s own request object and supports all [built-in fields and methods](https://nodejs.org/api/http.html#http_class_http_incomingmessage).

#### req.body

> Contains key-value pairs of data submitted in the request body. By default, it is `undefined`, and is populated when you use body-parsing middleware.

#### req.hash

> The hash property of the [URL](https://developer.mozilla.org/en-US/docs/Web/API/URL) interface is a [USVString](https://developer.mozilla.org/en-US/docs/Web/API/USVString) containing a '#' followed by the fragment identifier of the URL.

#### req.host

> Contains the hostname derived from the Host HTTP header (included connection port).

#### req.hostname

> Contains the hostname derived from the Host HTTP header.

#### req.location

> The current url (included connection port).

#### req.originalUrl

> This property is much like req.url; however, it retains the original request URL, allowing you to rewrite req.url freely for internal routing purposes.

#### req.params

> An object containing parameter values parsed from the URL path.<br><br>For example if you have the route `/user/:name`, then the "name" from the URL path wil be available as `req.params.name`. This object defaults to `{}`.

#### req.path

> Contains the path part of the request URL.

#### req.port

> The connection port.

#### req.protocol

> Contains the request protocol string: either http or (for TLS requests) https.

#### req.query

> This property is an object containing a property for each query string parameter in the route. When query parser is set to disabled, it is an empty object `{}`, otherwise it is the result of the configured query parser.

## Response

The res object is an enhanced version of Node’s own response object and supports all [built-in fields and methods](https://nodejs.org/api/http.html#http_class_http_serverresponse).

#### res.cache

> Get [Cache](#Cache) from application options.

#### res.header(name, value)

> Sets headers on the response.

#### res.json(data, [, options])

> Sends a JSON response. This method sends a response (with the correct content-type) that is the parameter converted to a JSON string using [JSON.stringify()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify).<br><br>The parameter can be any JSON type, including object, array, string, Boolean, number, or null, and you can also use it to convert other values to JSON.

#### res.jsonp(data, [, options])

> Sends a JSON response with JSONP support. This method is identical to res.json(), except that it opts-in to JSONP callback support.

#### res.redirect(status, path)

> Redirects to the URL derived from the specified path, with specified status, a positive integer that corresponds to an [HTTP status code](http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html) . If not specified, status defaults to “302 “Found”.

#### res.redirect(path, [status])

> Redirects to the URL derived from the specified path, with specified status, a positive integer that corresponds to an [HTTP status code](http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html) . If not specified, status defaults to “302 “Found”.

#### res.send(data, [, options])

> Sends the HTTP response.The body parameter can be a Buffer object, a String, an object, Boolean, or an Array.

#### res.status(code)

> Sets the HTTP status for the response. It is a chainable alias of Node’s [response.statusCode](http://nodejs.org/api/http.html#http_response_statuscode).

## Cache

#### clear()

> Reset the cache(s) and counter.

#### has(key)

> Check if the cache has the given key.

#### get(key)

> Get the assigned value for a given key. Will return `undefined` if the cache has evicted `key` or never contained it.

#### set(key, value)

> Persist an item to the cache by a given `key` name.
