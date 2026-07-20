let numberOfBells = 2; // Starting number of bells
let minAngleDifference = 20;
let normalBells = [];
let fastBells = [];
let mediumBells = [];
let movingCircles;
let circles = 8; // Starting number of circles
let maxBells = 10; // Maximum number of bells
let maxCircles = 20; // Maximum number of circles
let frameCounter = 0; // Counter to track frames
let increaseSpeed = 360; // Adjustable speed of increase

function setup() {
  createCanvas(windowWidth, windowHeight);

  movingCircles = new Tenacle(circles, 40);

  let angleStep = TWO_PI / numberOfBells;

  for (let i = 0; i < numberOfBells; i++) {
    let angleOffset = angleStep * i + radians(minAngleDifference * i);

    let normalBellAngle = angleOffset;
    let fastBellAngle = angleOffset;
    let mediumBellAngle = angleOffset;

    normalBells.push(new Bell(normalBellAngle, random(width), random(height), 0.01));
    fastBells.push(new Bell(fastBellAngle, random(width), random(height), 0.01));
    mediumBells.push(new Bell(mediumBellAngle, random(width), random(height), 0.01));
  }
}

function draw() {
  background(0, 5, 25);

  let targetX = mouseX;
  let targetY = mouseY;
  updateAndDisplayBells(normalBells, targetX, targetY);

  let target2X = mouseX + 10;
  let target2Y = mouseY + 10;
  updateAndDisplayBells(fastBells, target2X, target2Y);

  let target3X = mouseX + 40;
  let target3Y = mouseY + 40;
  updateAndDisplayBells(mediumBells, target3X, target3Y);

  movingCircles.update(targetX, targetY);
  movingCircles.display();

  // Increment the counter on each frame
  frameCounter++;

  // Dynamically increase the number of bells and circles up to their maximum
  if (numberOfBells < maxBells && circles < maxCircles && frameCounter % increaseSpeed === 0) {
    numberOfBells++; // Increment the number of bells
    circles++; // Increment the number of circles

    // Clear the arrays before adding new elements
    normalBells = [];
    fastBells = [];
    mediumBells = [];

    let angleStep = TWO_PI / numberOfBells;

    for (let i = 0; i < numberOfBells; i++) {
      let angleOffset = angleStep * i + radians(minAngleDifference * i);

      let normalBellAngle = angleOffset;
      let fastBellAngle = angleOffset;
      let mediumBellAngle = angleOffset;

      normalBells.push(new Bell(normalBellAngle, random(width), random(height), 0.01));
      fastBells.push(new Bell(fastBellAngle, random(width), random(height), 0.01));
      mediumBells.push(new Bell(mediumBellAngle, random(width), random(height), 0.01));
    }
  }

  // Access and display the number of circles eaten
  fill(255);
  textSize(20);
  // Add your text here to display the number of circles eaten
}

function updateAndDisplayBells(bellsArray, targetX, targetY) {
  for (let i = 0; i < bellsArray.length; i++) {
    bellsArray[i].setTargetPosition(targetX, targetY);
    bellsArray[i].display();
  }
}
