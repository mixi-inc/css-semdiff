/// <reference path="./typings/bundle.d.ts" />

import * as Fs from "fs";
import * as Path from "path";


export function getVersion(): string {
  const packageJsonPath = Path.resolve(__dirname, "..", "package.json");
  const packageJson = JSON.parse(Fs.readFileSync(packageJsonPath, "utf-8"));
  return packageJson["version"];
}
