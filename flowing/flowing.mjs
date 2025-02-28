import { screenModes, setupScreen } from "../utils/screen/screen.mjs";

const DROP_CHAR = "██";

function configureScreen() {
  const SCREEN_LENGTH = 64;
  const SCREEN_HEIGHT = 32;
  const SCREEN_FILL = "  ";
  return setupScreen(
    SCREEN_LENGTH,
    SCREEN_HEIGHT,
    SCREEN_FILL,
    screenModes.QUADRANT
  );
}

let screenMetadata;
function start() {
  screenMetadata = configureScreen();
}

function addDrop(position) {
  screenMetadata.write(position, DROP_CHAR);
  screenMetadata.save();
  applyGravity(position);
}

function applyGravity({ x, y }) {
  const reachedGround = y == 0;
  if (reachedGround || isDrop({ x, y: y - 1 })) {
    flow({ x, y });
    return;
  }
  removeDrop({ x, y });
  addDrop({ x, y: --y });
}

function isDrop(position) {
  return screenMetadata.get(position) == DROP_CHAR;
}

function flow(position) {
  slide(position);
}

function slide({ x, y }) {
  while (x < screenMetadata.SCREEN_LENGTH) {
    if (!isDrop({ x: x + 1, y })) {
      screenMetadata.write({ x: x + 1, y }, DROP_CHAR);
      removeDrop({ x, y });
      screenMetadata.save();
    }
    x++;
  }
  while (x > 0) {
    if (!isDrop({ x: x - 1, y })) {
      screenMetadata.write({ x: x - 1, y }, DROP_CHAR);
      removeDrop({ x: x, y });
      screenMetadata.save();
    }
    x--;
  }
}

function removeDrop(position) {
  screenMetadata.write(position, screenMetadata.SCREEN_FILL);
}

start();
addDrop({ x: 10, y: 10 });
addDrop({ x: 10, y: 10 });
screenMetadata.animate(10);
