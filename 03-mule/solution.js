const { readInputFile, splitByLine } = require('../utils');

const file = splitByLine(readInputFile(!!process.argv[2] ? process.argv[2] : 'data'));

// console.log(file);

const regex = /mul\((\d+),(\d+)\)/g;

let result = 0;

file.forEach((line) => {
  const matches = line.match(regex);
  if (matches) {
    matches.forEach((match) => {
      match = match.replace('mul(', '').replace(')', '');
      const [first, second] = match.split(',').map((item) => parseInt(item));
      result += first * second;
    });
  }
});

console.log('PART 1:', result);

result = 0;
let isLastDo = true;

file.forEach((line) => {
  const matches = line.match(regex);
  if (matches) {
    matches.forEach((match) => {
      const doIndex = line.slice(0, line.indexOf(match)).lastIndexOf(`do()`);
      const dontIndex = line.slice(0, line.indexOf(match)).lastIndexOf(`don't()`);
      if (doIndex > dontIndex || (doIndex === -1 && isLastDo)) {
        isLastDo = true;
        match = match.replace('mul(', '').replace(')', '');
        const [first, second] = match.split(',').map((item) => parseInt(item));
        result += first * second;
      } else if (dontIndex > doIndex) isLastDo = false;
    });
  }
});

console.log('PART 2:', result);
