import fs from "fs";

import { fallingSand } from "./fallingSand/falling-sand.mjs";
import { shapePlotter, rotationAxes } from "./shapePlotter/shape-plotter.mjs";
import { pong } from "./pong/pong.mjs";

function playFallingSand({ particleQuantity, spawnCoordinate, refreshRate }) {
  fallingSand.start();
  for (let index = 0; index < particleQuantity; index++) {
    fallingSand.addParticle(spawnCoordinate);
  }
  fallingSand.animate(refreshRate);
}

function playShapePlotter({ rotations, rotationAxis, refreshRate }) {
  const rotationsQuantity = rotations * 360;
  shapePlotter.start();
  for (let index = 0; index <= rotationsQuantity; index += 5) {
    shapePlotter.plotWireframe({
      focalLength: 20,
      rotationAxisList: rotationAxis.map((axis) => rotationAxes[axis]),
      rotationDegrees: index,
    });
  }
  shapePlotter.animate(refreshRate);
}

function playPong({ refreshRate }) {
  pong.start();
  pong.animate(refreshRate);
}

(function menu() {
  const settings = JSON.parse(fs.readFileSync("./settings.json"));
  const simulations = {
    fallingSand: playFallingSand,
    shapePlotter: playShapePlotter,
    pong: playPong,
  };

  const simulationId = settings.currentSimulationId;
  const { name, ...rest } = settings[simulationId];
  simulations[name](rest);
})();
