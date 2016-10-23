import * as Fs from "fs";
import * as Path from "path";
import {parseFile} from "./css_utils";
import * as css from "css";


export function getVersion(): string {
  const packageJsonPath = Path.resolve(__dirname, "..", "package.json");
  const packageJson = JSON.parse(Fs.readFileSync(packageJsonPath, "utf-8"));
  return packageJson["version"];
}


export function getStyleSheetPair(args: string[]): Promise<[css.Stylesheet, css.Stylesheet]> {
  if (args.length === 2) {
    const [filePathA, filePathB] = args;

    return Promise.all([
      parseFile(filePathA),
      parseFile(filePathB),
    ]);
  }

  const error = new Error(`argument length must be 2 but come: ${args.length}`);
  return Promise.reject(error);
}
