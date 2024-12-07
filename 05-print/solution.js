const { readInputFile, splitByLine, splitByEmptyLine } = require('../utils');

const [fileRules, fileUpdates] = splitByEmptyLine(readInputFile(!!process.argv[2] ? process.argv[2] : 'data')).map(
  splitByLine
);

const rules = {};
const correctUpdates = [];
const incorrectUpdates = [];
const updates = [];

fileRules.forEach((line) => {
  const [before, after] = line.split('|');
  rules[before] = rules[before] ? [...rules[before], after] : [after];
});

fileUpdates.forEach((line) => {
  updates.push(line.split(','));
});

// PART 1
updates.forEach((update) => {
  let updateIsCorrect = true;
  update.forEach((item, i) => {
    const afterItemsRule = rules[item];
    afterItemsRule?.forEach((afterItem) => {
      const foundItem = update.findIndex((updateItem) => updateItem === afterItem);
      if (foundItem < i && foundItem !== -1) updateIsCorrect = false;
    });
  });
  if (updateIsCorrect) {
    correctUpdates.push(update);
  } else {
    incorrectUpdates.push(update);
  }
});

console.log(
  'Part 1',
  correctUpdates.reduce((acc, cur) => acc + parseInt(cur[(cur.length - 1) / 2]), 0)
);

// PART 2
const fixedUpdates = incorrectUpdates.map((update) => {
  return update.toSorted((a, b) => {
    const aRule = rules[a];
    if (aRule) {
      if (aRule.includes(b)) {
        return -1;
      }
    }
    return 0;
  });
});

console.log(
  'Part 2',
  fixedUpdates.reduce((acc, cur) => acc + parseInt(cur[(cur.length - 1) / 2]), 0)
);
