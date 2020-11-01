import { Server, IncomingMessage, ServerResponse } from 'http';

type Middleware = (
  req: IncomingMessage,
  res: ServerResponse,
  next: (error?: unknown) => void,
) => void | Promise<unknown>;

type Handler = (
  req: IncomingMessage,
  res: ServerResponse,
) => void | Promise<unknown>;

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

interface IPureHttp extends IRouter {
  listen(port: number, callback: void): Server;
}

declare function Router(): IRouter;

declare function pureHttp(): IPureHttp;

export { Router };

export default pureHttp;
