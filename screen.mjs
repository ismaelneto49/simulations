const metadata = {
  SCREEN: [[]],
  BUFFER: [],
  write,
  get,
  animate,
  print,
  save,
};

function setupScreen(length, height, fill) {
  metadata.SCREEN_LENGTH = length;
  metadata.SCREEN_HEIGHT = height;
  metadata.SCREEN_FILL = fill;
  metadata.SCREEN = Array.from({ length: length }, () =>
    Array.from({ length: height }, () => null).fill(fill)
  );
  return metadata;
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
  metadata.BUFFER.push(deepCopy(metadata.SCREEN));
}

function animate(frequency = 5) {
  let i = 0;
  const interval = setInterval(() => {
    if (i == metadata.BUFFER.length - 1) {
      stopAnimation();
    }
    print(metadata.BUFFER[i++]);
  }, frequency);

  function stopAnimation() {
    clearInterval(interval);
  }
}

function write({ x, y }, content) {
  metadata.SCREEN[x][y] = content;
}

function get({ x, y }) {
  return metadata.SCREEN[x][y];
}

export { setupScreen };
