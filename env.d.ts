import type { Context } from "hono";

declare global {
  type HonoBindings = Partial<{
    request: Request;
    response: Response;
  }> &
    (Record<string, any> | undefined);

  type HonoContext = Context<{
    Bindings: HonoBindings;
  }>;
}

export {};
