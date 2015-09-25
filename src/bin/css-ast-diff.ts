/// <reference path="../typings/bundle.d.ts" />
/// <reference path="../typings/css/css.d.ts" />

import commander = require("commander");
import css = require("css");
import {parseFiles} from "../css_utils";
import {astDiff} from "../ast_diff";
import {isEmpty} from "../collection_utils";

enum StatusCode {
  NOT_CHANGED = 0,
  ERROR = 1,
  CHANGED = 2,
}

const cli = commander
  .usage("[options] <file ...>")
  .option("-V, --verbose", "Display verbose diff")
  .parse(process.argv);

type Options = {
  verbose: boolean;
};

function astDiffByFiles(filePathA: string, filePathB: string, options?: Options): void {
  parseFiles(filePathA, filePathB)
    .then((tuple) => astDiff(tuple[0], tuple[1]))
    .then((result) => {
      const {changed, extra, missing} = result;
      if (changed && options.verbose) {
        if (!isEmpty(extra)) {
          console.log(formatNodes(extra, "extra"));
        }

        if (!isEmpty(missing)) {
          console.log(formatNodes(missing, "missing"));
        }
      }

      return changed ? StatusCode.CHANGED : StatusCode.NOT_CHANGED;
    }, (err) => {
      return StatusCode.ERROR;
    })
    .then((statusCode) => process.exit(statusCode));
}

function formatNodes(nodes: css.Node[], msg: string): string {
  return nodes
    .map(createDummyStyleSheet)
    .map((styleSheet) => css.stringify(styleSheet))
    .map((cssString) => `${msg}:\n${indent(cssString)}`)
    .join("\n\n");
}

function createDummyStyleSheet(node: css.Node): css.StyleSheet {
  const parsingErrors: Error[] = [];
  return {
    type: "stylesheet",
    stylesheet: {
      rules: [node],
      parsingErrors,
    },
  };
}

function indent(str: string): string {
  return str.split("\n").map((line) => `\t${line}`).join("\n");
}

astDiffByFiles(cli.args[0], cli.args[1], {
  verbose: cli.opts().verbose,
});
