import { readInputFile, splitByEmptyLine, splitByLine } from '../utils.js';

let [initialMap, movesList] = splitByEmptyLine(readInputFile(!!process.argv[2] ? process.argv[2] : 'data'));

initialMap = splitByLine(initialMap).map((line) => line.split(''));
movesList = splitByLine(movesList).join('').split('');

const directions = {
  '>': [1, 0],
  '<': [-1, 0],
  '^': [0, -1],
  v: [0, 1],
};

const compareVectors = (vectorA, vectorB) => {
  return vectorA.length === vectorB.length && vectorA.every((v, i) => v === vectorB[i]);
};

const addVector = (vectorA, vectorB) => {
  return vectorA.map((v, i) => v + vectorB[i]);
};

const solve = (initMap, moves, boxSize = 1) => {
  const blockAtPosition = (position) => {
    return map[position[1]][position[0]];
  };

  const getRobot = () => {
    return objects.filter((obj) => obj.type === 'robot')[0];
  };

  let objects = [];

  let map = initMap.map((row) => {
    const newRow = [];
    row.forEach((char) => {
      for (let i = 0; i < boxSize; i++) newRow.push(char === '#' ? '#' : '.');
    });
    return newRow;
  });

  const moveObject = (directionChar, object) => {
    const direction = directions[directionChar];
    const oldPosition = object.position.map((coord, i) => coord + direction[i]);
    const newPosition = addVector(oldPosition, addVector(object.size, [-1, -1]));

    if (blockAtPosition(oldPosition) === '#' || blockAtPosition(newPosition) === '#') return false;

    let obstacles = objects.filter((obj) => {
      if (compareVectors(obj.position, object.position)) return false;
      if (obj.size[0] === 1)
        return compareVectors(obj.position, oldPosition) || compareVectors(obj.position, newPosition);
      return (
        compareVectors(obj.position, oldPosition) ||
        compareVectors(obj.position, newPosition) ||
        compareVectors(addVector(obj.position, [1, 0]), oldPosition)
      );
    });

    if (obstacles.length === 0 || obstacles.every((obsticle) => moveObject(directionChar, obsticle))) {
      object.position = oldPosition;
      return true;
    } else {
      return false;
    }
  };

  initMap.forEach((row, y) =>
    row.forEach((char, x) => {
      if (['#', '.'].includes(char)) return true;
      objects.push({
        position: [x * boxSize, y],
        type: char === '@' ? 'robot' : 'box',
        size: char === '@' ? [1, 1] : [boxSize, 1],
      });
      initMap[y][x] = '.';
    })
  );

  moves.forEach((directionChar) => {
    let state = objects.map((obj) => ({ position: obj.position.slice(), size: obj.size.slice(), type: obj.type }));
    if (!moveObject(directionChar, getRobot())) objects = state;
  });

  return objects
    .filter((obj) => obj.type === 'box')
    .reduce((acc, obj) => acc + obj.position[1] * 100 + obj.position[0], 0);
};

console.log('PART 1:', solve(structuredClone(initialMap), structuredClone(movesList)));
console.log('PART 2:', solve(structuredClone(initialMap), structuredClone(movesList), 2));
