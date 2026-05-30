var canvas = document.getElementById("pcanvas");
var ctx = canvas.getContext("2d");
var points = [];
var paths = [];
var gridSize = 50;
var pointstack = [];
var solveQueue = [];
var entrance = null;
var exitPoint = null;
var currentPoint = null;
var interval = null;
var interval2 = null;
var interval3 = null;

function point(x, y) {
    this.drawX = (x + 1) * 10;
    this.drawY = (y + 1) * 10;
    this.visited = false;
    this.solved = false;
    this.parent = null;
    this.neighbors = [];
    this.paths = [];
    this.draw = function () {
        ctx.beginPath();
        if (this === entrance || this === exitPoint) {
            ctx.fillStyle = "#ff1493";
        } else {
            ctx.fillStyle = "green";
        }
        ctx.fillRect(this.drawX, this.drawY, 5, 5);
        ctx.closePath();
    };
    this.getUnvisited = function () {
        for (var i = this.neighbors.length - 1; i >= 0; i--) {
            if (this.neighbors[i].visited) {
                this.neighbors.splice(i, 1);
            }
        }
        if (this.neighbors.length > 0) {
            var index = Math.floor(Math.random() * this.neighbors.length);
            return this.neighbors[index];
        }
        return false;
    };
}

function segment(p1, p2, color) {
    this.start = { x: p1.drawX, y: p1.drawY };
    this.end = { x: p2.drawX, y: p2.drawY };
    this.p1 = p1;
    this.p2 = p2;
    this.color = color;
    this.vertical = p1.drawX === p2.drawX;
    this.draw = function () {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 3;
        ctx.moveTo(this.start.x + 2.5, this.start.y + 2.5);
        ctx.lineTo(this.end.x + 2.5, this.end.y + 2.5);
        ctx.stroke();
        ctx.closePath();
    };
}

function drawMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < points.length; i++) {
        for (var e = 0; e < points[i].length; e++) {
            points[i][e].draw();
        }
    }
    for (var p = 0; p < paths.length; p++) {
        paths[p].draw();
    }
}

function chooseEntranceAndExit() {
    var entranceX = Math.floor(Math.random() * gridSize);
    var entranceY = Math.floor(Math.random() * gridSize);
    var exitX = Math.floor(Math.random() * gridSize);
    var exitY = Math.floor(Math.random() * gridSize);

    while (entranceX === exitX && entranceY === exitY) {
        exitX = Math.floor(Math.random() * gridSize);
        exitY = Math.floor(Math.random() * gridSize);
    }

    entrance = points[entranceX][entranceY];
    exitPoint = points[exitX][exitY];
    entrance.solved = true;
    solveQueue.push(entrance);
    drawMaze();
    interval2 = setInterval(solveMaze, 0);
}

function createMaze() {
    drawMaze();

    if (pointstack.length === 0) {
        clearInterval(interval);
        chooseEntranceAndExit();
        return;
    }

    pointstack[0].draw();
    var nextPoint = pointstack[0].getUnvisited();

    while (nextPoint === false) {
        pointstack.splice(0, 1);
        if (pointstack.length === 0) {
            clearInterval(interval);
            chooseEntranceAndExit();
            return;
        }
        nextPoint = pointstack[0].getUnvisited();
    }

    nextPoint.visited = true;
    paths.push(new segment(pointstack[0], nextPoint, "white"));
    pointstack[0].paths.push(nextPoint);
    nextPoint.paths.push(pointstack[0]);
    pointstack.splice(0, 0, nextPoint);
}

function solveMaze() {
    if (solveQueue.length === 0 || entrance === null || exitPoint === null) {
        return;
    }

    drawMaze();
    entrance.draw();
    exitPoint.draw();

    var point = solveQueue.pop();
    if (point === exitPoint) {
        currentPoint = exitPoint;
        clearInterval(interval2);
        interval3 = setInterval(drawSolvedMaze, 0);
        return;
    }

    for (var i = 0; i < point.paths.length; i++) {
        if (point.paths[i].solved !== true) {
            point.paths[i].parent = point;
            point.paths[i].solved = true;
            solveQueue.splice(0, 0, point.paths[i]);
            paths.push(new segment(point, point.paths[i], "green"));
        }
    }
}

function drawSolvedMaze() {
    drawMaze();

    if (currentPoint === null || exitPoint === null || exitPoint.parent === null) {
        clearInterval(interval3);
        return;
    }

    entrance.draw();
    exitPoint.draw();

    if (currentPoint.parent === null) {
        clearInterval(interval3);
        return;
    }

    paths.push(new segment(currentPoint.parent, currentPoint, "cyan"));
    currentPoint = currentPoint.parent;
}

function init() {
    for (var i = 0; i < gridSize; i++) {
        var row = [];
        for (var e = 0; e < gridSize; e++) {
            row.push(new point(i, e));
            if (i > 0) {
                points[i - 1][e].neighbors.push(row[e]);
                row[e].neighbors.push(points[i - 1][e]);
            }
            if (e > 0) {
                row[e].neighbors.push(row[e - 1]);
                row[e - 1].neighbors.push(row[e]);
            }
        }
        points.push(row);
    }

    var x = Math.floor(Math.random() * gridSize);
    var y = Math.floor(Math.random() * gridSize);
    pointstack.push(points[x][y]);
    pointstack[0].visited = true;
    drawMaze();
}

init();
interval = setInterval(createMaze, 0);

