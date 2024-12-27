import { readInputFile, splitByEmptyLine, splitByLine } from '../utils.js';

const file = splitByEmptyLine(readInputFile(!!process.argv[2] ? process.argv[2] : 'data'));

const registers = {};
splitByLine(file[0]).forEach((line) => {
  const [register, value] = line.split(': ');
  registers[register.replace('Register ', '')] = parseInt(value);
});

const program = file[1].replace('Program: ', '').split(',');

const out = [];

let [a, b, c] = [registers.A, registers.B, registers.C];
let currentCommandId = 0;

const runProgram = () => {
  out.length = 0;
  currentCommandId = 0;
  while (program[currentCommandId]) {
    instructions[program[currentCommandId]]();
    currentCommandId += 2;
  }
};

const instructions = {
  0: () => (a = Math.floor(a / (1 << comboOperand()))),
  1: () => (b = b ^ program[currentCommandId + 1]),
  2: () => (b = comboOperand() & 7),
  3: () => a && (currentCommandId = program[currentCommandId + 1] - 2),
  4: () => (b = b ^ c),
  5: () => out.push(comboOperand() & 7),
  6: () => (b = Math.floor(a / (1 << comboOperand()))),
  7: () => (c = Math.floor(a / (1 << comboOperand()))),
};

const comboOperand = () => [0, 1, 2, 3, a, b, c][program[currentCommandId + 1]];

const findInitialRegisterA = (nextValue = 0, i = program.length - 1) => {
  if (i < 0) return nextValue;
  for (let aValue = nextValue * 8; aValue < nextValue * 8 + 8; aValue++) {
    a = aValue;
    runProgram();
    if (out[0] === parseInt(program[i])) {
      const finalVal = findInitialRegisterA(aValue, i - 1);
      if (finalVal >= 0) return finalVal;
    }
  }
  return -1;
};

const solve1 = () => {
  runProgram();
  return out.join(',');
};
const solve2 = () => {
  return findInitialRegisterA();
};

console.log('PART 1:', solve1());
console.log('PART 2:', solve2());
