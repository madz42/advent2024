import { readInputFile, splitByLine } from '../utils.js';

const file = splitByLine(readInputFile(!!process.argv[2] ? process.argv[2] : 'data'));

let result1 = 0;
let result2 = 0;
const visited = new Set();

for (let i = 0; i < file.length; i++) {
  for (let j = 0; j < file[0].length; j++) {
    if (visited.has([i, j].join(':'))) continue;
    const char = file[i][j];
    let area = 0;
    let walls = {};
    let perimeter = 0;
    const crawl = (i, j, prevI, prevJ) => {
      if (i < 0 || i >= file.length || file[i][j] !== char) {
        if (j == prevJ) {
          !walls[['i', i, prevI]] ? (walls[['i', i, prevI]] = [j]) : walls[['i', i, prevI]].push(j);
        } else {
          !walls[['j', j, prevJ]] ? (walls[['j', j, prevJ]] = [i]) : walls[['j', j, prevJ]].push(i);
        }
        perimeter++;
        return;
      }
      if (visited.has([i, j].join(':'))) return;
      area++;
      visited.add([i, j].join(':'));
      crawl(i - 1, j, i, j);
      crawl(i + 1, j, i, j);
      crawl(i, j - 1, i, j);
      crawl(i, j + 1, i, j);
    };
    crawl(i, j);
    let wallCount = 0;
    for (let wall in walls) {
      let currentWall = walls[wall];
      currentWall.sort((a, b) => a - b);
      let prev = -100_000;
      for (let x of currentWall) {
        if (x > prev + 1) wallCount++;
        prev = x;
      }
    }
    result1 += area * perimeter;
    result2 += area * wallCount;
  }
}

console.log('PART 1:', result1);
console.log('PART 2:', result2);
