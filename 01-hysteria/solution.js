const { readInputFile, splitByLine } = require('../utils');

const file = splitByLine(readInputFile(!!process.argv[2] ? process.argv[2] : 'data'));

// PARSE

const [arrOne, arrTwo] = [[], []];

file.forEach((line) => {
  const [first, second] = line.split('   ');
  arrOne.push(parseInt(first));
  arrTwo.push(parseInt(second));
});

// PART 1

arrOne.sort((a, b) => a - b);
arrTwo.sort((a, b) => a - b);

const resultOne = arrOne.reduce((acc, cur, i) => {
  return acc + Math.abs(cur - arrTwo[i]);
}, 0);

console.log('PART 1:', resultOne);

// PART 2

const unique = [...new Set(arrOne)];
const count = {};

unique.forEach((num) => {
  count[num] = 0;
});

arrTwo.forEach((num) => {
  count[num]++;
});

let resultTwo = 0;

arrOne.forEach((num, i) => {
  resultTwo += count[num] * num;
});

console.log('PART 2:', resultTwo);
