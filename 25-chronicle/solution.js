import { readInputFile, splitByEmptyLine, splitByLine } from '../utils.js';

const file = splitByEmptyLine(readInputFile(!!process.argv[2] ? process.argv[2] : 'data'));

const locks = [];
const keys = [];

file.forEach((chunk) => {
  const line = splitByLine(chunk);
  const isLock = line[0][0] === '#';
  const heights = [];
  for (let i = 0; i < line[0].length; i++) {
    const total = line.reduce((sum, row) => sum + (row[i] === '#' ? 1 : 0), 0) - 1;
    heights.push(total);
  }
  isLock ? locks.push(heights) : keys.push(heights);
});

let result = 0;
keys.forEach((key) => {
  locks.forEach((lock) => {
    if (lock.every((pin, i) => pin + key[i] <= 5)) {
      result++;
    }
  });
});

console.log(result);
