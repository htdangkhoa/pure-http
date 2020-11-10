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

  export type Handler = (
    req: IRequest,
    res: IResponse,
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

  export interface IPureHttp extends net.Server, IRouter {}

  export interface IOptions {
    server?: http.Server | https.Server;

    defaultRoute?: (req: IRequest, res: IResponse) => void | Promise<unknown>;

    errorHandler?: (
      error: unknown,
      req: IRequest,
      res: IResponse,
    ) => void | Promise<unknown>;
  }
}

declare function pureHttp(options?: PureHttp.IOptions): PureHttp.IPureHttp;

declare function Router(prefix?: string): PureHttp.IRouter;

declare module 'pure-http' {
  export = pureHttp;

  export { Router };
}
