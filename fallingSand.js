function make2DArray(cols, rows) {
  let arr = new Array(cols);
  
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
    for (let j = 0; j < arr[i].length; j++) {
      arr[i][j] = 0;
    }
  }
  
  return arr;
}

let grid;
let velocityGrid;
let cols, rows;
// change value to resize individual sand blocks
let w = 5;
// change hueValue to determine starting colour of sand
let hueValue = 200;
// change value to increase/decrease gravity
let gravity = 0.1;

function withinCols(i) {
  return i >= 0 && i < cols;
}

function withinRows(i) {
  return i >= 0 && i < rows;
}

function setup() {
  // play around with canvas size, and colors of the sand
  createCanvas(900, 750);
  colorMode(HSB, 360, 255, 255);
  cols = width / w;
  rows = height / w;
  grid = make2DArray(cols, rows);
  velocityGrid = make2DArray(cols, rows, 1);
}

function draw() {
  background(0);
  
  if (mouseIsPressed) {
    let mouseCol = floor(mouseX / w);
    let mouseRow = floor(mouseY / w);
    // change value to increase/decrease size of blob of sand dropped upon mouse click
    let dropMatrix = 5;
    let dropRange = floor(dropMatrix / 2);
  
    for (let i = -dropRange; i <= dropRange; i++) {
      for (let j = -dropRange; j <= dropRange; j++) {
        // change probability to determine density of blob of sand dropped
        if (random(1) < 0.70) {
          let col = mouseCol + i;
          let row = mouseRow + j;
        
          if (withinCols(col) && withinRows(row)) {
            grid[col][row] = hueValue;
            velocityGrid[col][row] = 1;
          }
        }
      }
    }
    // change incremente (or decrement) value to control how the colours vary
    hueValue += 1;
  
    if (hueValue > 360) {
      hueValue = 1;
    }
  }
  
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      noStroke();
      
      if (grid[i][j] > 0) {
        fill(grid[i][j], 255, 255);
        let x = i * w;
        let y = j * w;
        square(x, y, w);
      }
    }
  }
  
  let nextGrid = make2DArray(cols, rows);
  let nextVelocityGrid = make2DArray(cols, rows);
  
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows ; j++) {
      let state = grid[i][j];
      let velocity = velocityGrid[i][j];
      let moved = false;
      
      if (state > 0) {
        let newPos = int(j + velocity);
        
        for (let y = newPos; y > j; --y) {
          let below = grid[i][y];
          let dir = random([-1, 1]);
          let belowA = -1;
          let belowB = -1;
        
          if (withinCols(i + dir)) {
            belowA = grid[i + dir][y];
          }
        
          if (withinCols(i - dir)) {
            belowB = grid[i - dir][y];
          }
        
          if (below === 0) {
            nextGrid[i][y] = state;
            nextVelocityGrid[i][y] = velocity + gravity;
            moved = true;
            break;
          } else if (belowA === 0) {
            nextGrid[i + dir][y] = state;
            nextVelocityGrid[i + dir][y] = velocity + gravity;
            moved = true;
            break;
          } else if (belowB === 0) {
            nextGrid[i - dir][y] = state;
            nextVelocityGrid[i - dir][y] = velocity + gravity;
            moved = true;
            break;
          }
        }
      }
      
      if (state > 0 && !moved) {
        nextGrid[i][j] = grid[i][j];
        nextVelocityGrid[i][j] = velocityGrid[i][j] + gravity;
      }
    }
  }
  
  grid = nextGrid;
  velocityGrid = nextVelocityGrid;
}