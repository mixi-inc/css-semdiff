import * as css from "css";
import {ConsoleDocument} from "./console_document";
import {stringifyCssNode} from "../css_utils";
import {AstDiffResult} from "../ast_diff";
import {repeat} from "../string_utils";


export function formatAstDiffResult(result: AstDiffResult): string {
  return ConsoleDocument.format([createAstDiffResultSummary(result)]);
}


export function formatAstDiffResultVerbose(result: AstDiffResult): string {
  const summary = createAstDiffResultSummary(result);

  return ConsoleDocument.format(ConsoleDocument.concat([
    formatExtraAndMissingNodes(result.extra, result.missing),
    "",
    repeat("-", summary.length),
    summary,
  ]));
}


function createAstDiffResultSummary(result: AstDiffResult): string {
  const {extra, missing} = result;
  return `${extra.length} extra rules and ${missing.length} missing rules`;
}


function formatExtraAndMissingNodes(extraNodes: css.Node[], missingNodes: css.Node[]): ConsoleDocument.Document[] {
  const docForExtras = extraNodes.length > 0
    ? ConsoleDocument.concat(ConsoleDocument.intersperse(
        [""], // 2 line breaks
        extraNodes.map((extraNode) => formatNodesWithLabel("extra:", extraNode))
      ))
    : ["No extra nodes"];

  const docForMissings = missingNodes.length > 0
    ? ConsoleDocument.concat(ConsoleDocument.intersperse(
        [""], // 2 line breaks
        missingNodes.map((missingNode) => formatNodesWithLabel("missing:", missingNode))
      ))
    : ["No missing nodes"];

  return <ConsoleDocument.Document[]> ConsoleDocument.concat([
    docForExtras,
    [""], // 2 line breaks
    docForMissings,
  ]);
}


function formatNodesWithLabel(label: string, node: css.Node): ConsoleDocument.Document {
  return [
    label,
    stringifyCssNode(node).split("\n"),
  ];
}
