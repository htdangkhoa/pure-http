import net from 'net';
import tls from 'tls';
import http from 'http';
import http2 from 'http2';

declare namespace PureHttp {
  export interface IRequest {
    originalUrl: string;

    location?: string;

    protocol?: string;

    host?: string;

    hostname?: string;

    port?: number;

    path?: string;

    search?: string;

    query?: Record<string, string>;

    hash?: string;

    header(name: string): undefined | string | string[];
  }

  export interface IRequestHttp extends http.IncomingMessage, IRequest {}

  export interface IRequestHttp2 extends http2.Http2ServerRequest, IRequest {}

  export interface IJSONPOptions {
    escape?: boolean;

    replacer?: (this: any, key: string, value: any) => any;

    spaces?: string | number;

    callbackName?: string;
  }

  export type IHeader = Record<string, number | string | string[]>;

  export interface IResponse {
    cache?: ICache;

    header(name: string, value: number | string | ReadonlyArray<string>): this;

    status(code: number): this;

    /* send */
    send(
      data: unknown,
      cached?: boolean,
      code?: number,
      headers?: IHeader,
    ): void;

    send(
      data: unknown,
      cached?: boolean,
      headers?: IHeader,
      code?: number,
    ): void;

    send(
      data: unknown,
      code?: number,
      cached?: boolean,
      headers?: IHeader,
    ): void;

    send(
      data: unknown,
      code?: number,
      headers?: IHeader,
      cached?: boolean,
    ): void;

    send(
      data: unknown,
      headers?: IHeader,
      cached?: boolean,
      code?: number,
    ): void;

    send(
      data: unknown,
      headers?: IHeader,
      code?: number,
      cached?: boolean,
    ): void;

    /* json */
    json(
      data?: Record<string, any>,
      cached?: boolean,
      code?: number,
      headers?: IHeader,
    ): void;

    json(
      data?: Record<string, any>,
      cached?: boolean,
      headers?: IHeader,
      code?: number,
    ): void;

    json(
      data?: Record<string, any>,
      code?: number,
      cached?: boolean,
      headers?: IHeader,
    ): void;

    json(
      data?: Record<string, any>,
      code?: number,
      headers?: IHeader,
      cached?: boolean,
    ): void;

    json(
      data?: Record<string, any>,
      headers?: IHeader,
      cached?: boolean,
      code?: number,
    ): void;

    json(
      data?: Record<string, any>,
      headers?: IHeader,
      code?: number,
      cached?: boolean,
    ): void;

    /* jsonp */
    jsonp(
      data?: Record<string, any>,
      cached?: boolean,
      options?: IJSONPOptions,
    ): void;

    jsonp(
      data?: Record<string, any>,
      options?: IJSONPOptions,
      cached?: boolean,
    ): void;

    /* redirect */
    redirect(url: string, status?: number): void;

    redirect(status: number, url: string): void;

    /* render */
    render(
      view: string,
      options?: Record<string, any>,
      callback?: (error: unknown, html: string) => void,
    ): void;

    render(
      view: string,
      callback?: (error: unknown, html: string) => void,
    ): void;
  }

  export interface IResponseHttp extends http.ServerResponse, IResponse {}

  export interface IResponseHttp2
    extends http2.Http2ServerResponse,
      IResponse {}

  export type Handler = (
    req: IRequestHttp | IRequestHttp2,
    res: IResponseHttp | IResponseHttp2,
    next: (error?: unknown) => void,
  ) => void | Promise<unknown>;

  export interface IRouter {
    get(path: string, ...handler: Array<Handler>): this;

    post(path: string, ...handler: Array<Handler>): this;

    put(path: string, ...handler: Array<Handler>): this;

    patch(path: string, ...handler: Array<Handler>): this;

    delete(path: string, ...handler: Array<Handler>): this;

    head(path: string, ...handler: Array<Handler>): this;

    options(path: string, ...handler: Array<Handler>): this;

    trace(path: string, ...handler: Array<Handler>): this;

    all(path: string, ...handler: Array<Handler>): this;

    use(...middlewares: Array<Handler>): this;

    use(path?: string, ...middlewares: Array<Handler>): this;
  }

  export interface ICache {
    clear(): void;

    has(key: string): boolean;

    get(key: string): unknown;

    set(key: string, value: unknown): void;

    delete(key: string): boolean;
  }

  export interface ICacheOptions {
    max?: number;

    maxAge?: number;

    stale?: boolean;
  }

  export interface IPureHttpServer extends net.Server, IRouter {}

  export interface IPureHttpSecureServer extends tls.Server, IRouter {}

  export interface IOptions {
    server?: net.Server | tls.Server;

    cache?: ICache;

    views?: {
      dir: string;

      ext: string;

      engine: Function;
    };

    onNotFound?: (
      req: IRequestHttp | IRequestHttp2,
      res: IResponseHttp | IResponseHttp2,
    ) => void | Promise<unknown>;

    onError?: (
      error: unknown,
      req: IRequestHttp | IRequestHttp2,
      res: IResponseHttp | IResponseHttp2,
    ) => void | Promise<unknown>;
  }
}

declare function pureHttp(
  options?: PureHttp.IOptions,
): PureHttp.IPureHttpServer | PureHttp.IPureHttpSecureServer;

declare function Router(prefix?: string): PureHttp.IRouter;

declare function Cache(options?: PureHttp.ICacheOptions): PureHttp.ICache;

declare module 'pure-http' {
  export default pureHttp;

  export { Router, Cache };
}
