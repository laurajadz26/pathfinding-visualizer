# Pathfinding Visualizer

An interactive web application that visualizes Breadth-First Search
(BFS) and Dijkstra’s algorithm on a 15 × 20 grid.

## Features

- Animated exploration and highlighted paths
- Click to add or remove walls
- Shift-click to add or remove weighted cells with a cost of 5
- Results showing the number of moves and total path cost
- Clear Grid button to reset the board
- A message when no path exists

## Technologies

HTML, CSS, and JavaScript.

## How to Run

Download or clone this repository, then open index.html in a browser.
No installation or build step is required.

## How to Use

1. Click cells to create walls.
2. Hold Shift and click cells to create weighted terrain.
3. Run BFS or Dijkstra to watch the search.
4. Compare the path’s moves and total cost.
5. Click Clear Grid to start over.

The green S is the start, and the red F is the finish.
Blue cells show explored locations, and yellow cells show the final path.

## Algorithm Comparison

BFS finds a path with the fewest moves. It treats all traversable
cells equally, so it does not account for terrain weights.

Dijkstra finds a path with the lowest total cost. Entering a normal
cell costs 1, while entering a weighted cell costs 5.

Both algorithms move up, down, left, or right and avoid walls.

## Example

Place one weighted cell on the direct route between S and F:

- BFS: 13 moves, total cost 17.
- Dijkstra: 15 moves, total cost 15 by going around the weighted cell.