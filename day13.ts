import assert from "assert";
import fetch from "node-fetch";

// implementation

const fold = (map: number[][], instruction: string) => {
  const [axis, indexStr] = instruction.split("g ")[1].split("=") as [
    "x" | "y",
    string
  ];
  const index = parseInt(indexStr);
  const newMap: number[][] = [];
  if (axis === "y") {
    const top = map.slice(0, index);
    const bottom = map.slice(index + 1);
    top.reverse();
    const longest = Math.max(top.length, bottom.length);
    for (let j = 0; j < longest; j++) {
      const row = !top[j]
        ? bottom[j]
        : !bottom[j]
        ? top[j]
        : top[j].map((n, i) => n + bottom[j][i]);
      newMap.push(row);
    }
    newMap.reverse();
  }
  if (axis === "x") {
    for (let j = 0; j < map.length; j++) {
      const row = map[j];
      const left = row.slice(0, index);
      const right = row.slice(index + 1);
      left.reverse();
      const longer = left.length >= right.length ? left : right;
      const shorter = left.length < right.length ? left : right;
      const newRow = longer.map((n, i) => (shorter[i] ? shorter[i] + n : n));
      newRow.reverse();
      newMap.push(newRow);
    }
  }
  return newMap;
};

const mapFromPoints = (points: string[]): number[][] => {
  const np = points.map((p) => p.split(",").map((n) => parseInt(n)));
  const xMax = np.reduce((m, v) => (m > v[0] ? m : v[0]), 0) + 1;
  const yMax = np.reduce((m, v) => (m > v[1] ? m : v[1]), 0) + 1;
  const map = Array.from({ length: yMax }, () =>
    Array.from({ length: xMax }, () => 0)
  );
  np.forEach(([x, y]) => {
    map[y][x] = 1;
  });
  return map;
};

const countPoints = (map: number[][]) =>
  map.map((row) => row.filter((n) => n > 0).length).reduce((s, v) => s + v, 0);

const showResult = (points: string[], folds: string[]) => {
  let map = mapFromPoints(points);
  for (const f of folds) {
    map = fold(map, f);
  }
  console.log(
    map.map((r) => r.map((x) => (x === 0 ? "." : "#")).join("")).join("\n")
  );
};

// test

const testPoints = [
  "6,10",
  "0,14",
  "9,10",
  "0,3",
  "10,4",
  "4,11",
  "6,0",
  "6,12",
  "4,1",
  "0,13",
  "10,12",
  "3,4",
  "3,0",
  "8,4",
  "1,10",
  "2,14",
  "8,10",
  "9,0",
];

const testFolds = ["fold along y=7", "fold along x=5"];

assert.equal(countPoints(fold(mapFromPoints(testPoints), testFolds[0])), 17);
assert.equal(
  countPoints(
    fold(fold(mapFromPoints(testPoints), testFolds[0]), testFolds[1])
  ),
  16
);

console.log("it works ✨");

// solution

const input = await fetch("https://adventofcode.com/2021/day/13/input", {
  headers: { cookie: `session=${process.env.SESSION_COOKIE}` },
});
const data = (await input.text()).split("\n");
const points = data.filter((d) => d.includes(","));
const folds = data.filter((d) => d.includes("="));

console.log(
  "part 1 solution: ",
  countPoints(fold(mapFromPoints(points), folds[0]))
);
console.log("part 2 solution: ", showResult(points, folds));
