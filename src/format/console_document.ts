import {uncons} from "../collection_utils";
import {repeat} from "../string_utils";


export namespace ConsoleDocument {
  export interface Document {
    [index: number]: Document | string;
    length: number;
  }


  export function format(doc: Document): string {
    return formatRecursively(doc, 0);
  }


  export function toArray(doc: Document): (Document | string)[] {
    return <any> doc;
  }


  function formatRecursively(doc: Document, indentLevel: number): string {
    const indent = repeat("  ", indentLevel);

    return toArray(doc)
      .filter((x) => {
        if (typeof x === "string") {
          return true;
        }
        else {
          // Ignore empty arrays
          return x.length > 0;
        }
      })
      .map((x) => {
        if (typeof x === "string") {
          return `${indent}${x}`;
        }
        else {
          return formatRecursively(x, indentLevel + 1);
        }
      })
      .join("\n");
  }


  export function concat(docs: (Document | string)[]): Document {
    return Array.prototype.concat.apply([], docs);
  }


  export function append(docs: Document[], doc: Document): Document[] {
    return docs.concat([doc]);
  }


  export function intersperse(sep: Document, docs: Document[]): Document[] {
    if (docs.length <= 0) {
      return <Document[]> [];
    }

    const [x, xs] = uncons(docs);

    return xs.reduce<Document[]>((result, doc) => {
      return append(append(result, sep), doc);
    }, <Document[]> [x]);
  }
}
