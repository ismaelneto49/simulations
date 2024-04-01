import { fallingSand } from "./fallingSand/falling-sand.mjs";
import { shapePlotter } from "./shapePlotter/shape-plotter.mjs";

fallingSand.start();
for (let index = 0; index < 50; index++) {
  fallingSand.addParticle({ x: 25, y: 25 });
}
fallingSand.animate(5);

shapePlotter.start();
for (let index = 30; index <= 75; index += 5) {
  shapePlotter.plotWireframe({ focalLength: index });
}
shapePlotter.animate(100);
