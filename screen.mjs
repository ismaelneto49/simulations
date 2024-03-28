const entities = {
  SCREEN: [[]],
  SCREEN_HEIGHT: 30,
  SCREEN_LENGTH: 63,
  BUFFER: [],
  FILL: "  ",
  write,
  get,
  animate,
  print,
  save,
};
entities.SCREEN = generateScreen(
  entities.SCREEN_LENGTH,
  entities.SCREEN_HEIGHT,
  entities.FILL
);

function generateScreen(length, height, fill) {
  return Array.from({ length: length }, () =>
    Array.from({ length: height }, () => null).fill(fill)
  );
}

function print(screen) {
  function transformMatrix(matrix) {
    return matrix[0]
      .map((_, colIndex) => matrix.map((row) => row[colIndex]))
      .reverse();
  }
  const cartesianMatrix = transformMatrix(screen);

  cartesianMatrix.forEach((row) => console.log(row.join("")));
  console.log("");
}

function save() {
  function deepCopy(matrix) {
    return matrix.map((row) => [...row]);
  }
  entities.BUFFER.push(deepCopy(entities.SCREEN));
}

function animate(frequency = 5) {
  let i = 0;
  const interval = setInterval(() => {
    if (i == entities.BUFFER.length - 1) {
      stopAnimation();
    }
    print(entities.BUFFER[i++]);
  }, frequency);

  function stopAnimation() {
    clearInterval(interval);
  }
}

function write({ x, y }, content) {
  entities.SCREEN[x][y] = content;
}

function get({ x, y }) {
  return entities.SCREEN[x][y];
}

export { entities };
