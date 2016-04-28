/// <reference path="./typings/bundle.d.ts" />

import * as Fs from "fs";
import * as Path from "path";
import {parseFile, parseStream} from "./css_utils";
import * as css from "css";


export function getVersion(): string {
  const packageJsonPath = Path.resolve(__dirname, "..", "package.json");
  const packageJson = JSON.parse(Fs.readFileSync(packageJsonPath, "utf-8"));
  return packageJson["version"];
}


export function getStyleSheetPair(args: string[]): Promise<[css.StyleSheet, css.StyleSheet]> {
  if (args.length === 0) {
    return Promise.all([
      parseStream(process.stdin, "stdin"),
      parseStream(Fs.createReadStream(null, { fd: 3 }), "fd3"),
    ]);
  }

  if (args.length === 1) {
    const [filePath] = args;

    return Promise.all([
      parseFile(filePath),
      parseStream(process.stdin, "stdin"),
    ]);
  }

  if (args.length === 2) {
    const [filePathA, filePathB] = args;

    return Promise.all([
      parseFile(filePathA),
      parseFile(filePathB),
    ]);
  }

  const error = new Error(`argument length must be 0 (fd mode) or ` +
                          `2 (file mode) but come: ${args.length}`);

  return Promise.reject(error);
}
