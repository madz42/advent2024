import { readInputFile, splitByLine } from '../utils.js';

const file = splitByLine(readInputFile(!!process.argv[2] ? process.argv[2] : 'data'));

const connections = new Map();

file.forEach((line) => {
  const [nodeA, nodeB] = line.split('-');
  if (!connections.has(nodeA)) connections.set(nodeA, new Set());
  if (!connections.has(nodeB)) connections.set(nodeB, new Set());
  connections.get(nodeA).add(nodeB);
  connections.get(nodeB).add(nodeA);
});

const bronKerboschAlg = (clique, options, excluded, connections, maxClique) => {
  if (options.size === 0 && excluded.size === 0) {
    if (clique.size > maxClique.size) {
      maxClique.clear();
      clique.forEach((node) => maxClique.add(node));
    }
    return;
  }

  const available = Array.from(options);
  for (const vertex of available) {
    clique.add(vertex);
    const neighbors = connections.get(vertex) || new Set();
    bronKerboschAlg(
      clique,
      new Set([...options].filter((v) => neighbors.has(v))),
      new Set([...excluded].filter((v) => neighbors.has(v))),
      connections,
      maxClique
    );
    clique.delete(vertex);
    options.delete(vertex);
    excluded.add(vertex);
  }
};

const solve1 = (connections) => {
  const triplets = new Set();
  for (const [node, neighbors] of connections) {
    const neighborArray = Array.from(neighbors);
    for (let i = 0; i < neighborArray.length; i++) {
      for (let j = i + 1; j < neighborArray.length; j++) {
        const [node1, node2] = [neighborArray[i], neighborArray[j]];
        if (connections.get(node1)?.has(node2)) {
          const triplet = [node, node1, node2].sort().join(',');
          triplets.add(triplet);
        }
      }
    }
  }
  const tripletsArray = Array.from(triplets).map((triplet) => triplet.split(','));
  return tripletsArray.filter((triplet) => triplet.some((node) => node.startsWith('t'))).length;
};

const solve2 = (connections) => {
  const maxClique = new Set();
  bronKerboschAlg(new Set(), new Set(connections.keys()), new Set(), connections, maxClique);
  return Array.from(maxClique).sort().join(',');
};

console.log('PART 1:', solve1(connections));
console.log('PART 2:', solve2(connections));
