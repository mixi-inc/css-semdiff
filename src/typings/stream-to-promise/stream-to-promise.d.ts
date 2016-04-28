/// <reference path="../bundle.d.ts" />


declare module "stream-to-promise" {
  interface StreamToPromise {
    (stream: NodeJS.ReadableStream): Promise<Buffer>;
  }

  let streamToPromise: StreamToPromise;
  export = streamToPromise;
}
