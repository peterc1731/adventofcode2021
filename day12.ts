import assert from "assert";
import fetch from "node-fetch";

// implementation

const isLowercase = (s: string) => s.toLowerCase() === s;

const canTraverse = (base: string[], next: string) =>
  !isLowercase(next) || !base.includes(next);

const containsTwoLowercase = (xs: string[]) => {
  const lower = xs.filter((x) => isLowercase(x));
  const uniq = [...new Set(lower)];
  return lower.length > uniq.length;
};

const canTraverse2 = (base: string[], next: string) =>
  next !== "start" &&
  (!isLowercase(next) ||
    (base.includes(next) && !containsTwoLowercase(base)) ||
    !base.includes(next));

const numberOfPaths = (
  conns: string[],
  cond: (a: string[], b: string) => boolean
) => {
  const paths: string[][] = [];
  const findConnections = (base: string[], end: string): number => {
    const start = base.at(-1)!;
    if (start === end) {
      return paths.push([...base, end]);
    }
    for (const conn of conns) {
      const [a, b] = conn.split("-");
      if (a === start && cond(base, b)) {
        findConnections([...base, b], end);
      }
      if (b === start && cond(base, a)) {
        findConnections([...base, a], end);
      }
    }
    return 0;
  };
  findConnections(["start"], "end");
  return paths.length;
};

// test

const testInput1 = [
  "start-A",
  "start-b",
  "A-c",
  "A-b",
  "b-d",
  "A-end",
  "b-end",
];

const testInput2 = [
  "dc-end",
  "HN-start",
  "start-kj",
  "dc-start",
  "dc-HN",
  "LN-dc",
  "HN-end",
  "kj-sa",
  "kj-HN",
  "kj-dc",
];

const testInput3 = [
  "fs-end",
  "he-DX",
  "fs-he",
  "start-DX",
  "pj-DX",
  "end-zg",
  "zg-sl",
  "zg-pj",
  "pj-he",
  "RW-he",
  "fs-DX",
  "pj-RW",
  "zg-RW",
  "start-pj",
  "he-WI",
  "zg-he",
  "pj-fs",
  "start-RW",
];

assert.equal(containsTwoLowercase(["A", "a", "B", "C", "c", "a"]), true);
assert.equal(containsTwoLowercase(["A", "a", "B", "C", "c", "b"]), false);
assert.equal(canTraverse2(["A", "a", "B", "C", "c", "b"], "a"), true);
assert.equal(canTraverse2(["A", "a", "B", "C", "c", "a"], "a"), false);
assert.equal(numberOfPaths(testInput1, canTraverse), 10);
assert.equal(numberOfPaths(testInput2, canTraverse), 19);
assert.equal(numberOfPaths(testInput3, canTraverse), 226);
assert.equal(numberOfPaths(testInput1, canTraverse2), 36);
assert.equal(numberOfPaths(testInput2, canTraverse2), 103);
assert.equal(numberOfPaths(testInput3, canTraverse2), 3509);

console.log("it works ✨");

// solution

const input = await fetch("https://adventofcode.com/2021/day/12/input", {
  headers: { cookie: `session=${process.env.SESSION_COOKIE}` },
});
const data = (await input.text()).split("\n");

console.log("part 1 solution: ", numberOfPaths(data, canTraverse));
console.log("part 2 solution: ", numberOfPaths(data, canTraverse2));
