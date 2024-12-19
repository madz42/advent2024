import { readInputFile, splitByLine } from '../utils.js';

const file = splitByLine(readInputFile(!!process.argv[2] ? process.argv[2] : 'data'));

// console.log(file.join('\n'));

const antennas = {};

file.forEach((line, i) => {
  line.split('').forEach((char, j) => {
    if (char !== '.') {
      antennas[char] ? antennas[char].push([i, j]) : (antennas[char] = [[i, j]]);
    }
  });
});

// console.log(antennas);

// find antinodes

const antinodes = {};

const checkInBounds = (point) => {
  return point[0] >= 0 && point[0] < file.length && point[1] >= 0 && point[1] < file[0].length;
};

const shootBeam = (point, step, n) => {
  const beamPoints = n === 1 ? [] : [point];
  for (let i = 1; i <= n; i++) {
    const newPoint = [point[0] + step[0] * i, point[1] + step[1] * i];
    if (checkInBounds(newPoint)) {
      beamPoints.push(newPoint);
    } else {
      break;
    }
  }
  return beamPoints;
};

const getAntinodes = (pointA, pointB, n) => {
  const [diffI, diffJ] = [pointB[0] - pointA[0], pointB[1] - pointA[1]];
  const [diffX, diffY] = [pointA[0] - pointB[0], pointA[1] - pointB[1]];
  return [...shootBeam(pointB, [diffI, diffJ], n), ...shootBeam(pointA, [diffX, diffY], n)];
};

const runSolution = (repeats) => {
  Object.keys(antennas).forEach((antenna) => {
    for (let i = 0; i < antennas[antenna].length - 1; i++) {
      for (let j = i + 1; j < antennas[antenna].length; j++) {
        const newAntinodes = getAntinodes(antennas[antenna][i], antennas[antenna][j], repeats);
        antinodes[antenna] ? antinodes[antenna].push(...newAntinodes) : (antinodes[antenna] = newAntinodes);
      }
    }
  });

  const uniqueAntinodes = [];

  Object.keys(antinodes).forEach((antenna) => {
    antinodes[antenna].forEach((pos) => {
      const stringedPos = JSON.stringify(pos);
      if (!uniqueAntinodes.includes(stringedPos)) {
        uniqueAntinodes.push(stringedPos);
      }
    });
  });

  //   console.log('antinodes');
  //   console.log(antinodes);

  return uniqueAntinodes.length;
};

console.log('PART 1:', runSolution(1));
console.log('PART 2:', runSolution(999));

// print antinode maps
// Object.keys(antinodes).forEach((antenna) => {
//   const map = file.map((line) => line.split('').map((char) => '.'));
//   antennas[antenna].forEach((pos) => {
//     map[pos[0]][pos[1]] = antenna;
//   });
//   antinodes[antenna].forEach((pos) => {
//     if (pos[0] >= 0 && pos[0] < map.length && pos[1] >= 0 && pos[1] < map[0].length) {
//       map[pos[0]][pos[1]] = '#';
//     }
//   });
//   console.log(`==== ${antenna} ====`);
//   console.log(map.map((line) => line.join('')).join('\n'));
// });
