import Mouse from "./Mouse.js";
import Player from "./Player.js";
import Obstacle from "./Obstacle.js";
import Camera from "./Camera.js";
import PhysicalObject from "./PhysicalObject.js";
import Tree from "./Resources/Tree.js";
import EnvironmentManager from "./EnvironmentManager.js";
import ResourceObstacle from "./Resources/ResourceObstacle.js";

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.height = canvas.height;
    this.width = canvas.width;
    this.mouse = new Mouse(this.width * 0.5, this.height * 0.5);
    this.camera = new Camera(this);
    this.environmentManager = new EnvironmentManager(this);

    // this.fps = 60;
    // this.fpsInterval = 1000 / this.fps;
    // this.fpsTimer = 0;

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

    this.canvas.addEventListener("click", this.handleResourceClick.bind(this));
  }

  updateObjectsToRender() {
    this.objectsToRender = [this.player, ...this.obstacles];
  }

  handleResourceClick(e) {
    const item = this.environmentManager.checkInteracting(e);
    if (item != null) {
      this.player.collect(item);
    }
  }

  init() {
    this.environmentManager.generate("trees");
    this.environmentManager.generate("rocks");
    this.environmentManager.generate("berry");

    this.updateObjectsToRender();
  }

  render(context, deltaTime) {
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.objectsToRender.forEach((obj) => {
      obj.draw(context);
      obj.update(deltaTime);
    });

    this.camera.updateView();
  }
}

export default Game;
