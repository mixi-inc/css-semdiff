export interface ErrorLikeWithNoStack {
  message: string;
}


export interface ErrorLikeWithStack {
  message: string;
  stack: string;
}


export type ErrorLike = ErrorLikeWithStack | ErrorLikeWithNoStack;


function isErrorLike(x: any): x is ErrorLike {
  return x && typeof x.message === "string";
}


function isErrorLikeWithStack(x: any): x is ErrorLikeWithStack {
  return isErrorLike(x) && typeof (x as { stack?: string }).stack === "string";
}


export function stringifyErrorLike(errorLike: ErrorLike | any): string {
  if (isErrorLikeWithStack(errorLike)) {
    return errorLike.stack;
  }
  else if (isErrorLike(errorLike)) {
    return errorLike.message;
  }
  else {
    return String(errorLike);
  }
}
