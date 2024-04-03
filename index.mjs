import { fallingSand } from "./fallingSand/falling-sand.mjs";
import { shapePlotter } from "./shapePlotter/shape-plotter.mjs";

function playFallingSand() {
  fallingSand.start();
  for (let index = 0; index < 50; index++) {
    fallingSand.addParticle({ x: 25, y: 25 });
  }
  fallingSand.animate(5);
}

function playShapePlotter() {
  shapePlotter.start();
  for (let index = 0; index < 360; index += 360) {
    shapePlotter.plotWireframe({ focalLength: 35, rotationDegrees: 0 });
  }
  shapePlotter.animate(100);
}

playShapePlotter();
