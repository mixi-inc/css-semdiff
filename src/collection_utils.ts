/// <reference path="./typings/bundle.d.ts" />

import * as assert from "assert";


export class OrderedStringSet {
  private order: string[] = [];
  private store: { [key: string]: void } = {};

  constructor(strings?: string[]) {
    if (strings) {
      strings.forEach((x) => {
        if (x in this.store) {
          return;
        }
        this.store[x] = undefined;
        this.order.push(x);
      });
    }
  }

  public union(set: OrderedStringSet): OrderedStringSet {
    return new OrderedStringSet(this.order.concat(set.order));
  }

  public intersection(set: OrderedStringSet): OrderedStringSet {
    const union = this.union(set);
    return new OrderedStringSet(union.order.filter((x) => this.contains(x) && set.contains(x)));
  }

  public contains(x: string): boolean {
    return x in this.store;
  }

  public flatMap(f: (x: string) => string[]): OrderedStringSet {
    return new OrderedStringSet(flatMap(this.order, f));
  }

  public sub(set: OrderedStringSet): OrderedStringSet {
    return this.flatMap((x) => set.contains(x) ? [] : [x]);
  }

  public map(f: (x: string) => string): OrderedStringSet {
    return new OrderedStringSet(this.order.map(f));
  }

  public toArray(): string[] {
    return [].concat(this.order);
  }
}

export function flatten<T>(arrays: T[][]): T[] {
  const result: T[] = [];
  return result.concat(...arrays);
}

export function flatMap<T, S>(source: T[], fn: (t: T) => S[]): S[] {
  return flatten(source.map(fn));
}

export function values<T>(object: { [key: string]: T }): T[] {
  return Object.keys(object).map((key) => object[key]);
}

export function keys(object: { [key: string]: any }): string[] {
  return Object.keys(object);
}

export function cut<T>(index: number, array: T[]): [T[], T[]] {
  return [array.slice(0, index), array.slice(index + 1)];
}

export function isEmpty(array: { length: number }): boolean {
  return array.length <= 0;
}

export function uncons<T>(array: T[]): [T, T[]] {
  assert(array.length > 0, "uncons can handle only non-empty string");

  return <[T, T[]]> [array[0], array.slice(1)];
}
