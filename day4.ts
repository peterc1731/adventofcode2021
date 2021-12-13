import assert from "assert";
import fetch from "node-fetch";

// implementation

type Board = number[][];

const matches = (set: number[], draws: number[]) =>
  set.every((x) => draws.includes(x));

const getColumn = (board: Board, i: number) => board.map((r) => r[i]);

const sum = (x: number[]) => x.reduce((acc, val) => acc + val, 0);

const isWinningBoard = (board: Board, draws: number[]) => {
  for (const [index, row] of board.entries()) {
    if (matches(row, draws) || matches(getColumn(board, index), draws)) {
      const flattened = board.flat();
      return sum(flattened) - sum(draws.filter((x) => flattened.includes(x)));
    }
  }
  return 0;
};

const getWinningScore = (boards: Board[], draws: number[]) => {
  for (let i = 4; i < draws.length; i++) {
    const slice = draws.slice(0, i);
    for (const board of boards) {
      const sum = isWinningBoard(board, slice);
      if (sum) {
        return sum * slice.at(-1)!;
      }
    }
  }
  return 0;
};

const getLosingScore = (boards: Board[], draws: number[]) => {
  let workingBoards: Board[] = boards;
  for (let i = 4; i < draws.length; i++) {
    const slice = draws.slice(0, i);
    const winners: number[] = [];
    for (const [index, board] of workingBoards.entries()) {
      const sum = isWinningBoard(board, slice);
      if (sum && workingBoards.length === 1) {
        return sum * slice.at(-1)!;
      }
      if (sum) {
        winners.push(index);
      }
    }
    workingBoards = workingBoards.filter((_, n) => !winners.includes(n));
  }
  return 0;
};

// test

const testDraws = [
  7, 4, 9, 5, 11, 17, 23, 2, 0, 14, 21, 24, 10, 16, 13, 6, 15, 25, 12, 22, 18,
  20, 8, 19, 3, 26, 1,
];

const testBoards = [
  [
    [22, 13, 17, 11, 0],
    [8, 2, 23, 4, 24],
    [21, 9, 14, 16, 7],
    [6, 10, 3, 18, 5],
    [1, 12, 20, 15, 19],
  ],
  [
    [3, 15, 0, 2, 22],
    [9, 18, 13, 17, 5],
    [19, 8, 7, 25, 23],
    [20, 11, 10, 24, 4],
    [14, 21, 16, 12, 6],
  ],
  [
    [14, 21, 17, 24, 4],
    [10, 16, 15, 9, 19],
    [18, 8, 23, 26, 20],
    [22, 11, 13, 6, 5],
    [2, 0, 12, 3, 7],
  ],
];

assert.equal(isWinningBoard(testBoards[2], [14, 21, 17, 24, 1]), 0);

assert.equal(
  isWinningBoard(testBoards[2], [7, 4, 9, 5, 11, 17, 23, 2, 0, 14, 21, 24]),
  188
);

assert.equal(isWinningBoard(testBoards[2], [14, 10, 7, 18, 22, 2]), 252);

assert.equal(getWinningScore(testBoards, testDraws), 4512);

assert.equal(getLosingScore(testBoards, testDraws), 1924);

console.log("it works ✨");

// solution

const input = await fetch("https://adventofcode.com/2021/day/4/input", {
  headers: { cookie: `session=${process.env.SESSION_COOKIE}` },
});
const data = (await input.text()).split("\n");
const draws = data[0].split(",").map((n) => parseInt(n));
const rows = data
  .slice(2)
  .map((r) =>
    r
      .split(" ")
      .filter((s) => s)
      .map((n) => parseInt(n))
  )
  .filter((a) => a.length);
const boards = [];
for (let i = 0; i < rows.length / 5; i++) {
  boards.push(rows.slice(i * 5, (i + 1) * 5));
}

console.log("part 1 solution: ", getWinningScore(boards, draws));
console.log("part 2 solution: ", getLosingScore(boards, draws));
