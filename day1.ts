import assert from "assert";
import fetch from "node-fetch";

// implementation

const countIncreases = (m: number[]) =>
  m.reduce((acc, val, i) => {
    if (i === 0) return 0;
    if (val > m[i - 1]) return acc + 1;
    return acc;
  }, 0);

// tests

assert.equal(
  countIncreases([199, 200, 208, 210, 200, 207, 240, 269, 260, 263]),
  7
);

assert.equal(countIncreases([1]), 0);

assert.equal(countIncreases([1, 2]), 1);

assert.equal(countIncreases([2, 1]), 0);

console.log("it works ✨");

// solution

const input = await fetch("https://adventofcode.com/2021/day/1/input", {
  headers: { cookie: `session=${process.env.SESSION_COOKIE}` },
});
const txt = await input.text();
const solution = countIncreases(txt.split('\n').map(s => parseInt(s)));
console.log('solution: ', solution);
