import Mouse from "./Mouse.js";
import Player from "./Player.js";
import Obstacle from "./Obstacle.js";

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.height = canvas.height;
    this.width = canvas.width;
    this.mouse = new Mouse(this.width * 0.5, this.height * 0.5);

    this.player = new Player(this);
    this.objectsToRender = [this.player];
    this.obstacles = [];
    this.numOfObstacles = 30;

    this.canvas.addEventListener("mousedown", (e) => {
      this.mouse.togglePressed(true);
      this.mouse.setPosition(e.offsetX, e.offsetY);
    });

    this.canvas.addEventListener("mouseup", (e) => {
      this.mouse.togglePressed(false);
      this.mouse.setPosition(e.offsetX, e.offsetY);
    });

    this.canvas.addEventListener("mousemove", (e) => {
      if (this.mouse.isPressed()) {
        this.mouse.setPosition(e.offsetX, e.offsetY);
      }
    });
  }

  updateObjectsToRender() {
    this.objectsToRender = [this.player, ...this.obstacles];
  }

  init() {
    let attempts = 0;
    let testObstacle;

    while (this.obstacles.length < this.numOfObstacles && attempts < 300) {
      testObstacle = new Obstacle(this);

      let overlap = false;

      this.obstacles.forEach((obstacle) => {
        const { collided } = testObstacle.checkCollision(obstacle, 100);

        if (collided) {
          overlap = true;
        }
      });

      if (!overlap) {
        this.obstacles.push(testObstacle);
      }
    }

    this.updateObjectsToRender();
  }

  render(context) {
    this.objectsToRender.forEach((obj) => {
      obj.draw(context);
      obj.update();
    });
  }
}

export default Game;
