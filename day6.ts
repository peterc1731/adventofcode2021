import assert from "assert";
import fetch from "node-fetch";

// implementation

// this solution is pretty but not memory efficient
const simulate = (fish: number[], days: number): number[] =>
  days === 0
    ? fish
    : simulate(
        [
          ...fish.map((f) => (f === 0 ? 6 : f - 1)),
          ...fish.filter((f) => f === 0).map((_) => 8),
        ],
        days - 1
      );

// more memory efficient but still not good enough for 256 days
const simulateEfficiently = (fish: number[], days: number) => {
  let old = fish;
  let updated = fish;
  for (let i = 0; i < days; i++) {
    updated = old.map((f) => (f === 0 ? 6 : f - 1));
    updated = updated.concat(old.filter((f) => f === 0).map((_) => 8));
    old = updated;
  }
  return updated;
};

// the maths approach - kind of works but only ends up with a close approximation
// e.g. for given example 26984457539, this returns 26988752717
const calculate = (fish: number[], days: number) => {
  const x1 = 50;
  const x2 = 80;
  const y1 = simulateEfficiently(fish, x1).length;
  const y2 = simulateEfficiently(fish, x2).length;
  // y = ae^bx
  // y1 / e^bx1 = y2 / e^bx2
  // y1 * e^-bx1 = y2 * e^-bx2
  // ln(y1) - bx1 = ln(y2) - bx2
  // ln(y1) - ln(y2) = b(x1 - x2)
  // b = (ln(y1) - ln(y2))/(x1 - x2)
  const b = (Math.log(y1) - Math.log(y2)) / (x1 - x2);
  // a = y / e^bx
  const a = y1 / Math.exp(b * x1);
  return Math.round(a * Math.exp(b * days));
};

// only store population of each age, not each fish, much more efficient!
const simulateVeryEfficiently = (fish: number[], days: number) => {
  const population = Array.from<number>({ length: 9 }).fill(0);
  fish.forEach((f) => {
    population[f] = population[f] + 1;
  });
  for (let i = 0; i < days; i++) {
    const n = population[0];
    population.shift();
    population[6] = population[6] + n;
    population.push(n);
  }
  return population.reduce((s, v) => s + v, 0);
};

// test

const testFish = [3, 4, 3, 1, 2];

assert.equal(simulate(testFish, 18).length, 26);
assert.equal(simulate(testFish, 80).length, 5934);
assert.equal(simulateEfficiently(testFish, 18).length, 26);
assert.equal(simulateEfficiently(testFish, 80).length, 5934);
// assert.equal(calculate(testFish, 256), 26984457539); doesn't work :(
assert.equal(simulateVeryEfficiently(testFish, 18), 26);
assert.equal(simulateVeryEfficiently(testFish, 80), 5934);

console.log("it works ✨");

// solution

const input = await fetch("https://adventofcode.com/2021/day/6/input", {
  headers: { cookie: `session=${process.env.SESSION_COOKIE}` },
});
const data = (await input.text()).split(",").map((n) => parseInt(n));

console.log("part 1 solution: ", simulateVeryEfficiently(data, 80));
console.log("part 1 solution: ", simulateVeryEfficiently(data, 256));
