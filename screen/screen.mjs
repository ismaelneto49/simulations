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

function write(coordinates, content) {
  const { x, y } = mapCoordinates(coordinates);
  metadata.SCREEN[x][y] = content;
}

function get(coordinates) {
  const { x, y } = mapCoordinates(coordinates);
  const screenX = metadata.SCREEN[x];
  if (screenX == undefined) {
    console.log();
  }
  return metadata.SCREEN[x][y];
}

function clear() {
  metadata.SCREEN.forEach(element => {
    element.forEach((_, j, arr) => {
      arr[j] = metadata.FILL;
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

function mapCoordinates(coordinates) {
  const modeMapper = {
    REGULAR: (c) => mapToRegular(c),
    QUADRANT: (c) => mapToQuadrant(c),
    CARTESIAN: (c) => mapToCartesian(c),
  };

  const mode = metadata.SCREEN_MODE;
  const { x, y } = modeMapper[mode](coordinates);
  return { x, y };
}

function mapToRegular(coordinates) {
  return coordinates;
}

function mapToQuadrant({ x, y }) {
  const realX = metadata.SCREEN_HEIGHT - y - 1;
  const realY = x;
  return { x: realX, y: realY };
}

function mapToCartesian({ x, y }) {
  const bothPositive = x >= 0 && y >= 0;
  const bothNegative = x <= 0 && y <= 0;
  const xPositive_yNegative = x >= 0 && y <= 0;
  const xNegative_yPositive = x <= 0 && y >= 0;

  const differenceFactorX = metadata.SCREEN_LENGTH / 2;
  const differenceFactorY = metadata.SCREEN_HEIGHT / 2;
  let realX = 0;
  let realY = 0;
  if (bothPositive || bothNegative) {
    realX = differenceFactorX + x;
    realY = differenceFactorY - y;
  } else if (xPositive_yNegative || xNegative_yPositive) {
    realX = differenceFactorX - x;
    realY = differenceFactorY + y;
  }
  return { x: Math.trunc(realX), y: Math.trunc(realY) };
}

export { screenModes, setupScreen };
