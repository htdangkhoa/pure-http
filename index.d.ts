import { Server, IncomingMessage, ServerResponse } from 'http';

interface IRequest extends IncomingMessage {}

interface IResponse extends ServerResponse {
  send(
    data: unknown,
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

declare function Router(): IRouter;

declare function pureHttp(): IPureHttp;

export { Router };

export default pureHttp;
