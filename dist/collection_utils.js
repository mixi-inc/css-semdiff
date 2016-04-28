"use strict";
var OrderedStringSet = (function () {
    function OrderedStringSet(strings) {
        var _this = this;
        this.order = [];
        this.store = {};
        if (strings) {
            strings.forEach(function (x) {
                if (x in _this.store) {
                    return;
                }
                _this.store[x] = undefined;
                _this.order.push(x);
            });
        }
    }
    OrderedStringSet.prototype.union = function (set) {
        return new OrderedStringSet(this.order.concat(set.order));
    };
    OrderedStringSet.prototype.intersection = function (set) {
        var _this = this;
        var union = this.union(set);
        return new OrderedStringSet(union.order.filter(function (x) { return _this.contains(x) && set.contains(x); }));
    };
    OrderedStringSet.prototype.contains = function (x) {
        return x in this.store;
    };
    OrderedStringSet.prototype.flatMap = function (f) {
        return new OrderedStringSet(flatMap(this.order, f));
    };
    OrderedStringSet.prototype.sub = function (set) {
        return this.flatMap(function (x) { return set.contains(x) ? [] : [x]; });
    };
    OrderedStringSet.prototype.map = function (f) {
        return new OrderedStringSet(this.order.map(f));
    };
    OrderedStringSet.prototype.toArray = function () {
        return [].concat(this.order);
    };
    return OrderedStringSet;
}());
exports.OrderedStringSet = OrderedStringSet;
function flatten(arrays) {
    var result = [];
    return result.concat.apply(result, arrays);
}
exports.flatten = flatten;
function flatMap(source, fn) {
    return flatten(source.map(fn));
}
exports.flatMap = flatMap;
function values(object) {
    return Object.keys(object).map(function (key) { return object[key]; });
}
exports.values = values;
function keys(object) {
    return Object.keys(object);
}
exports.keys = keys;
function cut(index, array) {
    return [array.slice(0, index), array.slice(index + 1)];
}
exports.cut = cut;
function isEmpty(array) {
    return array.length <= 0;
}
exports.isEmpty = isEmpty;
