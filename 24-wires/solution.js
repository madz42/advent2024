import { readInputFile, splitByEmptyLine, splitByLine } from '../utils.js';

const [initialState, initialGates] = splitByEmptyLine(readInputFile(!!process.argv[2] ? process.argv[2] : 'data')).map(
  (part) => splitByLine(part)
);
const state = {};
initialState.forEach((line) => {
  const [output, value] = line.split(': ');
  state[output] = !!parseInt(value);
});

const gates = [];

initialGates.forEach((line) => {
  const [left, condition, right, output] = line.replace(' ->', '').split(' ');
  state[left] = state[left] ?? null;
  state[right] = state[right] ?? null;
  state[output] = state[output] ?? null;
  gates.push({ left, condition, right, output });
});

const solve1 = () => {
  const zOutputs = [];

  Object.keys(state).forEach((name) => {
    if (name.startsWith('z')) {
      zOutputs.push(name);
    }
  });

  zOutputs.sort().reverse();

  const checkResultsForZ = () => {
    return !zOutputs.map((output) => state[output]).some((value) => value === null);
  };

  const generateOutput = (left, right, condition) => {
    if (condition === 'AND') {
      return left && right;
    }
    if (condition === 'OR') {
      return left || right;
    }
    if (condition === 'XOR') {
      return left !== right;
    }
  };

  while (!checkResultsForZ()) {
    gates.forEach((gate) => {
      if (state[gate.left] !== null && state[gate.right] !== null && state[gate.output] === null) {
        state[gate.output] = generateOutput(state[gate.left], state[gate.right], gate.condition);
      }
    });
  }
  return parseInt(zOutputs.map((output) => (state[output] ? 1 : 0)).join(''), 2);
};

const findGateOutput = (inputA, inputB, operator) => {
  const matchingGate = gates.find((gate) => {
    return (
      ((gate.left === inputA && gate.right === inputB) || (gate.right === inputA && gate.left === inputB)) &&
      gate.condition === operator
    );
  });
  return matchingGate?.output;
};

const solve2 = () => {
  // Half adder logic:
  // inputA XOR inputB => sumPartial
  // inputA AND inputB => carryPartial
  // carryPrevious AND sumPartial => carryIntermediate
  // carryPrevious XOR sumPartial => sumFinal
  // carryIntermediate OR carryPartial => carryNext

  let swappedWires = [];
  let carryPrevious = null;
  for (let wireIndex = 0; wireIndex < 45; wireIndex++) {
    const wireIndexStr = wireIndex.toString().padStart(2, '0');
    let sumPartial, carryPartial, carryIntermediate, sumFinal, carryNext;

    sumPartial = findGateOutput(`x${wireIndexStr}`, `y${wireIndexStr}`, 'XOR');
    carryPartial = findGateOutput(`x${wireIndexStr}`, `y${wireIndexStr}`, 'AND');

    if (carryPrevious) {
      carryIntermediate = findGateOutput(carryPrevious, sumPartial, 'AND');
      if (!carryIntermediate) {
        [carryPartial, sumPartial] = [sumPartial, carryPartial];
        swappedWires.push(sumPartial, carryPartial);
        carryIntermediate = findGateOutput(carryPrevious, sumPartial, 'AND');
      }

      sumFinal = findGateOutput(carryPrevious, sumPartial, 'XOR');

      if (sumPartial?.startsWith('z')) {
        [sumPartial, sumFinal] = [sumFinal, sumPartial];
        swappedWires.push(sumPartial, sumFinal);
      }

      if (carryPartial?.startsWith('z')) {
        [carryPartial, sumFinal] = [sumFinal, carryPartial];
        swappedWires.push(carryPartial, sumFinal);
      }

      if (carryIntermediate?.startsWith('z')) {
        [carryIntermediate, sumFinal] = [sumFinal, carryIntermediate];
        swappedWires.push(carryIntermediate, sumFinal);
      }

      carryNext = findGateOutput(carryIntermediate, carryPartial, 'OR');
    }

    if (carryNext?.startsWith('z') && carryNext !== 'z45') {
      [carryNext, sumFinal] = [sumFinal, carryNext];
      swappedWires.push(carryNext, sumFinal);
    }

    carryPrevious = carryPrevious ? carryNext : carryPartial;
  }
  return swappedWires.sort().join(',');
};

console.log('PART 1:', solve1());
console.log('PART 2:', solve2());
