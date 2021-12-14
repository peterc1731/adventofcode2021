import assert from "assert";
import fetch from "node-fetch";

// implementation

const getVals = (s: string) =>
  s
    .split(" -> ")
    .flatMap((p) => p.split(","))
    .map((n) => parseInt(n));

const order = (x: number, y: number) => [x, y].sort((a, b) => a - b);

const numberOfOverlaps = (coords: string[], includeDiagonal = false) =>
  coords
    .flatMap((coord) => {
      const [x1, y1, x2, y2] = getVals(coord);
      if (x1 === x2) {
        const [min, max] = order(y1, y2);
        return Array.from(
          { length: max - min + 1 },
          (_, i) => `${x1}, ${min + i}`
        );
      }
      if (y1 === y2) {
        const [min, max] = order(x1, x2);
        return Array.from(
          { length: max - min + 1 },
          (_, i) => `${min + i}, ${y1}`
        );
      }
      if (includeDiagonal && Math.abs(y1 - y2) === Math.abs(x1 - x2)) {
        const [yMin, yMax] = order(y1, y2);
        const [xMin, xMax] = order(x1, x2);
        const xDown =
          (yMin === y1 && xMin !== x1) || (yMin === y2 && xMin !== x2);
        return Array.from(
          { length: yMax - yMin + 1 },
          (_, i) => `${xDown ? xMax - i : xMin + i}, ${yMin + i}`
        );
      }
      return [];
    })
    .reduce<string[]>((overlapping, point, _, points) => {
      if (overlapping.includes(point)) {
        return overlapping;
      }
      if (points.filter((p) => p === point).length > 1) {
        return [...overlapping, point];
      }
      return overlapping;
    }, []).length;

// test

const testCoords = [
  "0,9 -> 5,9",
  "8,0 -> 0,8",
  "9,4 -> 3,4",
  "2,2 -> 2,1",
  "7,0 -> 7,4",
  "6,4 -> 2,0",
  "0,9 -> 2,9",
  "3,4 -> 1,4",
  "0,0 -> 8,8",
  "5,5 -> 8,2",
];

assert.equal(numberOfOverlaps(testCoords), 5);
assert.equal(numberOfOverlaps(testCoords, true), 12);

console.log("it works ✨");

// solution

const input = await fetch("https://adventofcode.com/2021/day/5/input", {
  headers: { cookie: `session=${process.env.SESSION_COOKIE}` },
});
const data = (await input.text()).split("\n");

console.log("part 1 solution: ", numberOfOverlaps(data));
console.log("part 2 solution: ", numberOfOverlaps(data, true));
