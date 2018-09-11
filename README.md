# Statly

`Statly` is a statistics library which is performance-tuned for samples with repeated values. Its methods can accept populations as arrays, but it converts them to value-keyed tally objects.

## Install
```sh
npm install statly
```
or
```sh
yarn add statly
```

## API

### tally (*Array* samples) ➜ *Tally* counts

Convert an Array to an Tally object, with a key for each unique number in the sample array, and corresponding values indicating the number of times that number appears in the sample array.

**Example:**
```js
const { tally } = require('statly')
const samples = [ 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 4 ]
const counts = tally(samples)
// counts ➜ { 1: 2, 2: 5, 3: 4, 4: 1 }
```

### uTest (a: *Array|Tally*, b: *Array|Tally*) ➜ { p: *Number*, auc: *Number* }

Perform a Mann-Whitney U Test (AKA a Wilcoxon Rank Sum Test) comparing sample `a` and `b`.

* `p` represents the probability that both sets of samples could have been randomly selected from the same underlying distribution.
* `auc` is the area under an ROC curve, which corresponds to the portion of `a × b` sample pairings in which the `a` value is greater than the `b` value.

**Example:**
```js
const { uTest } = require('statly')
const a = [ 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 4 ]
const b = [ 3, 4, 4, 4, 5, 5, 5, 6, 6, 7 ]
const result = uTest(a, b)
// result ➜ { p: 0.0009765625, auc: 0.0375 }
```
