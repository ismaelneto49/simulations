import { screenModes, setupScreen } from "../screen/screen.mjs";
import { projectVertex, rotationFunctions } from "./coordinate-helpers.mjs";
import shapeData from "./shape-data.json" assert { type: "json" };

const POINT_CHAR = "██";

function configureScreen() {
  const SCREEN_LENGTH = 64;
  const SCREEN_HEIGHT = 32;
  const SCREEN_FILL = "  ";
  return setupScreen(
    SCREEN_LENGTH,
    SCREEN_HEIGHT,
    SCREEN_FILL,
    screenModes.CARTESIAN
  );
}

let screenMetadata;
function start() {
  screenMetadata = configureScreen();
}

function createLines(vertices, edges, focalLength) {
  const projectedVertices = vertices.map((vertex) =>
    projectVertex(vertex, focalLength)
  );

  const lines = edges.map((edge) => {
    const point1 = projectedVertices[edge[0]];
    const point2 = projectedVertices[edge[1]];

    return { start: { ...point1 }, end: { ...point2 } };
  });
  return lines;
}

function plotWireframe({ focalLength }) {
  function createWireframe({ vertices, edges }, focal, rotationDegrees) {
    const rotatedVertices = vertices.map((vertex) =>
      rotateOnY(vertex, rotationDegrees)
    );

    const lines = createLines(rotatedVertices, edges, focal);
    lines.forEach((line) => {
      const { start, end } = line;
      screenMetadata.drawLine(start, end, POINT_CHAR);
    });
  }

  const { rotateOnX, rotateOnY, rotateOnZ } = rotationFunctions;

  for (let index = 0; index < 360; index += 30) {
    createWireframe(shapeData, focalLength, index);
    screenMetadata.save();
    screenMetadata.clear();
  }
}

function animate(frequency) {
  screenMetadata.animate(frequency);
}

const shapePlotter = { start, plotWireframe, animate };
export { shapePlotter };
