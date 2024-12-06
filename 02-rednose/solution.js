const { readInputFile, splitByLine } = require('../utils');

const file = splitByLine(readInputFile(!!process.argv[2] ? process.argv[2] : 'data'));

const reports = file.map((line) => line.split(' ').map((item) => parseInt(item)));

const isSafeReport = (report) => {
  const isIncreasing = report.reduce((acc, cur, i) => {
    if (i === 0) return true;
    return acc && cur > report[i - 1];
  }, true);
  const isDecreasing = report.reduce((acc, cur, i) => {
    if (i === 0) return true;
    return acc && cur < report[i - 1];
  }, true);
  const maxStep = report.reduce((acc, cur, i) => {
    return acc > Math.abs(cur - report[i - 1]) ? acc : Math.abs(cur - report[i - 1]);
  }, 0);
  return (isDecreasing || isIncreasing) && maxStep <= 3;
};

const isSafeReportWithProblemDampener = (report) => {
  if (isSafeReport(report)) return true;
  for (let i = 0; i < report.length; i++) {
    const newReport = report.toSpliced(i, 1);
    if (isSafeReport(newReport)) return true;
  }
  return false;
};

console.log(
  'PART 1:',
  reports.reduce((acc, report) => {
    if (isSafeReport(report)) return acc + 1;
    return acc;
  }, 0)
);

console.log(
  'PART 2:',
  reports.reduce((acc, report) => {
    if (isSafeReportWithProblemDampener(report)) return acc + 1;
    return acc;
  }, 0)
);
