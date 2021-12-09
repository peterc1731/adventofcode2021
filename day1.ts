import assert from "assert";
import fetch from "node-fetch";

// implementation

const countIncreases = (m: number[]) =>
  m.reduce((acc, val, i) => {
    if (i === 0) return 0;
    if (val > m[i - 1]) return acc + 1;
    return acc;
  }, 0);

const movingAverage = (m: number[]) =>
  m.reduce((acc, val, i) => {
    if (i > m.length - 3) return acc;
    return [...acc, val + m[i + 1] + m[i + 2]];
  }, [] as number[]);

const countMovingAverageIncreases = (m: number[]) =>
  countIncreases(movingAverage(m));

// tests

assert.equal(
  countIncreases([199, 200, 208, 210, 200, 207, 240, 269, 260, 263]),
  7
);

assert.equal(countIncreases([1]), 0);

assert.equal(countIncreases([1, 2]), 1);

assert.equal(countIncreases([2, 1]), 0);

assert.equal(
  countMovingAverageIncreases([199, 200, 208, 210, 200, 207, 240, 269, 260, 263]),
  5
);

console.log("it works ✨");

// solution

const input = await fetch("https://adventofcode.com/2021/day/1/input", {
  headers: { cookie: `session=${process.env.SESSION_COOKIE}` },
});
const data = (await input.text()).split("\n").map((s) => parseInt(s));
console.log("part 1 solution: ", countIncreases(data));
console.log("part 2 solution: ", countMovingAverageIncreases(data));
