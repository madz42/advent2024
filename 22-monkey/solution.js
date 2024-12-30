import { readInputFile, splitByLine } from '../utils.js';

const input = splitByLine(readInputFile(!!process.argv[2] ? process.argv[2] : 'data')).map((x) => parseInt(x));

const prune = (number) => {
  return ((number % 16777216) + 16777216) % 16777216;
};

const hashRound = (number) => {
  number = prune((number * 64) ^ number);
  number = prune(Math.floor(number / 32) ^ number);
  number = prune((number * 2048) ^ number);
  return number;
};

const seqWithBananas = new Map();

const hash = (number) => {
  const hashList = [[number % 10, 0]];
  const knownSequences = new Set();

  for (let i = 0; i < 2000; i++) {
    number = hashRound(number);
    hashList.push([number % 10, (number % 10) - hashList[hashList.length - 1][0]]);
    if (i <= 3) continue;
    const sequence = [3, 2, 1, 0].map((x) => hashList[i - x + 1][1]).join(',');
    if (!knownSequences.has(sequence)) {
      knownSequences.add(sequence);
      seqWithBananas.set(sequence, seqWithBananas.get(sequence) + (number % 10) || number % 10);
    }
  }
  return number;
};

console.log(
  'PART 1:',
  input.reduce((acc, val) => acc + hash(val), 0)
);
console.log('PART 2:', Math.max(...seqWithBananas.values()));
