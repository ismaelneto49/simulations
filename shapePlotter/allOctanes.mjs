const fs = require("fs");
const { drawLine } = require("./lineDrawer");
const { makeScreen, fillScreen, clearScreen } = require("./screenBuilder");
const {
  coordinateMapper,
  projectVertex,
  rotationFunctions,
} = require("./coordinateHelpers");

function createLines(vertices, edges, focalLength, SCREEN_DIMENSION) {
  const projectedVertices = vertices.map((vertex) =>
    projectVertex(vertex, focalLength)
  );

  const lines = edges.map((edge) => {
    const point1 = projectedVertices[edge[0]];
    const point2 = projectedVertices[edge[1]];

    const point1Real = coordinateMapper(point1, SCREEN_DIMENSION);
    const point2Real = coordinateMapper(point2, SCREEN_DIMENSION);

    return [{ ...point1Real }, { ...point2Real }];
  });
  return lines;
}

function main() {
  const { rotateOnX, rotateOnY, rotateOnZ } = rotationFunctions;

  const SCREEN_DIMENSION = 100;
  const BLANK_SPACE_CHARACTER = "░░";
  const screen = makeScreen(SCREEN_DIMENSION, BLANK_SPACE_CHARACTER);

  const shapeData = JSON.parse(
    fs.readFileSync("./shape-data.json", "utf-8", (err) => console.err(err))
  );

  let { vertices, edges } = shapeData;
  const FOCAL_LENGTH = 75;

  const vertex = [
    { x: 22, y: -8, z: 30 },
    { x: 22, y: -30, z: -8 },
    { x: -22, y: -30, z: -8 },
    { x: -22, y: -8, z: 30 },
    { x: 22, y: 30, z: 8 },
    { x: 22, y: 8, z: -30 },
    { x: -22, y: 8, z: -30 },
    { x: -22, y: 30, z: 8 },
  ];

  const lines = createLines(vertices, edges, FOCAL_LENGTH, SCREEN_DIMENSION);

  lines.forEach((lines) => {
    const point1 = lines[0];
    const point2 = lines[1];
    drawLine(screen, point1, point2);
  });

  const matrices = [];
  const bufferMatrix = fillScreen(screen);

  matrices.push(
    bufferMatrix.map((row) => {
      return row.slice();
    })
  );

  clearScreen(screen);
  console.log(bufferMatrix.join("\n"));
  vertices.forEach((vertex) => console.log(rotateOnY(vertex, 30)));
}

module.exports = { projectWireframe: main };
