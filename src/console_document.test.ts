import * as assert from "assert";
import {ConsoleDocument} from "./format/console_document";


describe("ConsoleDocument", () => {
  describe(".format", () => {
    interface TestCase {
      document: ConsoleDocument.Document;
      expected: string;
    }


    (<TestCase[]> [
      {
        document: [],
        expected: "",
      },
      {
        document: ["line1"],
        expected: "line1",
      },
      {
        document: ["line1", "line2"],
        expected: "line1\nline2",
      },
      {
        document: ["line1", ["line2-1"]],
        expected: "line1\n  line2-1",
      },
      {
        document: ["line1", ["line2-1", "line2-2"]],
        expected: "line1\n  line2-1\n  line2-2",
      },
      {
        // Empty document should be ignored
        document: ["line1", [], "line2"],
        expected: "line1\nline2",
      },
    ]).forEach((testCase) => {
      context(`when given ${pretty(testCase.document)}`, () => {
        it(`should return ${pretty(testCase.expected)}`, () => {
          const result = ConsoleDocument.format(testCase.document);
          assert.strictEqual(result, testCase.expected);
        });
      });
    });
  });



  describe(".concat", () => {
    interface TestCase {
      documents: ConsoleDocument.Document[];
      expected: ConsoleDocument.Document;
    }


    (<TestCase[]> [
      {
        documents: [],
        expected: [],
      },
      {
        documents: [
          ["doc1"],
        ],
        expected: ["doc1"],
      },
      {
        documents: [
          ["doc1"],
          ["doc2"],
        ],
        expected: ["doc1", "doc2"],
      },
      {
        documents: [
          ["doc1"],
          [["doc2-1"]],
        ],
        expected: ["doc1", ["doc2-1"]],
      },
    ]).forEach((testCase) => {
      context(`when given ${pretty(testCase.documents)}`, () => {
        it(`should return ${pretty(testCase.expected)}`, () => {
          const result = ConsoleDocument.concat(testCase.documents);
          assert.deepStrictEqual(result, testCase.expected);
        });
      });
    });
  });



  describe(".append", () => {
    interface TestCase {
      appended: ConsoleDocument.Document[];
      appendant: ConsoleDocument.Document;
      expected: ConsoleDocument.Document;
    }


    (<TestCase[]> [
      {
        appended: [],
        appendant: [],
        expected: [[]],
      },
      {
        appended: [],
        appendant: ["appendant1"],
        expected: [["appendant1"]],
      },
      {
        appended: [["appended1"]],
        appendant: ["appendant1"],
        expected: [["appended1"], ["appendant1"]],
      },
    ]).forEach((testCase) => {
      context(`when given ${pretty(testCase.appended)} + ${pretty(testCase.appendant)}`, () => {
        it(`should return ${pretty(testCase.expected)}`, () => {
          const result = ConsoleDocument.append(testCase.appended, testCase.appendant);
          assert.deepStrictEqual(result, testCase.expected);
        });
      });
    });
  });



  describe(".intersperse", () => {
    interface TestCase {
      separator: ConsoleDocument.Document;
      documents: ConsoleDocument.Document[];
      expected: ConsoleDocument.Document[];
    }


    (<TestCase[]> [
      {
        separator: ["sep"],
        documents: [],
        expected: [],
      },
      {
        separator: ["sep"],
        documents: [["doc1"]],
        expected: [["doc1"]],
      },
      {
        separator: ["sep"],
        documents: [["doc1"], ["doc2"]],
        expected: [["doc1"], ["sep"], ["doc2"]],
      },
      {
        separator: ["sep"],
        documents: [["doc1"], ["doc2"], ["doc3"]],
        expected: [["doc1"], ["sep"], ["doc2"], ["sep"], ["doc3"]],
      },
    ]).forEach((testCase) => {
      context(`when given separator = ${pretty(testCase.separator)}, ` +
              `documents = ${pretty(testCase.documents)}`, () => {
        it(`should return ${pretty(testCase.expected)}`, () => {
          const result = ConsoleDocument.intersperse(testCase.separator, testCase.documents);
          assert.deepStrictEqual(result, testCase.expected);
        });
      });
    });
  });
});


function pretty(doc: any): string {
  return JSON.stringify(doc);
}
