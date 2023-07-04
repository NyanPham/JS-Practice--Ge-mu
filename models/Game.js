import Mouse from "./Mouse.js";
import Player from "./Player.js";
import Camera from "./Camera.js";
import EnvironmentManager from "./EnvironmentManager.js";
import DayCycleManager from "./DayCycleManager.js";
import PlayerObject from "./Resources/PlayerObject.js";
import PhysicalObject from "./PhysicalObject.js";
import Slime from "./Slime.js";
import { getStorage, saveStorage } from "../helper/useStorage.js";

const PLAYER_STORAGE_KEY = "nhan-player-storage-key";
const ENV_STORAGE_KEY = "nhan-environment-storage-key";
const ENEMIES_KEY = "nhan-enemies-storage-key";
const DAY_STORAGE_KEY = "nhan-day-storage-key";

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.height = canvas.height;
    this.width = canvas.width;
    this.mouse = new Mouse(this.width * 0.5, this.height * 0.5);

    this.environmentManager = new EnvironmentManager(this);
    this.dayCycleManager = new DayCycleManager();
    this.player = new Player(this);
    this.camera = new Camera(this);

    this.fps = 60;
    this.fpsInterval = 1000 / this.fps;
    this.fpsTimer = 0;

    this.objectsToRender = [this.player];
    this.obstacles = [];
    this.nonObstacles = [];

    this.numOfEnemies = 25;
    this.enemies = [];

    this.objectToPlace = null;
    this.debug = false;

    this.canvas.addEventListener("mousedown", (e) => {
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

    document.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  updateObjectsToRender() {
    this.objectsToRender = [
      this.player,
      ...this.obstacles,
      ...this.nonObstacles,
      ...this.enemies,
    ];

    this.objectsToRender.sort((a, b) => a.collisionY - b.collisionY);
  }

  handleActionClick(e) {
    if (e.button !== 0) return;

    const item = this.environmentManager.checkInteracting(e);
    this.collectionItemAction(item);

    this.combatTargets();
    this.placeObjectAction();
  }

  collectionItemAction(item) {
    if (item != null) {
      this.player.disableMovement();
      this.player.collect(item);
    } else {
      this.player.enableMovement();
      this.player.cancelAttackAction();
    }
  }

  placeObjectAction() {
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

  combatTargets() {
    let enemy = this.enemies.find((enemy) => this.mouse.isWithin(enemy));

    if (enemy == null) return null;
    const { collided } = PhysicalObject.checkCollision(
      enemy,
      this.player,
      this.player.attackRange
    );

    if (!collided) {
      this.player.enableMovement();
      this.player.cancelAttackAction();
      return null;
    }

    this.player.disableMovement();
    this.player.startAttackAction(enemy);
  }

  handleRightClick(e) {
    e.preventDefault();

    if (this.mouse.useMouseCursor) {
      this.mouse.disableMouseCursor();
      this.player.cancelPlacingItem();
      this.objectToPlace = null;
    }
  }

  handleKeyDown(e) {
    if (e.ctrlKey && e.key.toLowerCase() === "d") {
      e.preventDefault();
      e.stopPropagation();
      this.debug = !this.debug;
    }

    if (e.ctrlKey && e.key.toLowerCase() === "s") {
      e.preventDefault();
      e.stopPropagation();

      this.save();
    }

    if (e.ctrlKey && e.key.toLowerCase() === "l") {
      e.preventDefault();
      e.stopPropagation();

      this.load();
    }
  }

  init() {
    this.environmentManager.generate("trees");
    this.environmentManager.generate("rocks");
    this.environmentManager.generate("berry");
    this.environmentManager.generate("grass");

    let enemyAttempts = 0;

    while (this.enemies.length < this.numOfEnemies && enemyAttempts < 300) {
      this.enemies.push(
        new Slime(
          this,
          Math.random() * this.width,
          Math.random() * this.height,
          30
        )
      );

      enemyAttempts++;
    }

    this.updateObjectsToRender();
  }

  render(context, deltaTime) {
    if (this.fpsTimer > this.fpsInterval) {
      context.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.objectsToRender.sort((a, b) => a.collisionY - b.collisionY);

      this.objectsToRender.forEach((obj) => {
        obj.draw(context, deltaTime);
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

  save() {
    const playerCopied = { ...this.player };
    const environmentCopied = { ...this.environmentManager };
    const dayCycleCopied = { ...this.dayCycleManager };
    const enemiesCopied = this.enemies.slice(0);

    this.camera = new Camera(this);

    saveStorage(PLAYER_STORAGE_KEY, JSON.decycle(playerCopied));
    saveStorage(ENV_STORAGE_KEY, JSON.decycle(environmentCopied));
    saveStorage(ENEMIES_KEY, JSON.decycle(enemiesCopied));
    saveStorage(DAY_STORAGE_KEY, JSON.decycle(dayCycleCopied));
  }

  load() {
    const player = JSON.retrocycle(getStorage(PLAYER_STORAGE_KEY));
    const environment = JSON.retrocycle(getStorage(ENV_STORAGE_KEY));
    const enemies = JSON.retrocycle(getStorage(ENEMIES_KEY));
    const dayCycle = JSON.retrocycle(getStorage(DAY_STORAGE_KEY));

    if (player) {
      this.player.loadData(player);
      this.player.cancelPlacingItem();
      this.player.inventory.loadData(player.inventory);
      this.mouse.setPosition(player.collisionX, player.collisionY);
    }

    if (environment) {
      this.obstacles = [];
      this.nonObstacles = [];

      this.environmentManager.loadData(environment);
    }

    if (enemies) {
      this.enemies = [];

      let instance;
      enemies.forEach((savedEnemy) => {
        if (savedEnemy.name.toLowerCase() === "slime") {
          instance = new Slime(this);
          instance.loadData(savedEnemy);

          this.enemies.push(instance);
        }
      });
    }

    if (dayCycle) {
      this.dayCycleManager.loadData(dayCycle);
    }

    this.updateObjectsToRender();
  }
}

export default Game;
