CSS Semantic Diff
=================

Install
-------

```shell
npm install -g git@github.lo.mixi.jp:Kuniwak/css-semdiff
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
```


### Comparing by Rule Order

```shell
css-orderdiff a.css b.css
```


#### Options

- `--verbose`: Display verbose output


#### Output

```
$ css-orderdiff a.css b.css --verbose
order changed: #footDisplay
        become to be higher than: .error #mainDisplay,
                .webView01 #mainDisplay
        become to be lower than:
order changed: .error #mainDisplay
        become to be higher than:
        become to be lower than: #footDisplay
```


License
-------

MIT
