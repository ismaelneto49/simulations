const metadata = {
  SCREEN: [[]],
  BUFFER: [],
  write,
  get,
  drawLine,
  animate,
  print,
  save,
};

const screenModes = {
  REGULAR: "REGULAR",
  QUADRANT: "QUADRANT",
  CARTESIAN: "CARTESIAN",
};

function setupScreen(length, height, fill, mode) {
  metadata.SCREEN_LENGTH = length;
  metadata.SCREEN_HEIGHT = height;
  metadata.SCREEN_FILL = fill;
  metadata.SCREEN_MODE = mode;
  metadata.clear = clear;
  metadata.SCREEN = Array.from({ length: height }, () =>
    Array.from({ length: length }, () => null).fill(fill)
  );
  return metadata;
}

function print(screen) {
  screen.forEach((row) => console.log(row.join("")));
  console.log("");
}

function save() {
  function deepCopy(matrix) {
    return matrix.map((row) => [...row]);
  }
  metadata.BUFFER.push(deepCopy(metadata.SCREEN));
}

function animate(frequency = 5) {
  const interval = setInterval(() => {
    if (metadata.BUFFER.length == 0) {
      stopAnimation();
      return;
    }
    print(metadata.BUFFER[0]);
    metadata.BUFFER.shift();
  }, frequency);

  function stopAnimation() {
    clearInterval(interval);
  }
}

function write(coordinates, content) {
  const { x, y } = mapCoordinates(coordinates);
  const screenX = metadata.SCREEN[x];
  if (screenX == undefined) {
    console.log();
  }
  metadata.SCREEN[x][y] = content;
}

function get(coordinates) {
  const { x, y } = mapCoordinates(coordinates);
  return metadata.SCREEN[x][y];
}

function clear() {
  metadata.SCREEN.forEach((line) => {
    line.forEach((_, idx, line) => {
      line[idx] = metadata.SCREEN_FILL;
    });
  });
}

function drawLine({ x: x1, y: y1 }, { x: x2, y: y2 }, content) {
  let x = x1;
  let y = y1;
  let deltaX = Math.abs(x2 - x1);
  let deltaY = Math.abs(y2 - y1);
  const s1 = Math.sign(x2 - x1);
  const s2 = Math.sign(y2 - y1);
  let interchange = 0;

  if (deltaY > deltaX) {
    let temp = deltaX;
    deltaX = deltaY;
    deltaY = temp;
    interchange = 1;
  }

  let error = 2 * deltaY - deltaX;
  const A = 2 * deltaY;
  const B = 2 * (deltaY - deltaX);

  for (let i = 1; i <= deltaX; i++) {
    if (error < 0) {
      if (interchange === 1) {
        y += s2;
      } else {
        x += s1;
      }
      error += A;
    } else {
      y += s2;
      x += s1;
      error += B;
    }
    write({ x, y }, content);
  }
}

function mapCoordinates(coordinate) {
  const modeMapper = {
    REGULAR: (c) => mapFromRegular(c),
    QUADRANT: (c) => mapFromQuadrant(c),
    CARTESIAN: (c) => mapFromCartesian(c),
  };

  const mode = metadata.SCREEN_MODE;
  const { x, y } = modeMapper[mode](coordinate);
  return { x, y };
}

function mapFromRegular(coordinate) {
  return coordinate;
}

function mapFromQuadrant({ x, y }) {
  const realX = metadata.SCREEN_HEIGHT - y - 1;
  const realY = x;
  return { x: realX, y: realY };
}

function mapFromCartesian({ x, y }) {
  const centerIndex = Math.floor(metadata.SCREEN_LENGTH / 2);

  const realX = centerIndex - y;
  const realY = x + centerIndex;

  return { x: realX, y: realY };
}

export { screenModes, setupScreen };
