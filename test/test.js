const { uTest, tally, cdf } = require('../statly')
const { wilcoxon } = require('genstats')
const zig = new (require('node-ziggurat'))()
const binomialCdf = require('binomial-cdf')

const population = (n, fn) => {
  const a = new Array(n)
  for (let i = 0; i < n; i++) a[i] = Math.round(fn())
  return a
}
const uniform = (n, min, max) => population(n, () => {
  return min + Math.random() * (max - min)
})
const normal = (n, mean, sd) => population(n, () => mean + zig.nextGaussian() * sd)
const lognormal = (n, mean, sd) => population(n, () => Math.exp(mean + zig.nextGaussian() * sd))

const n = 1e4
const samples = [
  { name: 'uniform', a: uniform(n, 800, 1200), b: uniform(n, 810, 1210) },
  { name: 'normal', a: normal(n, 1000, 200), b: normal(n, 1010, 200) },
  { name: 'lognormal', a: lognormal(n, 1.0, 1.8), b: lognormal(n, 1.2, 1.8) },
  { name: 'readme', a: [ 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 4 ], b: [ 3, 4, 4, 4, 5, 5, 5, 6, 6, 7 ] }
  // { a: [ 1, 2, 2, 3, 3, 3, 3, 4, 4, 5 ], b: [ 6, 5, 5, 4, 4, 4, 4, 3, 3, 2 ] },
  // { a: [ 1, 3, 5, 7], b: [ 2, 4, 6, 8] },
  // { a: [ 1, 2, 3, 4], b: [ 1, 2, 3, 4] },
  // { a: [ 1, 2, 3, 4], b: [ 1, 2, 3, 4, 5, 6, 7, 8 ] }
]

describe('tally', () => {
  it('transforms arrays', () => {
    const t = tally([ 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 4 ])
    is.same(t, { 1: 2, 2: 5, 3: 4, 4: 1 })
  })
})

describe('uTest', () => {
  it('works', () => {
    samples.forEach(({ name, a, b }) => {
      const aDist = tally(a)
      const bDist = tally(b)
      const w = wilcoxon(a, b)
      const u = uTest(aDist, bDist)
      alert({ name, w })
      alert({ name, u })
    })
  })
})

bench('Mann-Whitney U Test', () => {
  const { a, b } = samples[0]
  const aDist = tally(a)
  const bDist = tally(b)
  it('wilcoxon', () => {
    return wilcoxon(a, b)
  })
  it('uTest', () => {
    return uTest(aDist, bDist)
  })
})

describe('cdf', () => {
  it('matches binomial-cdf', () => {
    let n = 100
    for (let k = 0; k <= n / 2; k++) {
      const b = binomialCdf(k, n, 0.5)
      const c = cdf(n, k)
      is(b.toFixed(4), c.toFixed(4))
    }
  })
})

bench('Cumulative Distribution Function', () => {
  const n = 1e3
  it('binomial-cdf', () => {
    for (let k = 0; k <= n / 2; k += n / 10) {
      binomialCdf(k, n, 0.5)
    }
  })
  it('cdf', () => {
    for (let k = 0; k <= n / 2; k += n / 10) {
      cdf(n, k)
    }
  })
})
