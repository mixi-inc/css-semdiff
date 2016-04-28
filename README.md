CSS Semantic Diff
=================

[![Build Status](https://travis-ci.org/mixi-inc/css-semdiff.svg)](https://travis-ci.org/mixi-inc/css-semdiff)
[![npm version](https://badge.fury.io/js/css-semdiff.svg)](http://badge.fury.io/js/css-semdiff)



Install
-------

```console
$ npm install -g css-semdiff
```



Usage
-----
### Comparing by Abstract Syntax Tree
#### Comparing files

```console
$ css-astdiff a.css b.css
```



#### Comparing streams

```console
$ css-astdiff <(cat a.css) <(cat b.css)
```



#### Options

- `--verbose`: Display verbose output



#### Output

```console
$ css-astdiff a.css b.css
2 extra rules and 2 missing rules
```

```console
$ css-astdiff a.css b.css --verbose
extra:
  .extra-1 {
    border: none;
  }

extra:
  .extra-2 {
    border: none;
  }

missing:
  .missing-1 {
    border: none;
  }

missing:
  .missing-2 {
    border: none;
  }

---------------------------------
2 extra rules and 2 missing rules
```



### Comparing by Rule Order
#### Comparing files

```console
$ css-orderdiff a.css b.css
```



#### Comparing streams

```console
$ css-orderdiff <(cat a.css) <(cat b.css)
```



#### Options

- `--verbose`: Display verbose output



#### Output

```console
$ css-orderdiff a.css b.css
3 selectors changed
```

```console
$ css-orderdiff a.css b.css --verbose
order changed: a
    become to be lower than:
      b
      i

order changed: b
    become to be higher than:
      a

order changed: i
    become to be higher than:
      a

-------------------
3 selectors changed
```



License
-------

MIT
