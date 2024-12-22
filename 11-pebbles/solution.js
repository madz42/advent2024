import { createCache, readInputFile } from '../utils.js';

const file = readInputFile(!!process.argv[2] ? process.argv[2] : 'data');

const stones = file.split(' ').map((item) => parseInt(item));

const checkRules = (stone) => {
  if (stone === 0) {
    // mark 1
    return 0;
  } else if (stone.toString().length % 2 === 0) {
    // split to 2
    return 1;
  } else {
    // multiply by 2024
    return 2;
  }
};

const cache = createCache();

const blink = (stone, currentBlick, needToBlink) => {
  const cached = cache.check([stone, currentBlick, needToBlink]);
  if (cached !== undefined) return cached;
  let result = 0;
  const rule = checkRules(stone);
  if (currentBlick === needToBlink) {
    result = 1;
  } else if (rule === 0) {
    result = blink(1, currentBlick + 1, needToBlink);
  } else if (rule === 1) {
    const oldStone = stone.toString();
    const middle = oldStone.length / 2;
    const first = blink(parseInt(oldStone.slice(0, middle)), currentBlick + 1, needToBlink);
    const second = blink(parseInt(oldStone.slice(middle)), currentBlick + 1, needToBlink);
    result = first + second;
  } else if (rule === 2) {
    result = blink(stone * 2024, currentBlick + 1, needToBlink);
  }
  cache.store([stone, currentBlick, needToBlink], result);
  return result;
};

console.log(
  'PART 1:',
  stones.map((stone) => blink(stone, 0, 25)).reduce((acc, val) => acc + val, 0)
);

console.log(
  'PART 2:',
  stones.map((stone) => blink(stone, 0, 75)).reduce((acc, val) => acc + val, 0)
);
