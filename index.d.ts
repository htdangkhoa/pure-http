import net from 'net';
import tls from 'tls';
import http from 'http';
import http2 from 'http2';

declare module 'pure-http' {
  export interface ICookieSerializeOptions {
    encode?(value: string): string;

    maxAge?: number;

    domain?: string;

    path?: string;

    expires?: Date;

    httpOnly?: boolean;

    secure?: boolean;

    sameSite?: true | false | 'lax' | 'strict' | 'none';

    signed?: boolean;
  }

  export interface ISendFileOptions {
    headers?: IHeader;
  }

  export interface IRequest {
    originalUrl: string;

    protocol?: string;

    secure: boolean;

    host?: string;

    hostname?: string;

    port?: number;

    path?: string;

    query?: Record<string, any>;

    params?: {
      [key: string]: any;
      wild?: string;
    };

    body?: any;

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

    /* cookie */
    cookie(name: string, value: any, options?: ICookieSerializeOptions): this;

    clearCookie(name: string, options?: ICookieSerializeOptions): this;

    sendFile(filePath: string, options?: ISendFileOptions): void;
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

  export type ErrorHandler = (
    error: Error,
    req: IRequestHttp | IRequestHttp2,
    res: IResponseHttp | IResponseHttp2,
    next: (error?: unknown) => void,
  ) => void | Promise<unknown>;

  export interface IRouter {
    get(path: string | RegExp, ...handler: Array<Handler>): this;

    post(path: string | RegExp, ...handler: Array<Handler>): this;

    put(path: string | RegExp, ...handler: Array<Handler>): this;

    patch(path: string | RegExp, ...handler: Array<Handler>): this;

    delete(path: string | RegExp, ...handler: Array<Handler>): this;

    head(path: string | RegExp, ...handler: Array<Handler>): this;

    options(path: string | RegExp, ...handler: Array<Handler>): this;

    trace(path: string | RegExp, ...handler: Array<Handler>): this;

    connect(path: string | RegExp, ...handler: Array<Handler>): this;

    all(path: string | RegExp, ...handler: Array<Handler>): this;

    use(...middlewares: Array<Handler | IRouter>): this;

    use(path?: string | RegExp, ...middlewares: Array<Handler | IRouter>): this;

    use(errorHandler: ErrorHandler): this;
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
  }

  function pureHttp(
    options?: IOptions,
  ): IPureHttpServer | IPureHttpSecureServer;

  export default pureHttp;

  export function Router(prefix?: string | RegExp): IRouter;

  export function Cache(options?: ICacheOptions): ICache;
}
