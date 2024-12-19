const fs = require('fs');

// == IO and parsing ==

// Load Input File
const readInputFile = (fileName) => {
  try {
    const data = fs.readFileSync(`./${fileName}.input`, 'utf-8');
    return data;
  } catch (err) {
    console.error(err);
    return;
  }
};

const splitByLine = (file) => file.split(/\r?\n/);
const splitByEmptyLine = (file) => file.split(/\r?\n\r?\n/);

// == MATH ==

// Greatest Common Divisor
const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));

// Least Common Multiple
const lcm = (a, b) => (a * b) / gcd(a, b);

// LCM for array
const findLCM = (numbers) => {
  let result = 1;
  for (let i = 0; i < numbers.length; i++) {
    result = lcm(result, numbers[i]);
  }
  return result;
};

// == Optimizations ==

// Caching Helper
const createCache = () => {
  let cache = {};
  return {
    check(key) {
      const keyString = JSON.stringify(key);
      return cache[keyString];
    },
    store(key, value) {
      cache[JSON.stringify(key)] = value;
    },
    clean() {
      cache = {};
    },
    getSize() {
      return Object.keys(cache).length;
    },
    getCache() {
      return cache;
    },
  };
};

// Priority Queue Helper
const createPriorityQueue = (priority) => {
  //priority 'lo' or 'hi' = sorting asc or desc
  let queue = [];
  return {
    push(item) {
      queue.push(item);
      priority === 'lo' ? queue.sort((a, b) => a[0] - b[0]) : queue.sort((a, b) => b[0] - a[0]);
    },
    pop() {
      return queue.shift();
    },
    isEmpty() {
      return queue.length === 0;
    },
    getQueue() {
      return queue;
    },
  };
};

// == Helpers ==

// Array Incrementer
const incrementArray = (arr, base) => {
  const n = arr.length;
  let carry = 1;

  for (let i = n - 1; i >= 0; i--) {
    const sum = arr[i] + carry;
    arr[i] = sum % base;
    carry = Math.floor(sum / base);
    if (carry === 0) {
      break;
    }
  }
  if (carry === 1) {
    arr.unshift(1);
  }

  return arr;
};

module.exports = {
  readInputFile,
  splitByLine,
  splitByEmptyLine,
  findLCM,
  createCache,
  createPriorityQueue,
  incrementArray,
};
