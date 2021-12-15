import assert from "assert";
import fetch from "node-fetch";

// implementation

const averagePosition = (pos: number[]) =>
  Math.round(pos.reduce((s, v) => s + v, 0) / pos.length);

const getFuel = (pos: number[], goal: number) =>
  pos.map((x) => Math.abs(x - goal)).reduce((s, v) => s + v, 0);

const minimizeFuel = (pos: number[], fuel = getFuel) => {
  let start = averagePosition(pos);
  while (true) {
    const current = fuel(pos, start);
    const next = fuel(pos, start + 1);
    const prev = fuel(pos, start - 1);
    if (current < next && current < prev) {
      return current;
    }
    if (prev < current) {
      start = start - 1;
    } else if (next < current) {
      start = start + 1;
    } else {
      return 0;
    }
  }
};

const getExpensiveFuel = (pos: number[], goal: number) =>
  pos
    .map((x) => {
      const n = Math.abs(x - goal);
      return (n * (n + 1)) / 2;
    })
    .reduce((s, v) => s + v, 0);

// test

const testPositions = [16, 1, 2, 0, 4, 2, 7, 1, 2, 14];

assert.equal(averagePosition(testPositions), 5);
assert.equal(minimizeFuel(testPositions), 37);
assert.equal(minimizeFuel(testPositions, getExpensiveFuel), 168);

console.log("it works ✨");

// solution

const input = await fetch("https://adventofcode.com/2021/day/7/input", {
  headers: { cookie: `session=${process.env.SESSION_COOKIE}` },
});
const data = (await input.text()).split(",").map((n) => parseInt(n));

console.log("part 1 solution: ", minimizeFuel(data));
console.log("part 1 solution: ", minimizeFuel(data, getExpensiveFuel));
