/*
  Receives a 3d vertex and a focal length and return the 2d projection of the vertex in a plane
*/
function projectVertex(vertex, focalLength) {
  const { x, y, z } = vertex;

  const xProjected = Math.trunc((focalLength * x) / (z + focalLength));
  const yProjected = Math.trunc((focalLength * y) / (z + focalLength));

  return { x: xProjected, y: yProjected };
}

function getRotationMatrix(angleDegrees) {
  const radians = {
    0: 0,
    30: Math.PI / 6,
    45: Math.PI / 4,
    90: Math.PI / 2,
    180: Math.PI,
    360: 2 * Math.PI,
  };

  return [
    [
      Number(Math.cos(radians[angleDegrees]).toFixed(2)),
      Number(-Math.sin(radians[angleDegrees]).toFixed(2)),
    ],
    [
      Number(Math.sin(radians[angleDegrees]).toFixed(2)),
      Number(Math.cos(radians[angleDegrees]).toFixed(2)),
    ],
  ];
}

function rotateOnX({ x, y, z }, degrees) {
  const rotationMatrix = getRotationMatrix(degrees);

  // multiply rotation matrix and y and z coordinates, then add x back
  const yRotated = rotationMatrix[0][0] * y + rotationMatrix[0][1] * z;
  const zRotated = rotationMatrix[1][0] * y + rotationMatrix[1][1] * z;

  return {
    x,
    y: Number(yRotated.toFixed(0)),
    z: Number(zRotated.toFixed(0)),
  };
}

function rotateOnY({ x, y, z }, degrees) {
  const rotationMatrix = getRotationMatrix(degrees);
}

function rotateOnZ({ x, y, z }, degrees) {
  const rotationMatrix = getRotationMatrix(degrees);
}

const rotationFunctions = { rotateOnX, rotateOnY, rotateOnZ };
export { projectVertex, rotationFunctions };
