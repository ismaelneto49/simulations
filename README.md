# Simulations

This is a set of small projects made entirely using nodejs, have fun! :)

## Details

In the `settings.json` file, you can visualize and edit all of the simulations' properties. Fell free to change them at your will.

For example, the json example below would run the "Falling Sand" simulation, spawning 10 particles at the coordinate (25 ; 25)
```json
{
  "currentSimulationId": 0,
  "0": {
    "name": "fallingSand",
    "particleQuantity": 10,
    "spawnCoordinate": { "x": 25, "y": 25 },
    "refreshRate": 10
  },
```

## Usage

To run any of the simulations, you must initially set the `currentSimulationId` property in the `settings.json` file to any of the available simulation identifiers.

```json
{
  "currentSimulationId": 1,
```

Then, just run the index.mjs file and enjoy!

```js
node index.mjs
```