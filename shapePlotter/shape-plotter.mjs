import { screenModes, setupScreen } from "../screen/screen.mjs";
import { projectVertex, rotationFunctions } from "./coordinate-helpers.mjs";
import shapeData from "./shape-data.json" assert { type: "json" };

const POINT_CHAR = "██";

function configureScreen() {
  const SCREEN_LENGTH = 64;
  const SCREEN_HEIGHT = 45;
  const SCREEN_FILL = "░░";
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
  const { rotateOnX, rotateOnY, rotateOnZ } = rotationFunctions;

  let { vertices, edges } = shapeData;
  const lines = createLines(vertices, edges, focalLength);

  lines.forEach((line) => {
    const { start, end } = line;
    screenMetadata.drawLine(start, end, POINT_CHAR);
  });
  screenMetadata.save();
  screenMetadata.clear();
}

function animate(frequency) {
  screenMetadata.animate(frequency);
}

const shapePlotter = { start, plotWireframe, animate };
export { shapePlotter };
