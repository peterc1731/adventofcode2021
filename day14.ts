import assert from "assert";
import fetch from "node-fetch";

// implementation

const step = (template: string, rules: string[]) =>
  template
    .split("")
    .map((x, i, arr) => {
      const match = rules.find(
        (r) => r.split(" -> ")[0] === `${x}${arr[i + 1]}`
      );
      return match ? `${x}${match.split(" -> ")[1]}` : x;
    })
    .join("");

const score = (template: string, rules: string[], steps: number) => {
  let working = template;
  for (let i = 0; i < steps; i++) {
    working = step(working, rules);
  }
  const obj = working.split("").reduce<{ [key: string]: number }>((acc, v) => {
    if (acc[v]) {
      acc[v]++;
    } else {
      acc[v] = 1;
    }
    return acc;
  }, {});
  const dist = Object.values(obj).sort((a, b) => b - a);
  return dist[0] - dist[dist.length - 1];
};

const scoreEfficiently = (template: string, rules: string[], steps: number) => {
  const rulesObj: { [key: string]: string } = {};
  rules.forEach((r) => {
    const [key, val] = r.split(" -> ");
    rulesObj[key] = val;
  });
  let set: { [key: string]: number } = {};
  template.split("").forEach((t, i, a) => {
    if (i < a.length - 1) {
      const pair = `${t}${a[i + 1]}`;
      if (set[pair]) {
        set[pair]++;
      } else {
        set[pair] = 1;
      }
    }
  });
  for (let i = 0; i < steps; i++) {
    const newSet: { [key: string]: number } = {};
    Object.entries(set).forEach(([k, v]) => {
      const [a, c] = k.split("");
      const b = rulesObj[k];
      [`${a}${b}`, `${b}${c}`].forEach((pair) => {
        if (newSet[pair]) {
          newSet[pair] += v;
        } else {
          newSet[pair] = v;
        }
      });
    });
    set = newSet;
  }
  const first = template[0];
  const last = template[template.length - 1];
  let obj: { [key: string]: number } = { [first]: 1, [last]: 1 };
  Object.entries(set).forEach(([k, v]) => {
    k.split("").forEach((x) => {
      if (obj[x]) {
        obj[x] += v;
      } else {
        obj[x] = v;
      }
    });
  });
  const dist = Object.values(obj).sort((a, b) => b - a);
  return (dist[0] - dist[dist.length - 1]) / 2;
};

// test

const testRules = [
  "CH -> B",
  "HH -> N",
  "CB -> H",
  "NH -> C",
  "HB -> C",
  "HC -> B",
  "HN -> C",
  "NN -> C",
  "BH -> H",
  "NC -> B",
  "NB -> B",
  "BN -> B",
  "BB -> N",
  "BC -> B",
  "CC -> N",
  "CN -> C",
];

assert.equal(step("NNCB", testRules), "NCNBCHB");
assert.equal(step("NCNBCHB", testRules), "NBCCNBBBCBHCB");
assert.equal(step("NBCCNBBBCBHCB", testRules), "NBBBCNCCNBBNBNBBCHBHHBCHB");
assert.equal(
  step("NBBBCNCCNBBNBNBBCHBHHBCHB", testRules),
  "NBBNBNBBCCNBCNCCNBBNBBNBBBNBBNBBCBHCBHHNHCBBCBHCB"
);
assert.equal(score("NNCB", testRules, 10), 1588);
assert.equal(scoreEfficiently("NNCB", testRules, 10), 1588);

console.log("it works ✨");

// solution

const input = await fetch("https://adventofcode.com/2021/day/14/input", {
  headers: { cookie: `session=${process.env.SESSION_COOKIE}` },
});
const data = (await input.text()).split("\n");
const template = data[0];
const rules = data.slice(2);

console.log("part 1 solution: ", score(template, rules, 10));
console.log("part 2 solution: ", scoreEfficiently(template, rules, 40));
