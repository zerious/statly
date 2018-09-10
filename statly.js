exports.uTest = (a, b) => {
  a = tally(a)
  b = tally(b)
  const num = n => n === undefined ? Infinity : n
  const ak = keys(a)
  const bk = keys(b)
  let av = ak[0], i = 0, x = 0, dx = 0
  let bv = bk[0], j = 0, y = 0, dy = 0
  let u = 0
  while (av < Infinity || bv < Infinity) {
    if (av < bv) {
      dx = a[av]
      u += dx * y
      x += dx
      av = num(ak[++i])
    } else if (av > bv) {
      dy = b[bv]
      y += dy
      bv = num(bk[++j])
    } else {
      dx = a[av]
      dy = b[bv]
      u += dx * (y + dy / 2)
      x += dx
      y += dy
      av = num(ak[++i])
      bv = num(bk[++j])
    }
  }
  const n = Math.min(x, y)
  const auc = u / (x * y)
  const p = cdf(n, auc * n)
  return { p, auc }
}

function keys (o) {
  const a = []
  for (const k in o) {
    const n = parseFloat(k)
    if (!isNaN(n)) {
      a.push(n)
    }
  }
  a.sort((a, b) => a < b ? -1 : 1)
  return a
}

function Tally (a) {
  for (let i = 0, l = a.length; i < l; i++) {
    const k = a[i]
    this[k] = (this[k] || 0) + 1
  }
}

const tally = exports.tally = a => {
  return (a instanceof Tally) ? a : new Tally(a)
}

const cdf = exports.cdf = (n, k) => {
  if (k > n - k) k = n - k
  k = Math.round(k)
  const m = n + 1
  let p = Math.pow(2, -n)
  if (n < 1e3) {
    let b = p
    for (let i = 1; i <= k; i++) {
      b *= (m - i) / i
      p += b
    }
  } else {
    let x = -n
    for (let i = 1; i <= k; i++) {
      x += Math.log2((m - i) / i)
      p += Math.pow(2, x)
    }
  }
  return p
}
