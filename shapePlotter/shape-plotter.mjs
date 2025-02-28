import { screenModes, setupScreen } from "../utils/screen/screen.mjs";
import { projectVertex, rotationFunctions } from "./coordinate-helpers.mjs";
import shapeData from "./shape-data.json" assert { type: "json" };

const POINT_CHAR = "██";

function configureScreen() {
  const SCREEN_LENGTH = 32;
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

function plotWireframe({ focalLength, rotationAxisList, rotationDegrees }) {
  function createWireframe({ vertices, edges }, focal, axes, degrees) {
    const rotatedVertices = vertices.map((vertex) =>
      axes.reduce(
        (result, axis) => rotationFunctions[axis](result, degrees),
        vertex
      )
    );

    const lines = createLines(rotatedVertices, edges, focal);
    lines.forEach((line) => {
      const { start, end } = line;
      drawLine(start, end, POINT_CHAR);
    });
  }

  createWireframe(shapeData, focalLength, rotationAxisList, rotationDegrees);
  screenMetadata.save();
  screenMetadata.clear();
}

function drawLine({ x: x1, y: y1 }, { x: x2, y: y2 }, content) {
  let x = x1;
  let y = y1;
  let deltaX = Math.abs(x2 - x1);
  let deltaY = Math.abs(y2 - y1);
  const s1 = Math.sign(x2 - x1);
  const s2 = Math.sign(y2 - y1);
  let interchange = 0;

  if (deltaY > deltaX) {
    let temp = deltaX;
    deltaX = deltaY;
    deltaY = temp;
    interchange = 1;
  }

  let error = 2 * deltaY - deltaX;
  const A = 2 * deltaY;
  const B = 2 * (deltaY - deltaX);

  for (let i = 1; i <= deltaX; i++) {
    if (error < 0) {
      if (interchange === 1) {
        y += s2;
      } else {
        x += s1;
      }
      error += A;
    } else {
      y += s2;
      x += s1;
      error += B;
    }
    screenMetadata.write({ x, y }, content);
  }
}

function animate(frequency) {
  screenMetadata.animate(frequency);
}

const rotationAxes = { X: "x", Y: "y", Z: "z" };
const shapePlotter = { start, plotWireframe, animate };
export { shapePlotter, rotationAxes };
