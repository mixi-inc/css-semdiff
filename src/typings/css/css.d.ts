// Type definitions for css
// Project: https://www.npmjs.com/package/css
// Definitions by: Kuniwak <orga.chem.job@gmail.com> 
// Definitions: https://github.com/borisyankov/DefinitelyTyped

declare module "css" {
  type Selector = string;

  type Node = CommentNode | RuleNode | AtRuleNode;

  type AtRuleNode = KeyFramesNode
    | MediaNode
    | CustomMediaNode
    | SupportsNode
    | ImportNode
    | CharsetNode
    | NamespaceNode
    | DocumentNode
    | PageNode
    | HostNode
    | FontFaceNode;

  interface AbstractNode {
    type: string;
    position: Position;
    parent: Node;
  }

  interface Position {
    start: Cursor;
    end: Cursor;
    source: string;
  }

  interface Cursor {
    line: number;
    column: number;
  }

  interface StyleSheet {
    type: string;
    stylesheet: {
      rules: (AtRuleNode | RuleNode | CommentNode)[],
      parsingErrors: Error[],
    };
  }

  interface CommentNode extends AbstractNode {
    comment: string;
  }

  interface KeyFramesNode extends AbstractNode {
    name: string;
    vendor: string;
    keyframes: (KeyFrameNode | CommentNode)[];
  }

  interface KeyFrameNode extends AbstractNode {
    values: string[];
    declarations: (DeclarationNode | CommentNode)[];
  }

  interface DeclarationNode extends AbstractNode {
    property: string;
    value: string;
  }

  interface MediaNode extends AbstractNode {
    media: string;
    rules: (RuleNode | CommentNode)[];
  }

  interface CustomMediaNode extends AbstractNode {
    name: string;
    media: string;
  }

  interface SupportsNode extends AbstractNode {
    supports: string;
    rules: (RuleNode | CommentNode)[];
  }

  interface ImportNode extends AbstractNode {
    import: string;
  }

  interface CharsetNode extends AbstractNode {
    charset: string;
  }

  interface NamespaceNode extends AbstractNode {
    namespace: string;
  }

  interface DocumentNode extends AbstractNode {
    document: string;
    vendor: string;
    rules: (RuleNode | CommentNode)[];
  }

  interface PageNode extends AbstractNode {
    selectors: Selector[];
    declarations: (DeclarationNode | CommentNode)[];
  }

  interface HostNode extends AbstractNode {
    rules: (RuleNode | CommentNode)[];
  }

  interface FontFaceNode extends AbstractNode {
    declarations: (DeclarationNode | CommentNode)[];
  }

  interface RuleNode extends AbstractNode {
    selectors: Selector[];
    declarations: (DeclarationNode | CommentNode)[];
  }

  export function parse(css: string, options?: {
    silent?: boolean;
    source?: string;
  }): StyleSheet;

  interface OptionGeneratorSourceMap {
    indent?: string;
    compress?: boolean;
    sourcemap: string;
    inputSourceMaps?: boolean;
  }

  interface OptionSourceMap {
    indent?: string;
    compress?: boolean;
    // NOTE: when the sourcemap is false, but we cannot handle it.
    sourcemap: boolean;
    inputSourceMaps?: boolean;
  }

  interface OptionNoSourceMap {
    indent?: string;
    compress?: boolean;
    inputSourceMaps?: boolean;
  }

  interface SourceMapResult {
    code: string;
    map: string;
  }

  interface GeneratorSourceMapResult {
    code: string;
    map: Object;
  }

  interface stringify {
    (node: StyleSheet): string;
    (node: StyleSheet, options: OptionNoSourceMap): string;
    // NOTE: If options.sourcemap === false,
    // then it should be a string.
    // But we cannot handle it because there are no ways.
    (node: StyleSheet, options: OptionSourceMap): SourceMapResult;
    // NOTE: If options.sourcemap === "generator",
    // then it should be GeneratorSourceMapResult.
    // But we cannot handle it because there are no ways.
    (node: StyleSheet, options: OptionGeneratorSourceMap): GeneratorSourceMapResult;
  }

  export var stringify: stringify;
}
