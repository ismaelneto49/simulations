import { fallingSand } from "./fallingSand/falling-sand.mjs";

for (let index = 0; index < 50; index++) {
  fallingSand.addParticle({ x: 25, y: 29 });
}

fallingSand.animate();
