import { readInputFile, splitByLine } from '../utils.js';

const file = splitByLine(readInputFile(!!process.argv[2] ? process.argv[2] : 'data'));

const ramSize = 71;
// const ramSize = 7;

const directions = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

const bytes = file.map((line) => line.split(',').map((x) => parseInt(x)));

const findPath = (grid, start, end) => {
  const queue = [start];
  const visited = new Set();
  let step = 0;

  while (queue.length) {
    const width = queue.length;
    for (let i = 0; i < width; i++) {
      const [x, y] = queue.shift();
      if (x === end[0] && y === end[1]) {
        return step;
      }

      for (const [deltaX, deltaY] of directions) {
        const nextX = x + deltaX;
        const nextY = y + deltaY;
        if (
          nextX < 0 ||
          nextX >= grid.length ||
          nextY < 0 ||
          nextY >= grid[0].length ||
          grid[nextX][nextY] === '#' ||
          visited.has(`${nextX}:${nextY}`)
        ) {
          continue;
        }
        queue.push([nextX, nextY]);
        visited.add(`${nextX}:${nextY}`);
      }
    }
    step++;
  }

  return -1;
};

const solve1 = (runs = bytes.length) => {
  const currentGrid = Array(ramSize)
    .fill(null)
    .map(() => Array(ramSize).fill('.'));

  for (let i = 0; i < runs; i++) {
    const [y, x] = bytes[i];
    currentGrid[x][y] = '#';
  }

  const start = [0, 0];
  const end = [ramSize - 1, ramSize - 1];

  const pathScore = findPath(currentGrid, start, end);

  return pathScore;
};

const solve2 = (runs = bytes.length) => {
  const currentGrid = Array(ramSize)
    .fill(null)
    .map(() => Array(ramSize).fill('.'));

  for (let i = 0; i < runs; i++) {
    const [y, x] = bytes[i];
    currentGrid[x][y] = '#';

    const start = [0, 0];
    const end = [ramSize - 1, ramSize - 1];
    const pathScore = findPath(currentGrid, start, end);

    if (pathScore === -1) {
      return `${y},${x}`;
    }
  }
};

console.log('PART 1:', solve1(1024));
console.log('PART 2:', solve2());
