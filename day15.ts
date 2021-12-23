import assert from "assert";
import fetch from "node-fetch";
import { PriorityQueue } from "./util.js";

// implementation

type Grid = number[][];
type Node = [number, number]; // x, y

const format = (input: string[]): Grid =>
  input.map((row) => row.split("").map((c) => parseInt(c)));

const formatExpanded = (input: string[]): Grid => {
  const len = input.length * 5;
  const map = format(input);
  const newMap: Grid = Array.from({ length: len }, () =>
    Array.from({ length: len })
  );
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len; j++) {
      const x = i % input.length;
      const y = j % input.length;
      const updated =
        map[y][x] + Math.floor(i / input.length) + Math.floor(j / input.length);
      newMap[j][i] = updated % 9 === 0 ? 9 : updated % 9;
    }
  }
  return newMap;
};

const initialScore = (grid: Grid) => {
  const score: { [key: string]: number } = {};
  for (let i = 0; i < grid[0].length; i++) {
    for (let j = 0; j < grid.length; j++) {
      score[[i, j].toString()] = Infinity;
    }
  }
  return score;
};

const shortestPathLength = (grid: Grid, start: Node, goal: Node) => {
  const h = (n: Node) => Math.abs(n[0] - goal[0]) + Math.abs(n[1] - goal[1]);
  const openSet = new PriorityQueue<{ node: Node; weight: number }>(
    (a, b) => a.weight < b.weight
  );
  openSet.push({ node: start, weight: h(start) });

  const cameFrom: { [key: string]: Node } = {};

  const gScore = initialScore(grid);
  gScore[start.toString()] = 0;

  const fScore = initialScore(grid);
  fScore[start.toString()] = h(start);

  const d = ([x, y]: Node) => grid[y][x];

  while (!openSet.isEmpty()) {
    const current = openSet.pop();
    const [x, y] = current.node;
    if (x === goal[0] && y === goal[1]) {
      return fScore[current.node.toString()];
    }
    const neighbors = (
      [
        [x, y + 1],
        [x, y - 1],
        [x + 1, y],
        [x - 1, y],
      ] as Node[]
    ).filter(([i, j]) => grid[j]?.[i] !== undefined);
    for (const neighbor of neighbors) {
      const tentative_gScore = gScore[current.node.toString()] + d(neighbor);
      if (tentative_gScore < gScore[neighbor.toString()]) {
        cameFrom[neighbor.toString()] = current.node;
        gScore[neighbor.toString()] = tentative_gScore;
        const f = tentative_gScore + h(neighbor);
        fScore[neighbor.toString()] = f;
        if (
          !openSet.contains((n) => n.node.toString() === neighbor.toString())
        ) {
          openSet.push({ node: neighbor, weight: f });
        }
      }
    }
  }

  return 0;
};

// test

const testLines = [
  "1163751742",
  "1381373672",
  "2136511328",
  "3694931569",
  "7463417111",
  "1319128137",
  "1359912421",
  "3125421639",
  "1293138521",
  "2311944581",
];

assert.equal(shortestPathLength(format(testLines), [0, 0], [9, 9]), 40);
assert.equal(
  shortestPathLength(formatExpanded(testLines), [0, 0], [49, 49]),
  315
);

console.log("it works ✨");

// solution

const input = await fetch("https://adventofcode.com/2021/day/15/input", {
  headers: { cookie: `session=${process.env.SESSION_COOKIE}` },
});
const data = (await input.text()).split("\n").filter((r) => r);

console.log(
  "part 1 solution: ",
  shortestPathLength(format(data), [0, 0], [data.length - 1, data.length - 1])
);
console.log(
  "part 2 solution: ",
  shortestPathLength(
    formatExpanded(data),
    [0, 0],
    [data.length * 5 - 1, data.length * 5 - 1]
  )
);
