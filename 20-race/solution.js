import { readInputFile, splitByLine } from '../utils.js';
const map = splitByLine(readInputFile(!!process.argv[2] ? process.argv[2] : 'data')).map((line) => line.split(''));

const directions = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

let start = { x: 0, y: 0 };
let end = { x: 0, y: 0 };

for (let y = 0; y < map.length; y++) {
  for (let x = 0; x < map[0].length; x++) {
    if (map[y][x] === 'S') {
      start = { x, y };
    } else if (map[y][x] === 'E') {
      end = { x, y };
    }
  }
}

const getNeighbors = (x, y) => {
  const neighbors = [];
  for (const direction of directions) {
    const [dx, dy] = direction;
    if (x + dx < 0 || x + dx >= map[0].length || y + dy < 0 || y + dy >= map.length) continue;
    if (map[y + dy] && map[y + dy][x + dx] !== '#') {
      neighbors.push([x + dx, y + dy]);
    }
  }
  return neighbors;
};

const solve = (distance) => {
  const path = [];
  const visited = new Set();
  const queue = [{ ...start }];
  while (queue.length) {
    const { x, y } = queue.shift();
    path.push({ x, y });
    if (x === end.x && y === end.y) break;
    visited.add(`${x}:${y}`);
    const neighbours = getNeighbors(x, y).filter((point) => !visited.has(`${point[0]}:${point[1]}`));
    queue.push({ x: neighbours[0][0], y: neighbours[0][1] });
  }

  let cheats = 0;
  for (let firstPos = 0; firstPos < path.length - 1; firstPos++) {
    for (let secondPos = firstPos + 1; secondPos < path.length; secondPos++) {
      const savedWithCheating = secondPos - firstPos;
      const deltaX = Math.abs(path[firstPos].x - path[secondPos].x);
      const deltaY = Math.abs(path[firstPos].y - path[secondPos].y);
      if (deltaX + deltaY <= distance) {
        if (savedWithCheating - (deltaX + deltaY) >= 100) cheats++;
      }
    }
  }
  return cheats;
};

console.log('PART 1:', solve(2));
console.log('PART 2:', solve(20));
