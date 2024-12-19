import { readInputFile, splitByLine, incrementArray } from '../utils.js';

const file = splitByLine(readInputFile(!!process.argv[2] ? process.argv[2] : 'data'));

const equeations = file.map((line) => {
  const [left, right] = line.split(': ');
  return { result: parseInt(left), operators: right.split(' ').map((item) => parseInt(item)) };
});

const valid = [];

const checkIfValid = (equeation, base) => {
  const { result, operators } = equeation;
  const actions = Array(operators.length).fill(0);
  const totalIterations = base ** (operators.length - 1);

  for (let i = 0; i < totalIterations; i++) {
    // apply actions
    const testResult = operators.reduce((res, cur, i) => {
      if (actions[i] === 0) {
        return res + cur;
      } else if (actions[i] === 1) {
        return res * cur;
      } else if (actions[i] === 2) {
        return parseInt(`${res}${cur}`);
      } else {
        return res;
      }
    }, 0);
    if (testResult === result) {
      return true;
    }
    incrementArray(actions, base);
  }
  return false;
};

// PART 1
equeations.forEach((equeation) => {
  if (checkIfValid(equeation, 2)) {
    valid.push(equeation);
  }
});

console.log(
  'PART 1:',
  valid.reduce((acc, equeation) => acc + equeation.result, 0)
);

// PART 2
valid.length = 0;

equeations.forEach((equeation) => {
  if (checkIfValid(equeation, 3)) {
    valid.push(equeation);
  }
});

console.log(
  'PART 2:',
  valid.reduce((acc, equeation) => acc + equeation.result, 0)
);
