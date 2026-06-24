// Tiny className joiner (a dependency-free stand-in for `clsx`).
// Accepts strings, arrays and objects: cn('a', cond && 'b', { c: isC }).
export function cn(...args) {
  const out = []
  for (const arg of args) {
    if (!arg) continue
    if (typeof arg === 'string' || typeof arg === 'number') {
      out.push(String(arg))
    } else if (Array.isArray(arg)) {
      out.push(cn(...arg))
    } else if (typeof arg === 'object') {
      for (const [key, val] of Object.entries(arg)) if (val) out.push(key)
    }
  }
  return out.join(' ')
}
