import { screenModes, setupScreen } from "../utils/screen/screen.mjs";

const PARTICLE_CHAR = "██";

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
  addParticle({
    x: screenMetadata.SCREEN_LENGTH / 2,
    y: screenMetadata.SCREEN_HEIGHT / 2,
  });
}

function animate(frequency) {
  screenMetadata.animate(frequency);
}

function addParticle(position) {
  screenMetadata.write(position, PARTICLE_CHAR);
  screenMetadata.save();
}

const pong = { start, animate };
export { pong };
