import assert from "assert";
import fetch from "node-fetch";

// implementation

type Coords = [number, number];

const calculateRisk = (map: number[][]) => {
  const xMax = map[0].length;
  const yMax = map.length;
  const points: number[] = [];
  for (let y = 0; y < yMax; y++) {
    for (let x = 0; x < xMax; x++) {
      const p = map[y][x];
      const a = [
        map[y + 1]?.[x],
        map[y - 1]?.[x],
        map[y][x + 1],
        map[y][x - 1],
      ].filter((n) => n !== undefined);
      if (a.every((n) => n > p)) {
        points.push(p);
      }
    }
  }
  return points.reduce((s, n) => s + n + 1, 0);
};

const isInBasin = (n: number, p: number) => (n > p && n < 9 ? n : undefined);

const expand = (map: number[][], [y, x]: Coords) =>
  [
    isInBasin(map[y + 1]?.[x], map[y][x]) ? [y + 1, x] : undefined,
    isInBasin(map[y - 1]?.[x], map[y][x]) ? [y - 1, x] : undefined,
    isInBasin(map[y][x + 1], map[y][x]) ? [y, x + 1] : undefined,
    isInBasin(map[y][x - 1], map[y][x]) ? [y, x - 1] : undefined,
  ].filter((n) => n !== undefined) as Coords[];

const uniq = (a: Coords[]) => {
  var seen: { [key: string]: true } = {};
  return a.filter((item) => {
    if (seen.hasOwnProperty(item.toString())) {
      return false;
    }
    seen[item.toString()] = true;
    return true;
  });
};

const largestBasins = (map: number[][]) => {
  const xMax = map[0].length;
  const yMax = map.length;
  const basinSizes: number[] = [];
  for (let y = 0; y < yMax; y++) {
    for (let x = 0; x < xMax; x++) {
      const p = map[y][x];
      const a = [
        map[y + 1]?.[x],
        map[y - 1]?.[x],
        map[y][x + 1],
        map[y][x - 1],
      ].filter((n) => n !== undefined);
      if (a.every((n) => n > p)) {
        let basin: Coords[] = [[y, x]];
        while (true) {
          const newBasin = uniq(
            basin.flatMap((c) => expand(map, c)).concat(basin)
          );
          if (newBasin.length === basin.length) {
            break;
          }
          basin = newBasin;
        }
        basinSizes.push(basin.length);
      }
    }
  }
  basinSizes.sort((a, b) => b - a);
  return basinSizes[0] * basinSizes[1] * basinSizes[2];
};

// test

const testInput = [
  [2, 1, 9, 9, 9, 4, 3, 2, 1, 0],
  [3, 9, 8, 7, 8, 9, 4, 9, 2, 1],
  [9, 8, 5, 6, 7, 8, 9, 8, 9, 2],
  [8, 7, 6, 7, 8, 9, 6, 7, 8, 9],
  [9, 8, 9, 9, 9, 6, 5, 6, 7, 8],
];

assert.equal(calculateRisk(testInput), 15);
assert.equal(largestBasins(testInput), 1134);

console.log("it works ✨");

// solution

const input = await fetch("https://adventofcode.com/2021/day/9/input", {
  headers: { cookie: `session=${process.env.SESSION_COOKIE}` },
});
const data = (await input.text())
  .split("\n")
  .map((s) => s.split("").map((x) => parseInt(x)));

console.log("part 1 solution: ", calculateRisk(data));
console.log("part 2 solution: ", largestBasins(data));
