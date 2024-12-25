import { readInputFile, splitByLine } from '../utils.js';

const file = splitByLine(readInputFile(!!process.argv[2] ? process.argv[2] : 'data'));

const initialRobots = file.map((line) => {
  let [position, velocity] = line.split(' ');
  position = position
    .replace('p=', '')
    .split(',')
    .map((item) => parseInt(item));
  velocity = velocity
    .replace('v=', '')
    .split(',')
    .map((item) => parseInt(item));
  return { position, velocity };
});

// const mapSize = [11, 7];
const mapSize = [101, 103];

const solve1 = (robots, time) => {
  const quadrants = [0, 0, 0, 0];
  for (let i = 0; i < robots.length; i++) {
    robots[i].position[0] = (robots[i].position[0] + robots[i].velocity[0] * time + mapSize[0] * time) % mapSize[0];
    robots[i].position[1] = (robots[i].position[1] + robots[i].velocity[1] * time + mapSize[1] * time) % mapSize[1];
    if (robots[i].position[0] === Math.floor(mapSize[0] / 2) || robots[i].position[1] === Math.floor(mapSize[1] / 2))
      continue;
    const quadrant =
      Math.floor(robots[i].position[0] / Math.ceil(mapSize[0] / 2)) +
      Math.floor(robots[i].position[1] / Math.ceil(mapSize[1] / 2)) * 2;
    quadrants[quadrant]++;
  }

  return quadrants.reduce((acc, val) => acc * val, 1);
};

const solve2 = (robots) => {
  let step = 0;
  while (true) {
    step++;
    for (let i = 0; i < robots.length; i++) {
      robots[i].position[0] = (robots[i].position[0] + robots[i].velocity[0] + mapSize[0]) % mapSize[0];
      robots[i].position[1] = (robots[i].position[1] + robots[i].velocity[1] + mapSize[1]) % mapSize[1];
    }
    const currentPositions = new Set(robots.map((robot) => `${robot.position[0]},${robot.position[1]}`));
    for (const position of currentPositions) {
      const [x, y] = position.split(',').map((num) => parseInt(num));
      let isStacked = true;
      for (let j = 0; j <= 2; j++) {
        for (let k = 0; k <= 2; k++) {
          if (!currentPositions.has(`${x + k},${y + j}`)) {
            isStacked = false;
            break;
          }
        }
        if (!isStacked) break;
      }
      if (isStacked) return step;
    }
  }
};

console.log('PART 1:', solve1(structuredClone(initialRobots), 100));
console.log('PART 2:', solve2(structuredClone(initialRobots)));
