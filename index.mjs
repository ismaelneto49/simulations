import { fallingSand } from "./fallingSand/falling-sand.mjs";
import { shapePlotter, rotationAxes } from "./shapePlotter/shape-plotter.mjs";

function playFallingSand() {
  fallingSand.start();
  for (let index = 0; index < 50; index++) {
    fallingSand.addParticle({ x: 25, y: 25 });
  }
  fallingSand.animate(5);
}

function playShapePlotter() {
  shapePlotter.start();
  for (let index = 0; index <= 180; index += 5) {
    shapePlotter.plotWireframe({ focalLength: 20, rotationAxis: rotationAxes.X, rotationDegrees: index });
  }
  for (let index = 0; index <= 180; index += 5) {
    shapePlotter.plotWireframe({ focalLength: 20, rotationAxis: rotationAxes.Y, rotationDegrees: index });
  }
  for (let index = 0; index <= 180; index += 5) {
    shapePlotter.plotWireframe({ focalLength: 20, rotationAxis: rotationAxes.Z, rotationDegrees: index });
  }
  shapePlotter.animate(25);
}

playShapePlotter();
