import assert from "assert";
import fetch from "node-fetch";

// implementation

const findLeft = (
  chars: string[],
  index: number
): [number | undefined, string] => {
  const section = chars.slice(0, index + 1).reverse();
  const match = section.join("").matchAll(/\d+/g).next().value;
  const i = match?.index
    ? index - (match.index + match?.[0].length - 1)
    : undefined;
  return [i, match?.[0].split("").reverse().join("") || ""];
};

const findRight = (
  chars: string[],
  index: number
): [number | undefined, string] => {
  const match = chars.slice(index).join("").matchAll(/\d+/g).next().value;
  const i = match?.index ? index + match.index : undefined;
  return [i, match?.[0] || ""];
};

const reduce = (n: string): string => {
  // console.log(n);
  const chars = n.split("");
  let depth = 0;
  for (const [i, c] of chars.entries()) {
    if (depth === 4) {
      if (c === "[") {
        // needs exploding
        const ds = chars.slice(i).join("").matchAll(/\d+/g);
        const l: string = ds.next().value[0];
        const r: string = ds.next().value[0];
        const end = chars.slice(i).findIndex((c) => c === "]");
        chars.splice(i, end + 1, "0");
        const [iLeft, vLeft] = findLeft(chars, i - 1);
        const [iRight, vRight] = findRight(chars, i + 1);
        if (iRight) {
          chars.splice(
            iRight,
            vRight.length,
            ...`${parseInt(vRight) + parseInt(r)}`.split("")
          );
        }
        if (iLeft) {
          chars.splice(
            iLeft,
            vLeft.length,
            ...`${parseInt(vLeft) + parseInt(l)}`.split("")
          );
        }
        // console.log(
        //   "exploded",
        //   `[${l},${r}]`,
        //   "into",
        //   "left:",
        //   `${parseInt(vLeft) + parseInt(l)}`,
        //   "right:",
        //   `${parseInt(vRight) + parseInt(r)}`
        // );
        return reduce(chars.join(""));
      }
    }
    if (c === "[") {
      depth++;
    } else if (c === "]") {
      depth--;
    }
  }
  for (const [i, c] of chars.entries()) {
    if (c !== "," && c !== "[" && c !== "]") {
      // needs splitting
      const d = chars.slice(i).join("").matchAll(/\d+/g).next()
        .value[0] as string;
      const p = parseInt(d);
      if (p >= 10) {
        chars.splice(i, d.length, `[${Math.floor(p / 2)},${Math.ceil(p / 2)}]`);
        // console.log(
        //   "split",
        //   d,
        //   "into",
        //   `[${Math.floor(p / 2)},${Math.ceil(p / 2)}]`
        // );
        return reduce(chars.join(""));
      }
    }
  }
  return n;
};

const sum = (ns: string[]): string => {
  if (ns.length === 1) {
    return ns[0];
  }
  const reducedSum = reduce(`[${ns[0]},${ns[1]}]`);
  return ns.length > 2 ? sum([reducedSum, ...ns.slice(2)]) : reducedSum;
};

const magnitude = (s: string): string => {
  const sNew = s.replace(/\[\d+,\d+\]/g, (match) => {
    const [left, right] = match
      .slice(1, match.length)
      .split(",")
      .map((n) => parseInt(n));
    return `${left * 3 + right * 2}`;
  });
  if (sNew === s) {
    return s;
  }
  return magnitude(sNew);
};

const largestMagnitude = (ns: string[]) => {
  const ms: number[] = [];
  for (const n1 of ns) {
    for (const n2 of ns) {
      if (n1 !== n2) {
        ms.push(parseInt(magnitude(sum([n1, n2]))));
      }
    }
  }
  ms.sort((a, b) => b - a);
  return ms[0];
};

// test

assert.equal(
  reduce("[[[[[4,3],4],4],[7,[[8,4],9]]],[1,1]]"),
  "[[[[0,7],4],[[7,8],[6,0]]],[8,1]]"
);
assert.equal(
  reduce("[[[[[6,6],[6,6]],[[6,0],[6,7]]],[[[7,7],[8,9]],[8,[8,1]]]],[2,9]]"),
  "[[[[6,6],[7,7]],[[0,7],[7,7]]],[[[5,5],[5,6]],9]]"
);
assert.equal(
  sum(["[1,1]", "[2,2]", "[3,3]", "[4,4]"]),
  "[[[[1,1],[2,2]],[3,3]],[4,4]]"
);
assert.equal(
  sum(["[1,1]", "[2,2]", "[3,3]", "[4,4]", "[5,5]"]),
  "[[[[3,0],[5,3]],[4,4]],[5,5]]"
);
assert.equal(
  sum(["[1,1]", "[2,2]", "[3,3]", "[4,4]", "[5,5]", "[6,6]"]),
  "[[[[5,0],[7,4]],[5,5]],[6,6]]"
);
assert.equal(
  sum(["[[[[6,6],[6,6]],[[6,0],[6,7]]],[[[7,7],[8,9]],[8,[8,1]]]]", "[2,9]"]),
  "[[[[6,6],[7,7]],[[0,7],[7,7]]],[[[5,5],[5,6]],9]]"
);
assert.equal(
  sum([
    "[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]",
    "[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]",
    "[[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]]",
    "[[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]]",
    "[7,[5,[[3,8],[1,4]]]]",
    "[[2,[2,2]],[8,[8,1]]]",
    "[2,9]",
    "[1,[[[9,3],9],[[9,0],[0,7]]]]",
    "[[[5,[7,4]],7],1]",
    "[[[[4,2],2],6],[8,7]]",
  ]),
  "[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]"
);
assert.equal(
  sum([
    "[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]",
    "[[[5,[2,8]],4],[5,[[9,9],0]]]",
    "[6,[[[6,2],[5,6]],[[7,6],[4,7]]]]",
    "[[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]",
    "[[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]",
    "[[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]",
    "[[[[5,4],[7,7]],8],[[8,3],8]]",
    "[[9,3],[[9,9],[6,[4,9]]]]",
    "[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]",
    "[[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]",
  ]),
  "[[[[6,6],[7,6]],[[7,7],[7,0]]],[[[7,7],[7,7]],[[7,8],[9,9]]]]"
);
assert.equal(
  magnitude("[[[[6,6],[7,6]],[[7,7],[7,0]]],[[[7,7],[7,7]],[[7,8],[9,9]]]]"),
  4140
);
assert.equal(
  largestMagnitude([
    "[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]",
    "[[[5,[2,8]],4],[5,[[9,9],0]]]",
    "[6,[[[6,2],[5,6]],[[7,6],[4,7]]]]",
    "[[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]",
    "[[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]",
    "[[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]",
    "[[[[5,4],[7,7]],8],[[8,3],8]]",
    "[[9,3],[[9,9],[6,[4,9]]]]",
    "[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]",
    "[[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]",
  ]),
  3993
);

console.log("it works ✨");

// solution

const input = await fetch("https://adventofcode.com/2021/day/18/input", {
  headers: { cookie: `session=${process.env.SESSION_COOKIE}` },
});
const data = (await input.text()).split("\n").filter((x) => x);

console.log("part 1 solution: ", magnitude(sum(data)));
console.log("part 2 solution: ", largestMagnitude(data));
