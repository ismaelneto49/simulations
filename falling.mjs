import { entities } from "./screen.mjs";

const PARTICLE_CHAR = "██";
const BLANK = "▒▒";
const DIRECTIONS = {
  left: "L",
  right: "R",
};

function spawnParticle() {
  const particle = {
    x: Math.floor(Math.random() * entities.SCREEN_LENGTH),
    y: Math.floor(Math.random() * entities.SCREEN_HEIGHT),
  };
  addParticle(particle);
}

function addParticle(position) {
  entities.write(position, PARTICLE_CHAR);
  entities.save();
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

function isParticle({ x, y }) {
  return entities.get({ x, y }) == PARTICLE_CHAR;
}

function slideParticle({ x, y }) {
  const ground = determineGround({ x, y });
  const fallDirection = getFallDirection();

  const checkFall = calculateFall({ x, y }, ground);
  const fallToTheLeft = fallDirection == DIRECTIONS.left;
  if (fallToTheLeft) {
    if (ground.left) {
      checkFall.toTheLeft();
    } else if (ground.right) {
      checkFall.toTheRight();
    }
    return;
  }

  const fallToTheRight = fallDirection == DIRECTIONS.right;
  if (fallToTheRight) {
    if (ground.right) {
      checkFall.toTheRight();
    } else if (ground.left) {
      checkFall.toTheLeft();
    }
  }
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
  if (x < entities.SCREEN_LENGTH - 1 && !isParticle(rightPosition)) {
    groundInfo.right = findGround(rightPosition);
  }
  return groundInfo;
}

function getFallDirection() {
  return Math.random() <= 0.5 ? DIRECTIONS.left : DIRECTIONS.right;
}

function calculateFall(particle, ground) {
  function fall(particle, groundPosition, direction) {
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
    toTheLeft: () => fall(particle, ground.left, DIRECTIONS.left),
    toTheRight: () => fall(particle, ground.right, DIRECTIONS.right),
  };
}

function removeParticle(position) {
  entities.write(position, BLANK);
}

for (let index = 0; index < 200; index++) {
  addParticle({ x: 25, y: 30 });
}
entities.animate();
