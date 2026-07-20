class Tenacle {
  constructor(numCircles, circleSpacing) {
    this.numCircles = numCircles;
    this.circleSpacing = circleSpacing;
    this.minDistance = 50; // Set minimum distance between circles to 100
    this.drag = 0.8;
   this.circlesEaten = 0;
    this.circles = [];

    for (let j = 0; j < 3; j++) {
      for (let i = 0; i < this.numCircles; i++) {
        this.circles.push(new Circle(width / 4 + i * this.circleSpacing, height / 4 + j * height / 3));
      }
    }

    this.circles[0].idleVelocity = createVector(0, 0);
    this.circles[this.numCircles - 1].idleVelocity = createVector(-0, -0.001);
  }
   update(anchorX, anchorY, smallCircleSpawner) {
    for (let i = 0; i < this.circles.length; i++) {
      let targetX, targetY;
      if (i % this.numCircles === 0) {
        targetX = anchorX;
        targetY = anchorY;
      } else {
        let previousCircle = this.circles[i - 1];
        targetX = previousCircle.pos.x;
        targetY = previousCircle.pos.y;
      }
      this.circles[i].update(targetX, targetY);
    }

    for (let i = 0; i < this.circles.length; i++) {
      if (i === 0 || i === this.numCircles - 1) {
        this.circles[i].pos.add(this.circles[i].idleVelocity);
      }

      for (let j = i + 1; j < this.circles.length; j++) {
        if (i % this.numCircles !== 0 && j % this.numCircles !== 0) {
          let distance = p5.Vector.dist(this.circles[i].pos, this.circles[j].pos);

          if (distance < this.minDistance) {
            let angle = atan2(this.circles[j].pos.y - this.circles[i].pos.y, this.circles[j].pos.x - this.circles[i].pos.x);
            let overlap = this.minDistance - distance;
            let targetX1 = this.circles[i].pos.x - cos(angle) * overlap * 0.5;
            let targetY1 = this.circles[i].pos.y - sin(angle) * overlap * 0.5;
            let targetX2 = this.circles[j].pos.x + cos(angle) * overlap * 0.5;
            let targetY2 = this.circles[j].pos.y + sin(angle) * overlap * 0.5;

            this.circles[i].pos.set(targetX1, targetY1);
            this.circles[j].pos.set(targetX2, targetY2);

            this.circles[i].velocity.mult(-this.drag);
            this.circles[j].velocity.mult(-this.drag);
          }
        }
      }
    }

    // Check for collisions between the tentacle and circles from smallCircleSpawner
    for (let i = 0; i < this.circles.length; i++) {
      if (smallCircleSpawner && smallCircleSpawner.circles && smallCircleSpawner.circles.length > 0) {
        for (let j = 0; j < smallCircleSpawner.circles.length; j++) {
          let distance = p5.Vector.dist(this.circles[i].pos, smallCircleSpawner.circles[j].pos);
          if (distance < this.circles[i].radius + smallCircleSpawner.circles[j].radius) {
            this.circlesEaten++; // Increment circlesEaten upon collision
            smallCircleSpawner.circles.splice(j, 1); // Remove collided small circle
            j--; // Adjust the loop counter due to removal of the circle
          }
        }
      }
    }
  }

  display() {
    noFill();
    stroke(255, 255, 255, 50);
    strokeWeight(2);

    for (let j = 0; j < 3; j++) {
      beginShape();
      stroke('white');
      for (let i = j * this.numCircles; i < (j + 1) * this.numCircles - 1; i++) {
        let x1 = this.circles[i].pos.x;
        let y1 = this.circles[i].pos.y;
        let x2 = this.circles[i + 1].pos.x;
        let y2 = this.circles[i + 1].pos.y;

        let xc = (x1 + x2) / 2;
        let yc = (y1 + y2) / 2;

        vertex(x1, y1);
        quadraticVertex(xc, yc, x2, y2);
      }
      endShape();
    }

    for (let i = 0; i < this.circles.length; i++) {
      this.circles[i].display();
    }
  }
}

class Circle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.velocity = createVector(random(-0, 0), random(-0, ));
    this.idleVelocity = createVector(0, 0);
    this.radius = 10;
    this.previousTarget = createVector(x, y);
  }

  update(targetX, targetY) {
    let target = createVector(targetX, targetY);
    let force = p5.Vector.sub(target, this.pos);
    force.mult(0.1);
    this.velocity.add(force);
    this.velocity.mult(0.5);

    this.pos.add(this.velocity);

    if (this.pos.x < 0 + this.radius || this.pos.x > width - this.radius) {
      this.velocity.x *= -1;
    }
    if (this.pos.y < 0 + this.radius || this.pos.y > height - this.radius) {
      this.velocity.y *= -1;
    }
  }

  display() {
    noStroke();
    fill(255, 255, 255, 70);
    ellipse(this.pos.x, this.pos.y, this.radius * 2);
  }
}
