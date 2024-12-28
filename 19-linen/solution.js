import { readInputFile, splitByEmptyLine, splitByLine } from '../utils.js';

const file = splitByEmptyLine(readInputFile(!!process.argv[2] ? process.argv[2] : 'data'));

const towels = new Set(file[0].split(', '));
const designs = splitByLine(file[1]);

let [result1, result2] = [0, 0];

for (let design of designs) {
  let valids = [1];
  for (let i = 0; i < design.length; i++) {
    if (!valids[i]) continue;
    for (let j = i + 1; j <= design.length; j++) {
      if (i === 0) valids[j] = 0;
      if (towels.has(design.substring(i, j))) valids[j] += valids[i];
    }
  }
  if (valids[design.length]) result1++;
  result2 += valids[design.length];
}

console.log('PART 1:', result1);
console.log('PART 2:', result2);
