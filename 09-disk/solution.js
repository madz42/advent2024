import { readInputFile } from '../utils.js';

const file = readInputFile(!!process.argv[2] ? process.argv[2] : 'data');

const fileId = (i) => i / 2;

const disk = [];

// build disk form input
file
  .split('')
  .map((char) => parseInt(char))
  .forEach((item, i) => {
    for (let x = 0; x < item; x++) {
      if (i % 2 === 0) {
        disk.push(fileId(i));
      } else {
        disk.push('.');
      }
    }
  });

const getChecksum = (disk) => {
  return disk.reduce((acc, item, i) => {
    if (item !== '.') {
      acc += item * i;
    }
    return acc;
  }, 0);
};

const solvePart1 = (disk) => {
  let formattedDisk = [...disk];

  let [head, tail] = [0, formattedDisk.length - 1];

  while (head < tail) {
    const findFreeSpace = () => {
      for (let i = head; i < tail; i++) {
        if (formattedDisk[i] === '.') {
          return i;
        }
      }
    };
    const findFileAtEnd = () => {
      for (let i = tail; i > head; i--) {
        if (formattedDisk[i] !== '.') {
          return i;
        }
      }
    };
    head = findFreeSpace();
    tail = findFileAtEnd();
    if (head < tail) {
      formattedDisk[head] = formattedDisk[tail];
      formattedDisk[tail] = '.';
    }
  }

  // console.log('disk out:', formattedDisk.join(''));

  return formattedDisk;
};

const solvePart2 = (disk) => {
  let formattedDisk = [...disk];

  const freeSpace = [];
  const files = [];

  const findFreeSpaceChunks = () => {
    freeSpace.length = 0;
    formattedDisk.forEach((cell, i) => {
      if (cell === '.') {
        if (freeSpace.length === 0) {
          freeSpace.push({ start: i, end: i });
        } else if (freeSpace[freeSpace.length - 1].end === i - 1) {
          freeSpace[freeSpace.length - 1].end = i;
        } else {
          freeSpace.push({ start: i, end: i });
        }
      }
    });
  };

  const findAllFiles = () => {
    formattedDisk.forEach((cell, i) => {
      if (cell !== '.') {
        if (files.length === cell) {
          files.push({ id: cell, start: i, end: i });
        } else {
          files[cell] = { ...files[cell], end: i };
        }
      }
    });
  };

  findAllFiles();
  files.reverse();

  files.forEach((file) => {
    const { start, end } = file;
    const fileSize = end - start + 1;
    findFreeSpaceChunks();
    for (let i = 0; i < freeSpace.length; i++) {
      const { start: freeSpaceStart, end: freeSpaceEnd } = freeSpace[i];
      const freeSpaceSize = freeSpaceEnd - freeSpaceStart + 1;
      if (freeSpaceSize < fileSize) {
        continue;
      } else if (freeSpaceStart > start) {
        break;
      } else {
        // move file
        for (let j = 0; j < fileSize; j++) {
          formattedDisk[start + j] = '.';
          formattedDisk[freeSpaceStart + j] = file.id;
        }
        break;
      }
    }
  });

  // console.log('disk out:', formattedDisk.join(''));

  return formattedDisk;
};

// console.log('disk  in:', disk.join(''));
console.log('PART 1:', getChecksum(solvePart1(disk)));
// console.log('disk  in:', disk.join(''));
console.log('PART 2:', getChecksum(solvePart2(disk)));
