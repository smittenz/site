class SmallCircleSpawner {
  constructor(numberOfCircles) {
    this.numberOfCircles = numberOfCircles;
    this.circles = [];
    this.circlesEaten = 0; // Variable to track circles eaten
  }

  // Function to generate small circles and add them to the array
  generateCircles() {
    for (let i = 0; i < this.numberOfCircles; i++) {
      let circle = {
        x: random(width),
        y: random(height),
        radius: random(5, 20),
        color: color(random(255), random(255), random(255), 150)
      };
      this.circles.push(circle);
    }
  }

  // Function to display the generated circles on the canvas
  displayCircles() {
    for (let i = 0; i < this.circles.length; i++) {
      fill(this.circles[i].color);
      noStroke();
      ellipse(this.circles[i].x, this.circles[i].y, this.circles[i].radius * 2);
    }
  }
    checkCollisions(tentacle) {
    // Assuming there's a collision detection logic here between tentacle and circles
    // When collision occurs, increment a variable to track the number of circles eatenif (/* collision detected */) {
      tentacle.circlesEaten++; // Increment a variable in the tentacle class
      // Or if the tentacle doesn't have a variable, you can create and increment it here
      // Example: tentacle.circlesEatenCount++;
    }
  

}
