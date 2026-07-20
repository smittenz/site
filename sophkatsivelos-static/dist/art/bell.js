class Bell {
  constructor(initialAngle, startX, startY, rotationSpeed) {
    // Initialize properties
    this.x = startX;
    this.y = startY;
    this.targetX = 0;
    this.targetY = 0;
    this.angle = initialAngle;
    this.rotationSpeed = rotationSpeed;
    this.transitionSpeed = 0.05;
    this.randomMoveX = 0;
    this.randomMoveY = 0;
    this.scaleFactor = 1.6; // Scale factor for the bell size
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    scale(this.scaleFactor); // Scale the bell
    this.drawShape();
    pop();
    this.move();
  }
  drawShape() {
    beginShape();
      stroke('white');
      fill(255,255,255,50);
      vertex(0.6 - 26.82, 31.52 - 64.06);
      bezierVertex(2.6 - 26.82, 19.52 - 64.06, 3.6 - 26.82, 3.52 - 64.06, 10.6 - 26.82, 1.52 - 64.06);
      bezierVertex(17.6 - 26.82, -0.48 - 64.06, 24.6 - 26.82, 3.52 - 64.06, 24.6 - 26.82, 3.52 - 64.06);
      vertex(23.6 - 26.82, 7.52 - 64.06);
      bezierVertex(14.1 - 26.82, 12.88 - 64.06, 19.29 - 26.82, 48.46 - 64.06, 26.82 - 26.82, 48.06 - 64.06);
      bezierVertex(33.82 - 26.82, 50.06 - 64.06, 38.82 - 26.82, 11.06 - 64.06, 29.82 - 26.82, 7.06 - 64.06);
      vertex(28.82 - 26.82, 3.06 - 64.06);
      bezierVertex(28.82 - 26.82, 3.06 - 64.06, 35.82 - 26.82, -0.94 - 64.06, 42.82 - 26.82, 1.06 - 64.06);
      bezierVertex(42.82 - 26.82, 1.06 - 64.06, 50.82 - 26.82, 19.06 - 64.06, 52.82 - 26.82, 31.06 - 64.06);
      bezierVertex(54.82 - 26.82, 43.06 - 64.06, 26.82 - 26.82, 64.06 - 64.06, 26.82 - 26.82, 64.06 - 64.06);
      bezierVertex(26.82 - 26.82, 64.06 - 64.06, -1.4 - 26.82, 43.52 - 64.06, 0.6 - 26.82, 31.52 - 64.06);
    endShape(CLOSE);
  }

 move() {
    this.randomMoveX = map(noise(frameCount * 0.01), 0, 1, -10, 10);
    this.randomMoveY = map(noise(frameCount * 0.01 + 1000), 0, 1, -5, 5);

    this.angle += this.rotationSpeed;
    this.x += ((this.targetX + this.randomMoveX) - this.x) * this.transitionSpeed;
    this.y += ((this.targetY + this.randomMoveY) - this.y) * this.transitionSpeed;
  }

  setTargetPosition(targetX, targetY) {
    this.targetX = targetX;
    this.targetY = targetY;
  }
    getAnchorPoint() {
    return createVector(this.x, this.y);
  }

}

function createBells(numberOfBells, minAngleDifference) {
  let bells = [];
  let angleDifference = TWO_PI / numberOfBells;

  for (let i = 0; i < numberOfBells; i++) {
    let initialAngle = angleDifference * i + minAngleDifference * i;
    let startX = random(width);
    let startY = random(height);
    let rotationSpeed = random(-0.02, 0.02);
    let bell = new Bell(initialAngle, startX, startY, rotationSpeed);
    bells.push(bell);
  }

  return bells;
}
