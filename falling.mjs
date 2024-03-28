import { entities } from "./screen.mjs";

const PARTICLE_CHAR = "██";
const BLANK = "▒▒";

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
  function fall(particle, groundPosition, direction) {
    const distance = particle.y - groundPosition.y;
    const mapper = {
      L: particle.x - 1,
      R: particle.x + 1,
    };

    if (distance >= 3) {
      removeParticle(particle);
      addParticle({ x: mapper[direction], y: particle.y - 1 });
    }
  }

  const checkFall = {
    toTheLeft: (particle, groundPosition) => {
      fall(particle, groundPosition, "L");
    },
    toTheRight: (particle, groundPosition) => {
      fall(particle, groundPosition, "R");
    },
  };

  const ground = determineGround({ x, y });
  const fallDirection = Math.random();

  const fallToTheLeft = fallDirection < 0.5;
  if (fallToTheLeft) {
    if (ground.left) {
      checkFall.toTheLeft({ x, y }, ground.left);
    } else if (ground.right) {
      checkFall.toTheRight({ x, y }, ground.right);
    }
    return;
  }

  const fallToTheRight = fallDirection >= 0.5;
  if (fallToTheRight) {
    if (ground.right) {
      checkFall.toTheRight({ x, y }, ground.right);
    } else if (ground.left) {
      checkFall.toTheLeft({ x, y }, ground.left);
    }
  }
}

function removeParticle(position) {
  entities.write(position, BLANK);
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

for (let index = 0; index < 200; index++) {
  addParticle({ x: 25, y: 30 });
}
entities.animate();
