import { readInputFile, splitByLine, cachedFunction } from '../utils.js';

const codeList = splitByLine(readInputFile(!!process.argv[2] ? process.argv[2] : 'data'));

const makePad = (pad) => {
  const buttons = {};
  for (let i = 0; i < pad.length; i++) {
    for (let j = 0; j < pad[0].length; j++) {
      buttons[pad[i][j]] = [i, j];
    }
  }
  return buttons;
};

const numpad = makePad(['789', '456', '123', ' 0A']);
const arrowpad = makePad([' ^A', '<v>']);

const getDirectionalSequence = (fromPosition, toPosition, level, ignore) => {
  const [fromI, fromJ] = fromPosition;
  const [toI, toJ] = toPosition;
  let result = null;
  const queue = [[fromI, fromJ, '']];

  while (queue.length) {
    const [curI, curJ, path] = queue.shift();

    if (curI === toI && curJ === toJ) {
      const currentResult = sequenceForRobot(path + 'A', level - 1);
      result = result === null ? currentResult : Math.min(result, currentResult);
    } else if (!(curI === ignore[0] && curJ === ignore[1])) {
      if (curJ < toJ) queue.push([curI, curJ + 1, path + '>']);
      else if (curJ > toJ) queue.push([curI, curJ - 1, path + '<']);
      if (curI < toI) queue.push([curI + 1, curJ, path + 'v']);
      else if (curI > toI) queue.push([curI - 1, curJ, path + '^']);
    }
  }
  return result;
};

const cachedSequence = cachedFunction(getDirectionalSequence);

const sequenceForRobot = (path, level) => {
  if (level === 1) return path.length;

  let result = 0;
  let [fromI, fromJ] = arrowpad['A'];

  for (const button of path) {
    const [toI, toJ] = arrowpad[button];
    result += cachedSequence([fromI, fromJ], [toI, toJ], level, arrowpad[' ']);
    [fromI, fromJ] = [toI, toJ];
  }

  return result;
};

const solve = (codes, robotsCount) => {
  let result = 0;
  for (const code of codes) {
    let sequnceLength = 0;
    let [fromI, fromJ] = numpad['A'];
    for (const button of code) {
      const [toI, toJ] = numpad[button];
      sequnceLength += cachedSequence([fromI, fromJ], [toI, toJ], robotsCount + 2, numpad[' ']);
      [fromI, fromJ] = [toI, toJ];
    }
    result += sequnceLength * parseInt(code.replace('A', ''), 10);
  }
  return result;
};

console.log('PART 1:', solve(codeList, 2));
console.log('PART 2:', solve(codeList, 25));
