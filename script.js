const rows = 15;
const columns = 20;
const grid = document.getElementById("grid");

const start = { row: 7, column: 3 };
const finish = { row: 7, column: 16 };

for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
        const cell = document.createElement("div");

        cell.classList.add("cell");
        cell.dataset.row = row;
        cell.dataset.column = column;

        if (row === start.row && column === start.column) {
            cell.classList.add("start");
            cell.textContent = "S";
        } else if (row === finish.row && column === finish.column) {
            cell.classList.add("finish");
            cell.textContent = "F";
        }

        cell.addEventListener("click", function (event) {
            if (
                document.body.classList.contains("searching") ||
                cell.classList.contains("start") ||
                cell.classList.contains("finish")
            ) {
                return;
            }

            document.querySelectorAll(".cell").forEach(function (square) {
                square.classList.remove("visited", "path");
            });
            document.getElementById("results").textContent =
                "Grid changed. Run an algorithm to see its results.";

            if (event.shiftKey) {
                cell.classList.remove("wall");
                cell.classList.toggle("weight");
                cell.textContent = cell.classList.contains("weight") ? "5" : "";
            } else {
                cell.classList.remove("weight");
                cell.textContent = "";
                cell.classList.toggle("wall");
            }
        });

        grid.appendChild(cell);
    }
}

const clearButton = document.getElementById("clear-button");

clearButton.addEventListener("click", function () {
    if (document.body.classList.contains("searching")) {
        return;
    }
    document.getElementById("results").textContent =
        "Run an algorithm to see its results.";

    document.querySelectorAll(".cell").forEach(function (cell) {
        cell.classList.remove("wall", "weight", "visited", "path");

        if (
            !cell.classList.contains("start") &&
            !cell.classList.contains("finish")
        ) {
            cell.textContent = "";
        }
    });
});
const bfsButton = document.getElementById("bfs-button");

bfsButton.addEventListener("click", runBFS);
function getCell(row, column) {
    return grid.children[row * columns + column];
}

function getNeighbors(row, column) {
    const directions = [
        [-1, 0], // Up
        [1, 0],  // Down
        [0, -1], // Left
        [0, 1]   // Right
    ];

    const neighbors = [];

    for (const [rowChange, columnChange] of directions) {
        const nextRow = row + rowChange;
        const nextColumn = column + columnChange;

        if (
            nextRow >= 0 && nextRow < rows &&
            nextColumn >= 0 && nextColumn < columns
        ) {
            const cell = getCell(nextRow, nextColumn);

            if (!cell.classList.contains("wall")) {
                neighbors.push({
                    row: nextRow,
                    column: nextColumn
                });
            }
        }
    }

    return neighbors;
}
async function runBFS() {
    if (document.body.classList.contains("searching")) {
        return;
    }

    document.getElementById("results").textContent = "BFS is searching...";
    document.body.classList.add("searching");
    document.querySelectorAll(".cell").forEach(function (cell) {
        cell.classList.remove("visited", "path");
    });

    const queue = [start];
    const previous = new Map();
    const discovered = new Set();
    discovered.add(start.row + "," + start.column);

    let head = 0;

    while (head < queue.length) {
        const current = queue[head];
        head++;

        if (
            current.row === finish.row &&
            current.column === finish.column
        ) {
            highlightPath(previous, "BFS");
            document.body.classList.remove("searching");
            return;
        }

        const cell = getCell(current.row, current.column);

        if (!cell.classList.contains("start")) {
            cell.classList.add("visited");
            await new Promise(resolve => setTimeout(resolve, 20));
        }

        const neighbors = getNeighbors(current.row, current.column);

        for (const neighbor of neighbors) {
            const key = neighbor.row + "," + neighbor.column;

            if (!discovered.has(key)) {
                discovered.add(key);
                previous.set(key, current);
                queue.push(neighbor);
            }
        }
    }

    document.body.classList.remove("searching");
    document.getElementById("results").textContent = "No path exists.";
}
function highlightPath(previous, algorithm) {
    let current = finish;
    let moves = 0;
    let totalCost = 0;

    while (
        current.row !== start.row ||
        current.column !== start.column
    ) {
        const cell = getCell(current.row, current.column);

        moves++;
        totalCost += cell.classList.contains("weight") ? 5 : 1;

        if (!cell.classList.contains("finish")) {
            cell.classList.add("path");
        }

        const key = current.row + "," + current.column;
        current = previous.get(key);
    }

    document.getElementById("results").textContent =
        `${algorithm} — Moves: ${moves} | Total cost: ${totalCost}`;
}
const dijkstraButton = document.getElementById("dijkstra-button");
dijkstraButton.addEventListener("click", runDijkstra);

async function runDijkstra() {
    if (document.body.classList.contains("searching")) {
        return;
    }

    document.getElementById("results").textContent =
        "Dijkstra is searching...";

    document.body.classList.add("searching");

    try {
        document.querySelectorAll(".cell").forEach(function (cell) {
            cell.classList.remove("visited", "path");
        });

        const frontier = [{ ...start, cost: 0 }];
        const distances = new Map();
        const previous = new Map();
        const expanded = new Set();

        distances.set(start.row + "," + start.column, 0);

        while (frontier.length > 0) {
            frontier.sort((a, b) => a.cost - b.cost);
            const current = frontier.shift();
            const currentKey = current.row + "," + current.column;

            if (expanded.has(currentKey)) {
                continue;
            }

            expanded.add(currentKey);

            if (
                current.row === finish.row &&
                current.column === finish.column
            ) {
                highlightPath(previous, "Dijkstra");
                return;
            }

            const cell = getCell(current.row, current.column);

            if (!cell.classList.contains("start")) {
                cell.classList.add("visited");
                await new Promise(resolve => setTimeout(resolve, 20));
            }

            for (const neighbor of getNeighbors(current.row, current.column)) {
                const key = neighbor.row + "," + neighbor.column;

                if (expanded.has(key)) {
                    continue;
                }

                const neighborCell = getCell(neighbor.row, neighbor.column);
                const moveCost = neighborCell.classList.contains("weight") ? 5 : 1;
                const newCost = current.cost + moveCost;
                const bestCost = distances.get(key) ?? Infinity;

                if (newCost < bestCost) {
                    distances.set(key, newCost);
                    previous.set(key, current);
                    frontier.push({ ...neighbor, cost: newCost });
                }
            }
        }

        document.getElementById("results").textContent = "No path exists.";
    } finally {
        document.body.classList.remove("searching");
    }
}
