import {OrderDiffResult} from "../order_diff";
import {ConsoleDocument} from "./console_document";
import {repeat} from "../string_utils";


export function formatOrderDiffResult(result: OrderDiffResult): string {
  return ConsoleDocument.format([createOrderDiffResultSummary(result)]);
}


export function formatOrderDiffResultVerbose(result: OrderDiffResult): string {
  const selectors = Object.keys(result);
  const summary = createOrderDiffResultSummary(result);

  const verboseSummaries = selectors.map((selector) => {
    const {uptrends, downtrends} = result[selector];
    return formatSelectorOrderChangedVerbose(selector, uptrends, downtrends);
  });

  return ConsoleDocument.format(ConsoleDocument.concat([
    ConsoleDocument.concat(ConsoleDocument.intersperse([""], verboseSummaries)),
    "",
    repeat("-", summary.length),
    summary,
  ]));
}


function createOrderDiffResultSummary(result: OrderDiffResult): string {
  const changedSelectors = Object.keys(result);
  return `${changedSelectors.length} selectors changed`;
}


function formatSelectorOrderChangedVerbose(selector: string, uptrendSelectors: string[], downtrendSelectors: string[]): ConsoleDocument.Document {
  return [
    `order changed: ${selector}`,
    [
      formatUptrendSelectors(uptrendSelectors),
      formatDowntrendSelectors(downtrendSelectors),
    ],
  ];
}


function formatUptrendSelectors(uptrendSelectors: string[]): ConsoleDocument.Document {
  if (uptrendSelectors.length <= 0) {
    return [];
  }

  return [
    "become to be lower than:",
    uptrendSelectors,
  ];
}


function formatDowntrendSelectors(downtrendSelectors: string[]): ConsoleDocument.Document {
  if (downtrendSelectors.length <= 0) {
    return [];
  }

  return [
    "become to be higher than:",
    downtrendSelectors,
  ];
}
