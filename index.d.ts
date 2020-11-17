import net from 'net';
import tls from 'tls';
import http from 'http';
import http2 from 'http2';

declare namespace PureHttp {
  export interface IRequest {
    originalUrl: string;

    location: string | undefined;

    protocol: string | undefined;

    host: string | undefined;

    hostname: string | undefined;

    port: string | undefined;

    pathname: string | undefined;

    search: string | undefined;

    query: Record<string, string> | undefined;

    hash: string | undefined;

    header(name: string): string | undefined;
  }

  export interface IRequestHttp extends http.IncomingMessage, IRequest {}

  export interface IRequestHttp2 extends http2.Http2ServerRequest, IRequest {}

  export interface IResponse {
    cache?: ICache;

    header(name: string, value: number | string | ReadonlyArray<string>): void;

    send(
      data: unknown,
      headers?: Record<string, number | string | string[]>,
    ): void;

    send(
      data: unknown,
      code?: number,
      headers?: Record<string, number | string | string[]>,
    ): void;

    json(
      data: Record<string, any>,
      headers?: Record<string, number | string | string[]>,
    ): void;

    json(
      data: Record<string, any>,
      code?: number,
      headers?: Record<string, number | string | string[]>,
    ): void;

    redirect(url: string, status?: number): void;

    redirect(status: number, url: string): void;
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
    get(path: string, ...handler: Array<Handler>): IRouter;

    post(path: string, ...handler: Array<Handler>): IRouter;

    put(path: string, ...handler: Array<Handler>): IRouter;

    patch(path: string, ...handler: Array<Handler>): IRouter;

    delete(path: string, ...handler: Array<Handler>): IRouter;

    head(path: string, ...handler: Array<Handler>): IRouter;

    options(path: string, ...handler: Array<Handler>): IRouter;

    trace(path: string, ...handler: Array<Handler>): IRouter;

    all(path: string, ...handler: Array<Handler>): IRouter;

    use(...middlewares: Array<Handler>): IRouter;

    use(path?: string, ...middlewares: Array<Handler>): IRouter;
  }

  export interface ICache {
    clear(): void;

    has(key: string): boolean;

    get(key: string): unknown;

    set(key: string, value: unknown): void;
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
  export = pureHttp;

  export { Router, Cache };
}
