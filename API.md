# API References

## Application & Router

- Application Options:

  - `server`: Allows to optionally override the HTTP server instance to be used.

    > Default: `undefined`.

  - `views`: An object to configuration [render](#resrenderview--options--callback) function.

    > Default: `undefined`.

    - `dir`: A directory for the application's views.

    - `ext`: The default engine extension to use when omitted.

    - `engine`: Registers the given template engine.

- Router Options:

  - `prefix`: Allow append the path before each route.

    > Default: `undefined`.

#### get(route, handler [, handler...])

> Routes HTTP GET requests to the specified path with the specified handler functions.

#### post(route, handler [, handler...])

> Routes HTTP POST requests to the specified path with the specified handler functions.

#### put(route, handler [, handler...])

> Routes HTTP PUT requests to the specified path with the specified handler functions.

#### patch(route, handler [, handler...])

> Routes HTTP PATCH requests to the specified path with the specified handler functions.

#### delete(route, handler [, handler...])

> Routes HTTP DELETE requests to the specified path with the specified handler functions.

#### head(route, handler [, handler...])

> Routes HTTP HEAD requests to the specified path with the specified handler functions.

#### options(route, handler [, handler...])

> Routes HTTP OPTIONS requests to the specified path with the specified handler functions.

#### trace(route, handler [, handler...])

> Routes HTTP TRACE requests to the specified path with the specified handler functions.

#### connect(route, handler [, handler...])

> Routes HTTP CONNECT requests to the specified path with the specified handler functions.

#### all(route, handler [, handler...])

> This method accepts all of HTTP method of the request, such as GET, PUT, POST.

#### app.use(route, handler [, handler...])

> Mounts the specified middleware function or functions at the specified path: the middleware function is executed when the base of the requested path matches path.

## Request

The req object is an enhanced version of Node’s own request object and supports all [built-in fields and methods](https://nodejs.org/api/http.html#http_class_http_incomingmessage).

#### req.body

> Contains key-value pairs of data submitted in the request body. By default, it is `undefined`, and is populated when you use body-parsing middleware.

#### req.host

> Contains the hostname derived from the Host HTTP header (included connection port).

#### req.hostname

> Contains the hostname derived from the Host HTTP header.

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

#### req.secure

> A Boolean property that is true if a TLS connection is established.

#### req.query

> This property is an object containing a property for each query string parameter in the route. When query parser is set to disabled, it is an empty object `{}`, otherwise it is the result of the configured query parser.

## Response

The res object is an enhanced version of Node’s own response object and supports all [built-in fields and methods](https://nodejs.org/api/http.html#http_class_http_serverresponse).

#### res.cache

> Get [Cache](#Cache) from application options.

#### res.header(name, value)

> Sets headers on the response.

#### res.json(data [, options])

> Sends a JSON response. This method sends a response (with the correct content-type) that is the parameter converted to a JSON string using [JSON.stringify()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify).<br><br>The parameter can be any JSON type, including object, array, string, Boolean, number, or null, and you can also use it to convert other values to JSON.

#### res.jsonp(data [, options])

> Sends a JSON response with JSONP support. This method is identical to res.json(), except that it opts-in to JSONP callback support.

#### res.redirect(status, path)

> Redirects to the URL derived from the specified path, with specified status, a positive integer that corresponds to an [HTTP status code](http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html) . If not specified, status defaults to “302 “Found”.

#### res.redirect(path [, status])

> Redirects to the URL derived from the specified path, with specified status, a positive integer that corresponds to an [HTTP status code](http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html) . If not specified, status defaults to “302 “Found”.

#### res.render(view [, options] [, callback])

> Renders a view and sends the rendered HTML string to the client. Optional parameters:
>
> - `options`: An object whose properties define local variables for the view.
> - `callback`: A callback function. If provided, the method returns both the possible error and rendered string, but does not perform an automated response. When an error occurs, the method invokes onError(err, req, res) internally.

#### res.send(data [, options])

> Sends the HTTP response.The body parameter can be a Buffer object, a String, an object, Boolean, or an Array.

#### res.cookie(name, value [, options])

> Sets cookie name to value. The value parameter may be a string or object converted to JSON.
> `options`: An object to configuration the [`Set-Cookie`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#attributes) in header.

#### res.clearCookie(name [, options])

> Clears the cookie specified by name. For details about the options object, see [res.cookie()](#rescookiename-value--options).

#### res.sendFile(path, [, options])

> Transfers the file at the given path. Sets the Content-Type response HTTP header field based on the filename’s extension.
>
> Options:
>
> - `headers`: The addition headers.

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

#### delete(key)

> Removes item from cache.
