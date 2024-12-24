import { readInputFile, splitByEmptyLine, splitByLine } from '../utils.js';

const file = splitByEmptyLine(readInputFile(!!process.argv[2] ? process.argv[2] : 'data')).map((section) => {
  let [buttonA, buttonB, prize] = splitByLine(section);
  buttonA = buttonA
    .replace('Button A: X+', '')
    .replace('Y+', '')
    .split(', ')
    .map((coord) => parseInt(coord));
  buttonB = buttonB
    .replace('Button B: X+', '')
    .replace('Y+', '')
    .split(', ')
    .map((coord) => parseInt(coord));
  prize = prize
    .replace('Prize: X=', '')
    .replace('Y=', '')
    .split(', ')
    .map((coord) => parseInt(coord));
  return {
    a: { x: buttonA[0], y: buttonA[1] },
    b: { x: buttonB[0], y: buttonB[1] },
    prize: { x: prize[0], y: prize[1] },
  };
});

const moveClaw = (add = 0) => {
  let result = 0;
  for (let i = 0; i < file.length; i++) {
    const { x: aX, y: aY } = file[i].a;
    const { x: bX, y: bY } = file[i].b;
    let { x: pX, y: pY } = file[i].prize;

    pX += add;
    pY += add;

    const x = (pX * bY - pY * bX) / (aX * bY - aY * bX);
    const y = (aX * pY - aY * pX) / (aX * bY - aY * bX);

    if (x % 1 === 0 && y % 1 === 0) {
      result += x * 3 + y;
    }
  }
  return result;
};
console.log('PART 1:', moveClaw());
console.log('PART 2:', moveClaw(10_000_000_000_000));
