import assert from "assert";
import fetch from "node-fetch";
import { PriorityQueue } from "./util.js";

// implementation

type Packet = {
  type: number;
  version: number;
  length: number;
  value: number;
  children?: Packet[];
};

const hexToBin = (hex: string) =>
  hex
    .split("")
    .map((x) => parseInt(x, 16).toString(2).padStart(4, "0"))
    .join("");

const parseLiteral = (bin: string): { value: number; lastIndex: number } => {
  const values: string[] = [];
  for (let i = 0; i < 100; i++) {
    const val = bin.slice(6 + i * 5, 6 + (i + 1) * 5);
    values.push(val.slice(1));
    if (val.at(0) === "0") {
      return {
        value: parseInt(values.join(""), 2),
        lastIndex: 5 + (i + 1) * 5,
      };
    }
  }
  return { value: 0, lastIndex: 0 };
};

const getValue = (type: number, children: Packet[]): number => {
  if (type === 0) {
    return children.reduce((s, v) => s + v.value, 0);
  }
  if (type === 1) {
    return children.reduce((p, v) => p * v.value, 1);
  }
  if (type === 2) {
    return Math.min(...children.map((c) => c.value));
  }
  if (type === 3) {
    return Math.max(...children.map((c) => c.value));
  }
  if (type === 5) {
    return children[0]?.value > children[1]?.value ? 1 : 0;
  }
  if (type === 6) {
    return children[0]?.value < children[1]?.value ? 1 : 0;
  }
  if (type === 7) {
    return children[0]?.value === children[1]?.value ? 1 : 0;
  }
  return 0;
};

const parse = (bin: string): Packet => {
  if (!bin) {
    return { version: 0, type: 0, value: 0, length: Infinity };
  }
  const version = parseInt(bin.slice(0, 3), 2);
  const type = parseInt(bin.slice(3, 6), 2);
  if (type === 4) {
    const { value, lastIndex } = parseLiteral(bin);
    return { version, type, value, length: lastIndex };
  }
  const lengthType = parseInt(bin[6], 2);
  if (lengthType === 0) {
    const length = parseInt(bin.slice(7, 22), 2);
    if (isNaN(length)) {
      return { version, type, length: 5, value: 0 };
    }
    let children: Packet[] = [];
    let end = 21;
    while (end < 21 + length) {
      const child = parse(bin.slice(end + 1));
      end += child.length + 1;
      children.push(child);
    }
    return {
      version,
      type,
      children,
      length: end,
      value: getValue(type, children),
    };
  }
  if (lengthType === 1) {
    const n = parseInt(bin.slice(7, 18), 2);
    if (isNaN(n)) {
      return { version, type, length: 5, value: 0 };
    }
    let children: Packet[] = [];
    let end = 17;
    for (let i = 0; i < n; i++) {
      const child = parse(bin.slice(end + 1));
      children.push(child);
      end += child.length + 1;
    }
    return {
      version,
      type,
      children,
      length: end,
      value: getValue(type, children),
    };
  }
  return { version, type, length: 5, value: 0 };
};

const addVersions = (p: Packet): number =>
  p.version +
  ("children" in p && Array.isArray(p.children)
    ? p.children.map((x) => addVersions(x)).reduce((s, v) => s + v, 0)
    : 0);

const versionSum = (hex: string): number => {
  const bin = hexToBin(hex);
  const parsed = parse(bin);

  return addVersions(parsed);
};

const getParsedValue = (hex: string): number => {
  const bin = hexToBin(hex);
  const parsed = parse(bin);
  return parsed.value;
};

// test

assert.equal(versionSum("D2FE28"), 6);
assert.equal(versionSum("38006F45291200"), 9);
assert.equal(versionSum("8A004A801A8002F478"), 16);
assert.equal(versionSum("620080001611562C8802118E34"), 12);
assert.equal(versionSum("C0015000016115A2E0802F182340"), 23);
assert.equal(versionSum("A0016C880162017C3686B18A3D4780"), 31);

assert.equal(getParsedValue("C200B40A82"), 3);
assert.equal(getParsedValue("04005AC33890"), 54);
assert.equal(getParsedValue("880086C3E88112"), 7);
assert.equal(getParsedValue("CE00C43D881120"), 9);
assert.equal(getParsedValue("D8005AC2A8F0"), 1);
assert.equal(getParsedValue("F600BC2D8F"), 0);
assert.equal(getParsedValue("9C005AC2F8F0"), 0);
assert.equal(getParsedValue("9C0141080250320F1802104A08"), 1);

console.log("it works ✨");

// solution

const input = await fetch("https://adventofcode.com/2021/day/16/input", {
  headers: { cookie: `session=${process.env.SESSION_COOKIE}` },
});
const data = await input.text();

console.log("part 1 solution: ", versionSum(data));
console.log("part 2 solution: ", getParsedValue(data));
