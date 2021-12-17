import assert from "assert";
import fetch from "node-fetch";

// implementation

const occurences = {
  a: 8,
  b: 6,
  c: 8,
  d: 7,
  e: 4,
  f: 9,
  g: 7,
};

type Wires = keyof typeof occurences;
type WireMap = { [key: string]: string | undefined };

const numberOfUniqueDigits = (rows: string[]) => {
  const uniqueLengths = [2, 3, 4, 7];
  return rows.reduce(
    (sum, r) =>
      sum +
      r
        .split(" | ")[1]
        .split(" ")
        .filter((s) => uniqueLengths.includes(s.length)).length,
    0
  );
};

const translate = (map: WireMap, wires: string[]) => {
  const numbers = [
    "abcefg",
    "cf",
    "acdeg",
    "acdfg",
    "bcdf",
    "abdfg",
    "abdefg",
    "acf",
    "abcdefg",
    "abcdfg",
  ];
  return numbers.findIndex(
    (s) =>
      s ===
      wires
        .map((w) => map[w])
        .sort()
        .join("")
  );
};

const sumOutputs = (rows: string[]) =>
  rows
    .map((r) => {
      const wireMap: WireMap = {
        a: "",
        b: "",
        c: "",
        d: "",
        e: "",
        f: "",
        g: "",
      };
      const [input, output] = r.split(" | ");
      const inputs = input.split(" ").map((x) => x.split("")) as Wires[][];
      const outputs = output.split(" ").map((x) => x.split("")) as Wires[][];
      const occurs = { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0, g: 0 };
      inputs.flat().forEach((x) => {
        occurs[x]++;
      });
      const seven = inputs.find((x) => x.length === 3);
      const one = inputs.find((x) => x.length === 2);
      const four = inputs.find((x) => x.length === 4);
      wireMap.a = seven?.find((x) => !one?.includes(x));
      wireMap.b = (Object.entries(occurs).find(
        ([key, val]) => val === occurences.b
      ) || [])[0];
      wireMap.c = (Object.entries(occurs).find(
        ([key, val]) => val === occurences.c && key !== wireMap.a
      ) || [])[0];
      wireMap.e = (Object.entries(occurs).find(
        ([key, val]) => val === occurences.e
      ) || [])[0];
      wireMap.f = (Object.entries(occurs).find(
        ([key, val]) => val === occurences.f
      ) || [])[0];
      wireMap.d = four?.find(
        (x) => ![wireMap.b, wireMap.c, wireMap.f].includes(x)
      );
      wireMap.g = (Object.entries(occurs).find(
        ([key, val]) => val === occurences.g && key !== wireMap.d
      ) || [])[0];
      const map = Object.fromEntries(
        Object.entries(wireMap).map((x) => x.reverse())
      );
      return parseInt(outputs.map((o) => translate(map, o)).join(""));
    })
    .reduce((sum, v) => sum + v, 0);

// test

const testInput = [
  "be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe",
  "edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc",
  "fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg",
  "fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb",
  "aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea",
  "fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb",
  "dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe",
  "bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef",
  "egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb",
  "gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce",
];

assert.equal(numberOfUniqueDigits(testInput), 26);
assert.equal(
  sumOutputs([
    "acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf",
  ]),
  5353
);
assert.equal(sumOutputs(testInput), 61229);

console.log("it works ✨");

// solution

const input = await fetch("https://adventofcode.com/2021/day/8/input", {
  headers: { cookie: `session=${process.env.SESSION_COOKIE}` },
});
const data = (await input.text()).split("\n").slice(0, -1);

console.log("part 1 solution: ", numberOfUniqueDigits(data));
console.log("part 2 solution: ", sumOutputs(data));
