/// <reference path="typings/bundle.d.ts" />
/// <reference path="typings/css/css.d.ts" />

import css = require("css");

import {orderDiff} from "./order_diff";
import {astDiff} from "./ast_diff";

export default {
  order: orderDiff,
  ast: astDiff,
};
