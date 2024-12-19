import { readInputFile, splitByLine } from '../utils.js';

let map = splitByLine(readInputFile(!!process.argv[2] ? process.argv[2] : 'data')).map((line) => line.split(''));

const directions = { up: [-1, 0], down: [1, 0], left: [0, -1], right: [0, 1] };

let initPos = [0, 0];

// add border
map = map.map((line) => ['@', ...line, '@']);
map.unshift(new Array(map[0].length).fill('@'));
map.push(new Array(map[0].length).fill('@'));

// find start
map.forEach((line, i) =>
  line.forEach((char, j) => {
    if (char === '^') {
      initPos = [i, j];
    }
  })
);

map[initPos[0]][initPos[1]] = '.';

const turnRight = (current) => {
  const sequence = ['up', 'right', 'down', 'left'];
  const index = sequence.indexOf(current);
  return sequence[(index + 1) % sequence.length];
};

const walkTheMap = (startPos, curDir, obsticle = null) => {
  let [i, j] = [...startPos];
  const path = new Set();
  while (true) {
    // check step with current direction
    const nextPosition = [i + directions[curDir][0], j + directions[curDir][1]];
    const nextSquare = map[nextPosition[0]][nextPosition[1]];
    if (nextSquare === '#' || nextPosition.join(':') === obsticle) {
      // obsticle change direction
      curDir = turnRight(curDir);
    } else if (nextSquare === '.') {
      //check if loop
      if (path.has(`${i}:${j};${curDir}`)) {
        return ['loop', path];
      }
      // make step
      path.add(`${i}:${j};${curDir}`);
      [i, j] = [...nextPosition];
    } else if (nextSquare === '@') {
      // check if out of bounds exit
      path.add(`${i}:${j};${curDir}`);
      return ['exit', path];
    }
  }
};

// PART 1

const [_, originalPath] = walkTheMap(initPos, 'up');
const visitedSquares = new Set();
originalPath.forEach((point) => {
  const [x, y] = point.split(';')[0].split(':');
  visitedSquares.add(`${x}:${y}`);
});
console.log('PART 1:', visitedSquares.size);

// PART 2

const obsticles = new Set();
visitedSquares.forEach((point) => {
  if (obsticles.has(point)) return;
  const [result, _] = walkTheMap(initPos, 'up', point);
  if (result === 'loop') {
    obsticles.add(point);
  }
});
console.log('PART 2:', obsticles.size);
