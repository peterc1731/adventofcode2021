import assert from "assert";
import fetch from "node-fetch";

// implementation

type Jellyfish = number | "f";

const tick = (map: number[][]) => {
  let flashes = 0;
  const working: Jellyfish[][] = map.map((y) => y.map((x) => x + 1));

  while (true) {
    let didFlash = false;
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        if (working[y][x] > 9) {
          [
            [y + 1, x],
            [y - 1, x],
            [y, x + 1],
            [y, x - 1],
            [y + 1, x + 1],
            [y - 1, x - 1],
            [y + 1, x - 1],
            [y - 1, x + 1],
          ].forEach(([j, k]) => {
            if (working[j]?.[k] !== undefined && working[j][k] !== "f") {
              (working[j][k] as number)++;
            }
          });
          didFlash = true;
          flashes++;
          working[y][x] = "f";
        }
      }
    }
    if (!didFlash) {
      break;
    }
  }
  const allFlashed = working.every((y) => y.every((x) => x === "f"));
  const updated: number[][] = working.map((y) =>
    y.map((x) => (x === "f" ? 0 : x))
  );
  return { updated, flashes, allFlashed };
};

const countFlashes = (map: number[][], steps: number) => {
  let count = 0;
  let working = map;
  for (let i = 0; i < steps; i++) {
    const { updated, flashes } = tick(working);
    count += flashes;
    working = updated;
  }
  return count;
};

const simultaneousFlash = (map: number[][]) => {
  let working = map;
  for (let i = 0; i < 1000; i++) {
    const { updated, allFlashed } = tick(working);
    if (allFlashed) {
      return i + 1;
    }
    working = updated;
  }
  return 0;
};

// test

const testInput = [
  [5, 4, 8, 3, 1, 4, 3, 2, 2, 3],
  [2, 7, 4, 5, 8, 5, 4, 7, 1, 1],
  [5, 2, 6, 4, 5, 5, 6, 1, 7, 3],
  [6, 1, 4, 1, 3, 3, 6, 1, 4, 6],
  [6, 3, 5, 7, 3, 8, 5, 4, 7, 8],
  [4, 1, 6, 7, 5, 2, 4, 6, 4, 5],
  [2, 1, 7, 6, 8, 4, 1, 7, 2, 1],
  [6, 8, 8, 2, 8, 8, 1, 1, 3, 4],
  [4, 8, 4, 6, 8, 4, 8, 5, 5, 4],
  [5, 2, 8, 3, 7, 5, 1, 5, 2, 6],
];

assert.equal(countFlashes(testInput, 100), 1656);
assert.equal(simultaneousFlash(testInput), 195);

console.log("it works ✨");

// solution

const input = await fetch("https://adventofcode.com/2021/day/11/input", {
  headers: { cookie: `session=${process.env.SESSION_COOKIE}` },
});
const data = (await input.text())
  .split("\n")
  .map((s) => s.split("").map((x) => parseInt(x)));

console.log("part 1 solution: ", countFlashes(data, 100));
console.log("part 2 solution: ", simultaneousFlash(data));
