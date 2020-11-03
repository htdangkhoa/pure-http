import { Server, IncomingMessage, ServerResponse } from 'http';

declare namespace PureHttp {
  interface IRequest extends IncomingMessage {
    originalUrl: string;

    location: ?string;

    protocol: ?string;

    host: ?string;

    hostname: ?string;

    port: ?string;

    pathname: ?string;

    search: ?string;

    query: ?Record<string, string>;

    hash: ?string;

    header(name: string): string;
  }

  interface IResponse extends ServerResponse {
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

  type Middleware = (
    req: IRequest,
    res: IResponse,
    next: (error?: unknown) => void,
  ) => void | Promise<unknown>;

  type Handler = (req: IRequest, res: IResponse) => void | Promise<unknown>;

  interface IRouter {
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

  interface IPureHttp extends Server, IRouter {}
}

declare function pureHttp(): PureHttp.IPureHttp;

declare function Router(): PureHttp.IRouter;

declare module 'pure-http' {
  export = pureHttp;

  export { Router };
}
