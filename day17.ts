import assert from "assert";
import fetch from "node-fetch";

// implementation

const fire = (
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
  initialVX: number,
  initialVY: number
): number | "too far" | "too low" | "not enough steps" => {
  let x = 0;
  let y = 0;
  let vX = initialVX;
  let vY = initialVY;
  let largestY = 0;
  for (let step = 0; step < 1000; step++) {
    x += vX;
    y += vY;
    if (vX > 0) {
      vX -= 1;
    }
    if (vX < 0) {
      vX += 1;
    }
    vY -= 1;
    if (y > largestY) {
      largestY = y;
    }
    if (x >= xMin && x <= xMax && y >= yMin && y <= yMax) {
      return largestY;
    }
    if (x > xMax) {
      return "too far";
    }
    if (y < yMin) {
      return "too low";
    }
  }
  return "not enough steps";
};

const highestTrajectory = (input: string) => {
  const [xCoords, yCoords] = input.split(": ")[1].split(", ");
  const [xMin, xMax] = xCoords
    .split("=")[1]
    .split("..")
    .map((n) => parseInt(n));
  const [yMin, yMax] = yCoords
    .split("=")[1]
    .split("..")
    .map((n) => parseInt(n));

  let largestY = 0;
  for (let vY = 1; vY <= 1000; vY++) {
    let allTooFar = true;
    for (
      let vX = Math.floor((Math.sqrt(8 * xMin + 1) - 1) / 2);
      vX <= xMax;
      vX++
    ) {
      const val = fire(xMin, xMax, yMin, yMax, vX, vY);
      // console.log(vX, vY, val);
      if (val === "too far" || val === "not enough steps") {
        break;
      }
      allTooFar = false;
      if (typeof val === "number" && val > largestY) {
        largestY = val;
      }
    }
    if (allTooFar) {
      break;
    }
  }
  return largestY;
};

const numberOfHits = (input: string) => {
  const [xCoords, yCoords] = input.split(": ")[1].split(", ");
  const [xMin, xMax] = xCoords
    .split("=")[1]
    .split("..")
    .map((n) => parseInt(n));
  const [yMin, yMax] = yCoords
    .split("=")[1]
    .split("..")
    .map((n) => parseInt(n));

  let hits = 0;
  for (let vY = yMin; vY <= 1000; vY++) {
    let allTooFar = true;
    for (
      let vX = Math.floor((Math.sqrt(8 * xMin + 1) - 1) / 2);
      vX <= xMax;
      vX++
    ) {
      const val = fire(xMin, xMax, yMin, yMax, vX, vY);
      allTooFar = false;
      if (typeof val === "number") {
        hits++;
      }
    }
    if (allTooFar) {
      break;
    }
  }
  return hits;
};

// test

assert.equal(highestTrajectory("target area: x=20..30, y=-10..-5"), 45);
assert.equal(numberOfHits("target area: x=20..30, y=-10..-5"), 112);

console.log("it works ✨");

// solution

const input = await fetch("https://adventofcode.com/2021/day/17/input", {
  headers: { cookie: `session=${process.env.SESSION_COOKIE}` },
});
const data = await input.text();

console.log("part 1 solution: ", highestTrajectory(data));
console.log("part 2 solution: ", numberOfHits(data));
