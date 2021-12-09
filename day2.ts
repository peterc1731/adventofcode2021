import assert from "assert";
import fetch from "node-fetch";

// implementation

interface Coords {
  horizontal: number;
  depth: number;
}

interface CoordsWithAim {
  horizontal: number;
  depth: number;
  aim: number;
}

const calculatePosition = (s: string[]) =>
  s.reduce<Coords>(
    (acc, val) => {
      const [type, amount] = val.split(" ");
      const num = parseInt(amount);
      if (type === "forward") {
        return { ...acc, horizontal: acc.horizontal + num };
      }
      if (type === "down") {
        return { ...acc, depth: acc.depth + num };
      }
      if (type === "up") {
        return { ...acc, depth: acc.depth - num };
      }
      return acc;
    },
    { horizontal: 0, depth: 0 }
  );

const multiply = ({ horizontal, depth }: Coords | CoordsWithAim) =>
  horizontal * depth;

const calculatePositionWithAim = (s: string[]) =>
  s.reduce<CoordsWithAim>(
    (acc, val) => {
      const [type, amount] = val.split(" ");
      const num = parseInt(amount);
      if (type === "forward") {
        return {
          ...acc,
          horizontal: acc.horizontal + num,
          depth: acc.depth + acc.aim * num,
        };
      }
      if (type === "down") {
        return { ...acc, aim: acc.aim + num };
      }
      if (type === "up") {
        return { ...acc, aim: acc.aim - num };
      }
      return acc;
    },
    { horizontal: 0, depth: 0, aim: 0 }
  );

// test

assert.equal(
  multiply(
    calculatePosition([
      "forward 5",
      "down 5",
      "forward 8",
      "up 3",
      "down 8",
      "forward 2",
    ])
  ),
  150
);

assert.equal(
  multiply(
    calculatePositionWithAim([
      "forward 5",
      "down 5",
      "forward 8",
      "up 3",
      "down 8",
      "forward 2",
    ])
  ),
  900
);

console.log("it works ✨");

// solution

const input = await fetch("https://adventofcode.com/2021/day/2/input", {
  headers: { cookie: `session=${process.env.SESSION_COOKIE}` },
});
const data = (await input.text()).split("\n");
console.log("part 1 solution: ", multiply(calculatePosition(data)));
console.log("part 2 solution: ", multiply(calculatePositionWithAim(data)));
