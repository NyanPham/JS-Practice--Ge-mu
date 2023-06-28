import Mouse from "./Mouse.js";
import Player from "./Player.js";
import Camera from "./Camera.js";
import EnvironmentManager from "./EnvironmentManager.js";
import DayCycleManager from "./DayCycleManager.js";
import PlayerObject from "./Resources/PlayerObject.js";
import PhysicalObject from "./PhysicalObject.js";
import Enemy from "./Enemy.js";

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.height = canvas.height;
    this.width = canvas.width;
    this.mouse = new Mouse(this.width * 0.5, this.height * 0.5);
    this.camera = new Camera(this);
    this.environmentManager = new EnvironmentManager(this);

    this.dayCycleManager = new DayCycleManager();

    this.fps = 60;
    this.fpsInterval = 1000 / this.fps;
    this.fpsTimer = 0;

    this.player = new Player(this);
    this.objectsToRender = [this.player];
    this.obstacles = [];
    this.numOfObstacles = 30;

    this.numOfEnemies = 35;
    this.enemies = [];

    this.objectToPlace = null;

    this.canvas.addEventListener("mousedown", (e) => {
      console.log(e.button);
      if (e.button === 0) {
        this.mouse.togglePressed(true);
        this.mouse.setPosition(e.offsetX, e.offsetY);
      }
    });

    this.canvas.addEventListener("mouseup", (e) => {
      if (e.button === 0) {
        this.mouse.togglePressed(false);
        this.mouse.setPosition(e.offsetX, e.offsetY);
      }
    });

    this.canvas.addEventListener("mousemove", (e) => {
      if (this.mouse.isPressed()) {
        this.mouse.setPosition(e.offsetX, e.offsetY);
      }
      this.mouse.setCursorMousePosition(e.clientX, e.clientY);
    });

    this.canvas.addEventListener(
      "mousedown",
      this.handleActionClick.bind(this)
    );

    this.canvas.addEventListener(
      "contextmenu",
      this.handleRightClick.bind(this)
    );
  }

  updateObjectsToRender() {
    this.objectsToRender = [this.player, ...this.obstacles, ...this.enemies];
  }

  handleActionClick(e) {
    if (e.button !== 0) return;

    const item = this.environmentManager.checkInteracting(e);

    if (item != null) {
      this.player.disableMovement();
      this.player.collect(item);
    } else {
      this.player.enableMovement();
    }

    if (this.player.isPlacingObject) {
      // create object at mouse position;
      const item = this.player.getPlacingItem();
      const itemData = this.player.getItemInfoAfterCrafting(item.name);

      const playerObject = new PlayerObject(
        this,
        this.mouse.x,
        this.mouse.y,
        itemData.collisionRadius,
        itemData.name,
        itemData.type,
        itemData.durability,
        itemData.constantDropDurability,
        itemData.customProperties,
        itemData.draw,
        itemData.update,
        itemData.onRemoval
      );

      this.objectToPlace = playerObject;
    }
  }

  handleRightClick(e) {
    e.preventDefault();

    if (this.mouse.useMouseCursor) {
      this.mouse.disableMouseCursor();
      this.player.cancelPlacingItem();
    }
  }

  init() {
    this.environmentManager.generate("trees");
    this.environmentManager.generate("rocks");
    this.environmentManager.generate("berry");

    let enemyAttempts = 0;

    while (this.enemies.length < this.numOfEnemies && enemyAttempts < 300) {
      this.enemies.push(
        new Enemy(
          this,
          Math.random() * this.width,
          Math.random() * this.height,
          Math.random() * (35 - 25) + 25
        )
      );

      enemyAttempts++;
    }

    this.updateObjectsToRender();
  }

  render(context, deltaTime) {
    if (this.fpsTimer > this.fpsInterval) {
      context.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.objectsToRender.forEach((obj) => {
        obj.draw(context);
        obj.update(deltaTime);
      });

      this.camera.updateView();

      this.dayCycleManager.updateDayNight(deltaTime);
      this.dayCycleManager.draw();

      if (this.objectToPlace != null) {
        if (
          PhysicalObject.checkCollision(this.player, this.objectToPlace, 50)
            .collided
        ) {
          const isPlaced = this.environmentManager.addUserObjectToWorld(
            this.objectToPlace
          );

          if (isPlaced) {
            this.player.placeItem();
            this.mouse.disableMouseCursor();
          }
        }
      }

      this.fpsTimer = 0;
    }

    this.fpsTimer += deltaTime;
  }
}

export default Game;
