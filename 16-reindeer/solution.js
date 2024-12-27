import { createPriorityQueue, readInputFile } from '../utils.js';

const file = readInputFile(!!process.argv[2] ? process.argv[2] : 'data');

const initialMap = file.split('\n').map((row) => row.split(''));

let start = [0, 0];
let end = [0, 0];

for (let i = 0; i < initialMap.length; i++) {
  for (let j = 0; j < initialMap[0].length; j++) {
    if (initialMap[i][j] === 'S') {
      start = [i, j];
    }
    if (initialMap[i][j] === 'E') {
      end = [i, j];
    }
  }
}

const directions = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

function getKey(point, direction) {
  return `${point.i},${point.j},${direction}`;
}

const getScore = (map, start, end) => {
  const queue = createPriorityQueue('lo');
  queue.push([0, start[0], start[1], 1]);
  const visited = new Set();

  while (!queue.isEmpty()) {
    const [score, i, j, dir] = queue.pop();
    const key = `${i},${j},${dir}`;

    if (i === end[0] && j === end[1]) return score;
    if (visited.has(key)) continue;

    visited.add(key);

    const nextI = i + directions[dir][0];
    const nextJ = j + directions[dir][1];
    if (map[nextI]?.[nextJ] !== '#') {
      queue.push([score + 1, nextI, nextJ, dir]);
    }

    queue.push([score + 1000, i, j, (dir + 1) % 4]);
    queue.push([score + 1000, i, j, (dir + 3) % 4]);
  }

  return score;
};

const getPaths = (map, start, end, lowestScore) => {
  const queue = [[start[0], start[1], 1, 0, [start]]];
  const visited = new Map();
  const paths = [];

  while (queue.length) {
    const [i, j, dir, score, path] = queue.shift();
    const key = getKey({ i, j }, dir);

    if (score > lowestScore) continue;
    if (visited.has(key) && visited.get(key) < score) continue;
    visited.set(key, score);

    if (i === end[0] && j === end[1] && score === lowestScore) {
      paths.push(path);
      continue;
    }
    const nextI = i + directions[dir][0];
    const nextJ = j + directions[dir][1];

    if (map[nextI]?.[nextJ] !== '#') {
      queue.push([nextI, nextJ, dir, score + 1, [...path, { i: nextI, j: nextJ }]]);
    }
    queue.push([i, j, (dir + 1) % 4, score + 1000, [...path]]);
    queue.push([i, j, (dir + 3) % 4, score + 1000, [...path]]);
  }

  return paths;
};

const solve1 = (map, start, end) => {
  return getScore(map, start, end);
};

const solve2 = (map, start, end) => {
  const lowest = getScore(map, start, end);
  const paths = getPaths(map, start, end, lowest);
  const uniquePaths = new Set();
  paths.forEach((path) => {
    path.forEach((point) => uniquePaths.add(getKey(point, 0)));
  });
  return uniquePaths.size;
};

console.log('PART 1:', solve1(initialMap, start, end));
console.log('PART 2:', solve2(initialMap, start, end));
