export class CssSemdiffError extends Error {}


export class NoRulesError extends CssSemdiffError {
  static causedBy(pos: string): NoRulesError {
    return new NoRulesError("Stylesheets must be have rule nodes, " +
                            `but ${pos} have no rule nodes`);
  }

  static causedByFirst(): NoRulesError {
    return NoRulesError.causedBy("the first one");
  }

  static causedBySecond(): NoRulesError {
    return NoRulesError.causedBy("the second one");
  }
}


export class NoSelectorsError extends CssSemdiffError {
  static causedBy(pos: string): NoSelectorsError {
    return new NoSelectorsError("Rule nodes must be have selectors, " +
                                `but ${pos} have no selectors`);
  }
}
