import assert from "assert";
import fetch from "node-fetch";

// implementation

const binArrToVal = (a: number[]) => parseInt(a.join(""), 2);

const powerConsumption = (x: string[]) => {
  const count = x.reduce(
    (acc, val) => {
      const v = val.split("").map((n) => parseInt(n));
      return acc.map((y, i) => y + v[i]);
    },
    x[0].split("").map((_) => 0)
  );

  const gamma = binArrToVal(count.map((v) => (v > x.length / 2 ? 1 : 0)));
  const epsilon = binArrToVal(count.map((v) => (v > x.length / 2 ? 0 : 1)));

  return gamma * epsilon;
};

const getMostCommonAtPosition = (arr: string[], pos: number) =>
  arr.reduce((acc, val) => acc + parseInt(val[pos]), 0) >= arr.length / 2
    ? 1
    : 0;

const getLeastCommonAtPosition = (arr: string[], pos: number) =>
  arr.reduce((acc, val) => acc + parseInt(val[pos]), 0) >= arr.length / 2
    ? 0
    : 1;

const oxygen = (x: string[]) => {
  let working: string[] = x;
  for (let i = 0; i < x[0].length; i++) {
    working = working.filter(
      (y) => parseInt(y[i]) === getMostCommonAtPosition(working, i)
    );
    if (working.length === 1) {
      break;
    }
  }
  return parseInt(working[0], 2);
};

const cO2 = (x: string[]) => {
  let working: string[] = x;
  for (let i = 0; i < x[0].length; i++) {
    working = working.filter(
      (y) => parseInt(y[i]) === getLeastCommonAtPosition(working, i)
    );
    if (working.length === 1) {
      break;
    }
  }
  return parseInt(working[0], 2);
};

const lifeSupport = (x: string[]) => oxygen(x) * cO2(x);

// test

const testData = [
  "00100",
  "11110",
  "10110",
  "10111",
  "10101",
  "01111",
  "00111",
  "11100",
  "10000",
  "11001",
  "00010",
  "01010",
];

assert.equal(powerConsumption(testData), 198);

assert.equal(getMostCommonAtPosition(testData, 0), 1);

assert.equal(getLeastCommonAtPosition(testData, 0), 0);

assert.equal(lifeSupport(testData), 230);

console.log("it works ✨");

// solution

const input = await fetch("https://adventofcode.com/2021/day/3/input", {
  headers: { cookie: `session=${process.env.SESSION_COOKIE}` },
});
const data = (await input.text()).split("\n").filter((x) => x);
console.log("part 1 solution: ", powerConsumption(data));
console.log("part 2 solution: ", lifeSupport(data));
