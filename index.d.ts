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
    get(path: string, ...handler: Array<Handler>): void;

    post(path: string, ...handler: Array<Handler>): void;

    put(path: string, ...handler: Array<Handler>): void;

    patch(path: string, ...handler: Array<Handler>): void;

    delete(path: string, ...handler: Array<Handler>): void;

    head(path: string, ...handler: Array<Handler>): void;

    options(path: string, ...handler: Array<Handler>): void;

    trace(path: string, ...handler: Array<Handler>): void;

    all(path: string, ...handler: Array<Handler>): void;

    use(...middlewares: Array<Handler>): void;

    use(path?: string, ...middlewares: Array<Handler>): void;
  }

  export interface IPureHttpServer extends net.Server, IRouter {}

  export interface IPureHttpSecureServer extends tls.Server, IRouter {}

  export interface IOptions {
    server?: net.Server | tls.Server;

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

declare module 'pure-http' {
  export = pureHttp;

  export { Router };
}
