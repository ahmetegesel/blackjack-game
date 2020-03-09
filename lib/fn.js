export const createArrayFromRange = (n) => [...Array(n).keys()];
export const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);
export const after =
  (f, advice) => {
    const callAdvice = squelched(advice)
    return (...x) => {
      const result = f(...x)
      return callAdvice(result)
    }
  };
export const map = fn => array => array.map(fn);

const squelched =
  advice => (...x) => {
    try { advice(...x) }
    catch (err) {}
  }
