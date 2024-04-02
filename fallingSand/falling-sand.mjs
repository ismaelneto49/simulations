import { screenModes, setupScreen } from "../screen/screen.mjs";

const PARTICLE_CHAR = "██";
const DIRECTIONS = {
  left: "left",
  right: "right",
};

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

function spawnParticle() {
  const particle = {
    x: Math.floor(Math.random() * screenMetadata.SCREEN_LENGTH),
    y: Math.floor(Math.random() * screenMetadata.SCREEN_HEIGHT),
  };
  addParticle(particle);
}

function addParticle(position) {
  screenMetadata.write(position, PARTICLE_CHAR);
  screenMetadata.save();
  applyGravity(position);
}

function applyGravity({ x, y }) {
  if (y == 0 || isParticle({ x, y: y - 1 })) {
    slideParticle({ x, y });
    return;
  }
  removeParticle({ x, y });
  addParticle({ x, y: --y });
}

function isParticle(position) {
  return screenMetadata.get(position) == PARTICLE_CHAR;
}

function slideParticle(particle) {
  const ground = determineGround(particle);
  verifySlide(particle, ground);
}

function determineGround({ x, y }) {
  function findGround(position) {
    if (position.y === 0 || isParticle(position)) {
      return position;
    }
    return findGround({ x: position.x, y: position.y - 1 });
  }

  const leftPosition = { x: x - 1, y };
  const rightPosition = { x: x + 1, y };
  const groundInfo = { left: null, right: null };

  if (x > 0 && !isParticle(leftPosition)) {
    groundInfo.left = findGround(leftPosition);
  }
  if (x < screenMetadata.SCREEN_LENGTH - 1 && !isParticle(rightPosition)) {
    groundInfo.right = findGround(rightPosition);
  }
  return groundInfo;
}

function verifySlide(particle, ground) {
  function checkDirection(ground, direction, slide) {
    const oppositeDirection = Object.keys(ground).find(
      (key) => key != direction
    );
    if (ground[direction]) {
      slide.to[direction]();
    } else if (ground[oppositeDirection]) {
      slide.to[oppositeDirection]();
    }
  }

  const slideDirection = getSlideDirection();
  const slide = calculateSlide(particle, ground);
  checkDirection(ground, slideDirection, slide);
}

function getSlideDirection() {
  return Math.random() <= 0.5 ? DIRECTIONS.left : DIRECTIONS.right;
}

function calculateSlide(particle, ground) {
  function slide(particle, groundPosition, direction) {
    const distance = particle.y - groundPosition.y;
    const mapper = {
      [DIRECTIONS.left]: particle.x - 1,
      [DIRECTIONS.right]: particle.x + 1,
    };
    if (distance >= 3) {
      removeParticle(particle);
      addParticle({ x: mapper[direction], y: particle.y - 1 });
    }
  }
  return {
    to: {
      left: () => slide(particle, ground.left, DIRECTIONS.left),
      right: () => slide(particle, ground.right, DIRECTIONS.right),
    },
  };
}

function removeParticle(position) {
  screenMetadata.write(position, screenMetadata.SCREEN_FILL);
}

function animate(frequency) {
  screenMetadata.animate(frequency);
  screenMetadata.clear();
}

const fallingSand = { start, addParticle, spawnParticle, animate };
export { fallingSand };
