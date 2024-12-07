const { readInputFile, splitByLine } = require('../utils');

const file = splitByLine(readInputFile(!!process.argv[2] ? process.argv[2] : 'data'));

// PART 1
let xmasCount = 0;

const findXmas = (line, print = false) => {
  const getMatches = (line) => {
    const matches = line.match(/XMAS/g);
    if (matches) xmasCount += matches.length;
    print && console.log(line, matches);
  };
  getMatches(line);
  getMatches(line.split('').reverse().join(''));
};

// form strings

// L to R
for (let i = 0; i < file.length; i++) {
  const line = file[i];
  findXmas(line);
}

// T to B
for (let i = 0; i < file[0].length; i++) {
  let line = '';
  for (let j = 0; j < file.length; j++) {
    line += file[j][i];
  }
  findXmas(line);
}

// 0:0 0:1 0:2 0:3
//    .   .   .
// 1:0 1:1 1:2 1:3
//    .   .   .
// 2:0 2:1 2:2 2:3
//    .   .   .
// 3:0 3:1 3:2 3:3

// i=0 => 0:0 1:1 2:2 3:3   | 0:0 1:1 2:2 3:3
// i=1 => 0:1 1:2 2:3       | 1:0 2:1 3:2
// i=2 => 0:2 1:3           | 2:0 3:1
// i=3 => 0:3               | 3:0

// diagonals TL to BR
for (let i = 0; i < file.length; i++) {
  let lineA = '';
  let lineB = '';
  for (let j = i; j < file.length; j++) {
    lineA += file[j - i][j];
    lineB += file[j][j - i];
  }
  findXmas(lineA);
  i && findXmas(lineB);
}

// i=0 => 3:0 2:1 1:2 0:3   | 3:0 2:1 1:2 0:3
// i=1 => 2:0 1:1 0:2       | 3:1 2:2 1:3
// i=2 => 1:0 0:1           | 3:2 2:3
// i=3 => 0:0               | 3:3

// diagonals BL to TR
for (let i = 0; i < file.length; i++) {
  let lineA = '';
  let lineB = '';
  for (let j = 0; j < file.length - i; j++) {
    lineA += file[file.length - j - i - 1][j];
    lineB += file[file.length - j - 1][i + j];
  }
  findXmas(lineA);
  i && findXmas(lineB);
}

console.log('Part 1:', xmasCount);

// PART 2
let bigXmasCount = 0;
const mas = ['MAS', 'SAM'];

const checkBigX = (i, j) => {
  const diagonalL = file[i - 1][j - 1] + file[i][j] + file[i + 1][j + 1];
  const diagonalR = file[i - 1][j + 1] + file[i][j] + file[i + 1][j - 1];
  return mas.includes(diagonalL) && mas.includes(diagonalR);
};

for (let i = 1; i < file.length - 1; i++) {
  for (let j = 1; j < file[0].length - 1; j++) {
    file[i][j] === 'A' && checkBigX(i, j) && bigXmasCount++;
  }
}

console.log('Part 2:', bigXmasCount);
