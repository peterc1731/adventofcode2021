import assert from "assert";
import fetch from "node-fetch";

// implementation

const symbols = [
  { open: "(", close: ")", errorScore: 3, completionScore: 1 },
  { open: "[", close: "]", errorScore: 57, completionScore: 2 },
  { open: "{", close: "}", errorScore: 1197, completionScore: 3 },
  { open: "<", close: ">", errorScore: 25137, completionScore: 4 },
];

const open = symbols.map((s) => s.open);
const close = symbols.map((s) => s.close);

const errorScore = (lines: string[]) =>
  lines.reduce((total, line) => {
    const o: string[] = [];
    for (const c of line.split("")) {
      if (close.includes(c)) {
        const i = close.findIndex((x) => x === c);
        if (o.at(-1) === open[i]) {
          o.pop();
        } else {
          return total + symbols[i].errorScore;
        }
      } else {
        o.push(c);
      }
    }
    return total;
  }, 0);

const completionScore = (lines: string[]) => {
  const scores = lines
    .map((line) => {
      const o: string[] = [];
      let error = false;
      for (const c of line.split("")) {
        if (close.includes(c)) {
          const i = close.findIndex((x) => x === c);
          if (o.at(-1) === open[i]) {
            o.pop();
          } else {
            error = true;
            break;
          }
        } else {
          o.push(c);
        }
      }
      if (error) {
        return 0;
      }
      return o
        .reverse()
        .map((x) => symbols.find((y) => y.open === x)!.completionScore)
        .reduce((s, n) => s * 5 + n, 0);
    })
    .filter((x) => x > 0)
    .sort((a, b) => a - b);
  return scores[Math.floor(scores.length / 2)];
};

// test

const testInput = [
  "[({(<(())[]>[[{[]{<()<>>",
  "[(()[<>])]({[<{<<[]>>(",
  "{([(<{}[<>[]}>{[]{[(<()>",
  "(((({<>}<{<{<>}{[]{[]{}",
  "[[<[([]))<([[{}[[()]]]",
  "[{[{({}]{}}([{[{{{}}([]",
  "{<[[]]>}<{[{[{[]{()[[[]",
  "[<(<(<(<{}))><([]([]()",
  "<{([([[(<>()){}]>(<<{{",
  "<{([{{}}[<[[[<>{}]]]>[]]",
];

assert.equal(errorScore(testInput), 26397);
assert.equal(completionScore(testInput), 288957);

console.log("it works ✨");

// solution

const input = await fetch("https://adventofcode.com/2021/day/10/input", {
  headers: { cookie: `session=${process.env.SESSION_COOKIE}` },
});
const data = (await input.text()).split("\n");

console.log("part 1 solution: ", errorScore(data));
console.log("part 2 solution: ", completionScore(data));
