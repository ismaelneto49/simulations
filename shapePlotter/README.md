# Shape plotter

This is a 3D to 2D shape plotter. It receives a set of 3D vertices and edges, and plots the shape in a 2d plane.

## Details

The default shape is a cube. All shapes must be centered at the point (0, 0, 0) for better visualization.

## Usage

You are free to add any shape you will. Just input its vertices and edges in the `shape-data.json` file.

* Each vertex is an object with three coordinates `{ x, y, z }` of a point.
* Each edge is a list of two numbers that represent the IDs of the vertices that are being connected.

The json file below represents a line that starts at the point (2,2,2) and ends at the point (2,-2,2). Their connection is represented by the edge [0,1]

```json
{
  "vertices": [
    { "x": 5, "y": 5, "z": 5 },
    { "x": 5, "y": -5, "z": 5 }
  ],
  "edges": [[0, 1]]
}
```