CSS Semantic Diff
=================

[![Build Status](https://travis-ci.org/mixi-inc/css-semdiff.svg)](https://travis-ci.org/mixi-inc/css-semdiff)
[![npm version](https://badge.fury.io/js/css-semdiff.svg)](http://badge.fury.io/js/css-semdiff)


Install
-------

```shell
npm install -g css-semdiff
```


Usage
-----

### Comparing by Abstract Syntax Tree

```shell
css-astdiff a.css b.css
```


#### Options

- `--verbose`: Display verbose output


#### Output

```
$ css-astdiff a.css b.css --verbose
23 extra rules and 23 missing rules between a.css and b.css
```

```
$ css-astdiff a.css b.css --verbose
extra:
        #header ul {
          display: -webkit-box;
          display: -webkit-flex;
          display: -moz-box;
          display: flex;
        }

missing:
        #header ul {
          display: -webkit-box;
          display: -webkit-flex;
          display: flex;
        }
23 extra rules and 23 missing rules between a.css and b.css
```


### Comparing by Rule Order

```shell
css-orderdiff a.css b.css
```


#### Options

- `--verbose`: Display verbose output


#### Output

```
$ css-orderdiff a.css b.css
order changed: #footDisplay
order changed: .error #mainDisplay
```

```
$ css-orderdiff a.css b.css --verbose
order changed: #footDisplay
        become to be higher than:
                .error #mainDisplay,
                .webView01 #mainDisplay

order changed: .error #mainDisplay
        become to be lower than:
                #footDisplay
```


License
-------

MIT
