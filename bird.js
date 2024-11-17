// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/cXgA1d_E-jY

// Class is exported (eslint flag)
/* exported Bird */

class Bird {
  constructor(brain, playerControlled = false) {
    this.y = height / 2;
    this.x = 64;

    this.gravity = 0.8;
    this.lift = -12;
    this.velocity = 0;

    this.width = 64;
    this.height = 64;

    this.playerControl = playerControlled;

    if (playerControlled === false) {
      if (brain) {
        this.brain = brain.copy();
      } else {
        this.brain = new NeuralNetwork(5, 8, 2);
      }
    }
    this.score = 0;
    this.fitness = 0;
    this.up_sprite = loadImage("./graphics/owl_up.png");
    this.down_sprite = loadImage("./graphics/owl_down.png");
    this.robot_sprite = loadImage("./graphics/robot-bird.png");
  }

  show() {
    if (this.playerControl == true) {
      if (this.velocity > 0) {
        image(this.down_sprite, this.x, this.y, 55, 55);
      } else {
        image(this.up_sprite, this.x, this.y, 55, 55);
      }
    } else {
      image(this.robot_sprite, this.x, this.y, 55, 55);
    }
  }

  up() {
    this.velocity = this.lift;
  }

  think(pipes) {
    // FInd the closest pipe
    let closest = null;
    let closestD = Infinity;
    for (let i = 0; i < pipes.length; ++i) {
      let d = pipes[i].x + pipes[i].w - this.x;
      if (d < closestD && d > 0) {
        closest = pipes[i];
        closestD = d;
      }
    }
    let inputs = [];
    inputs[0] = this.y / height;
    inputs[1] = closest.top / height;
    inputs[2] = closest.bottom / height;
    inputs[3] = closest.x / width;
    inputs[4] = this.velocity / 10;

    let output = this.brain.predict(inputs);
    if (output[0] > output[1]) {
      this.up();
    }
  }

  update() {
    this.score++;

    this.velocity += this.gravity;
    this.y += this.velocity;
  }

  mutate() {
    this.brain.mutate(0.01);
  }

  offScreen() {
    return this.y > height || this.y < 0;
  }
}
