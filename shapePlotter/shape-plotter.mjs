import { screenModes, setupScreen } from "../screen/screen.mjs";
import { projectVertex } from "./coordinate-helpers.mjs";

const POINT_CHAR = "██";

const shapeData = JSON.parse(
  fs.readFileSync("./shape-data.json", "utf-8", (err) => console.err(err))
);

function configureScreen() {
  const SCREEN_LENGTH = 50;
  const SCREEN_HEIGHT = 50;
  const SCREEN_FILL = "░░";
  return setupScreen(
    SCREEN_LENGTH,
    SCREEN_HEIGHT,
    SCREEN_FILL,
    screenModes.QUADRANT
  );
}

const screenMetadata = configureScreen();

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

function plotWireframe() {
  const { rotateOnX, rotateOnY, rotateOnZ } = rotationFunctions;

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

  const lines = createLines(vertices, edges, FOCAL_LENGTH);

  lines.forEach((line) => {
    const { start, end } = line;
    screenMetadata.drawLine(start, end, POINT_CHAR);
  });
  screenMetadata.save();

  // CONTINUE REFACTORING FROM HERE

  /*
  function fillScreen(screen) {
    function rotateMatrix(matrix) {
      const numRows = matrix.length;
      const numCols = matrix[0].length;
  
      for (let i = 0; i < numRows; i++) {
        for (let j = i + 1; j < numCols; j++) {
          const temp = matrix[i][j];
          matrix[i][j] = matrix[j][i];
          matrix[j][i] = temp;
        }
      }
    }
  
    rotateMatrix(screen);
    return screen.map((line) => line.join("")).reverse();
  }
  */

  const matrices = [];
  const bufferMatrix = fillScreen(screen);

  matrices.push(
    bufferMatrix.map((row) => {
      return row.slice();
    })
  );

  screenMetadata.clear();
  console.log(bufferMatrix.join("\n"));
  vertices.forEach((vertex) => console.log(rotateOnY(vertex, 30)));
}

function animate() {
  screenMetadata.animate();
}

const shapePlotter = { plotWireframe };
export { shapePlotter };
