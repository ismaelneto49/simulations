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
  function toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  return [
    [
      Number(Math.cos(toRadians(angleDegrees)).toFixed(2)),
      Number(-Math.sin(toRadians(angleDegrees)).toFixed(2)),
    ],
    [
      Number(Math.sin(toRadians(angleDegrees)).toFixed(2)),
      Number(Math.cos(toRadians(angleDegrees)).toFixed(2)),
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

  // multiply by rotation matrix on x and z coordinates, then add y back
  const xRotated = rotationMatrix[0][0] * x + rotationMatrix[0][1] * z;
  const zRotated = rotationMatrix[1][0] * x + rotationMatrix[1][1] * z;

  return {
    x: Number(xRotated.toFixed(0)),
    y: y,
    z: Number(zRotated.toFixed(0)),
  };
}

function rotateOnZ({ x, y, z }, degrees) {
  const rotationMatrix = getRotationMatrix(degrees);

  // multiply rotation matrix and x and y coordinates, then add z back
  const xRotated = rotationMatrix[0][0] * x + rotationMatrix[0][1] * y;
  const yRotated = rotationMatrix[1][0] * x + rotationMatrix[1][1] * y;

  return {
    x: Number(xRotated.toFixed(0)),
    y: Number(yRotated.toFixed(0)),
    z,
  };
}

const rotationFunctions = { x: rotateOnX, y: rotateOnY, z: rotateOnZ };
export { projectVertex, rotationFunctions };
