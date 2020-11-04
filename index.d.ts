import net from 'net';
import http from 'http';
import https from 'https';

declare namespace PureHttp {
  export interface IRequest extends http.IncomingMessage {
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

  export interface IResponse extends http.ServerResponse {
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
  }

  export type Middleware = (
    req: IRequest,
    res: IResponse,
    next: (error?: unknown) => void,
  ) => void | Promise<unknown>;

  export type Handler = (
    req: IRequest,
    res: IResponse,
  ) => void | Promise<unknown>;

  export interface IRouter {
    get(path: string, handler: Handler): void;

    post(path: string, handler: Handler): void;

    put(path: string, handler: Handler): void;

    patch(path: string, handler: Handler): void;

    delete(path: string, handler: Handler): void;

    head(path: string, handler: Handler): void;

    options(path: string, handler: Handler): void;

    trace(path: string, handler: Handler): void;

    all(path: string, handler: Handler): void;

    use(...middlewares: Array<Middleware>): void;

    use(path?: string, ...middlewares: Array<Middleware>): void;
  }

  export interface IPureHttp extends net.Server, IRouter {}

  export interface IOptions {
    server: http.Server | https.Server;
  }
}

declare function pureHttp(): PureHttp.IPureHttp;

declare function Router(): PureHttp.IRouter;

declare module 'pure-http' {
  export = pureHttp;

  export { Router };
}
