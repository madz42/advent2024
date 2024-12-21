import { readInputFile, splitByLine } from '../utils.js';

let file = splitByLine(readInputFile(!!process.argv[2] ? process.argv[2] : 'data'));

// add border
file = file.map((line) => `#${line}#`);
file.unshift(new Array(file[0].length).fill('#').join(''));
file.push(new Array(file[0].length).fill('#').join(''));

// console.log(file.join('\n'));

const directions = { up: [-1, 0], down: [1, 0], left: [0, -1], right: [0, 1] };
const sequence = Object.keys(directions);

const trailHeads = [];
file.forEach((line, i) =>
  line.split('').forEach((char, j) => {
    if (char === '0') trailHeads.push([i, j]);
  })
);

const check = (currentChar, nextChar) => {
  if (nextChar === '#') {
    return false;
  }
  const [current, next] = [parseInt(currentChar), parseInt(nextChar)];
  return current + 1 === next;
};

const trails = {};

const hike = (startPos, currentChar, head, path) => {
  const [i, j] = startPos;
  for (const direction of sequence) {
    const nextPosition = [i + directions[direction][0], j + directions[direction][1]];
    const nextChar = file[nextPosition[0]][nextPosition[1]];
    if (check(currentChar, nextChar)) {
      if (nextChar === '9') {
        trails[head.join(':')] === undefined
          ? (trails[head.join(':')] = [path + ';' + nextPosition.join(':')])
          : trails[head.join(':')].push(path + ';' + nextPosition.join(':'));
      } else {
        hike(nextPosition, file[nextPosition[0]][nextPosition[1]], head, path + ';' + nextPosition.join(':'));
      }
    }
  }
};
trailHeads.forEach((trailHead) => {
  hike(trailHead, file[trailHead[0]][trailHead[1]], trailHead, trailHead.join(':'));
});

const scores = {};
Object.keys(trails).forEach((head) => {
  scores[head] = new Set();
  trails[head].forEach((trail) => {
    scores[head].add(trail.split(';').reverse()[0]);
  });
});

// console.log(trails);
// console.log(scores);

// scores - number of nines reached from each trail head
console.log(
  'PART 1:',
  Object.values(scores).reduce((acc, val) => acc + val.size, 0)
);

// ranking - number of unique trails from each trail head
console.log(
  'PART 2:',
  Object.values(trails).reduce((acc, val) => acc + val.length, 0)
);
